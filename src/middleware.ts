import { USER_ROLE } from "@prisma/client";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      console.log({ token, req: req.nextUrl.pathname });
      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        // @ts-ignore
        return token.user.role === USER_ROLE.ADMIN;
      }
      return !!token;
    },
  },
});

export const config = { matcher: ["/dashboard"] };
