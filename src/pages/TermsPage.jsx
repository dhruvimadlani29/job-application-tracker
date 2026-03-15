// src/pages/TermsPage.jsx
import { Link } from "react-router-dom";

function TermsPage() {
  const lastUpdated = "March 15, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By creating an account and using CoopTracker, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application. These terms apply to all users of the CoopTracker platform.`,
    },
    {
      title: "2. Description of Service",
      content: `CoopTracker is a free web application designed to help college students — primarily Algonquin College students — track their co-op job applications, manage resumes and cover letters, prepare for interviews using AI tools, and receive reminders about deadlines and upcoming interviews.`,
    },
    {
      title: "3. User Accounts",
      content: `You must create an account to use CoopTracker. You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information including your real name and email address. You are responsible for all activity that occurs under your account. You must notify us immediately if you suspect unauthorized access to your account.`,
    },
    {
      title: "4. Your Data",
      content: `All application data you enter — including company names, job titles, notes, recruiter contacts, and resume information — belongs to you. We do not sell your personal data to third parties. Your data is stored securely using AWS cloud infrastructure. You can export or delete your data at any time. We may use anonymized, aggregated data to improve the service.`,
    },
    {
      title: "5. AI Features",
      content: `CoopTracker uses third-party AI services (Groq LLaMA) to generate emails, cover letters, interview questions, and other content. AI-generated content is provided as a suggestion only. You are responsible for reviewing and editing any AI-generated content before using it. We do not guarantee the accuracy, completeness, or suitability of AI-generated content for any specific purpose.`,
    },
    {
      title: "6. Acceptable Use",
      content: `You agree to use CoopTracker only for lawful purposes related to your co-op job search. You must not attempt to hack, reverse engineer, or disrupt the service. You must not use the service to harass, spam, or harm others. You must not share your account with other users. We reserve the right to suspend accounts that violate these terms.`,
    },
    {
      title: "7. Intellectual Property",
      content: `The CoopTracker application, including its design, code, and features, is the intellectual property of the developer. You retain ownership of all content you create and enter into the application. You grant us a limited license to store and process your data solely for the purpose of providing the service.`,
    },
    {
      title: "8. Disclaimers",
      content: `CoopTracker is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that it will help you find a co-op position. AI-generated content including emails and cover letters should be reviewed before use. We are not responsible for any employment decisions made by companies you apply to.`,
    },
    {
      title: "9. Limitation of Liability",
      content: `To the maximum extent permitted by law, CoopTracker and its developers shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you paid to use the service (which is zero, as CoopTracker is free).`,
    },
    {
      title: "10. Changes to Terms",
      content: `We may update these Terms of Service from time to time. We will notify you of significant changes by updating the "Last Updated" date at the top of this page. Continued use of the service after changes constitutes acceptance of the new terms.`,
    },
    {
      title: "11. Contact",
      content: `If you have questions about these Terms of Service, please contact us through the Settings page in your CoopTracker account.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl mx-8 mt-8">
        <div className="max-w-4xl mx-auto px-8 py-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              🎯
            </div>
            <span className="font-bold text-lg">CoopTracker</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-blue-100 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Intro box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <p className="text-sm text-blue-800 leading-relaxed">
            Please read these Terms of Service carefully before using
            CoopTracker. These terms govern your use of our application and the
            services we provide. CoopTracker is a free tool built to help
            college students manage their co-op job search.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h2 className="text-base font-bold text-gray-800 mb-3">
                {section.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400 mb-4">
            By using CoopTracker you agree to these terms.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Create Account →
            </Link>
            <Link
              to="/login"
              className="bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
