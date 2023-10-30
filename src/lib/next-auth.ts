import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { USER_ROLE } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      type: "credentials",
      credentials: {
        email: { name: "Email", type: "email" },
        password: { name: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password ?? ""
          );

          if (passwordsMatch) return user;
        }

        return null;
      },
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
