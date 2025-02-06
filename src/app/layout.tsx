import type { Metadata } from "next";

import ReduxProvider from "@/components/reduxProvider";
import LayoutWrapper from "../components/layoutWrapper/layoutWrapper";

import "./globals.css";

export const metadata: Metadata = {
  title: "LINMO - Sports & Wellness",
  description: "LINMO - Sports & Wellness Life in Moviment",
  icons: [
    {
      url: "/static/icon.svg"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
