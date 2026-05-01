import { type NextRequest, NextResponse } from "next/server";

/**
 * DEMO BUILD: email-OTP confirmation is a no-op. We just bounce visitors
 * to the home feed.
 */
export async function GET(request: NextRequest) {
	const url = request.nextUrl.clone();
	url.pathname = "/home";
	url.search = "";
	return NextResponse.redirect(url);
}
