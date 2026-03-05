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
