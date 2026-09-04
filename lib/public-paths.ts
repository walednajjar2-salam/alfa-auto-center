export function isPublicPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/quote" ||
    pathname.startsWith("/quote/") ||
    pathname.startsWith("/api/auth")
  );
}
