import { Figtree, Instrument_Sans } from "next/font/google";

export const landingDisplayFont = Figtree({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const landingBodyFont = Instrument_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
