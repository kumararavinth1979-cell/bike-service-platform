import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppProvider } from "@/lib/app-context";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bike Service",
  description: "Motorcycle service reminder and inspection",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceef1" },
    { media: "(prefers-color-scheme: dark)", color: "#17181b" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          <Header />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
