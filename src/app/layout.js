// import { Geist, Geist_Mono, Zen_Kaku_Gothic_Antique, Zen_Kaku_Gothic_New } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import 'destyle.css'
import "./globals.css";
import Nav from "@/components/Nav";
import Header from "@/components/Header";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
//   display: 'swap',
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   display: 'swap',
// });

const noto = Noto_Sans_JP({
  weight: ["400", "700"],//variableフォントではないので、使う太さを決めてDLする
  subsets: ["latin"],
  display: "swap",//最初はシステムフォントで表示し、フォントが読み込まれた瞬間に差し替える
  variable: "--font-noto", // CSS変数名
});

// const zkgAntique = Zen_Kaku_Gothic_Antique({
//   weight: ["400", "700"],//variableフォントではないので、使う太さを決めてDLする
//   subsets: ["latin"],
//   display: "swap",//最初はシステムフォントで表示し、フォントが読み込まれた瞬間に差し替える
// });

// const zkgNew = Zen_Kaku_Gothic_New({
//   weight: ["400", "700"],//variableフォントではないので、使う太さを決めてDLする
//   subsets: ["latin"],
//   display: "swap",//最初はシステムフォントで表示し、フォントが読み込まれた瞬間に差し替える
// });

export const metadata = {
  title: "Simple Closet",
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
      {/* <body className={`${noto.className} ${geistSans.variable} ${geistMono.variable}`}> */}
      <body className={`${noto.className}`}>
        <Header />
        <Nav />
          {children}
      </body>
    </html>
  );
}
