// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & Password
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // ✅ Handle Sending OTP
//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setMessage("OTP sent to your email.");
//         setStep(2); // Move to next step (OTP input)
//       } else {
//         setError(result.message || "Failed to send OTP.");
//       }
//     } catch (error) {
//       setError("Something went wrong.");
//     }
//   };

//   // ✅ Handle OTP Verification & Password Reset
//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp, newPassword }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setMessage("Password reset successfully. Redirecting...");
//         setTimeout(() => navigate("/"), 2000); // Redirect to home page
//       } else {
//         setError(result.message || "Invalid OTP or password reset failed.");
//       }
//     } catch (error) {
//       setError("Something went wrong.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
//         <p className="text-center text-gray-600 mt-2">
//           {step === 1 ? "Enter your email to receive an OTP." : "Enter OTP and create a new password."}
//         </p>

//         {message && <p className="text-green-500 text-center mt-2">{message}</p>}
//         {error && <p className="text-red-500 text-center mt-2">{error}</p>}

//         {step === 1 ? (
//           // ✅ Step 1: Enter Email
//           <form className="mt-6" onSubmit={handleSendOTP}>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg text-lg"
//             />

//             <button type="submit" className="w-full bg-[#0073FF] text-white py-3 mt-4 rounded-lg hover:bg-[#005FCC]">
//               Send OTP
//             </button>
//           </form>
//         ) : (
//           // ✅ Step 2: Enter OTP & New Password
//           <form className="mt-6" onSubmit={handleVerifyOTP}>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg text-lg"
//             />

//             <input
//               type="password"
//               placeholder="Enter new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg text-lg mt-4"
//             />

//             <button type="submit" className="w-full bg-[#0073FF] text-white py-3 mt-4 rounded-lg hover:bg-[#005FCC]">
//               Reset Password
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export { ForgotPassword };



import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & Password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Sending OTP
  const handleSendOTP = async (e) => { 
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("https://sponsosync-backend.onrender.com/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("OTP sent to your email.");
        setStep(2); // Move to next step (OTP input)
      } else {
        setError(result.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  // ✅ Handle OTP Verification & Password Reset
  const handleVerifyOTP = async (e) => {
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
        setMessage("Password reset successfully. Redirecting...");
        setTimeout(() => navigate("/"), 2000); // Redirect to home page
      } else {
        setError(result.message || "Invalid OTP or password reset failed.");
      }
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <p className="text-center text-gray-600 mt-2">
          {step === 1 ? "Enter your email to receive an OTP." : "Enter OTP and create a new password."}
        </p>

        {message && <p className="text-green-500 text-center mt-2">{message}</p>}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {step === 1 ? (
          <form className="mt-6" onSubmit={handleSendOTP}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-lg"
            />

            <button type="submit" className="w-full bg-[#0073FF] text-white py-3 mt-4 rounded-lg hover:bg-[#005FCC]">
              Send OTP
            </button>
          </form>
        ) : (
          <form className="mt-6" onSubmit={handleVerifyOTP}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-lg"
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-lg mt-4"
            />

            <button type="submit" className="w-full bg-[#0073FF] text-white py-3 mt-4 rounded-lg hover:bg-[#005FCC]">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export { ForgotPassword };