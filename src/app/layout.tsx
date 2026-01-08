import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentOps Platform | Berlin AI Labs",
  description: "Enterprise discovery platform for pre-vetted, regulatory-compliant AI agents. EU AI Act, GDPR, and DiGA verified.",
  keywords: ["AI governance", "agent compliance", "EU AI Act", "GDPR", "enterprise AI", "Berlin AI Labs"],
  openGraph: {
    title: "AgentOps Platform | Berlin AI Labs",
    description: "Vendor-neutral compliance infrastructure for enterprise AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
