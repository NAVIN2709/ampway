import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
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

        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AmpWay, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
            <p>
              AmpWay provides a platform for campus-related navigation and services. We reserve the right to modify or discontinue the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h2>
            <p>
              Users are responsible for maintaining the confidentiality of their accounts and for all activities that occur under their account. You agree to use the service for lawful purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Limitation of Liability</h2>
            <p>
              AmpWay shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Your continued use of the platform after any changes constitutes acceptance of the new terms.
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

export default Terms;
