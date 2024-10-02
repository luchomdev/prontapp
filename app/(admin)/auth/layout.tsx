import { Inter, Roboto_Mono } from "next/font/google";
import "../../globals.css";
import Hydration from "@/components/Hydration";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

export const metadata = {
  title: 'Auntenticarse en la consola administrativa',
  description: 'Auntenticarse en la consola administrativa',
}
const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${robotoMono.className} flex flex-col min-h-screen text-sm`}>
        <Hydration />
        <AuthInitializer />
        <main>{children}</main>
      </body>
    </html>
  )
}
