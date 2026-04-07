import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: "problem",
      title: "The Problem We Faced",
      content: "In 2023, we landed our dream internships at Google. We couldn't wait to start, but before we could kick off our dream summer in the city, another challenge awaited us: finding summer housing. Hours lost scrolling through Facebook groups. Sketchy listings that looked too good to be true. Scam after scam. And the constant stress of wondering, 'What if I can't find a place to stay?'",
      image: "/assets/4.jpg",
      alt: "Frustrated person looking at phone",
      
    },
    {
      id: "solution",
      title: "Our Solution",
      content: "That's why we built SubletMatch, the service we desperately needed but couldn't find. A platform that actually verifies listings, connects you with real people, and makes short-term housing feel simple again. No more guesswork. No more anxiety. Just a clear path to your summer home.",
      image: "/assets/3.jpg",
      alt: "Team building a solution",
   
    },
    {
      id: "mission",
      title: "Our Mission Today",
      content: "Now, we help interns and young professionals skip the chaos and lock in sublets without wasting time or risking scams. No endless scrolling. No uncertainty. Just safe options that fit your budget and your timeline — so you can focus on chasing your goals and actually enjoying your summer.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Happy young professionals enjoying summer",
     
    }
  ];

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const sectionHeight = e.target.scrollHeight / sections.length;
    const newActiveSection = Math.floor(scrollTop / sectionHeight);
    setActiveSection(Math.min(newActiveSection, sections.length - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#242B38] to-[#1a1f28] py-16 border-b border-[#95BDCB]/30">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
            alt="Young professionals collaborating"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#242B38]/90 via-[#242B38]/80 to-[#242B38]/90"></div>
        </div>

        {/* Animated Background Blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3BC0E9] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#95BDCB] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#3BC0E9] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            
            <span className="text-xs font-medium text-white uppercase tracking-wider">
              Our Story
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Built by Interns,{' '}
            <span className="bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] bg-clip-text text-transparent">
              for Interns
            </span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            From frustration to solution, here's how SubletMatch came to life
          </p>
        </div>
      </div>

      {/* Main Content with Scrollable Sections */}
      <div className="max-w-88xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 min-h-[600px]">
          
          {/* Left Side - Scrollable Text */}
          <div 
            className="lg:h-[600px] overflow-y-auto pr-6 scroll-smooth hide-scrollbar"
            onScroll={handleScroll}
          >
            <div className="space-y-16 pb-8">
              {sections.map((section, index) => (
                <div 
                  key={section.id}
                  className={`transition-opacity duration-500 ${
                    activeSection === index ? 'opacity-100' : 'opacity-90'
                  }`}
                >
                  {/* Section Indicator */}
                  <div className="flex items-center mb-4">
                    
                    <h2 className="text-2xl font-bold text-[#242B38]">
                      {section.title}
                    </h2>
                  </div>

                  {/* Mobile Image (visible only on small screens) */}
                  <div className="lg:hidden mb-6">
                    <img
                      src={section.image}
                      alt={section.alt}
                      className="w-full h-48 object-cover rounded-xl shadow-md"
                    />
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {section.content}
                  </p>

                  {/* Section Divider (except last) */}
                  {index < sections.length - 1 && (
                    <div className="border-t border-gray-200 my-8"></div>
                  )}
                </div>
              ))}

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-[#3BC0E9]/10 to-[#95BDCB]/10 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-[#242B38] mb-3">
                  Ready to find your summer home?
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/listings"
                    className="px-6 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Browse Sublets
                  </Link>
                  <Link
                    to="/landlord/register"
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#3BC0E9] hover:text-[#3BC0E9] transition-all"
                  >
                    List Your Apartments
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Fixed Image Gallery */}
          <div className="hidden lg:block relative h-[600px] rounded-xl overflow-hidden shadow-xl">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  activeSection === index
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={section.image}
                  alt={section.alt}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#242B38]/80 via-transparent to-transparent"></div>
                
                {/* Image Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="inline-block px-3 py-1 bg-[#3BC0E9]/20 backdrop-blur-sm rounded-full text-xs mb-2">
                    Step {index + 1}
                  </div>
                  <p className="text-sm opacity-90">
                    {section.alt}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const scrollContainer = document.querySelector('.overflow-y-auto');
                    if (scrollContainer) {
                      const sectionHeight = scrollContainer.scrollHeight / sections.length;
                      scrollContainer.scrollTo({
                        top: sectionHeight * index,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeSection === index
                      ? 'w-8 bg-[#3BC0E9]'
                      : 'bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to section ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}