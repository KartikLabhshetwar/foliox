import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Foliox: AI-Powered Portfolio Generator",
  description: "Turn your GitHub profile into a stunning portfolio in seconds with AI-powered insights.",
  openGraph: {
    title: "Foliox: AI-Powered Portfolio Generator",
    description: "Turn your GitHub profile into a stunning portfolio in seconds with AI-powered insights.",
    type: "website",
    images: [
      {
        url: "https://foliox-ashy.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "Foliox Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foliox: AI-Powered Portfolio Generator",
    description: "Turn your GitHub profile into a stunning portfolio in seconds with AI-powered insights.",
    images: ["https://foliox-ashy.vercel.app/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <script defer src="https://cloud.umami.is/script.js" data-website-id="e8b67cef-c928-4c15-9aa3-e2d24f71ba1b"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
