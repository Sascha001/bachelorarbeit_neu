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
            let isInitialized = false;

            function activateScrollbar() {
              console.log('🟢 Activating scrollbar');
              document.body.classList.add('actively-scrolling');
              
              // Clear existing timeout
              if (scrollTimeout) {
                clearTimeout(scrollTimeout);
              }
              
              // Hide after 1 second of no scrolling
              scrollTimeout = setTimeout(() => {
                console.log('🔴 Deactivating scrollbar');
                document.body.classList.remove('actively-scrolling');
              }, 1000);
            }

            function initScrollbarEvents() {
              if (isInitialized) return;
              console.log('🚀 Initializing scrollbar events');
              
              // Multiple event strategies for maximum compatibility
              window.addEventListener('scroll', activateScrollbar, { passive: true });
              window.addEventListener('wheel', activateScrollbar, { passive: true });
              document.addEventListener('scroll', activateScrollbar, { passive: true, capture: true });
              
              // Also listen on document body
              document.body.addEventListener('scroll', activateScrollbar, { passive: true });
              
              // Listen for touchmove on mobile
              window.addEventListener('touchmove', activateScrollbar, { passive: true });
              
              isInitialized = true;
            }

            // Initialize immediately and also on DOMContentLoaded
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initScrollbarEvents);
            } else {
              initScrollbarEvents();
            }
            
            // Also initialize on window load as backup
            window.addEventListener('load', initScrollbarEvents);
          `
        }} />
      </body>
    </html>
  );
}
