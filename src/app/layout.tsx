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

            function activateScrollbar() {
              document.body.classList.add('actively-scrolling');
              
              // Clear existing timeout
              if (scrollTimeout) {
                clearTimeout(scrollTimeout);
              }
              
              // Hide after 1 second of no scrolling
              scrollTimeout = setTimeout(() => {
                document.body.classList.remove('actively-scrolling');
              }, 1000);
            }

            // Simple, reliable scroll detection
            window.addEventListener('scroll', activateScrollbar, { passive: true });
            window.addEventListener('wheel', activateScrollbar, { passive: true });
            document.addEventListener('scroll', activateScrollbar, { passive: true, capture: true });
          `
        }} />
      </body>
    </html>
  );
}
