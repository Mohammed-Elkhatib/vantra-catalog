import type { Metadata } from "next";
import { plexSans, plexMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ventra-leb.com"),
  title: "Vantra Lebanon | Medical-Grade HVAC & Air Filtration",
  description:
    "High-efficiency air filtration, dampers, sound attenuators, and coatings for medical, pharmaceutical, and commercial projects in Lebanon. Open catalog, instant datasheets, no registration.",
  openGraph: {
    siteName: "Vantra Lebanon",
    type: "website",
    locale: "en",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
