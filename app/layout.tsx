import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sisi's Wanted Board — Lagos Creative & Marketing Jobs",
  description:
    "A live wanted board tracking brand marketing, advertising, copywriting and digital marketing roles at Sisi's dream companies in Lagos, Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInit = `
    (function () {
      try {
        var stored = localStorage.getItem("sisi-theme");
        var theme = stored === "light" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", theme);
      } catch (e) {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    })();
  `;

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
