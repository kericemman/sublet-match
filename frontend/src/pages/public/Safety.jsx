import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function SafetyTips() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tips = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Verify Lister Identity",
      description: "Always ask for proof of identity. SubletMatch verifies all listers, but you should also ask to see a government-issued ID that matches the property address or lease agreement.",
      color: "green"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: "Schedule a Viewing",
      description: "Never rent a property without seeing it first. Schedule an in-person or live video tour to verify the property exists and matches the listing photos.",
      color: "blue"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Never Pay Before Signing",
      description: "Never send money before signing a lease agreement. A legitimate lister will be happy to provide a contract before accepting any payment.",
      color: "yellow"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Get Everything in Writing",
      description: "Ensure you have a written lease agreement that clearly states the rental period, monthly rent, security deposit, and any house rules. Keep copies of all communications.",
      color: "purple"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Use Secure Payment Methods",
      description: "Avoid cash payments or wire transfers. Use traceable methods like checks, bank transfers, or secure payment platforms that offer buyer protection.",
      color: "red"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: "Communicate Through the Platform",
      description: "Keep all communication within SubletMatch's messaging system. This helps us monitor for suspicious activity and provides a record of your conversations.",
      color: "teal"
    }
  ];

  const redFlags = [
    "Lister asks for payment before you've seen the property",
    "Listing price seems too good to be true",
    "Lister claims to be out of the country and can't show the property",
    "Requests for wire transfers or gift cards as payment",
    "Pressure to make a quick decision or deposit",
    "Listing photos appear professionally staged or stock images",
    "Lister is vague about property details or location",
    "Communication only through external email or phone",
    "No lease agreement or refuses to provide one"
  ];

  const dosAndDonts = [
    {
      type: "do",
      title: "Do Research the Neighborhood",
      description: "Look up crime rates, proximity to public transit, and local amenities before committing."
    },
    {
      type: "do",
      title: "Do Take Photos During Move-In",
      description: "Document the property's condition with time-stamped photos to protect your security deposit."
    },
    {
      type: "do",
      title: "Do Read the Lease Carefully",
      description: "Understand all terms including cancellation policies, subletting rules, and maintenance responsibilities."
    },
    {
      type: "dont",
      title: "Don't Share Personal Information",
      description: "Avoid sharing your social security number, bank details, or passwords until you've signed a lease."
    },
    {
      type: "dont",
      title: "Don't Ignore Your Gut Feeling",
      description: "If something feels off, trust your instincts and walk away. There are plenty of other listings."
    },
    {
      type: "dont",
      title: "Don't Rush the Process",
      description: "Take your time to verify everything. A legitimate lister will be patient and cooperative."
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-50 text-green-700 border-green-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      red: "bg-red-50 text-red-700 border-red-200",
      teal: "bg-teal-50 text-teal-700 border-teal-200"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-[#95BDCB]/20 py-16 border-b border-[#95BDCB]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
        
            <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
              Stay Safe
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#242B38] mb-4">
            Safety{' '}
            <span className="bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] bg-clip-text text-transparent">
              Tips
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your safety is our priority. Follow these guidelines for a secure subletting experience.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Safety Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border ${getColorClasses(tip.color)} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                <div className={getColorClasses(tip.color).split(' ')[0]}>
                  {tip.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
              <p className="text-sm leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>

        {/* Red Flags Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#242B38]">Red Flags to Watch For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {redFlags.map((flag, index) => (
              <div key={index} className="flex items-start">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-sm text-gray-700">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Do's and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Do's */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800">Do's ✅</h3>
            </div>
            <div className="space-y-4">
              {dosAndDonts.filter(item => item.type === "do").map((item, index) => (
                <div key={index}>
                  <p className="font-medium text-green-800">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Don'ts */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800">Don'ts ❌</h3>
            </div>
            <div className="space-y-4">
              {dosAndDonts.filter(item => item.type === "dont").map((item, index) => (
                <div key={index}>
                  <p className="font-medium text-red-800">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-gradient-to-r from-[#3BC0E9]/10 to-[#95BDCB]/10 rounded-xl p-6 text-center border border-[#3BC0E9]/20">
          <h3 className="text-lg font-semibold text-[#242B38] mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you encounter suspicious activity or need assistance, contact our support team immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all"
            >
              Contact Support
            </a>
            <a
              href="mailto:info@subletmatch.com"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#3BC0E9] hover:text-[#3BC0E9] transition-all"
            >
              info@subletmatch.com
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            For emergencies, please contact local authorities immediately.
          </p>
        </div>

        {/* Report Button */}
        <div className="mt-8 text-center">
          <Link
            to="/report"
            className="inline-flex items-center px-6 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Report Suspicious Activity
          </Link>
        </div>
      </div>
    </div>
  );
}