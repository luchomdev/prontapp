import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Hydration from "@/components/Hydration";
import CheckoutHeader from "@/components/CheckoutHeader";
import CheckoutFooter from "@/components/CheckoutFooter";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Checkout Process",
  description: "Checkout Process",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Hydration />
      <AuthInitializer />
        <div className="flex flex-col min-h-screen">
          <CheckoutHeader />
          <main className="flex-grow flex items-start justify-center bg-gray-100">
            <div className="w-full mx-auto p-2 sm:p-4">
              {children}
            </div>
          </main>
          <CheckoutFooter />
        </div>
      </body>
    </html>
  );
}
