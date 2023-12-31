import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { USER_ROLE } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        // @ts-ignore
        id: token.sub,
        // @ts-ignore
        name: token.user.name,
        // @ts-ignore
        email: token.user.email,
        // @ts-ignore
        emailVerified: token.user.emailVerified,
        // @ts-ignore
        image: token.user.image,
        // @ts-ignore
        active: token.user.active,
        // @ts-ignore
        role: token.user.role,
      };
      return session;
    },
    async redirect({ baseUrl, url }) {
      return baseUrl;
    },
  },
};

export interface Session {
  user: {
    id: string;
    name: string;
    email: String;
    role: USER_ROLE;
    image: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export async function getServerAuthSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  return await getServerSession(req, res, authOptions);
}
