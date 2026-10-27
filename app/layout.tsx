import type { Metadata } from "next";
import { Geist, Geist_Mono, Patrick_Hand, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Rukopis pátrača (SIL Open Font License, uložené v projekte cez next/font). */
const patrickHand = Patrick_Hand({
  variable: "--font-handwriting",
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/** Titulky vo videách – písmo s pätkami (SIL Open Font License, uložené v projekte cez next/font). */
const sourceSerif = Source_Serif_4({
  variable: "--font-story-serif",
  weight: ["500"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Mysterium Bratislava",
  description: "Objav tajomstvá starého Prešporka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sk"
      className={`${geistSans.variable} ${geistMono.variable} ${patrickHand.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
