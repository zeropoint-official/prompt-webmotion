import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Schibsted_Grotesk,
  Spline_Sans_Mono,
} from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
});

const body = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "The Section Library — Web Motion Academy",
  description:
    "A library of ready-made, production-grade section prompts. Paste one into Claude Code, tell it about your brand, and the section appears on your site — polished, animated, responsive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
