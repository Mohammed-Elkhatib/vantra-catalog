import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vantra Lebanon | Medical-Grade HVAC & Air Filtration",
  description: "High-efficiency air filtration systems, dampers, ecology units, and sound attenuators for medical, pharmaceutical, and commercial projects in Lebanon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <header className="border-b border-slate-100 sticky top-0 bg-white z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-sky-700 tracking-wide">VANTRA</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium">LEBANON</span>
            </div>
            <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <a href="/" className="hover:text-sky-600 transition-colors">Home</a>
              <a href="/products" className="hover:text-sky-600 transition-colors">Catalog</a>
              <a href="/contact" className="hover:text-sky-600 transition-colors">Contact</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-100 bg-slate-50 py-12 text-slate-500 text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
            <p>&copy; {new Date().getFullYear()} Vantra Lebanon. A CMS Global Subsidiary. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-4 sm:mt-0">
              <a href="/contact" className="hover:text-slate-800">Support</a>
              <a href="#" className="hover:text-slate-800">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
