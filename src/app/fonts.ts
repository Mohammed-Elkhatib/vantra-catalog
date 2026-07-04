import { IBM_Plex_Sans, IBM_Plex_Mono, Mulish } from "next/font/google";

// Display + body. IBM Plex was designed for the human/machine relationship,
// which suits an engineering catalog (see research_and_planning/DESIGN_STRATEGY.md).
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Data / utility face: spec values, model codes, axis labels, classification ladders.
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Design B ("CMS") face: a free, humanist-geometric stand-in for Avenir
// (which is licensed and cannot be bundled). Heavy weights echo Avenir Black.
export const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cms",
  display: "swap",
});
