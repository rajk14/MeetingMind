import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import MeetingHistory from "@/components/MeetingHistory";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetingMind — AI Meeting Summarizer",
  description: "Transform your meeting transcripts into structured action items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <TooltipProvider>
          <div className="flex h-screen overflow-hidden">
            <Suspense fallback={<div className="w-64 border-r border-border bg-card"></div>}>
              <MeetingHistory />
            </Suspense>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
          <Toaster position="top-right" richColors theme="dark" />
        </TooltipProvider>
      </body>
    </html>
  );
}
