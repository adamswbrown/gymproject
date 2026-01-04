import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Average Joe's Gym",
  description: "A gym. You train. You leave stronger. No mirrors. No hype. Just people working out together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
