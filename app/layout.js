import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Manabi admin",
  description: "まなびリンクの管理者専用ページです",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <header style={{ padding: "1rem", background: "#1a1a1a" }}>
          <h1>Manabi Admin</h1>
        </header>
        <main>{children}</main>
        <footer style={{ padding: "1rem", background: "#1a1a1a", marginTop: "2rem" }}>
          <p>© 2025 ManabiLink Project</p>
        </footer>
      </body>
    </html>
  );
}
