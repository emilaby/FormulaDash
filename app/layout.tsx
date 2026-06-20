import "./globals.css";
import Header from "./Header"
import { Titillium_Web } from "next/font/google"

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
