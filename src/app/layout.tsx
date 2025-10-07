import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/auth/use-auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twii",
  description: "Twii - A simple social media platform",
  openGraph: {
    title: "Twii",
    description: "Twii - A simple social media platform",
    url: "https://twii.vercel.app",
    siteName: "Twii",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Twii - A simple social media platform",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twii",
    description: "Twii - A simple social media platform",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          className="xpx-4 md:px-6 lg:px-8 xl:px-10 py-4 
            min-h-screen
          "
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="twii-ui-theme"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
