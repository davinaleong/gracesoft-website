import { createHmac } from 'node:crypto';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ParsedPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
  form_elapsed_ms: string;
};

function jsonResponse(statusCode: number, body: Record<string, unknown>) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

function redirectResponse(status: string) {
  return {
    statusCode: 303,
    headers: {
      Location: `/contact?status=${encodeURIComponent(status)}`
    },
    body: ''
  };
}

function prefersJson(headers: Record<string, string | undefined>): boolean {
  const accept = headers.accept?.toLowerCase() ?? '';
  const requestedWith = headers['x-requested-with']?.toLowerCase() ?? '';
  return accept.includes('application/json') || requestedWith === 'xmlhttprequest';
}

function responseFor(
  wantsJson: boolean,
  statusCode: number,
  status: 'sent' | 'blocked' | 'invalid' | 'error',
  message: string
) {
  if (wantsJson) {
    return jsonResponse(statusCode, { status, message });
  }

  return redirectResponse(status);
}

function decodeBody(body: string | null, isBase64Encoded: boolean): string {
  if (!body) {
    return '';
  }

  if (isBase64Encoded) {
    return Buffer.from(body, 'base64').toString('utf8');
  }

  return body;
}

function parsePayload(
  contentType: string,
  rawBody: string
): ParsedPayload | null {
  if (contentType.includes('application/json')) {
    const parsed = JSON.parse(rawBody || '{}');
    return {
      name: String(parsed?.name ?? '').trim(),
      email: String(parsed?.email ?? '').trim(),
      subject: String(parsed?.subject ?? '').trim(),
      message: String(parsed?.message ?? '').trim(),
      company: String(parsed?.company ?? '').trim(),
      form_elapsed_ms: String(parsed?.form_elapsed_ms ?? '').trim()
    };
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(rawBody);
    return {
      name: String(params.get('name') ?? '').trim(),
      email: String(params.get('email') ?? '').trim(),
      subject: String(params.get('subject') ?? '').trim(),
      message: String(params.get('message') ?? '').trim(),
      company: String(params.get('company') ?? '').trim(),
      form_elapsed_ms: String(params.get('form_elapsed_ms') ?? '').trim()
    };
  }

  return null;
}

function hmacSha256Hex(secret: string, value: string): string {
  return createHmac('sha256', secret).update(value, 'utf8').digest('hex');
}

export const handler = async (event: {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
  isBase64Encoded: boolean;
}) => {
  const wantsJson = prefersJson(event.headers ?? {});

  if (event.httpMethod !== 'POST') {
    return wantsJson
      ? jsonResponse(405, { status: 'error', message: 'Method not allowed.' })
      : redirectResponse('error');
  }

  const HQ_API_URL = process.env.HQ_API_URL;
  const HQ_APP_ID = process.env.HQ_APP_ID;
  const HQ_APP_KEY = process.env.HQ_APP_KEY;
  const HQ_API_SECRET = process.env.HQ_API_SECRET;

  if (!HQ_API_URL || !HQ_APP_ID || !HQ_APP_KEY || !HQ_API_SECRET) {
    console.error('Missing one or more HQ_* environment variables.');
    return responseFor(wantsJson, 500, 'error', 'Missing HQ environment variables.');
  }

  const contentType = (event.headers['content-type'] ?? '').toLowerCase();
  const rawBody = decodeBody(event.body, event.isBase64Encoded);

  let parsed: ParsedPayload | null = null;

  try {
    parsed = parsePayload(contentType, rawBody);
  } catch (error) {
    console.error('Failed to parse request payload:', error);
    return responseFor(wantsJson, 400, 'invalid', 'Invalid request payload.');
  }

  if (!parsed) {
    return responseFor(wantsJson, 400, 'invalid', 'Unsupported content type.');
  }

  const { name, email, subject, message, company, form_elapsed_ms } = parsed;
  const elapsedMs = Number(form_elapsed_ms || '0');

  // Server-side anti-bot checks to complement client checks.
  if (company !== '' || Number.isNaN(elapsedMs) || elapsedMs < 3000) {
    return responseFor(wantsJson, 429, 'blocked', 'Submission blocked by anti-bot checks.');
  }

  if (
    name.length < 2 ||
    name.length > 255 ||
    (email !== '' && (!EMAIL_PATTERN.test(email) || email.length > 255)) ||
    subject.length > 255 ||
    message.length < 20 ||
    message.length > 5000
  ) {
    return responseFor(wantsJson, 422, 'invalid', 'Form validation failed.');
  }

  const hqPayload = {
    name,
    email: email || undefined,
    subject: subject || undefined,
    message,
    source: 'web' as const,
    metadata: {
      page: '/contact',
      elapsed_ms: elapsedMs
    }
  };

  const payloadJson = JSON.stringify(hqPayload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = hmacSha256Hex(HQ_API_SECRET, `${timestamp}${payloadJson}`);

  try {
    const response = await fetch(HQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-APP-ID': HQ_APP_ID,
        'X-APP-KEY': HQ_APP_KEY,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature
      },
      body: payloadJson
    });

    if (response.status !== 201) {
      const text = await response.text();
      console.error('HQ API error:', response.status, text);
      return responseFor(wantsJson, 502, 'error', 'HQ API returned an unexpected response.');
    }

    return responseFor(wantsJson, 201, 'sent', 'Message sent successfully.');
  } catch (error) {
    console.error('Failed to reach HQ API:', error);
    return responseFor(wantsJson, 502, 'error', 'Failed to reach HQ API.');
  }
};
