    import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleOnSignUp = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const res = await axios.post("https://sponsosync-backend.onrender.com/admin/login", {
                username,
                password,
            });

            console.log("Response Data:", res.data);
            console.log("Token:", res.data.token);

            localStorage.setItem("token", res.data.token);
            toast.success("Login successful! Redirecting...", {
                duration: 2000, // 2 seconds
              });
              setTimeout(() => {
                navigate("/auth/admin/home");
              }, 1000);

        } catch (err) {
            console.error(err);

            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Invalid credentials. Please try again.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#E7F6F2] p-4 sm:p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col items-center">

                {/* Login Logo - Responsive Sizing */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#26A69A] flex items-center justify-center shadow-lg mb-4 bg-white">
                    <img src="/login.png" alt="Login" className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-center text-[#2D2D2D] mb-4">Login</h2>

                {errorMessage && (
                    <div className="mb-4 text-red-600 bg-red-100 p-2 rounded-lg text-center text-sm sm:text-base w-full">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleOnSignUp} className="w-full space-y-4">
                    <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">Username:</label>
                        <input
                            className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-600 mb-1">Password:</label>
                        <input
                            className="w-full border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]"
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
                        Login
                    </button>
                </form>

                <p className="text-center text-sm sm:text-base text-gray-600 mt-3">
                    Don't have an account?{" "}
                    <span
                        className="text-[#26A69A] hover:underline cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Sign up
                    </span>
                </p>
            </div>
            <Toaster richColors 
            position="top-center"
            closeButton
            toastOptions={{
                style: {             
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  padding: "14px 24px",
                  display: "flex",
                    justifyContent: "space-between",
                alignItems: "center",
                },
              }}
            />

        </div>
    );
};

export default Login;