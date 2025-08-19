import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MessagingProvider } from "@/contexts/MessagingContext";
import { ErrorHandlerProvider } from "@/contexts/ErrorHandlerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrowdProp",
  description: "CrowdProp - The future of crowd-sourced promotion",
  icons: {
    icon: "/cp_icon.png",
    shortcut: "/cp_icon.png",
    apple: "/cp_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorHandlerProvider>
          <MessagingProvider>{children}</MessagingProvider>
        </ErrorHandlerProvider>
      </body>
    </html>
  );
}
