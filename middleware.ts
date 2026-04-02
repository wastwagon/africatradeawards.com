import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookieName, verifySessionToken } from "@/lib/jwt-session";
import {
  defaultDashboardForRoleStr,
  hasRoleAtLeastStr,
  isAuditorStr,
  resolvePostLoginStr,
} from "@/lib/role-access";

async function getSession(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    const next = searchParams.get("next") ?? "/admin/";
    const url = request.nextUrl.clone();
    url.pathname = "/login/";
    url.search = `next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" || pathname === "/login/") {
    const session = await getSession(request);
    if (session?.role && typeof session.role === "string") {
      const next = searchParams.get("next");
      const dest = resolvePostLoginStr(session.role, next);
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = await getSession(request);
    if (!session?.role || typeof session.role !== "string") {
      const url = request.nextUrl.clone();
      url.pathname = "/login/";
      url.search = `next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    const role = session.role;
    if (!isAuditorStr(role) && !hasRoleAtLeastStr(role, "PROGRAM_MANAGER")) {
      return NextResponse.redirect(new URL(defaultDashboardForRoleStr(role), request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal/entrant")) {
    const session = await getSession(request);
    if (!session?.role || typeof session.role !== "string") {
      const url = request.nextUrl.clone();
      url.pathname = "/login/";
      url.search = `next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    const role = session.role;
    if (!hasRoleAtLeastStr(role, "ENTRANT")) {
      return NextResponse.redirect(new URL(defaultDashboardForRoleStr(role), request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal/nominator")) {
    const session = await getSession(request);
    if (!session?.role || typeof session.role !== "string") {
      const url = request.nextUrl.clone();
      url.pathname = "/login/";
      url.search = `next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    const role = session.role;
    if (!hasRoleAtLeastStr(role, "ENTRANT")) {
      return NextResponse.redirect(new URL(defaultDashboardForRoleStr(role), request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal/judge")) {
    const session = await getSession(request);
    if (!session?.role || typeof session.role !== "string") {
      const url = request.nextUrl.clone();
      url.pathname = "/login/";
      url.search = `next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    const role = session.role;
    if (!hasRoleAtLeastStr(role, "JUDGE")) {
      return NextResponse.redirect(new URL(defaultDashboardForRoleStr(role), request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login", "/login/"],
};
