import { Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Brand Column (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-kudi-green rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-kudi-green/20">
                K
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 tracking-tight">
                Kudi<span className="text-kudi-green">Flow</span>
              </span>
            </div>

            <p className="text-slate-500 mb-8 leading-relaxed max-w-sm">
              Empowering Smart Market Vendors across Nigeria to track sales,
              manage inventory, and recover debts effortlessly.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-kudi-green/10 hover:border-kudi-green/20 hover:text-kudi-green transition-all duration-300"
              >
                <Twitter
                  className="w-5 h-5"
                  fill="currentColor"
                  fillOpacity={0.2}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-kudi-green/10 hover:border-kudi-green/20 hover:text-kudi-green transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-kudi-green/10 hover:border-kudi-green/20 hover:text-kudi-green transition-all duration-300"
              >
                <Linkedin
                  className="w-5 h-5"
                  fill="currentColor"
                  fillOpacity={0.2}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-500 transition-all duration-300"
              >
                <MessageCircle
                  className="w-5 h-5"
                  fill="currentColor"
                  fillOpacity={0.2}
                />
              </a>
            </div>
          </div>

          {/* Spacer Column (Optional, or just let gap-8 handle it) */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Column 1: Product */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-slate-900 mb-6 tracking-wide">
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#features"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Offline Mode
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-slate-900 mb-6 tracking-wide">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#faqs"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Help Center / FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Video Tutorials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Merchant Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Company */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-slate-900 mb-6 tracking-wide">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2340000000000"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Contact Sales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-kudi-green hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Trust Badge */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            &copy; {currentYear} KudiFlow Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
