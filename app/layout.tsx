import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { ThemeGallery } from "@/components/theme-gallery/ThemeGallery";
import { PointerGlow } from "@/components/effects/PointerGlow";
import { AmbientBackdrop } from "@/components/effects/AmbientBackdrop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strike | DSA, Web Development & Gen AI Courses by Rohit Negi",
  description:
    "Master DSA, System Design & AI with interactive coding environments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="grain min-h-full flex flex-col">
        <ThemeProvider>
          <AmbientBackdrop />
          <PointerGlow />
          {children}
          <ThemeGallery />
        </ThemeProvider>
      </body>
    </html>
  );
}
