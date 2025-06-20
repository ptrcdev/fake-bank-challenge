import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReactQueryProvider } from "@/contexts/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Secure Bank",
  description: "Made by Patricia Almeida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
              {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
