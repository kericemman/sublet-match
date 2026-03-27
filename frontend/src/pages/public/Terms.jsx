import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-[#95BDCB]/20 py-16 border-b border-[#95BDCB]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
            <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
              Legal
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#242B38] mb-4">
            Terms of{' '}
            <span className="bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last Updated: February 2026
          </p>
          <div className="mt-6 p-4 bg-white rounded-xl border border-[#95BDCB]/30 shadow-sm">
            <p className="text-sm text-gray-600">
              By accessing or using SubletMatch.com (“Sublet Match,” “we,” “our,” or “the Platform”), 
              you agree to be bound by these Terms of Service. If you do not agree to these Terms, 
              you may not use the Platform.
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {/* Update Notice */}
          <div className="bg-[#3BC0E9]/5 rounded-xl p-4 border border-[#3BC0E9]/20">
            <p className="text-sm text-gray-600 flex items-start">
              <svg className="w-5 h-5 text-[#3BC0E9] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>We may update these Terms from time to time. Continued use of the Platform after updates constitutes acceptance of the revised Terms. Use of this Platform is also subject to our <Link to="/privacy" className="text-[#3BC0E9] hover:underline">Privacy Policy</Link>.</span>
            </p>
          </div>

          {/* Section 1 */}
          <Section 
            number="1." 
            title="Nature of the Platform"
          >
            <p className="text-gray-600 mb-4">
              Sublet Match is a marketplace platform that allows users to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1">
              <li>Post short-term rental or sublet listings</li>
              <li>Search for available housing</li>
              <li>Communicate with other users</li>
              <li>Purchase optional premium services</li>
            </ul>
            <p className="text-gray-600">
              We do not own, lease, manage, or control any listed properties. We are not a broker, real estate agent, or landlord. All listings and user content are provided by third parties.
            </p>
          </Section>

          {/* Section 2 */}
          <Section 
            number="2." 
            title="Eligibility"
          >
            <p className="text-gray-600">
              You must be at least 18 years old to use this Platform. You are responsible for safeguarding your account credentials and preventing unauthorized use of your account.
            </p>
          </Section>

          {/* Section 3 */}
          <Section 
            number="3." 
            title="Listing Requirements"
          >
            <p className="text-gray-600 mb-4">
              You may not post a listing unless you have the legal right to do so. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1">
              <li>Ownership of the property</li>
              <li>A lease that permits subletting</li>
              <li>A lawful lease assignment</li>
              <li>Written authorization from the property owner or manager</li>
            </ul>
            <p className="text-gray-600 mb-4">
              By posting a listing, you represent and warrant that you have sufficient legal rights to advertise the accommodation and that the information provided is accurate. You are responsible for communication, availability, and occupancy matters.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                We reserve the right to remove listings at our discretion, especially if contacted by a property owner, landlord, or representative asserting unauthorized posting.
              </p>
            </div>
          </Section>

          {/* Section 4 */}
          <Section 
            number="4." 
            title="User Conduct"
          >
            <p className="text-gray-600 mb-4">
              You agree:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1">
              <li>To contact users only for legitimate housing-related purposes</li>
              <li>Not to spam or solicit users for unrelated services</li>
              <li>Not to misrepresent yourself</li>
              <li>Not to post duplicate listings</li>
              <li>Not to use auto-responders directing users to external platforms</li>
              <li>Not to use the Platform for illegal or fraudulent purposes</li>
              <li>Not to attempt to disrupt, overload, or infect the Platform</li>
            </ul>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                We reserve the right to suspend or terminate accounts for misconduct, fraud, impersonation, abuse, or violations of these Terms. No refunds will be issued for accounts terminated due to Terms violations.
              </p>
            </div>
          </Section>

          {/* Section 5 */}
          <Section 
            number="5." 
            title="Content Ownership & License"
          >
            <p className="text-gray-600 mb-4">
              You retain ownership of the content you post ("User Content").
            </p>
            <p className="text-gray-600 mb-4">
              By posting content, you grant Sublet Match a worldwide, non-exclusive, royalty-free, sublicensable license to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1">
              <li>Display</li>
              <li>Distribute</li>
              <li>Promote</li>
              <li>Reproduce</li>
              <li>Market</li>
            </ul>
            <p className="text-gray-600">
              Your content in connection with the Platform and its marketing. You represent that you have the rights to use all images, videos, and text you upload.
            </p>
          </Section>

          {/* Section 6 */}
          <Section 
            number="6." 
            title="Platform Disclaimer (Section 230 Protection)"
          >
            <p className="text-gray-600 mb-4">
              Sublet Match operates as an interactive computer service under Section 230 of the Communications Decency Act.
            </p>
            <p className="text-gray-600 mb-4">
              We do not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1">
              <li>Verify listings</li>
              <li>Endorse users</li>
              <li>Guarantee accuracy</li>
              <li>Guarantee availability</li>
              <li>Guarantee safety of transactions</li>
            </ul>
            <p className="text-gray-600">
              Users interact with listings and other users at their own risk. We are not liable for user-generated content, communications, agreements, or transactions between users.
            </p>
          </Section>

          {/* Section 7 */}
          <Section 
            number="7." 
            title="Fees & Payments"
          >
            <p className="text-gray-600 mb-4">
              We charge fees for certain optional services. All fees are shown before purchase.
            </p>
            <div className="bg-white border border-[#95BDCB]/30 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-[#242B38] mb-2">A. "Be First to Know" Subscription – $15/month</h4>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Recurring monthly subscription</li>
                <li>Billed automatically</li>
                <li>Non-refundable once processed</li>
                <li>May be canceled before the next billing cycle to avoid future charges</li>
              </ul>
            </div>
            <div className="bg-white border border-[#95BDCB]/30 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-[#242B38] mb-2">B. Listing Boost – $15</h4>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>One-time payment</li>
                <li>Boost lasts 7 days</li>
                <li>Non-refundable once activated</li>
              </ul>
            </div>
            <p className="text-gray-600">
              We reserve the right to change pricing with reasonable notice.
            </p>
          </Section>

          {/* Section 8-9 */}
          <Section 
            number="8-9." 
            title="Payment Processing & Chargebacks"
          >
            <p className="text-gray-600 mb-4">
              Payments are processed through a third-party payment processor (e.g., Stripe). By making a payment, you agree to the payment processor's terms and privacy policies. We are not responsible for errors caused by payment processors but may assist in resolving issues.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                If you initiate a chargeback or payment reversal, we may suspend or terminate your account. If you have billing concerns, contact us before disputing charges.
              </p>
            </div>
          </Section>

          {/* Section 10 */}
          <Section 
            number="10." 
            title="No Guarantees"
          >
            <p className="text-gray-600">
              We do not guarantee rental outcomes, listing performance, lead volume, housing availability, or compatibility between users. You are responsible for conducting your own due diligence.
            </p>
          </Section>

          {/* Section 11 */}
          <Section 
            number="11." 
            title="External Links"
          >
            <p className="text-gray-600">
              The Platform may contain links to third-party websites. We do not control or endorse third-party sites and are not responsible for phishing, malware, data breaches, fraud, or external content. You access external sites at your own risk.
            </p>
          </Section>

          {/* Section 12 */}
          <Section 
            number="12." 
            title="Messaging & Monitoring"
          >
            <p className="text-gray-600">
              We may monitor communications on the Platform for scam prevention, fraud detection, platform integrity, and dispute resolution. By using the messaging system, you consent to this monitoring. We will not disclose message content except as required by law or outlined in our Privacy Policy.
            </p>
          </Section>

          {/* Section 13 */}
          <Section 
            number="13." 
            title="Data & Scraping Restrictions"
          >
            <p className="text-gray-600 mb-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1">
              <li>Scrape or extract data</li>
              <li>Use bots or automated systems</li>
              <li>Train AI models on Platform data</li>
              <li>Reproduce or redistribute listings without permission</li>
              <li>Analyze or republish Platform data without written consent</li>
            </ul>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Violations may result in legal action.
              </p>
            </div>
          </Section>

          {/* Section 14 */}
          <Section 
            number="14." 
            title="Limitation of Liability"
          >
            <p className="text-gray-600 mb-4">
              Sublet Match, its employees, officers, and affiliates shall not be liable for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1">
              <li>Loss</li>
              <li>Injury</li>
              <li>Death</li>
              <li>Property damage</li>
              <li>Lost business</li>
              <li>Fraud between users</li>
              <li>Data breaches</li>
              <li>Platform interruptions</li>
            </ul>
            <p className="text-gray-600">
              Use of the Platform is at your own risk.
            </p>
          </Section>

          {/* Section 15-18 */}
          <Section 
            number="15-18." 
            title="Compliance & Legal"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#242B38] mb-2">15. Compliance With Legal Requests</h4>
                <p className="text-gray-600">We may disclose user information if required by subpoena, court order, or legal obligation.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#242B38] mb-2">16. Intellectual Property Claims</h4>
                <p className="text-gray-600">If you believe your intellectual property rights have been infringed, contact us at: <a href="mailto:support@subletmatch.com" className="text-[#3BC0E9] hover:underline">support@subletmatch.com</a></p>
              </div>
              <div>
                <h4 className="font-semibold text-[#242B38] mb-2">17. Fair Housing Compliance</h4>
                <p className="text-gray-600">All users agree to comply with applicable housing laws, including the Fair Housing Act and local anti-discrimination laws.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#242B38] mb-2">18. No Legal Advice</h4>
                <p className="text-gray-600">Sublet Match is not a law firm and does not provide legal advice. Consult an attorney for legal matters related to leasing or housing agreements.</p>
              </div>
            </div>
          </Section>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-[#3BC0E9]/5 to-[#95BDCB]/5 rounded-xl border border-[#95BDCB]/30">
            <h3 className="text-lg font-semibold text-[#242B38] mb-3">Questions?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="mailto:support@subletmatch.com" 
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@subletmatch.com
              </a>
            </div>
          </div>

          {/* Back to Top */}
          <div className="text-center pt-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center text-sm text-gray-500 hover:text-[#3BC0E9] transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Back to top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-[#95BDCB]/30 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-[#242B38] mb-4">
        <span className="text-[#3BC0E9] mr-2">{number}</span>
        {title}
      </h2>
      <div className="prose prose-sm max-w-none">
        {children}
      </div>
    </div>
  );
}