import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Pavyon | Anonim Tanışma ve Eğlence",
  description: "Türkiye'nin lüks ve anonim sanal pavyon deneyimi. Hemen katıl, sohbete başla!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Inline safety styles to prevent white screen on Android if CSS fails to load */}
        <style dangerouslySetInnerHTML={{
          __html: `
          :root { --color-pavyon-bg: #05000a; }
          html, body { 
            background-color: #05000a !important; 
            color: #ffffff !important;
            margin: 0; padding: 0;
            overflow-x: hidden;
            font-family: sans-serif;
          }
          .min-h-screen { min-height: 100vh; }
          .bg-pavyon-bg { background-color: #05000a; }
          .fixed-bg {
            position: fixed; inset: 0; z-index: -10;
            background: radial-gradient(circle at center, #0a0011 0%, #05000a 100%);
          }
        `}} />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased text-white`}
      >
        <div className="min-h-screen relative overflow-x-hidden">
          <div className="fixed inset-0 bg-pavyon-bg z-[-2] pointer-events-none" />
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,127,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(46,2,73,0.3),transparent_50%)] z-[-1] pointer-events-none" />
          {children}
        </div>
      </body>
    </html>
  );
}
