type NextAuthOptions = Record<string, unknown>;
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password!
            );
            if (isPasswordCorrect) {
              return { id: user.id, email: user.email, role: user.role };
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "credentials") return true;
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findFirst({
            where: { email: user.email! },
          });
          if (!existingUser) {
            await prisma.user.create({
              data: { id: nanoid(), email: user.email!, role: "user", password: null },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.iat = Math.floor(Date.now() / 1000);
      }
      const now = Math.floor(Date.now() / 1000);
      if (now - (token.iat as number) > 15 * 60) return {};
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
    updateAge: 5 * 60,
  },
  jwt: { maxAge: 15 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
