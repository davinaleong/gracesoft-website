console.log('Contact API route loaded.'); // <-- This doesn't get printed.

type Env = {
  HQ_API_URL?: string;
  HQ_APP_ID?: string;
  HQ_APP_KEY?: string;
  HQ_API_SECRET?: string;
};

type ParsedPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
  form_elapsed_ms: string;
};

type ContactRequestContext = {
  request: Request;
  env: Env;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function redirectResponse(status: 'sent' | 'blocked' | 'invalid' | 'error'): Response {
  return Response.redirect(`/contact?status=${encodeURIComponent(status)}`, 303);
}

function prefersJson(request: Request): boolean {
  const accept = request.headers.get('accept')?.toLowerCase() ?? '';
  const requestedWith = request.headers.get('x-requested-with')?.toLowerCase() ?? '';
  return accept.includes('application/json') || requestedWith === 'xmlhttprequest';
}

function responseFor(
  wantsJson: boolean,
  code: number,
  status: 'sent' | 'blocked' | 'invalid' | 'error',
  message: string
): Response {
  if (wantsJson) {
    return jsonResponse(code, { status, message });
  }

  return redirectResponse(status);
}

function parsePayload(contentType: string, rawBody: string): ParsedPayload | null {
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

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256Hex(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return bytesToHex(new Uint8Array(signature));
}

export const onRequestPost = async (context: ContactRequestContext): Promise<Response> => {
  try {
    const { request, env } = context;
    const wantsJson = prefersJson(request);

    const HQ_API_URL = env.HQ_API_URL;
    const HQ_APP_ID = env.HQ_APP_ID;
    const HQ_APP_KEY = env.HQ_APP_KEY;
    const HQ_API_SECRET = env.HQ_API_SECRET;

    console.log('HEADERS DEBUG:', {
      HQ_API_URL,
      HQ_APP_ID,
      HQ_APP_KEY,
      HQ_API_SECRET
    });

    if (!HQ_API_URL || !HQ_APP_ID || !HQ_APP_KEY || !HQ_API_SECRET) {
      console.error('Missing ENV');
      return responseFor(wantsJson, 500, 'error', 'Missing HQ environment variables.');
    }

    const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
    const rawBody = await request.text();

    let parsed: ParsedPayload | null = null;

    try {
      parsed = parsePayload(contentType, rawBody);
    } catch (error) {
      console.error('Parse error:', error);
      return responseFor(wantsJson, 400, 'invalid', 'Invalid request payload.');
    }

    if (!parsed) {
      return responseFor(wantsJson, 400, 'invalid', 'Unsupported content type.');
    }

    const { name, email, subject, message, company, form_elapsed_ms } = parsed;
    const elapsedMs = Number(form_elapsed_ms || '0');

    if (company !== '' || Number.isNaN(elapsedMs) || elapsedMs < 3000) {
      return responseFor(wantsJson, 429, 'blocked', 'Bot detected');
    }

    if (
      name.length < 2 ||
      name.length > 255 ||
      (email !== '' && (!EMAIL_PATTERN.test(email) || email.length > 255)) ||
      subject.length > 255 ||
      message.length < 20 ||
      message.length > 5000
    ) {
      return responseFor(wantsJson, 422, 'invalid', 'Validation failed');
    }

    const payloadJson = JSON.stringify({
      name,
      email,
      subject,
      message,
      source: 'web'
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();

    // 🔥 TEMP BYPASS
    const signature = 'test-signature';

    console.log('Calling HQ:', HQ_API_URL);

    const response = await fetch(HQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-APP-ID': HQ_APP_ID,
        'X-APP-KEY': HQ_APP_KEY,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature
      },
      body: payloadJson
    });

    const text = await response.text();
    console.log('HQ RESPONSE:', response.status, text);

    if (!response.ok) {
      return responseFor(wantsJson, response.status, 'error', text);
    }

    return responseFor(wantsJson, 201, 'sent', 'Message sent');

  } catch (error) {
    console.error('🔥 GLOBAL ERROR:', error);

    return new Response(JSON.stringify({
      status: 'error',
      message: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS'
    }
  });
};

export const onRequest = async (): Promise<Response> => {
  return new Response('Method not allowed.', {
    status: 405,
    headers: {
      Allow: 'POST, OPTIONS'
    }
  });
};