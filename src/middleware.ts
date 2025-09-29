import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define user roles for better type safety
type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export function middleware(request: NextRequest) {
  // Get the current path
  const currentPath = request.nextUrl.pathname;

  // Sign-in page URL for redirects
  const signInUrl = new URL("/signIn", request.url);

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // If no token is present, redirect unauthenticated users to sign-in page
  if (!token) {
    console.log("⚠️ Middleware: No token found in cookies, redirecting to sign-in");
    console.log("Current path:", currentPath);
    console.log("Available cookies:", request.cookies.getAll().map(c => ({ name: c.name, value: c.value?.slice(0, 20) + '...' })));
    return NextResponse.redirect(signInUrl);
  }

  console.log("✅ Middleware: Token found, proceeding with authentication check for path:", currentPath);
  
  // Decode token to get user info
  let userInfo: { role?: UserRole; exp: number };
  try {
    userInfo = jwtDecode(token) as { role?: UserRole; exp: number };

    // Check if token is expired
    if (userInfo.exp && userInfo.exp * 1000 < Date.now()) {
      return NextResponse.redirect(signInUrl);
    }
  } catch (error) {
    // Invalid token, redirect to sign-in
    return NextResponse.redirect(signInUrl);
  }

  // Role-based access control logic

  // 1. Dashboard routes: only USER role can access, except edit-business-plan for ADMIN
  if (currentPath.startsWith("/dashboard")) {
    // Allow ADMIN and SUPERADMIN to access edit-business-plan routes
    if (
      currentPath.includes("/edit-business-plan") &&
      (userInfo?.role === "ADMIN" || userInfo?.role === "SUPERADMIN")
    ) {
      // Allow admin access to edit business plans
    } else if (userInfo?.role !== "USER") {
      // Other dashboard routes only for USER role
      return NextResponse.redirect(signInUrl);
    }
  }

  // 2. Admin routes: only ADMIN or SUPERADMIN roles can access
  if (
    currentPath.startsWith("/admin") &&
    !(userInfo?.role === "ADMIN" || userInfo?.role === "SUPERADMIN")
  ) {
    return NextResponse.redirect(signInUrl);
  }

  // 3. AI Smart Form routes: only authenticated users can access
  // Note: We already validated the token presence and expiry above.
  // Do NOT require a role claim here, because some tokens may not include role but are still valid.
  if (currentPath.startsWith("/ai-smart-form")) {
    // Nothing extra to check here; allow if token is present and valid.
  }

  // 4. Subscription/Billing/Payment routes: only authenticated users can access
  if (
    currentPath.startsWith("/billing") ||
    currentPath.startsWith("/payment-demo") ||
    currentPath.startsWith("/payment-success") ||
    currentPath.startsWith("/my-plan") ||
    currentPath.startsWith("/generated-business-plan") ||
    currentPath.includes("/subscription-plan")
  ) {
    // Ensure user has a valid token and role (any authenticated user can access)
    if (!userInfo?.role) {
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/ai-smart-form/:path*",
    "/billing/:path*",
    "/payment-demo/:path*",
    "/payment-success/:path*",
    "/my-plan/:path*",
    "/generated-business-plan/:path*",
    "/(.*)/subscription-plan/:path*",
  ],
};
