import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manabi Admin",
  description: "まなびリンク管理者画面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
