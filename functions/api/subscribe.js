// Cloudflare Pages Function: POST /api/subscribe
// Accepts JSON: { "email": "you@example.com" }
// Proxies to Mailchimp server-side and returns { ok: true } on success.

const U_CODE = "0a7bc91bac675bcca19bd150d";
const ID_CODE = "4d7f887426";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequestPost({ request }) {
  try {
    const { email } = await request.json();
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), {
        status: 400,
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    // Build the same form Mailchimp expects, but post from the server.
    const form = new URLSearchParams({
      u: U_CODE,
      id: ID_CODE,
      EMAIL: email
    });

    const resp = await fetch("https://online.us2.list-manage.com/subscribe/post", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      redirect: "manual"
    });

    // Mailchimp typically returns a 302 on success; treat 200/302 as OK.
    const ok = resp.status === 200 || resp.status === 302;

    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : 502,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
}

// Optional: GET to help with quick diagnostics
export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, endpoint: "subscribe" }), {
    headers: { "content-type": "application/json; charset=utf-8" },
    status: 200
  });
}
