import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"]
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata = {
  title: "STRYIED | AI Case Analyzer",
  description: "Advanced AI-powered legal case analysis for BNS, BNSS & BSA sections.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
