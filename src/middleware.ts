import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  // if (token && req.nextUrl.pathname === "/") {
  //   return NextResponse.redirect(new URL("/home", req.url));
  // }

  // if (!token && req.nextUrl.pathname === "/home") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};
