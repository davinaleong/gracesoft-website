export const onRequestPost = async (context) => {
import { getEntries } from './../../../.astro/content.d';
  const { request, env } = context;{
  try {
    const headers = Object.fromEntries(request.headers.getEntries());
    const wantsJson = prefersJson(headers);

    const HQ_API_URL = env.HQ_API_URL;
    const HQ_APP_ID = env.HQ_APP_ID;
    const HQ_APP_KEY = env.HQ_APP_KEY;
    const HQ_API_SECRET = env.HQ_API_SECRET;

    if (!HQ_API_URL || !HQ_APP_ID || !HQ_APP_KEY || !HQ_API_SECRET) {
      console.error('Missing ENV:', {
        HQ_API_URL,
        HQ_APP_ID,
        HQ_APP_KEY,
        HQ_API_SECRET
      });

      return responseFor(wantsJson, 500, 'error', 'Missing env vars');
    }

    const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
    const rawBody = await request.text();

    const parsed = parsePayload(contentType, rawBody);

    if (!parsed) {
      return responseFor(wantsJson, 400, 'invalid', 'Invalid payload');
    }

    const { name, email, subject, message, company, form_elapsed_ms } = parsed;
    const elapsedMs = Number(form_elapsed_ms || '0');

    if (company !== '' || Number.isNaN(elapsedMs) || elapsedMs < 3000) {
      return responseFor(wantsJson, 429, 'blocked', 'Bot detected');
    }

    const payloadJson = JSON.stringify({
      name,
      email,
      subject,
      message,
      source: 'web'
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();

    // 🔥 LOG BEFORE CRITICAL STEP
    console.log('Generating signature...');

    const signature = await hmacSha256Hex(
      HQ_API_SECRET,
      `${timestamp}${payloadJson}`
    );
    console.log('Calling HQ API:', HQ_API_URL);

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
    console.error('🔥 UNCAUGHT ERROR:', error);

    return new Response(
      JSON.stringify({
        status: 'error',
        message: String(error)
      }),
      { status: 500 }
    );
  }
};