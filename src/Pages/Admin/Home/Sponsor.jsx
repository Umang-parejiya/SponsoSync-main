import React, { useEffect, useState } from "react";
import axios from "axios";

const Sponser = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get("https://sponsosync-backend.onrender.com/admin/sponser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSponsors(response.data?.sponser || []);
    } catch (err) {
      setError(err.message || "Failed to load sponsors.");
    } finally {
      setLoading(false);
    }
  };

  const verifySponsor = async (id) => {
    try {
      const token = localStorage.getItem("token");

      // Fetch sponsor details by ID
      const sponsorResponse = await axios.get(`https://sponsosync-backend.onrender.com/admin/sponser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sponsor = sponsorResponse.data;
      const email = sponsor.email;

      // Update sponsor verification status
      await axios.put(
        `https://sponsosync-backend.onrender.com/admin/sponser/${id}`,
        { isVerified: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Send verification email via backend API
      await axios.post(
        'https://sponsosync-backend.onrender.com/admin/sponser/send-verification-email',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Sponsor verified and email sent successfully.");
      fetchSponsors(); // Refresh the list of sponsors
    } catch (err) {
      console.error("Error verifying sponsor:", err);
      alert("Failed to verify sponsor.");
    }
  };

  const deleteSponsor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sponsor?")) return;
  
    try {
      const token = localStorage.getItem("token");
  
      // Fetch sponsor details by ID
      const sponsorResponse = await axios.get(`https://sponsosync-backend.onrender.com/admin/sponser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const sponsor = sponsorResponse.data;
      const email = sponsor.email;
  
      // Send deletion confirmation email via backend API
      await axios.post(
        'https://sponsosync-backend.onrender.com/admin/sponser/send-deletion-email',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Delete the sponsor
      await axios.delete(`https://sponsosync-backend.onrender.com/admin/sponser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Sponsor deleted and email sent successfully.");
      fetchSponsors(); // Refresh list after deletion
    } catch (err) {
      console.error("Error deleting sponsor:", err);
      alert("Failed to delete sponsor.");
    }
  };
  const filteredSponsors = sponsors.filter((sponsor) => {
    if (filter === "verified") return sponsor.isVerified;
    if (filter === "unverified") return !sponsor.isVerified;
    return true;
  });

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 md:mb-10 text-gray-800">All Sponsors</h1>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {["all", "verified", "unverified"].map((status) => (
          <button
            key={status}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 ${
              filter === status ? 
              (status === "verified" ? "bg-green-600 text-white" :
              status === "unverified" ? "bg-red-600 text-white" :
              "bg-blue-600 text-white") 
              : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} Sponsors
          </button>
        ))}
      </div>

      {/* Sponsor Cards */}
      {filteredSponsors.length === 0 ? (
        <p className="text-center text-gray-500">No sponsors available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredSponsors.map((sponsor) => (
            <div
              key={sponsor._id}
              className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-400 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-auto"
            >
              {/* Sponsor Info */}
              <div className="">
                {sponsor.logoUrl && (
                  <img
                    src={sponsor.logoUrl}
                    alt="Sponsor Logo"
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full mx-auto mb-3 border-2 border-gray-300"
                  />
                )}
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 break-words text-center mb-2">{sponsor.sponsername}</h2>
                <div className="text-gray-700 space-y-1 text-sm md:text-base break-words whitespace-normal">
                  <p><span className="font-semibold pl-4">Email:</span> {sponsor.email}</p>
                  <p><span className="font-semibold pl-4">Type:</span> {sponsor.sponsertype}</p>
                  <p><span className="font-semibold pl-4">Price:</span> ₹{sponsor.price}</p>
                  <p><span className="font-semibold pl-4">Audience:</span> {sponsor.minimalAudienceCount}</p>
                  <p>
                    <span className="font-semibold pl-4">Location:</span> {sponsor.location.city}, {sponsor.location.state}, {sponsor.location.country}
                  </p>
                  <p className={`font-semibold ${sponsor.isVerified ? "text-green-600 text-center" : "text-red-500 text-center"}`}>
                    {sponsor.isVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-center space-x-3">
                {!sponsor.isVerified && (
                  <button
                    className="bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                    onClick={() => verifySponsor(sponsor._id)}
                  >
                    Verify
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                  onClick={() => deleteSponsor(sponsor._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sponser;