import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {socket} from "../server"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat app",
  description: "organize your mettings easily with chatter",
};

import {
  ClerkProvider,
} from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
      </head> */}
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
        <Toaster />
      </body>
    </html>
  );
}
