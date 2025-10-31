import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill all fields");
      setIsLoading(false);
      return;
    }

    try {
      const apiObj = { email, password };
      const res = await axios.post(`${apiUrl}/api/auth/login`, apiObj);

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        alert("Login Successful ✅");
        navigate("/mainpage");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 animate-gradient">
      {/* Add to your tailwind.config.js: animation: { gradient: 'gradient-shift 15s ease infinite' } */}
      
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
      `}</style>

      <div className="w-full max-w-sm bg-white/25 backdrop-blur-md backdrop-saturate-200 border border-white/40 rounded-3xl p-10 shadow-2xl animate-fadeIn animate-float relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-green-400/20 -z-10 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-green-400/15 -z-10 group-hover:scale-110 transition-transform duration-300"></div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-8 pb-3 border-b-4 border-transparent bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent relative inline-block w-full">
          Login
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded"></span>
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all duration-300 hover:bg-white/95 shadow-sm"
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all duration-300 hover:bg-white/95 shadow-sm"
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-100/90 backdrop-blur-sm border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium animate-pulse">
              {errorMessage}
            </div>
          )}

          {/* Login Button */}
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </span>
            {/* Pulse effect on hover */}
            <div className="absolute inset-0 bg-white/20 rounded-xl scale-0 group-hover/btn:scale-100 transition-transform duration-500 ease-out"></div>
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center text-sm text-gray-700 mt-6 pt-6 border-t border-gray-200/50">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-500 font-bold hover:text-green-600 transition-colors duration-200 relative inline-block group/link"
          >
            Sign Up
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-500 group-hover/link:w-full transition-all duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
