import { Audiowide, Inter, JetBrains_Mono } from "next/font/google";

// Audiowide is the Strike wordmark face on the live site; kept display-only.
export const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const monoCode = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = `${audiowide.variable} ${inter.variable} ${monoCode.variable}`;
