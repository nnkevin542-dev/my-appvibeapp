import "./globals.css";
import { Providers } from "./providers"; // Подключаем наш клиентский провайдер

export const metadata = {
  title: "VibeRoom",
  description: "Новая эра стриминга",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {/* Оборачиваем сайт в Providers, который теперь работает правильно */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}