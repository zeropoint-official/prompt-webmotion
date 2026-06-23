import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import {
  Bricolage_Grotesque,
  Schibsted_Grotesk,
  Spline_Sans_Mono,
  Fraunces,
} from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
});

// Editorial serif for the Maré website-template demos (Website Templates).
const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
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
  title: "The Web Motion Library — Web Motion Academy",
  description:
    "A library of ready-made, production-grade prompts: animated components, hero animations, and full website templates. Paste one into Claude Code, tell it about your brand, and it appears on your site — polished, animated, responsive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html
        lang="en"
        className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable} h-full antialiased`}
      >
        <body className="min-h-full" suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  );
}
