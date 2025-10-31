import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 10) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 12.5;
    return Math.min(strength, 100);
  };

  async function handleSignup(e) {
    e && e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!name || !email || !password || !phone) {
      setErrorMessage("Please fill all fields");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const apiObj = { name, email, password, phone };
      await axios.post(`${apiUrl}/api/auth/signup`, apiObj);

      alert("Signup complete ✅");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Signup failed ❌";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 animate-gradient">
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 60px; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .bg-gradient-animate {
          animation: gradient-shift 15s ease infinite;
          background-size: 400% 400%;
        }
        .title-underline {
          animation: expandWidth 1s ease forwards;
        }
      `}</style>

      <div className="w-full max-w-md bg-white/25 backdrop-blur-md backdrop-saturate-200 border border-white/40 rounded-3xl p-10 shadow-2xl animate-fadeIn animate-float relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-green-400/20 -z-10 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-green-400/15 -z-10 group-hover:scale-110 transition-transform duration-300"></div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-8 pb-3 relative inline-block w-full">
          Create Account
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded title-underline"></span>
        </h2>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              value={name}
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all duration-300 hover:bg-white/95 shadow-sm"
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              value={email}
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all duration-300 hover:bg-white/95 shadow-sm"
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              value={password}
              placeholder="Create Password (min. 6 characters)"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }}
              required
              minLength="6"
              autoComplete="new-password"
              className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all duration-300 hover:bg-white/95 shadow-sm"
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength < 33
                        ? "bg-red-500 w-1/4"
                        : passwordStrength < 66
                        ? "bg-yellow-500 w-1/2"
                        : "bg-green-500 w-full"
                    }`}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Strength:{" "}
                  <span className={passwordStrength < 33 ? "text-red-500 font-semibold" : passwordStrength < 66 ? "text-yellow-500 font-semibold" : "text-green-500 font-semibold"}>
                    {passwordStrength < 33 ? "Weak" : passwordStrength < 66 ? "Medium" : "Strong"}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Phone Input */}
          <div className="relative">
            <input
              type="tel"
              value={phone}
              placeholder="Phone Number"
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
              className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all duration-300 hover:bg-white/95 shadow-sm"
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-100/90 backdrop-blur-sm border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium animate-pulse">
              {errorMessage}
            </div>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-green-400 via-green-500 to-green-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:translate-y-0 transition-all duration-200 mt-2 relative overflow-hidden group/btn"
          >
            <span className="relative z-10">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                  Signing up...
                </span>
              ) : (
                "Sign Up"
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 rounded-xl scale-0 group-hover/btn:scale-100 transition-transform duration-500 ease-out"></div>
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-700 mt-6 pt-6 border-t border-gray-200/50">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 font-bold hover:text-green-600 transition-colors duration-200 relative inline-block group/link"
          >
            Log In
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-500 group-hover/link:w-full transition-all duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
