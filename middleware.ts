// import { auth } from "@/lib/auth/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // const session = await auth.api.getSession({
    //     headers: request.headers,
    // });

    // // If user is not authenticated and trying to access protected routes
    // if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    // // If user is authenticated and trying to access login page
    // if (session && request.nextUrl.pathname === "/login") {
    //     return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // "/dashboard/:path*",
        // "/login",
    ],
};
