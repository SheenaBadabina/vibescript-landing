// functions/subscribe.js
// Cloudflare Pages Function: POST /subscribe
// Proxies the email to Mailchimp so the visitor stays on vibescript.online

export async function onRequestPost({ request }) {
  try {
    const form = await request.formData();
    const email = (form.get("email") || "").toString().trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, message: "Please enter a valid email." }, 400);
    }

    // Your Mailchimp form action (unchanged)
    const MC_URL =
      "https://online.us2.list-manage.com/subscribe/post?u=0a7bc91bac675bcca19bd150d&id=4d7f887426&f_id=00ffa2e0f0";

    // Build the same payload Mailchimp expects (URL-encoded)
    const mcBody = new URLSearchParams();
    mcBody.set("EMAIL", email);
    // Optional: include a real honeypot field (must be empty)
    mcBody.set("b_0a7bc91bac675bcca19bd150d_4d7f887426", "");

    // Forward the request server-side
    const mcRes = await fetch(MC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: mcBody.toString(),
    });

    // Mailchimp returns HTML even on success; we treat 200 as success
    if (mcRes.ok) {
      return json({
        ok: true,
        message:
          "Thanks! Check your inbox to confirm your subscription.",
      });
    }

    const text = await mcRes.text();
    return json(
      {
        ok: false,
        message:
          "We couldn’t submit your email right now. Please try again in a moment.",
        details: text.slice(0, 3000),
      },
      502
    );
  } catch (err) {
    return json(
      {
        ok: false,
        message: "Unexpected error. Please try again.",
      },
      500
    );
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
