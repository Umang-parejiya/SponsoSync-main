import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHandshake, FaUsers, FaChartLine } from "react-icons/fa";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-10">
      <div className="bg-white shadow-2xl rounded-3xl p-12 max-w-6xl w-full border border-gray-300 transition-transform transform hover:scale-105 duration-300">
        
        {/* Title Section */}
        <h2 className="text-5xl font-extrabold text-black text-center">About Us</h2>
        <p className="text-gray-600 text-center mt-3 mb-8 text-lg">
          Connecting sponsors and event managers to build meaningful, lasting partnerships.
        </p>

        {/* About Us Content */}
        <div className="space-y-6 text-center">
          <p className="text-gray-700 text-lg">
            We are a platform that helps brands gain exposure while enabling event organizers to secure valuable sponsorships.  
            Our goal is to make sponsorships easy, transparent, and mutually beneficial.
          </p>

          <p className="text-gray-700 text-lg">
            Whether you're a business seeking the right audience or an event planner looking for funding,  
            we provide seamless connections and ensure win-win collaborations.
          </p>
        </div>

        {/* Stats or Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Stat 1 */}
          <div className="p-6 bg-blue-500 text-white rounded-xl text-center shadow-lg transition-all duration-300 transform hover:scale-110">
            <FaHandshake className="text-5xl mx-auto mb-3" />
            <h3 className="text-4xl font-bold">500+</h3>
            <p className="text-lg">Successful Sponsorships</p>
          </div>
          
          {/* Stat 2 */}
          <div className="p-6 bg-blue-500 text-white rounded-xl text-center shadow-lg transition-all duration-300 transform hover:scale-110">
            <FaUsers className="text-5xl mx-auto mb-3" />
            <h3 className="text-4xl font-bold">300+</h3>
            <p className="text-lg">Trusted Companies</p>
          </div>

          {/* Stat 3 */}
          <div className="p-6 bg-blue-500 text-white rounded-xl text-center shadow-lg transition-all duration-300 transform hover:scale-110">
            <FaChartLine className="text-5xl mx-auto mb-3" />
            <h3 className="text-4xl font-bold">100+</h3>
            <p className="text-lg">Events Sponsored</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-10 text-center">
          <p className="text-gray-700 text-lg">Join us and <span className="font-bold text-blue-600">be a part of something big!</span></p>
          <button 
            className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;