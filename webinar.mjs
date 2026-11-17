const webinarPath = '/market-ready';
const registrationsPath = '/market-ready/registrations';
const formFields = ['name', 'email', 'city'];
const pageSize = 50;
const dateTime = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata'
});

function webinarLayout(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} · GLOSS</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font: 16px/1.55 Arial,sans-serif; background: #f6f1e9; color: #30212b; }
    header, main { width: min(1100px, 90%); margin: auto; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 0; border-bottom: 1px solid #d6c7ce; }
    a { color: #602849; }
    .wordmark { color: #30212b; font-weight: 900; font-size: 25px; letter-spacing: -.05em; text-decoration: none; }
    h1, h2 { font-family: Georgia,serif; font-weight: 400; line-height: 1.05; margin: 0 0 14px; }
    h1 { font-size: clamp(45px, 7vw, 88px); letter-spacing: -.055em; }
    h2 { font-size: 32px; }
    p { margin: 0 0 16px; }
    main { padding: clamp(25px, 5vw, 62px) 0; }
    .webinar-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(24px, 6vw, 72px); align-items: start; }
    .intro { max-width: 480px; font-size: 18px; }
    .price { display: inline-block; padding: 7px 12px; border-radius: 3px; background: #dce6c8; font-weight: 700; }
    .agenda { padding-left: 18px; margin: 16px 0 24px; }
    .agenda li { padding: 5px 0; }
    .card { background: #fffaf3; border: 1px solid #d6c7ce; padding: clamp(18px, 4vw, 34px); border-radius: 4px; }
    .hint { color: #625460; font-size: 14px; }
    label { display: grid; gap: 5px; font-weight: 600; margin: 12px 0; }
    label small { font-weight: 400; }
    input { min-width: 0; width: 100%; padding: 10px 12px; border-radius: 3px; border: 1px solid #a88b9c; background: white; color: inherit; font: inherit; }
    button { width: 100%; margin-top: 4px; padding: 12px 16px; border: 1px solid #55253f; border-radius: 3px; background: #55253f; color: #fff; font: bold 16px Arial,sans-serif; cursor: pointer; }
    :focus-visible { outline: 3px solid #8a5b79; outline-offset: 3px; }
    .error { color: #7b153b; font-weight: 600; }
    .table-wrap { overflow: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { text-align: left; vertical-align: top; padding: 9px 12px; border-bottom: 1px solid #d6c7ce; overflow-wrap: anywhere; }
    .pages { display: flex; gap: 16px; margin-top: 20px; }
    @media(max-width: 720px) { .webinar-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header><a class="wordmark" href="/">GLOSS</a><a href="/samples/model">View model sample</a></header>
  ${body}
</body>
</html>`;
}

function registrationPage(escape, { values = {}, error = '', received = false } = {}) {
  return webinarLayout('Get Market Ready', `<main class="webinar-grid">
    <section aria-labelledby="webinar-title">
      <p>Live webinar for aspiring models</p>
      <h1 id="webinar-title">Get Market Ready</h1>
      <p class="price">₹99 per seat</p>
      <p class="intro">Build your first modeling portfolio and learn how to approach photographers and agencies.</p>
      <ul class="agenda">
        <li>Plan your Polaroids, intro video and first set of portfolio photos.</li>
        <li>Know what to ask a photographer before a shoot or collaboration.</li>
        <li>Shortlist agencies by the kind of modeling you want to pursue.</li>
      </ul>
    </section>
    ${received ? `<section class="card" aria-labelledby="received-title">
      <h2 id="received-title">Seat request received</h2>
      <p>GLOSS will follow up by email with the webinar date and payment instructions. Your seat is confirmed after payment.</p>
      <a href="/samples/model">See a GLOSS sample portfolio</a>
    </section>` : `<section class="card" aria-labelledby="register-title">
      <h2 id="register-title">Register for the webinar</h2>
      <p class="hint">We’ll email the webinar date and payment instructions. Your seat is confirmed after payment.</p>
      ${error ? `<p class="error" role="alert">${escape(error)}</p>` : ''}
      <form action="${webinarPath}" method="post">
        <label>Full name<input name="name" autocomplete="name" maxlength="80" value="${escape(values.name)}" required></label>
        <label>Email<input name="email" type="email" autocomplete="email" maxlength="254" value="${escape(values.email)}" required></label>
        <label>City <small>Optional</small><input name="city" autocomplete="address-level2" maxlength="100" value="${escape(values.city)}"></label>
        <div hidden><label>Leave blank<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <button type="submit">Request a seat · ₹99</button>
      </form>
    </section>`}
  </main>`);
}

function registrationList(escape, rows, count, page, pages) {
  return webinarLayout('Webinar registrations', `<main>
    <h1>Webinar registrations</h1>
    <p>${count} seat request${count === 1 ? '' : 's'}</p>
    <p class="hint">Use the email addresses to follow up with the webinar date and payment instructions.</p>
    ${rows.length ? `<div class="table-wrap"><table>
      <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">City</th><th scope="col">Requested (IST)</th></tr></thead>
      <tbody>${rows.map(row => `<tr><td>${escape(row.name)}</td><td>${escape(row.email)}</td><td>${escape(row.city || '—')}</td><td>${escape(dateTime.format(new Date(row.requested_at)))}</td></tr>`).join('')}</tbody>
    </table></div>` : '<p>No seat requests yet.</p>'}
    ${pages > 1 ? `<nav class="pages" aria-label="Registration pages">
      ${page > 1 ? `<a href="?page=${page - 1}">Previous</a>` : ''}
      <span>Page ${page} of ${pages}</span>
      ${page < pages ? `<a href="?page=${page + 1}">Next</a>` : ''}
    </nav>` : ''}
  </main>`);
}

export async function handleWebinar(request, env, { headers, escape, limitedBody }) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '');
  if (path !== webinarPath && path !== registrationsPath) return null;

  const read = request.method === 'GET' || request.method === 'HEAD';
  const html = (getBody, status = 200) => new Response(request.method === 'HEAD' ? null : getBody(), {
    status,
    headers: {
      ...headers,
      'content-type': 'text/html;charset=utf-8',
      'referrer-policy': 'same-origin',
      'x-robots-tag': path === registrationsPath ? 'noindex, nofollow' : 'noarchive',
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"
    }
  });
  if (path === registrationsPath) {
    if (!read) return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'GET, HEAD' } });
    if (!request.headers.get('oai-authenticated-user-id')) {
      return Response.redirect(new URL('/signin-with-chatgpt?return_to=' + encodeURIComponent(registrationsPath), url.origin), 302);
    }
    const email = request.headers.get('oai-authenticated-user-email')?.toLowerCase();
    if (!env.AGENCY_ADMIN_EMAIL || email !== env.AGENCY_ADMIN_EMAIL.toLowerCase()) {
      return new Response('This list is available to the GLOSS administrator.', { status: 403, headers });
    }
    const { count } = await env.DB.prepare('SELECT COUNT(*) AS count FROM webinar_registrations').bind().first();
    const pages = Math.max(1, Math.ceil(count / pageSize));
    const requestedPage = Number.parseInt(url.searchParams.get('page') ?? '', 10);
    const page = Math.min(pages, Math.max(1, requestedPage || 1));
    const { results } = await env.DB.prepare(
      'SELECT name, email, city, requested_at FROM webinar_registrations ORDER BY requested_at DESC, email LIMIT ? OFFSET ?'
    ).bind(pageSize, (page - 1) * pageSize).all();
    return html(() => registrationList(escape, results, count, page, pages));
  }

  if (read) return html(() => registrationPage(escape));
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'GET, HEAD, POST' } });
  }
  if (request.headers.get('origin') !== url.origin) {
    return html(() => registrationPage(escape, { error: 'Please submit the form from this page.' }), 403);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/x-www-form-urlencoded') {
    return html(() => registrationPage(escape, { error: 'Please use the registration form below.' }), 415);
  }
  const data = new URLSearchParams(new TextDecoder().decode(await limitedBody(request, 4096)));
  const values = Object.fromEntries(formFields.map(field => [field, (data.get(field) || '').trim()]));
  const email = values.email.toLowerCase();
  const invalid = !values.name || values.name.length > 80 || email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/.test(email) || values.city.length > 100;
  if (invalid) {
    return html(() => registrationPage(escape, { values, error: 'Enter a full name and a valid email address. City is optional.' }), 400);
  }
  if (!data.get('website')) {
    try {
      await env.DB.prepare(
        'INSERT INTO webinar_registrations (email, name, city, requested_at) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING'
      ).bind(email, values.name, values.city, new Date().toISOString()).run();
    } catch {
      return html(() => registrationPage(escape, { values, error: 'Your request could not be saved. Please try again shortly.' }), 503);
    }
  }
  return html(() => registrationPage(escape, { received: true }));
}
