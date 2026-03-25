import type { APIRoute } from 'astro';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
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

function prefersJson(request: Request): boolean {
  const accept = request.headers.get('accept')?.toLowerCase() ?? '';
  const requestedWith = request.headers.get('x-requested-with')?.toLowerCase() ?? '';
  return accept.includes('application/json') || requestedWith === 'xmlhttprequest';
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function redirectTo(request: Request, status: string): Response {
  const url = new URL('/contact', request.url);
  url.searchParams.set('status', status);
  return Response.redirect(url, 303);
}

export const POST: APIRoute = async ({ request }) => {
  const wantsJson = prefersJson(request);
  const HQ_API_URL = import.meta.env.HQ_API_URL;
  const HQ_APP_ID = import.meta.env.HQ_APP_ID;
  const HQ_APP_KEY = import.meta.env.HQ_APP_KEY;
  const HQ_API_SECRET = import.meta.env.HQ_API_SECRET;

  if (!HQ_API_URL || !HQ_APP_ID || !HQ_APP_KEY || !HQ_API_SECRET) {
    console.error('Missing one or more HQ_* environment variables.');
    return wantsJson
      ? jsonResponse(500, { status: 'error', message: 'Missing HQ environment variables.' })
      : redirectTo(request, 'error');
  }

  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';

  let name = '';
  let email = '';
  let subject = '';
  let message = '';
  let honeypot = '';
  let elapsedMsRaw = '';

  try {
    if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await request.formData();
      name = String(formData.get('name') ?? '').trim();
      email = String(formData.get('email') ?? '').trim();
      subject = String(formData.get('subject') ?? '').trim();
      message = String(formData.get('message') ?? '').trim();
      honeypot = String(formData.get('company') ?? '').trim();
      elapsedMsRaw = String(formData.get('form_elapsed_ms') ?? '').trim();
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      name = String(body?.name ?? '').trim();
      email = String(body?.email ?? '').trim();
      subject = String(body?.subject ?? '').trim();
      message = String(body?.message ?? '').trim();
      honeypot = String(body?.company ?? '').trim();
      elapsedMsRaw = String(body?.form_elapsed_ms ?? '').trim();
    } else {
      return wantsJson
        ? jsonResponse(400, { status: 'invalid', message: 'Unsupported content type.' })
        : redirectTo(request, 'invalid');
    }
  } catch (error) {
    console.error('Failed to parse incoming contact payload:', error);
    return wantsJson
      ? jsonResponse(400, { status: 'invalid', message: 'Invalid request payload.' })
      : redirectTo(request, 'invalid');
  }

  const elapsedMs = Number(elapsedMsRaw || '0');

  // Bot protection checks run server-side in addition to client-side.
  if (honeypot !== '' || Number.isNaN(elapsedMs) || elapsedMs < 3000) {
    return wantsJson
      ? jsonResponse(429, { status: 'blocked', message: 'Submission blocked by anti-bot checks.' })
      : redirectTo(request, 'blocked');
  }

  if (
    name.length < 2 ||
    name.length > 255 ||
    (email !== '' && (!EMAIL_PATTERN.test(email) || email.length > 255)) ||
    subject.length > 255 ||
    message.length < 20 ||
    message.length > 5000
  ) {
    return wantsJson
      ? jsonResponse(422, { status: 'invalid', message: 'Form validation failed.' })
      : redirectTo(request, 'invalid');
  }

  const payload = {
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
  const payloadJson = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = await hmacSha256Hex(HQ_API_SECRET, `${timestamp}${payloadJson}`);

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
      return wantsJson
        ? jsonResponse(502, { status: 'error', message: 'HQ API returned an unexpected response.' })
        : redirectTo(request, 'error');
    }

    if (wantsJson) {
      return jsonResponse(201, { status: 'sent' });
    }

    return redirectTo(request, 'sent');
  } catch (error) {
    console.error('Failed to reach HQ API:', error);
    return wantsJson
      ? jsonResponse(502, { status: 'error', message: 'Failed to reach HQ API.' })
      : redirectTo(request, 'error');
  }
};