import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("https://sponsosync-backend.onrender.com/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Password successfully reset. You can now log in.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(result.message || "Failed to reset password.");
      }
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        {message && <p className="text-green-500 text-center mt-2">{message}</p>}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6" onSubmit={handleResetPassword}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg text-lg mt-4" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg text-lg mt-4" />

          <button type="submit" className="w-full bg-[#0073FF] text-white py-3 mt-4 rounded-lg hover:bg-[#005FCC]">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export { ResetPassword };