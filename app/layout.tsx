import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GraceSoft - Software you can trust",
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
    title: "GraceSoft - Software you can trust",
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
        alt: "GraceSoft - Software you can trust",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GraceSoft - Software you can trust",
    description: "Innovative software solutions and web development services from expert developers.",
    images: ["/GS_IMGOG_2026.png"],
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
    google: "kbYQfxu-OJGj7-iFo6z9y0VliezcpcnEWtrTpi6HdlY",
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
        id="top"
        className={`${montserrat.variable} text-gray-950 bg-gray-50 dark:text-gray-50 dark:bg-gray-950 font-sans antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
