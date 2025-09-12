import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // TODO: Wire to VibeScript backend or email service.
  return NextResponse.json({ ok: true, received: body }, { status: 200 });
}
