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
              console.log('🟢 Showing scrollbar - triggering fade-in animation');
              
              // Remove fade-out and add fade-in classes
              document.body.classList.remove('scrollbar-fade-out');
              document.body.classList.add('scrollbar-fade-in');
              
              // Clear existing timeout
              if (scrollTimeout) {
                console.log('⏰ Clearing existing timeout');
                clearTimeout(scrollTimeout);
              }
              
              // Hide after 1 second of no scrolling with fade-out animation
              scrollTimeout = setTimeout(() => {
                console.log('🔴 Hiding scrollbar - triggering fade-out animation');
                document.body.classList.remove('scrollbar-fade-in');
                document.body.classList.add('scrollbar-fade-out');
              }, 1000);
            }

            function initScrollbarEvents() {
              if (isInitialized) return;
              console.log('🚀 Initializing scrollbar events');
              
              // Debug: Check which elements have scrollbars
              setTimeout(() => {
                console.log('🔍 Debugging scrollable elements:');
                console.log('body scrollHeight:', document.body.scrollHeight, 'clientHeight:', document.body.clientHeight);
                console.log('html scrollHeight:', document.documentElement.scrollHeight, 'clientHeight:', document.documentElement.clientHeight);
                console.log('body overflow:', window.getComputedStyle(document.body).overflow);
                console.log('html overflow:', window.getComputedStyle(document.documentElement).overflow);
                
                // Manual CSS test
                console.log('🧪 Testing CSS manually...');
                console.log('Current body classes:', document.body.className);
                
                // Force add class and test
                document.body.classList.add('css-test');
                console.log('Added css-test class');
                
                setTimeout(() => {
                  document.body.classList.remove('css-test');  
                  console.log('Removed css-test class');
                }, 2000);
              }, 1000);
              
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
