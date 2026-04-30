import { NextResponse } from "next/server";
import { getSessionCookieName, isSessionCookieSecure } from "@/lib/auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isSessionCookieSecure(),
    maxAge: 0,
    path: "/",
  });
  return response;
}
