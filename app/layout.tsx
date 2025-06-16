import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Gelato | Relay Benchmarking",
  description: "Gelato - Relay Benchmarking",
  generator: "Gelato",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col bg-[#F9FAFB]">
        <Providers>
          <div className="w-full max-w-[1200px] mx-auto py-10">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
