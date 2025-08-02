import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tenant Verification App",
  description: "A platform for tenant verification",
  icons: {
    icon: [
      {
        url: "/image.png",
        sizes: "32x32",
        type: "image/png",
      },
    
    ],
    apple: {
      url: "/image.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      
        <link rel="apple-touch-icon" href="/image.png" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
