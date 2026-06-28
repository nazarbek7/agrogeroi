type NextAuthOptions = Record<string, unknown>;
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

function verifyTelegramHash(data: Record<string, string>, botToken: string): boolean {
  const { hash, ...rest } = data;
  const dataCheckString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  return hmac === hash;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Email + password
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const user = await prisma.user.findFirst({ where: { email: credentials.email } });
          if (user) {
            if (!user.password) throw new Error("google_account");
            const ok = await bcrypt.compare(credentials.password, user.password);
            if (ok) return { id: user.id, email: user.email, role: user.role, name: user.name };
          }
        } catch (err: any) {
          throw new Error(err);
        }
        return null;
      },
    }),

    // Telegram Login Widget
    CredentialsProvider({
      id: "telegram",
      name: "Telegram",
      credentials: { data: { label: "Telegram data", type: "text" } },
      async authorize(credentials: any) {
        try {
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN not set");

          const tgUser = JSON.parse(credentials.data);
          const isValid = verifyTelegramHash(tgUser, botToken);
          if (!isValid) return null;

          // Проверяем что данные свежие (не старше 1 часа)
          const age = Math.floor(Date.now() / 1000) - tgUser.auth_date;
          if (age > 3600) return null;

          const telegramId = `tg_${tgUser.id}`;
          let user = await prisma.user.findFirst({ where: { email: telegramId } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                id: nanoid(),
                email: telegramId,
                role: "user",
                password: null,
                name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" "),
                image: tgUser.photo_url ?? null,
              },
            });
          }

          return { id: user.id, email: user.email, role: user.role, name: user.name, image: user.image };
        } catch {
          return null;
        }
      },
    }),

    // Google OAuth
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "credentials" || account?.provider === "telegram") return true;
      if (account?.provider === "google") {
        try {
          const existing = await prisma.user.findFirst({ where: { email: user.email! } });
          if (!existing) {
            await prisma.user.create({
              data: { id: nanoid(), email: user.email!, role: "user", password: null, name: user.name ?? null, image: user.image ?? null },
            });
          }
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        const email = user.email ?? token.email;
        if (!user.role && email) {
          const dbUser = await prisma.user.findFirst({ where: { email } });
          token.role = dbUser?.role ?? "user";
          token.id = dbUser?.id ?? user.id;
          token.name = dbUser?.name ?? user.name ?? null;
        } else {
          token.role = user.role;
          token.id = user.id;
          token.name = user.name ?? null;
        }
        // Never store image in JWT — base64 images cause 700KB+ cookie overflow
      }
      if (trigger === "update" && session) {
        if (session.name !== undefined) token.name = session.name;
        if (session.email !== undefined) token.email = session.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.name = token.name as string ?? null;
      }
      return session;
    },
  },

  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  jwt: { maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
