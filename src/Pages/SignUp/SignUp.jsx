import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle } from "react-icons/fa"; // Importing icons

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();

  const handleOnSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://sponsosync-backend.onrender.com/user/signup", {
        username,
        password,
        email,
        mobile,
      });

      console.log(res.data);
      toast.success("Signup successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6] p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md sm:max-w-lg flex flex-col items-center border border-gray-300">
        {/* Logo Section */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#1E3A8A] flex items-center justify-center shadow-lg mb-4 bg-white">
          <img src="/login.png" alt="SignUp Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#111827] mb-4">Sign Up</h2>

        <form onSubmit={handleOnSignUp} className="w-full space-y-5">
          {/* Username */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-1">User Name</label>
            <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 bg-white focus-within:border-[#1E3A8A]">
              <FaUser className="text-gray-600 mr-3" />
              <input
                className="w-full outline-none text-black text-lg placeholder-gray-500"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-1">Email</label>
            <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 bg-white focus-within:border-[#1E3A8A]">
              <FaEnvelope className="text-gray-600 mr-3" />
              <input
                className="w-full outline-none text-black text-lg placeholder-gray-500"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-1">Mobile</label>
            <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 bg-white focus-within:border-[#1E3A8A]">
              <FaPhone className="text-gray-600 mr-3" />
              <input
                className="w-full outline-none text-black text-lg placeholder-gray-500"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit phone number"
                placeholder="Enter your mobile number"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-1">Password</label>
            <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 bg-white focus-within:border-[#1E3A8A]">
              <FaLock className="text-gray-600 mr-3" />
              <input
                className="w-full outline-none text-black text-lg placeholder-gray-500"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree"
              className="w-5 h-5 cursor-pointer accent-[#1E3A8A]"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree" className="text-gray-800 text-base font-medium flex items-center">
              <FaCheckCircle className="text-blue-600 mr-1" /> I agree to the{" "}
              <span className="text-[#1E3A8A] hover:underline ml-1 cursor-pointer">Terms & Conditions</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            className={`w-full ${
              agreed ? "bg-[#1E3A8A] hover:bg-[#1E40AF]" : "bg-gray-400 cursor-not-allowed"
            } text-white font-bold py-3 rounded-lg text-lg transition duration-300`}
            type="submit"
            disabled={!agreed}
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm sm:text-base text-gray-700 font-semibold mt-3">
          Already have an account?{" "}
          <span className="text-[#1E3A8A] hover:underline cursor-pointer font-bold" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default SignUp;
