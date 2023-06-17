import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next|api/stripe-hooks).*)", "/", "/api/trpc(.*)"],
};
