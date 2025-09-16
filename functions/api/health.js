export async function onRequest(ctx) {
  return new Response(
    JSON.stringify({
      ok: true,
      service: "vibescript.online",
      time: new Date().toISOString(),
      region: ctx.request?.cf?.colo || "unknown"
    }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      },
      status: 200
    }
  );
}
