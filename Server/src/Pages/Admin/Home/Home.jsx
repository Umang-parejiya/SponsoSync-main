import React, { useState } from "react";
import Event from "./Event";
import Sponsor from "./Sponsor";

// ... (previous imports)
import User from "./User";

const Home = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Container with Light Grey Background */}
      <div className="w-full max-w-4xl bg-gray-50 p-8 rounded-lg shadow-lg border border-gray-200">
        {/* Stylish Title with Underline */}
        <div className="w-full flex justify-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 relative inline-block text-center">
            Welcome to the System
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-blue-500 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></span>
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex space-x-8 justify-center">
          {/* Event Button */}
          <button
            className="w-40 h-40 flex items-center justify-center bg-blue-500/20 rounded-lg border-2 border-blue-500 text-blue-700 text-xl font-semibold hover:bg-blue-500/40 hover:border-blue-600 hover:text-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => setSelectedComponent("event")}
          >
            Go to Event
          </button>

          {/* Sponsor Button */}
          <button
            className="w-40 h-40 flex items-center justify-center bg-green-500/20 rounded-lg border-2 border-green-500 text-green-700 text-xl font-semibold hover:bg-green-500/40 hover:border-green-600 hover:text-green-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => setSelectedComponent("sponsor")}
          >
            Go to Sponsor
          </button>

          {/* User Button */}
          <button
            className="w-40 h-40 flex items-center justify-center bg-purple-500/20 rounded-lg border-2 border-purple-500 text-purple-700 text-xl font-semibold hover:bg-purple-500/40 hover:border-purple-600 hover:text-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => setSelectedComponent("user")}
          >
            User Management
          </button>
        </div>

        {/* Render Selected Component */}
        <div className="mt-10 w-full">
          {selectedComponent === "event" && <Event />}
          {selectedComponent === "sponsor" && <Sponsor />}
          {selectedComponent === "user" && <User />}
        </div>
      </div>
    </div>
  );
};

export default Home;