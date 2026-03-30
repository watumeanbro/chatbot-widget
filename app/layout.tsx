import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Groq Chat Widget",
  description:
    "A dark, embeddable Groq chatbot widget for business websites.",
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://makesomething.so"
  ),
  openGraph: {
    title: "Groq Chat Widget",
    description:
      "A dark, embeddable Groq chatbot widget for business websites.",
    siteName: "Groq Chat Widget",
  },
  twitter: {
    card: "summary_large_image",
    title: "Groq Chat Widget",
    description:
      "A dark, embeddable Groq chatbot widget for business websites.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className="min-h-screen text-foreground bg-background font-sans antialiased"
      >
        <Providers>{children}</Providers>
        <Script
          src="https://chatbot-widget-ruddy-kappa.vercel.app/montti2/widget.js"
          data-id="montti2"
          data-title="Montti Assistant"
          data-color="#111111"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
