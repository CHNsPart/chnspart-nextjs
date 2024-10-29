import type { Metadata, Viewport } from "next";
import { Poppins } from 'next/font/google';
import Script from 'next/script';
import "./globals.css";
import { Providers } from "./providers/Providers";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

// Load Poppins font
const poppins = Poppins({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chnspart.com'),
  title: 'Touhidul Islam Chayan — Portfolio',
  description: "I'm Touhidul Islam Chayan, a software engineer specializing in front-end development, UI/UX design, and machine learning. I have experience with independent international clients and full-time jobs, honing my skills in various technologies.",
  authors: [{ name: "Touhidul Islam Chayan" }],
  icons: {
    icon: '/images/favicon.ico',
  },
  
  // Open Graph
  openGraph: {
    title: 'Touhidul Islam Chayan — Portfolio',
    description: "I'm Touhidul Islam Chayan, a software engineer specializing in front-end development, UI/UX design, and machine learning...",
    url: 'https://chnspart.com',
    siteName: "Touhidul's Portfolio",
    images: 'https://i.ibb.co/b50SRrW/CHNs-Part-OG.png',
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Touhidul Islam Chayan — Portfolio',
    description: "I'm Touhidul Islam Chayan, a software engineer specializing in front-end development, UI/UX design, and machine learning...",
    images: 'https://i.ibb.co/b50SRrW/CHNs-Part-OG.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-G22KNCZ787"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G22KNCZ787');
          `}
        </Script>
      </head>

      <body className={`${poppins.className} antialiased bg-[var(--smoky-black)]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}