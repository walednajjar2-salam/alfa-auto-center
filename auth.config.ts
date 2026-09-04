import type { NextAuthConfig } from "next-auth";
import { canAccess } from "./lib/permissions";
import { isPublicPath } from "./lib/public-paths";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token }) {
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "RECEPTION";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (isPublicPath(nextUrl.pathname)) {
        if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      if (!isLoggedIn) return false;
      if (!canAccess(auth.user?.role, nextUrl.pathname)) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
