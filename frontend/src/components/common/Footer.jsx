import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#242B38] to-[#1a1f28] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">SubletMatch</span>
            </div>
            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              Your trusted platform for finding and listing short-term sublets. 
              Connecting renters with reliable listers for seamless living experiences.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/listings" className="text-white/60 hover:text-white transition-colors text-sm">
                  Browse Listings
                </Link>
              </li>
              
              <li>
                <Link to="/safety-tips" className="text-white/60 hover:text-white transition-colors text-sm">
                  Safety Tips
                </Link>
              </li>


              <li>
                <Link to="/feedback" className="text-white/60 hover:text-white transition-colors text-sm">
                  Submit Feedback
                </Link>
              </li>
             
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Landlords
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/landlord/register" className="text-white/60 hover:text-white transition-colors text-sm">
                  Become a Lister
                </Link>
              </li>
              
              
              {/* <li>
                <Link to="/blogs" className="text-white/60 hover:text-white transition-colors text-sm">
                  Resources
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-service" className="text-white/60 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
             
              
              <li>
                <Link to="/contact" className="text-white/60 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Get the latest listings
              </h3>
              <p className="text-white/60 text-sm">
                Be the first to know about new properties and updates.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg font-medium hover:shadow-md transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              © {currentYear} SubletMatch. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/accessibility" className="text-white/40 hover:text-white text-xs transition-colors">
                Accessibility
              </Link>
              
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">🌐</span>
                <select className="bg-transparent text-white/40 text-xs focus:outline-none cursor-pointer hover:text-white transition-colors">
                  <option value="en" className="bg-[#242B38]">English</option>
                  <option value="es" className="bg-[#242B38]">Español</option>
                  <option value="fr" className="bg-[#242B38]">Français</option>
                </select>
              </div>
            </div>
          </div>
          <p className="text-white/30 text-xs text-center mt-4">
            Made with ❤️ by <a href="https://thedigitalagame.com" className="hover:text-white transition-colors">The Digital Game</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;