"use client";

// ВАЖНО ДЛЯ VS CODE: 
// РАСКОММЕНТИРУЙ строку ниже у себя в VS Code! Она нужна для реальной работы сайта.
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}