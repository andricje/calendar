import type { Metadata } from "next";
import "./globals.css";
import { Background } from "@/components/ui/background";

export const metadata: Metadata = {
  title: "Sports Calendar - UFC, ONE FC & More",
  description: "Free and open source way to subscribe to calendars from multiple sports organizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Background />
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="px-4 py-6 text-center text-xs text-gray-300/80">
            <div>
              <span>Originally by </span>
              <a href="https://github.com/rsoper" className="text-blue-400 hover:underline">@rsoper</a>
              <span> — extended by </span>
              <a href="https://github.com/andricje" className="text-blue-400 hover:underline">@andricje</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
