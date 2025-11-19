import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 md:py-16 border-t border-white/10 bg-[#050505]">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1 text-center md:text-left">
            <div className="text-2xl font-bold tracking-tighter uppercase text-white">
              ComfHutt
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              Fractional Real Estate.
              <br />
              Intelligent Ownership.
            </p>
            <div className="mt-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Founders
              </p>
              <p className="text-gray-300 font-medium">
                Murtaza Patel & Yagnesh Akbari
              </p>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-200 text-sm tracking-wider uppercase">
              Platform
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#cta"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Explore Properties
                </Link>
              </li>
              <li>
                <Link
                  href="#validator"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Smart Validator
                </Link>
              </li>
              <li>
                <Link
                  href="#solution"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-200 text-sm tracking-wider uppercase">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-200 text-sm tracking-wider uppercase">
              Connect
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Twitter / X
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; 2025 ComfHutt. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}