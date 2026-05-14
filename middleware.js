import { NextResponse } from "next/server";

export function middleware(request) {
    // Next.js Middleware can ONLY read cookies
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Define protected routes
    const isProtectedRoute = pathname.startsWith('/dashboard');

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"]
};