import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

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
