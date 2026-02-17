import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Header from "@/components/Header";
import Weather from "@/components/Weather";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Siimple Closet",
  description: "シンプルで操作性の良いクローゼットアプリ",
  robots: {
    index: false,
    follow: false,
  },
  // openGraph: {
  //   title: "Siimple Closet",
  //   description: "個人用に開発した、シンプルで操作性の良いクローゼットアプリのデモサイトです。",
  //   url: "",
  //   siteName: "Siimple Closet",
  //   images: [
  //     {
  //       url: "/ogp.jpg",
  //       width: 1200,
  //       height: 630,
  //     },
  //   ],
  //   locale: "ja_JP",
  //   type: "website",
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <Nav />
        <Weather />
        {children}
      </body>
    </html>
  );
}
