import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import {Providers} from "./components/provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Afrobuggy Artist | Premium Portfolio",
  description: "Experience the cinematic world of the ultimate Afrobuggy music artist. Immersive, energetic, and professionally branded.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth h-full antialiased">
      <Providers>
      <body className={`${outfit.variable} font-sans min-h-full flex flex-col bg-black text-white`}>
        <div className="fixed inset-0 bg-grain pointer-events-none z-50 opacity-20" />
        {children}
      </body>
      </Providers>
    </html>
  );
}
