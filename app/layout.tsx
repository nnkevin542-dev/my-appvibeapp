import React from "react";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "VibeRoom",
  description: "Новая эра стриминга",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Базовые стили добавлены напрямую для предотвращения ошибки импорта globals.css */}
        <style>{`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
          
          body {
            background-color: black;
            color: white;
            margin: 0;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
        `}</style>
      </head>
      <body>
        {/* Встроенный провайдер сессий (заменяет внешний файл providers.tsx) */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}