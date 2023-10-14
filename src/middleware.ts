import { USER_ROLE } from "@prisma/client";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        // @ts-ignore
        return token?.user.role === USER_ROLE.ADMIN;
      }
      return !!token;
    },
  },
});

export const config = { matcher: ["/admin"] };
