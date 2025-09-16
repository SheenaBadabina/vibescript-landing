const VERSION = "0.1.0";
const BUILD = Date.now();

export async function onRequest() {
  return new Response(
    JSON.stringify({ version: VERSION, build: BUILD }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      },
      status: 200
    }
  );
}
