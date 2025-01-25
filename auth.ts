// /* eslint-disable */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  PrismaClient,
  // Role
} from "@prisma/client";
// import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/LoginSchema";
import { getUserByEmail } from "./app/actions/authActions";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      async authorize(creds) {
        const validated = loginSchema.safeParse(creds);
        if (validated.success) {
          const { email, password } = validated.data;
          const user = await getUserByEmail(email);
          if (
            !user ||
            !user.passwordHash ||
            !(await compare(password, user.passwordHash))
          )
            return null;
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    //     async jwt({ user, token }) {
    //       if (user) {
    //         token.profileComplete = user.profileComplete;
    //         token.role = user.role;
    //       }
    //       return token;
    //     },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        //         session.user.profileComplete = token.profileComplete as boolean;
        //         session.user.role = token.role as Role;
      }
      //   console.log(session);
      return session;
    },
  },
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  // ...authConfig,
});
