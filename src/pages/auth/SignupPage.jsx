// src/pages/auth/SignupPage.jsx
import { useState } from "react";
import { signUp } from "aws-amplify/auth";
import { useNavigate, Link } from "react-router-dom";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function validatePassword(password) {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(password))
      return "Password must contain at least one special character";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            name: formData.name,
          },
        },
      });
      navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      if (err.name === "UsernameExistsException") {
        setError("An account with this email already exists. Please sign in.");
      } else if (err.name === "InvalidPasswordException") {
        setError("Password does not meet the requirements below.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  }

  const passwordChecks = [
    { check: formData.password.length >= 8, text: "At least 8 characters" },
    {
      check: /[A-Z]/.test(formData.password),
      text: "One uppercase letter (A-Z)",
    },
    {
      check: /[a-z]/.test(formData.password),
      text: "One lowercase letter (a-z)",
    },
    { check: /[0-9]/.test(formData.password), text: "One number (0-9)" },
    {
      check: /[^A-Za-z0-9]/.test(formData.password),
      text: "One special character (!@#$)",
    },
  ];

  const allChecksPassed = passwordChecks.every((c) => c.check);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* ── LEFT PANEL — branding ── */}
        <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl">
                🎯
              </div>
              <span className="font-bold text-white text-lg">
                Job Application Tracker
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Land your co-op faster
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              Track every application, prep for interviews with AI, and never
              miss a deadline again.
            </p>

            {/* Feature list */}
            {[
              {
                icon: "🤖",
                text: "AI-powered email and cover letter generator",
              },
              {
                icon: "📊",
                text: "Resume match scoring for every job posting",
              },
              { icon: "🔔", text: "Smart deadline and interview reminders" },
              {
                icon: "📈",
                text: "Analytics to track your application progress",
              },
            ].map((f) => (
              <div key={f.text} className="flex items-start gap-3 mb-4">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <p className="text-blue-100 text-sm">{f.text}</p>
              </div>
            ))}
          </div>

          {/* Bottom tag */}
          <p className="text-blue-200 text-xs">
            Built for Algonquin College students 🎓
          </p>
        </div>

        {/* ── RIGHT PANEL — form ── */}
        <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              🎯
            </div>
            <span className="font-bold text-gray-800">
              Job Application Tracker
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Create your account 🚀
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dhruvi Madlani"
                  required
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@algonquincollege.com"
                  required
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            {/* Password requirements — compact grid */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs font-bold text-gray-400 mb-2">
                Password requirements:
              </p>
              <div className="grid grid-cols-2 gap-1">
                {passwordChecks.map((req) => (
                  <div key={req.text} className="flex items-center gap-1.5">
                    <span
                      className={`text-xs transition-colors ${req.check ? "text-green-500" : "text-gray-300"}`}
                    >
                      {req.check ? "✅" : "○"}
                    </span>
                    <span
                      className={`text-xs transition-colors ${req.check ? "text-green-600" : "text-gray-400"}`}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By creating an account you agree to our{" "}
            <Link
              to="/terms"
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
