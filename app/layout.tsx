import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Navigations/Header";
import { Footer } from "@/components/Navigations/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans", //here we create a variable for this font
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", //here we create a variable for this font
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyncPoint",
  description:
    "SyncPoint is a Calendly clone built with Next.js, Clerk, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Toaster />
      <html lang="en">
        <body
          className={cn(
            `${geistSans.variable} ${geistMono.variable} antialiased min-h-[calc(100vh-61px)] flex flex-col mt-[61px]`
          )}
        >
          <Header />
          <main className="flex-grow bg-background  text-foreground">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
