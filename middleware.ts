import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login"

  // Get the token from cookies
  const token = request.cookies.get("Access")?.value
  const expiresInStr = request.cookies.get("ExpiresIn")?.value

  console.log("Middleware checking path:", path)
  console.log("Token exists:", !!token)
  console.log("ExpiresIn exists:", !!expiresInStr)

  // Update the token validity check to be more robust

  // Check if token exists and is not expired
  let isTokenValid = false
  if (token && expiresInStr) {
    const expiresIn = Number.parseInt(expiresInStr, 10)
    const tokenSetTimeStr = request.cookies.get("TokenSetTime")?.value

    if (tokenSetTimeStr) {
      const tokenSetTime = Number.parseInt(tokenSetTimeStr, 10)
      const currentTime = Date.now()

      // Check if token is still valid
      isTokenValid = tokenSetTime + expiresIn > currentTime
      console.log("Token validity check:", {
        tokenSetTime,
        expiresIn,
        currentTime,
        expiryTime: new Date(tokenSetTime + expiresIn).toISOString(),
        isValid: isTokenValid,
      })
    } else {
      console.log("TokenSetTime cookie is missing")
      // If TokenSetTime is missing but we have a token, consider it valid
      // This helps with backward compatibility for existing sessions
      isTokenValid = true
    }
  }

  // Redirect logic
  if (isPublicPath && isTokenValid) {
    // If user is on login page but already authenticated, redirect to dashboard
    console.log("Authenticated user on login page, redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublicPath && !isTokenValid) {
    // If user is not on a public path and not authenticated, redirect to login
    console.log("Unauthenticated user on protected page, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
