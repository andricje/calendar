import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMA Calendar - UFC & ONE FC Events",
  description: "Free and open source way to subscribe to calendars from multiple MMA organizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
