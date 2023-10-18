import type { USER_ROLE } from "@prisma/client";
import type { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name: string;
      email: string;
      emailVerified: Date | null;
      image: string;
      active: boolean;
      role: USER_ROLE;
    };
  }
}
