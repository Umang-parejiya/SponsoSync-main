import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaLink, FaImage, FaInfoCircle, FaGift, FaUsers, FaMagic, FaSpinner } from "react-icons/fa";
import { MdDescription, MdEvent, MdLocationCity, MdLocationOn } from "react-icons/md";

const AddEventPage = () => {
  const [eventData, setEventData] = useState({
    eventname: "",
    eventtype: "",
    location: { address: "", city: "", state: "" },
    startDate: "",
    endDate: "",
    eventSocialMedia: { linkedin: "", instagram: "", facebook: "" },
    eventDescription: "",
    proposal: "",
    offers: [],
    eventOrganizer: "",
    audienceCount: 10,
    imageUrl: "",
  });

  const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
  const [isEnhancingProposal, setIsEnhancingProposal] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue.", { duration: 2000 });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleNestedChange = (e, field) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [field]: { ...eventData[field], [name]: value },
    });
  };

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
      setEventData({ ...eventData, imageUrl: uploadedFile.url, createdBy: userId });
    } catch (error) {
      toast.error("Error uploading image:", { duration: 2000 });
    }
  };

  const enhanceWithAI = async (field, prompt) => {
    if (!prompt.trim()) {
      toast.warning("Please enter some text to enhance", { duration: 2000 });
      return;
    }

    if (field === 'description') {
      setIsEnhancingDescription(true);
    } else {
      setIsEnhancingProposal(true);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://sponsosync-backend.onrender.com/gemini/enhance",
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      if (field === 'description') {
        setEventData({ ...eventData, eventDescription: response.data.enhancedText });
      } else {
        setEventData({ ...eventData, proposal: response.data.enhancedText });
      }
    } catch (error) {
      console.error("Error enhancing text with AI:", error);
      toast.error("Failed to enhance text  with AI", { duration: 2000 });
    } finally {
      if (field === 'description') {
        setIsEnhancingDescription(false);
      } else {
        setIsEnhancingProposal(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please log in to continue.", { duration: 2000 });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sponsosync-backend.onrender.com/event/new", eventData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      toast.success("Event added successfully! Please For Verify Your Event", { duration: 2000 });
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event.", { duration: 2000 });
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <Toaster position="top-center" closeButton richColors />
      <div className="flex flex-col items-center mb-8">
        <img
          src="/public/addevent.jpg"
          alt="Logo"
          className="w-24 h-24 mb-4"
        />
        <h2 className="text-4xl font-extrabold text-black text-center">Add Event</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name and Event Type */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <MdEvent className="mr-2" /> Event Name
          </label>
          <input
            name="eventname"
            type="text"
            placeholder="Event Name"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaInfoCircle className="mr-2" /> Event Type
          </label>
          <input
            name="eventtype"
            type="text"
            placeholder="Event Type"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            onChange={handleChange}
          />
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <MdLocationOn className="mr-2" /> Address
            </label>
            <input
              name="address"
              type="text"
              placeholder="Address"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              onChange={(e) => handleNestedChange(e, 'location')}
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <MdLocationCity className="mr-2" /> City
            </label>
            <input
              name="city"
              type="text"
              placeholder="City"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              onChange={(e) => handleNestedChange(e, 'location')}
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> State
            </label>
            <input
              name="state"
              type="text"
              placeholder="State"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              onChange={(e) => handleNestedChange(e, 'location')}
            />
          </div>
        </div>

        {/* Event Organizer */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaUser className="mr-2" /> Event Organizer
          </label>
          <input
            name="eventOrganizer"
            type="text"
            placeholder="Event Organizer"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            onChange={handleChange}
          />
        </div>

        {/* Start and End Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <FaCalendarAlt className="mr-2" /> Start Date
            </label>
            <input
              type="date"
              name="startDate"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <FaCalendarAlt className="mr-2" /> End Date
            </label>
            <input
              type="date"
              name="endDate"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <FaLink className="mr-2" /> LinkedIn
            </label>
            <input
              name="linkedin"
              type="text"
              placeholder="LinkedIn"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              onChange={(e) => handleNestedChange(e, 'eventSocialMedia')}
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <FaLink className="mr-2" /> Instagram
            </label>
            <input
              name="instagram"
              type="text"
              placeholder="Instagram"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              onChange={(e) => handleNestedChange(e, 'eventSocialMedia')}
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
              <FaLink className="mr-2" /> Facebook
            </label>
            <input
              name="facebook"
              type="text"
              placeholder="Facebook"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              onChange={(e) => handleNestedChange(e, 'eventSocialMedia')}
            />
          </div>
        </div>

        {/* Event Description with AI Enhance */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xl font-bold text-gray-800 flex items-center">
              <MdDescription className="mr-2" /> Event Description
            </label>
            <button
              type="button"
              onClick={() => enhanceWithAI('description', eventData.eventDescription)}
              className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
              disabled={isEnhancingDescription}
            >
              {isEnhancingDescription ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Enhancing...
                </>
              ) : (
                <>
                  <FaMagic className="mr-2" />
                  Enhance with AI
                </>
              )}
            </button>
          </div>
          <textarea
            name="eventDescription"
            placeholder="Enter a brief description of your event and click 'Enhance with AI' to improve it"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            onChange={handleChange}
            value={eventData.eventDescription}
            rows={5}
          />
        </div>

        {/* Proposal with AI Enhance */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xl font-bold text-gray-800 flex items-center">
              <FaInfoCircle className="mr-2" /> Proposal
            </label>
            <button
              type="button"
              onClick={() => enhanceWithAI('proposal', eventData.proposal)}
              className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
              disabled={isEnhancingProposal}
            >
              {isEnhancingProposal ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Enhancing...
                </>
              ) : (
                <>
                  <FaMagic className="mr-2" />
                  Enhance with AI
                </>
              )}
            </button>
          </div>
          <textarea
            name="proposal"
            placeholder="Enter your proposal idea and click 'Enhance with AI' to improve it"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            onChange={handleChange}
            value={eventData.proposal}
            rows={5}
          />
        </div>

        {/* Offers */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaGift className="mr-2" /> Offers
          </label>
          <input
            type="text"
            name="offers"
            placeholder="Offers (comma-separated)"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            onChange={(e) => setEventData({ ...eventData, offers: e.target.value.split(",") })}
          />
        </div>

        {/* Audience Count */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaUsers className="mr-2" /> Audience Count
          </label>
          <input
            type="number"
            name="audienceCount"
            min="10"
            placeholder="Audience Count"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            onChange={handleChange}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-2 flex items-center">
            <FaImage className="mr-2" /> Upload Image
          </label>
          <input
            type="file"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer font-medium"
            onChange={handleFileUpload}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-extrabold hover:bg-blue-700 transition-all hover:shadow-lg"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;