import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Enter new password
  const navigate = useNavigate();

  const handleOnSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://sponsosync-backend.onrender.com/user/login", {
        username,
        password,
      });

      console.log("Response Data:", res.data);
      console.log("Token:", res.data.token);

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      if (step === 1) {
        await axios.post("https://sponsosync-backend.onrender.com/user/forgot-password", {
          email,
        });
        toast.success("OTP sent to your email.");
        setStep(2);
      } else if (step === 2) {
        await axios.post("https://sponsosync-backend.onrender.com/user/verify-otp", {
          email,
          otp,
        });
        toast.success("OTP verified. Enter new password.");
        setStep(3);
      } else if (step === 3) {
        await axios.post("https://sponsosync-backend.onrender.com/user/reset-password", {
          email,
          newPassword,
        });
        toast.success("Password reset successfully! You can now log in.");
        setShowForgotPassword(false);
        setStep(1);
      }
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6] p-4 sm:p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col items-center">
        {/* Login Logo - Responsive Sizing */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#267ba6] flex items-center justify-center shadow-lg mb-4 bg-white">
          <img
            src="/login.png"
            alt="Login"
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
        </div>

        <h2 className="text-lg sm:text-2xl font-bold text-center text-[#2D2D2D] mb-4">
          Login
        </h2>

        {!showForgotPassword ? (
          <form onSubmit={handleOnSignUp} className="w-full space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">
                Username:
              </label>
              <input
                className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">
                Password:
              </label>
              <input
                className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-2 sm:py-3 rounded-lg text-sm sm:text-lg transition duration-300"
              type="submit"
            >
              Login
            </button>
            <p className="text-center text-sm sm:text-base text-gray-600 mt-3">
              Don't have an account?{" "}
              <span
                className="text-[#26A69A] hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Sign up
              </span>
            </p>
            <p className="text-center text-sm sm:text-base text-gray-600 mt-3">
              <span
                className="text-[#267da6] hover:underline cursor-pointer"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="w-full space-y-4">
            {step === 1 && (
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">
                  Email:
                </label>
                <input
                  className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            {step === 2 && (
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">
                  OTP:
                </label>
                <input
                  className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}
            {step === 3 && (
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">
                  New Password:
                </label>
                <input
                  className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            )}
            <button
              className="w-full bg-[#2657a6] hover:bg-[#56658d] text-white font-semibold py-2 sm:py-3 rounded-lg text-sm sm:text-lg transition duration-300"
              type="submit"
            >
              {step === 1
                ? "Send OTP"
                : step === 2
                ? "Verify OTP"
                : "Reset Password"}
            </button>
            <p className="text-center text-sm sm:text-base text-gray-600 mt-3">
              <span
                className="text-[#2662a6] hover:underline cursor-pointer"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </span>
            </p>
          </form>
        )}
      </div>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default Login;
