import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";

const HomePage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    const fetchSponsors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to continue.", { duration: 2000 });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return;
        }

        const response = await axios.get("https://sponsosync-backend.onrender.com/sponser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const verifiedSponsors = response.data?.sponser?.filter(
          (sponsor) => sponsor.isVerified
        ) || [];

        setSponsors(verifiedSponsors);
      } catch (err) {
        setError(err.message || "Failed to load sponsors.");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-lg font-semibold">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <Toaster position="top-center" theme="light" closeButton richColors />
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-600">
        Verified Sponsors
      </h1>
      {sponsors.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-center text-gray-500 text-xl">
            No verified sponsors available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {sponsor.logoUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={sponsor.logoUrl}
                    alt="Sponsor Logo"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
                {sponsor.sponsername}
              </h2>
              <div className="text-center mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                  {sponsor.sponsertype}
                </span>
              </div>
              <div className="text-center mb-4">
                <span className="text-lg font-semibold text-gray-700">
                  ₹{sponsor.price}
                </span>
                <span className="text-sm text-gray-500 ml-1">budget</span>
              </div>
              <div className="flex justify-center">
                <Link
                  to={`/sponser/${sponsor._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300 flex items-center"
                >
                  View Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;