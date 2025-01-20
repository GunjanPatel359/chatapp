import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
        <Toaster />
      </body>
    </html>
  );
}
