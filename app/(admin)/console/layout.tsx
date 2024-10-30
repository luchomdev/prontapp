import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "../../globals.css";
import '@mdxeditor/editor/style.css';
import ClientLayout from "@/app/(admin)/components/ClientLayout";
import Hydration from "@/components/Hydration";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Console NodePgNexus",
  description: "Console NodePgNexus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${robotoMono.className} flex flex-col min-h-screen`}>
        <Hydration />
        <AuthInitializer />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}