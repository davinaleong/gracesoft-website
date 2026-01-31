import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GraceSoft - Professional Software Solutions",
    template: "%s | GraceSoft",
  },
  description: "GraceSoft provides innovative software solutions and web development services. Expert team delivering high-quality, scalable applications for businesses worldwide.",
  keywords: ["software development", "web development", "applications", "technology solutions", "gracesoft", "programming", "digital solutions"],
  authors: [{ name: "GraceSoft Team" }],
  creator: "GraceSoft",
  publisher: "GraceSoft",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gracesoft.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GraceSoft - Professional Software Solutions",
    description: "Innovative software solutions and web development services from expert developers.",
    url: "https://gracesoft.dev",
    siteName: "GraceSoft",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/GS_IMGOG_2026.png",
        width: 1200,
        height: 630,
        alt: "GraceSoft - Professional Software Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GraceSoft - Professional Software Solutions",
    description: "Innovative software solutions and web development services from expert developers.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
