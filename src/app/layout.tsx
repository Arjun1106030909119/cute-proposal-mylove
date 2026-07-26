import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday",
  description:
    "A cinematic birthday and love proposal experience made with all my heart, just for you.",
  keywords: ["birthday", "love", "proposal", "romantic"],
  openGraph: {
    title: "Happy Birthday",
    description: "I made something special only for you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth"
    >
      <body className="min-h-full bg-[#0d1117] font-sans text-white antialiased">
        {/* Skip to content for accessibility */}
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
