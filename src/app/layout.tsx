import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "ProductPass — QR-powered Digital Product Passports",
  description:
    "Create product identity, evidence, sustainability, repair, and recycling records in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} min-h-screen antialiased`}>
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
