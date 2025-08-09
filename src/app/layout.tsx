import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif", 
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Modern dashboard with violet bloom theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            let scrollTimeout = null;

            function showScrollbar() {
              console.log('🟢 SHOWING scrollbar');
              document.body.classList.add('scrolling');
              
              if (scrollTimeout) {
                clearTimeout(scrollTimeout);
              }
            }

            function hideScrollbar() {
              scrollTimeout = setTimeout(() => {
                console.log('🔴 HIDING scrollbar');
                document.body.classList.remove('scrolling');
              }, 2000);
            }

            function handleScroll() {
              console.log('📜 Scroll detected!');
              showScrollbar();
              hideScrollbar();
            }

            document.addEventListener('DOMContentLoaded', () => {
              console.log('🚀 Scroll handler initialized!');
              window.addEventListener('scroll', handleScroll, { passive: true });
              document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
            });
          `
        }} />
      </body>
    </html>
  );
}
