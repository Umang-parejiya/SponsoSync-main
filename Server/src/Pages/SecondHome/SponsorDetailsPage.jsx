import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";

const SponsorDetailsPage = () => {
  const { sponserId } = useParams();
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
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
    const fetchSponsorAndEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to continue.");
          navigate("/login");
          return;
        }

        // Fetch sponsor details
        const sponsorResponse = await axios.get(
          `https://sponsosync-backend.onrender.com/sponser/${sponserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Handle both 'sponsor' and 'sponser' response keys
        const sponsorData =
          sponsorResponse.data.sponsor || sponsorResponse.data.sponser;
        if (!sponsorData) {
          throw new Error("Sponsor not found");
        }

        setSponsor(sponsorData);
        setAppliedEvents(sponsorData.interested || []);

        // Fetch events
        const eventsResponse = await axios.get(
          "https://sponsosync-backend.onrender.com/event/myevents",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const verifiedEvents =
          eventsResponse.data?.events?.filter((event) => event.isVerified) ||
          [];
        setEvents(verifiedEvents);

        const sponsorApprovedEvents = verifiedEvents
          .filter((event) => event.approvedBy?.includes(sponserId))
          .map((event) => event._id);

        setApprovedEvents(sponsorApprovedEvents);
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to load data"
        );
        toast.error(
          err.response?.data?.error || err.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (sponserId) {
      fetchSponsorAndEvents();
    }
  }, [sponserId, navigate]);

  const handleApply = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      if (appliedEvents.includes(eventId)) {
        toast.info("You've already applied to this event");
        return;
      }

      const response = await axios.post(
        `https://sponsosync-backend.onrender.com/sponser/${sponserId}/apply`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppliedEvents((prev) => [...prev, eventId]);
      toast.success(response.data.message || "Applied successfully!");
    } catch (err) {
      console.error("Error applying for event:", err);
      toast.error(
        err.response?.data?.message || "Failed to apply for the event."
      );
    }
  };

  const toggleShowEvents = () => {
    setShowEvents(!showEvents);
  };

  const isEventApplied = (eventId) => {
    return appliedEvents.includes(eventId);
  };

  const isEventApproved = (event) => {
    return event.approvedBy?.includes(sponserId);
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">Sponsor not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <Toaster position="top-center" theme="light" closeButton richColors />
      <Link
        to="/"
        className="flex items-center text-blue-500 mb-6 hover:text-blue-700 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Sponsors
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex flex-col items-center">
            {sponsor.logoUrl && (
              <img
                src={sponsor.logoUrl}
                alt="Sponsor Logo"
                className="w-48 h-48 object-contain rounded-lg border-2 border-gray-200 mb-6"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {sponsor.sponsername}
            </h1>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {sponsor.sponsertype}
            </div>
            <button
              onClick={toggleShowEvents}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300 mb-6"
            >
              {showEvents ? "Hide Events" : "Request Sponsorship"}
            </button>
          </div>

          <div className="md:w-2/3 p-6 border-t md:border-t-0 md:border-l border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Company Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-gray-800">{sponsor.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                <p className="text-gray-800">₹{sponsor.price}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Minimal Audience
                </h3>
                <p className="text-gray-800">{sponsor.minimalAudienceCount}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-gray-800">
                  {sponsor.location?.city}, {sponsor.location?.state},{" "}
                  {sponsor.location?.country}
                </p>
              </div>
            </div>

            {showEvents && events.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Select an Event to Apply
                </h3>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {event.eventname}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      {isEventApplied(event._id) ? (
  isEventApproved(event) ? (
    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
      Approved
    </span>
  ) : (
    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
      Applied
    </span>
  )
) : (
  <button
    onClick={() => handleApply(event._id)}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm transition duration-300"
  >
    Apply
  </button>
)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showEvents && events.length === 0 && (
              <div className="mt-8 text-center text-gray-500">
                No verified events available for sponsorship
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDetailsPage;
