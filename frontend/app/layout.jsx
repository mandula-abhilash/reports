import "./globals.css";

import { AuthProvider } from "@/visdak-auth/src/components/AuthProvider";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  metadataBase: new URL("https://fgbacumen.com"),
  title: {
    default: "FGB Acumen - Site Assessment Reports",
    template: "%s | FGB Acumen",
  },
  description:
    "Professional site assessment services with comprehensive reporting. Trust FGB Acumen for detailed insights and professional assessments.",
  keywords: [
    "site assessment",
    "property assessment",
    "land survey",
    "professional assessment",
    "site reports",
    "property analysis",
  ],
  authors: [{ name: "FGB Acumen" }],
  creator: "FGB Acumen",
  publisher: "FGB Acumen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://fgbacumen.com",
    title: "FGB Acumen - Site Assessment Reports",
    description:
      "Professional site assessment services with comprehensive reporting. Trust FGB Acumen for detailed insights and professional assessments.",
    siteName: "FGB Acumen",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FGB Acumen - Professional Site Assessment Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FGB Acumen - Site Assessment Reports",
    description:
      "Professional site assessment services with comprehensive reporting. Trust FGB Acumen for detailed insights and professional assessments.",
    images: ["/twitter-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
