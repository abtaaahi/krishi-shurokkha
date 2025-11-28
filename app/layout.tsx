import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata: Metadata = {
  title: "কৃষি সুরক্ষা",
  description: "Developed by ERROR 404! EDU HackFest Team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Krishi Shurokkha" />
      </head>
      <body>
        <LanguageProvider>
        {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
