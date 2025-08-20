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
        <div className="vscode-scrollbar" id="vscode-scrollbar">
          <div className="vscode-scrollbar-thumb" id="vscode-scrollbar-thumb"></div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // VS Code Custom Scrollbar Implementation
              const scrollbar = document.getElementById('vscode-scrollbar');
              const thumb = document.getElementById('vscode-scrollbar-thumb');
              let fadeTimeout = null;
              
              // Calculate thumb position and size
              function updateScrollbar() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const clientHeight = window.innerHeight;
                
                if (scrollHeight <= 0) {
                  scrollbar.classList.remove('visible');
                  return;
                }
                
                const ratio = clientHeight / document.documentElement.scrollHeight;
                const thumbHeight = Math.max(20, clientHeight * ratio); // Min 20px height
                const thumbTop = (scrollTop / scrollHeight) * (clientHeight - thumbHeight);
                
                thumb.style.height = thumbHeight + 'px';
                thumb.style.top = thumbTop + 'px';
              }
              
              // Show scrollbar with VS Code fade effect
              function showScrollbar() {
                scrollbar.classList.add('visible');
                
                if (fadeTimeout) {
                  clearTimeout(fadeTimeout);
                }
                
                fadeTimeout = setTimeout(() => {
                  scrollbar.classList.remove('visible');
                }, 1000); // VS Code timing: 1 second
              }
              
              // Handle scroll events
              function handleScroll() {
                updateScrollbar();
                showScrollbar();
              }
              
              // Initialize
              window.addEventListener('scroll', handleScroll, { passive: true });
              window.addEventListener('resize', updateScrollbar, { passive: true });
              
              // Initial setup
              updateScrollbar();
              
              // Show briefly on page load
              setTimeout(() => {
                showScrollbar();
              }, 500);
            `,
          }}
        />
      </body>
    </html>
  );
}
