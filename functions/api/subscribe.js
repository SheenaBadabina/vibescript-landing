// Cloudflare Pages Function: POST /api/subscribe
// Accepts JSON: { email, hp, ts } where:
//   - hp is a honeypot (must be empty or absent)
//   - ts is a client timestamp (ms since epoch); must be at least MIN_DELTA_MS old
//
// Returns: { ok: true } on success

const U_CODE = "0a7bc91bac675bcca19bd150d";
const ID_CODE = "4d7f887426";
const MIN_DELTA_MS = 1200; // human-ish min time between load and submit

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequestPost({ request, headers }) {
  try {
    const { email, hp = "", ts = 0 } = await request.json().catch(() => ({}));

    // Basic validations
    if (!isValidEmail(email)) {
      return json({ ok: false, error: "Invalid email" }, 400);
    }
    // Honeypot must be empty
    if (typeof hp === "string" && hp.trim() !== "") {
      // Pretend success to avoid clueing in bots
      await softDelay();
      return json({ ok: true }, 200);
    }
    // Min time check
    const now = Date.now();
    const delta = now - Number(ts || 0);
    if (!Number.isFinite(delta) || delta < MIN_DELTA_MS) {
      // Too fast — likely automated. Soft-success.
      await softDelay();
      return json({ ok: true }, 200);
    }

    // Server-side post to Mailchimp (no JSONP, no redirect following)
    const form = new URLSearchParams({ u: U_CODE, id: ID_CODE, EMAIL: email });
    const resp = await fetch("https://online.us2.list-manage.com/subscribe/post", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      redirect: "manual"
    });

    const ok = resp.status === 200 || resp.status === 302;
    await softDelay();
    return json({ ok }, ok ? 200 : 502);
  } catch (e) {
    return json({ ok: false, error: "Server error" }, 500);
  }
}

export async function onRequestGet() {
  return json({ ok: true, endpoint: "subscribe" }, 200);
}

// --- helpers ---
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
function softDelay() {
  // Small jitter to make bot timing less predictable
  const ms = 250 + Math.floor(Math.random() * 300);
  return new Promise((r) => setTimeout(r, ms));
}
