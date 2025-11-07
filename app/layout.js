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
  title: "My Next.js App",
  description: "This is a sample Next.js project.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header style={{ padding: "1rem", background: "#f5f5f5" }}>
          <h1>My Next.js App</h1>
        </header>
        <main>{children}</main>
        <footer style={{ padding: "1rem", background: "#f5f5f5", marginTop: "2rem" }}>
          <p>© 2025 My Website</p>
        </footer>
      </body>
    </html>
  );
}
