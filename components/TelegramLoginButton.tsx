"use client";
import { signIn } from "next-auth/react";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "";

export default function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!BOT_USERNAME) return;

    window.onTelegramAuth = async (user: TelegramUser) => {
      const res = await signIn("telegram", {
        redirect: false,
        data: JSON.stringify(user),
      });
      if (res?.ok) {
        window.location.href = "/";
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-radius", "10");

    containerRef.current?.appendChild(script);
    const node = containerRef.current;
    return () => { if (node) node.innerHTML = ""; };
  }, []);

  if (!BOT_USERNAME) return null;

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center min-h-[44px]"
    />
  );
}
