import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { FaUser, FaLink, FaImage, FaInfoCircle, FaMoneyBill, FaUsers } from "react-icons/fa";
import { MdLocationCity, MdLocationOn } from "react-icons/md";

const SponsorForm = () => {
  const [formData, setFormData] = useState({
    sponsername: "",
    email: "",
    location: { city: "", state: "", country: "India" },
    sponsertype: "",
    socialMedia: { facebook: "", instagram: "", other: "" },
    price: "",
    minimalAudienceCount: "",
    logoUrl: "",
  });
  const navigate = useNavigate();
  

  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to continue.", { duration: 2000 });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "sponsosync");
    data.append("cloud_name", "drgbi9wy0");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drgbi9wy0/image/upload",
        { method: "POST", body: data }
      );
      const uploadedFile = await res.json();
      setFormData({ ...formData, logoUrl: uploadedFile.secure_url });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name.includes("location.")) {
        return { ...prev, location: { ...prev.location, [name.split(".")[1]]: value } };
      }
      if (name.includes("socialMedia.")) {
        return { ...prev, socialMedia: { ...prev.socialMedia, [name.split(".")[1]]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  const validateSocialMediaLinks = () => {
    const urlRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    return Object.values(formData.socialMedia).every((link) => !link || urlRegex.test(link.trim()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateSocialMediaLinks()) {
      toast.error("Invalid social media link detected! Please enter valid URLs.");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated! Please log in.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://sponsosync-backend.onrender.com/sponser/new",
        { ...formData, createdBy: userId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      toast.success("Sponsor registered successfully! Please wait for verification.");
      setFormData({
        sponsername: "",
        email: "",
        location: { city: "", state: "", country: "India" },
        sponsertype: "",
        socialMedia: { facebook: "", instagram: "", other: "" },
        price: "",
        minimalAudienceCount: "",
        logoUrl: "",
      });
    } catch (error) {
      console.error("Error registering sponsor:", error);
      toast.error(error.response?.data?.message || "Failed to register sponsor.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Logo and Heading */}
      <Toaster position="top-center" closeButton richColors />
      <div className="flex flex-col items-center mb-8">
        <img
          src="/public/sponser.png" // Replace with your logo URL
          alt="Logo"
          className="w-24 h-24 mb-4"
        />
        <h2 className="text-4xl font-extrabold text-black text-center">Sponsor Registration</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sponsor Name */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaUser className="mr-2" /> Sponsor Name
          </label>
          <input
            type="text"
            name="sponsername"
            placeholder="Sponsor Name"
            value={formData.sponsername}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaInfoCircle className="mr-2" /> Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
          />
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <MdLocationCity className="mr-2" /> City
            </label>
            <input
              type="text"
              name="location.city"
              placeholder="City"
              value={formData.location.city}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <MdLocationOn className="mr-2" /> State
            </label>
            <input
              type="text"
              name="location.state"
              placeholder="State"
              value={formData.location.state}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            />
          </div>
        </div>

        {/* Type of Sponsorship */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaInfoCircle className="mr-2" /> Type of Sponsorship
          </label>
          <input
            type="text"
            name="sponsertype"
            placeholder="Type of Sponsorship"
            value={formData.sponsertype}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
          />
        </div>

        {/* Social Media Links */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <FaLink className="mr-2" /> Facebook
            </label>
            <input
              type="url"
              name="socialMedia.facebook"
              placeholder="Facebook"
              value={formData.socialMedia.facebook}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <FaLink className="mr-2" /> Instagram
            </label>
            <input
              type="url"
              name="socialMedia.instagram"
              placeholder="Instagram"
              value={formData.socialMedia.instagram}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            />
          </div>
        </div>

        {/* Sponsorship Price */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaMoneyBill className="mr-2" /> Sponsorship Price (₹)
          </label>
          <input
            type="number"
            name="price"
            placeholder="Sponsorship Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
          />
        </div>

        {/* Minimum Audience Count */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaUsers className="mr-2" /> Minimum Audience Count
          </label>
          <input
            type="number"
            name="minimalAudienceCount"
            placeholder="Minimum Audience Count"
            value={formData.minimalAudienceCount}
            onChange={handleChange}
            required
            min="10"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaImage className="mr-2" /> Upload Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer font-medium"
          />
          {formData.logoUrl && (
            <img
              src={formData.logoUrl}
              alt="Uploaded Logo"
              className="mt-2 w-24 h-24 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-extrabold hover:bg-blue-700 transition-all hover:shadow-lg"
        >
          Register Sponsor
        </button>
      </form>
    </div>
  );
};

export default SponsorForm;