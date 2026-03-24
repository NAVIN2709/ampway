import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you use AmpWay via Google Auth, we collect basic information provided by Google, such as your email address and name. We also collect usage data to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to provide and maintain our service, notify you about changes, and provide customer support. Your email is used for authentication and communication regarding the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
            <p>
              We prioritize the security of your data. We use industry-standard encryption and security practices provided by Supabase to protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p>
              We use Supabase for authentication and database services. These services have their own privacy policies. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time through our platform or by contacting us.
            </p>
          </section>
        </div>

        <footer className="mt-16 text-center text-gray-600 text-sm">
          Last Updated: February 2026
        </footer>
      </div>
    </div>
  );
};

export default Privacy;
