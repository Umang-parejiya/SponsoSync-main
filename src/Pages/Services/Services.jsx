import React from "react";
import { FaHandshake, FaBullhorn, FaMoneyBillWave, FaUsers, FaChartLine } from "react-icons/fa";

const Services = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-10">
      <div className="bg-white shadow-2xl rounded-3xl p-12 max-w-6xl w-full border border-gray-300">
        {/* Title Section */}
        <h2 className="text-5xl font-extrabold text-black text-center">Our Services</h2>
        <p className="text-gray-600 text-center mt-3 mb-8 text-lg">
          We bridge the gap between sponsors and event managers to create meaningful collaborations.
        </p>

        {/* Services List */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="p-8 border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 hover:border-blue-500 text-center">
            <div className="flex justify-center mb-4">
              <FaHandshake className="text-4xl text-blue-500 hover:text-blue-700 transition" />
            </div>
            <h3 className="text-2xl font-bold text-black">Sponsorship Matching</h3>
            <p className="text-gray-600 mt-3 text-lg">
              We connect brands with event organizers to create win-win partnerships.
            </p>
          </div>

          {/* Service 2 */}
          <div className="p-8 border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 hover:border-blue-500 text-center">
            <div className="flex justify-center mb-4">
              <FaBullhorn className="text-4xl text-blue-500 hover:text-blue-700 transition" />
            </div>
            <h3 className="text-2xl font-bold text-black">Event Promotion</h3>
            <p className="text-gray-600 mt-3 text-lg">
              Maximize your brand exposure through strategic event promotions.
            </p>
          </div>

          {/* Service 3 */}
          <div className="p-8 border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 hover:border-blue-500 text-center">
            <div className="flex justify-center mb-4">
              <FaMoneyBillWave className="text-4xl text-blue-500 hover:text-blue-700 transition" />
            </div>
            <h3 className="text-2xl font-bold text-black">Funding Assistance</h3>
            <p className="text-gray-600 mt-3 text-lg">
              Helping event managers secure the right sponsorship funding for their needs.
            </p>
          </div>

          {/* Service 4 */}
          <div className="p-8 border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 hover:border-blue-500 text-center">
            <div className="flex justify-center mb-4">
              <FaUsers className="text-4xl text-blue-500 hover:text-blue-700 transition" />
            </div>
            <h3 className="text-2xl font-bold text-black">Brand Collaborations</h3>
            <p className="text-gray-600 mt-3 text-lg">
              Facilitating partnerships between brands and events for mutual growth.
            </p>
          </div>

          {/* Service 5 */}
          <div className="p-8 border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 hover:border-blue-500 text-center">
            <div className="flex justify-center mb-4">
              <FaChartLine className="text-4xl text-blue-500 hover:text-blue-700 transition" />
            </div>
            <h3 className="text-2xl font-bold text-black">Analytics & Insights</h3>
            <p className="text-gray-600 mt-3 text-lg">
              Providing sponsors with data-driven insights on event engagement and ROI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;