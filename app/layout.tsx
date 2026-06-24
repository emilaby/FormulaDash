import "./globals.css";
import Header from "../components/Header"
import { Titillium_Web } from "next/font/google"
import { Metadata } from "next";

export const metadata:Metadata = {
  viewport: "width=device-width, initial-scale=1",
};

const titilliumWeb = Titillium_Web({ weight: ["400", "600", "700"], subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={titilliumWeb.className}>
          <Header />
          {children}
        </body>
    </html>
  );
}
