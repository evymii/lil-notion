import type { Metadata } from "next";
import "./nec/globals.css";

export const metadata: Metadata = {
  title: "Class Notes - Notion-like Note Taking",
  description: "Organize your class notes by subjects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
