import "./globals.css";
import Header from "../components/Header"
import { Titillium_Web } from "next/font/google"
import { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"

export const metadata:Metadata = {
  viewport: "width=device-width, initial-scale=1",
  title: { 
    default: "FormulaDash",
    template: "%s | FormulaDash"
  },
  description: "F1 dashboard with race, qualifying and practice results, team and driver standings."
}

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
          <Analytics />
        </body>
    </html>
  );
}
