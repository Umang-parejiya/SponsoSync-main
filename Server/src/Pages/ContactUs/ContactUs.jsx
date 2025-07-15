import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPaperPlane } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "734a7f39-bfaf-4063-a279-35bf7f41a82a");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
      setFormData({ name: "", email: "", message: "" });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center">
        {/* Logo Section */}
        <div className="w-16 h-16 rounded-full border-2 border-blue-600 flex items-center justify-center shadow-md bg-white mb-4">
          <img src="/contact_us.png" alt="Contact Us" className="w-10 h-10" />
        </div>

        {/* Title Section */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-center text-black mb-4">Contact Us</h2>
        <p className="text-gray-700 text-center text-sm sm:text-base mb-6">
          Have any questions? Feel free to reach out!
        </p>

        {/* Success Message */}
        {successMessage && (
          <p className="text-blue-700 bg-blue-100 p-2 rounded-lg text-center mb-4">
            {successMessage}
          </p>
        )}

        {/* Form Section */}
        <form onSubmit={onSubmit}  className="w-full space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-base sm:text-lg font-bold text-black mb-2">Name</label>
            <div className="flex items-center border border-gray-500 rounded-lg px-3 py-2 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 shadow-sm">
              <FaUser className="text-gray-600 mr-3" />
              <input
                className="w-full outline-none text-gray-900 text-lg font-semibold placeholder-gray-500 bg-transparent"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-base sm:text-lg font-bold text-black mb-2">Email</label>
            <div className="flex items-center border border-gray-500 rounded-lg px-3 py-2 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 shadow-sm">
              <FaEnvelope className="text-gray-600 mr-3" />
              <input
                className="w-full outline-none text-gray-900 text-lg font-semibold placeholder-gray-500 bg-transparent"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-base sm:text-lg font-bold text-black mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-500 rounded-lg bg-white text-gray-900 text-lg font-semibold placeholder-gray-500 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 shadow-sm"
              placeholder="Write your message..."
              rows="4"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg"
          >
            <div className="flex justify-center items-center gap-2">
              <FaPaperPlane />
              Send Message
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;