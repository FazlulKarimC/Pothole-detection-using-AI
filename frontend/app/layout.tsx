import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pothole Detection AI",
  description: "YOLOv8s-powered pothole detection with severity analysis. Upload road images to detect potholes with adjustable confidence thresholds.",
  keywords: ["pothole detection", "YOLO", "computer vision", "road safety", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`${inter.variable} antialiased bg-[#fafafa] text-[#171717]`}>
        {children}
      </body>
    </html>
  );
}
