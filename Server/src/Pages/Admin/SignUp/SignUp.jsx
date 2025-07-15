import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const navigate = useNavigate();

    const handleOnSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://sponsosync-backend.onrender.com/admin/signup", {
                username,
                password,
                email,
                mobile
            });
            console.log(res.data);
            navigate("/auth/admin/home");
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#E7F6F2] p-4 sm:p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center">

                {/* SignUp Logo */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-[#26A69A] flex items-center justify-center shadow-lg mb-4 bg-white">
                    <img src="/login.png" alt="SignUp Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-center text-[#2D2D2D] mb-4">Sign Up</h2>

                <form onSubmit={handleOnSignUp} className="w-full space-y-4">
                    <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">User Name:</label>
                        <input
                            className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-4 py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">Email:</label>
                        <input
                            className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-4 py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">Mobile:</label>
                        <input
                            className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-4 py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                            type="tel"
                            required
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            pattern="[0-9]{10}"
                            title="Enter a valid 10-digit phone number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">Password:</label>
                        <input
                            className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-4 py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        className="w-full bg-[#26A69A] hover:bg-[#1E847F] text-white font-semibold py-2 sm:py-3 rounded-lg text-sm sm:text-lg transition duration-300"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-sm sm:text-base text-gray-600 mt-3">
                    Already have an account?{" "}
                    <span
                        className="text-[#26A69A] hover:underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignUp;