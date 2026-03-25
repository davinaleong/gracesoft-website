import type { APIRoute } from 'astro';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function redirectTo(request: Request, status: string): Response {
  const url = new URL('/contact', request.url);
  url.searchParams.set('status', status);
  return Response.redirect(url, 303);
}

export const POST: APIRoute = async ({ request }) => {
  const HQ_API_URL = import.meta.env.HQ_API_URL;
  const HQ_APP_ID = import.meta.env.HQ_APP_ID;
  const HQ_APP_KEY = import.meta.env.HQ_APP_KEY;
  const HQ_API_SECRET = import.meta.env.HQ_API_SECRET;

  if (!HQ_API_URL || !HQ_APP_ID || !HQ_APP_KEY || !HQ_API_SECRET) {
    console.error('Missing one or more HQ_* environment variables.');
    return redirectTo(request, 'error');
  }

  const formData = await request.formData();

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  const honeypot = String(formData.get('company') ?? '').trim();
  const elapsedMsRaw = String(formData.get('form_elapsed_ms') ?? '').trim();
  const elapsedMs = Number(elapsedMsRaw || '0');

  // Bot protection checks run server-side in addition to client-side.
  if (honeypot !== '' || Number.isNaN(elapsedMs) || elapsedMs < 3000) {
    return redirectTo(request, 'blocked');
  }

  const allowedSubjects = new Set([
    'web-application-development',
    'ux-ui-design',
    'system-architecture',
    'technical-consulting',
    'other'
  ]);

  if (
    name.length < 2 ||
    name.length > 120 ||
    !EMAIL_PATTERN.test(email) ||
    !allowedSubjects.has(subject) ||
    message.length < 20 ||
    message.length > 3000
  ) {
    return redirectTo(request, 'invalid');
  }

  const payload = {
    name,
    email,
    subject,
    message,
    source: 'gracesoft-website-contact-form',
    submittedAt: new Date().toISOString()
  };

  try {
    const response = await fetch(HQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': HQ_APP_ID,
        'X-App-Key': HQ_APP_KEY,
        'X-Api-Secret': HQ_API_SECRET
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('HQ API error:', response.status, text);
      return redirectTo(request, 'error');
    }

    return redirectTo(request, 'sent');
  } catch (error) {
    console.error('Failed to reach HQ API:', error);
    return redirectTo(request, 'error');
  }
};
