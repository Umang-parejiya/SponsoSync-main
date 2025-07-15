import React, { useEffect, useState } from "react";
import axios from "axios";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get("https://sponsosync-backend.onrender.com/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(response.data?.events || []);
    } catch (err) {
      setError(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const verifyEvent = async (id) => {
    try {
      const token = localStorage.getItem("token");
  
      // Fetch event details by ID
      const eventResponse = await axios.get(`https://sponsosync-backend.onrender.com/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}`},
      });
  
      const event = eventResponse.data;
      const userEmail = event.createdBy.email; // Access the email of the user who created the event
  
      // Update event verification status
      await axios.put(
        `https://sponsosync-backend.onrender.com/admin/events/${id}`,
        { isVerified: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Send verification email via backend API
      await axios.post(
        'https://sponsosync-backend.onrender.com/admin/events/send-verification-email',
        { email: userEmail, eventName: event.eventname },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Event verified and email sent successfully.");
      fetchEvents(); // Refresh list after verification
    } catch (err) {
      console.error("Error verifying event:", err);
      alert("Failed to verify event.");
    }
  };
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
  
    try {
      const token = localStorage.getItem("token");
  
      // Fetch event details by ID
      const eventResponse = await axios.get(`https://sponsosync-backend.onrender.com/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const event = eventResponse.data;
      const userEmail = event.createdBy.email;
      console.log(userEmail)

      // Send deletion confirmation email via backend API
      await axios.post(
        'https://sponsosync-backend.onrender.com/admin/events/send-deletion-email',
        { email: userEmail, eventName: event.eventname },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Delete the event
      await axios.delete(`https://sponsosync-backend.onrender.com/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Event deleted and email sent successfully.");
      fetchEvents(); // Refresh list after deletion
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  };
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "verified") return event.isVerified;
    if (filter === "unverified") return !event.isVerified;
    return true;
  });

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-10 text-gray-800">All Events</h1>
      
      {/* Filter Buttons */}
      <div className="flex justify-center gap-2 md:gap-4 mb-4 md:mb-6 flex-wrap">
        {["all", "verified", "unverified"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 ${
              filter === status ?
              (status === "verified" ? "bg-green-600 text-white" :
              status === "unverified" ? "bg-red-600 text-white" :
              "bg-blue-600 text-white")
              : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} Events
          </button>
        ))}
      </div>

      {/* Event List */}
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500">No events available.</p>
      ) : (
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="flex flex-col md:flex-row bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-400 hover:shadow-lg transition-shadow duration-300">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.eventname}
                  className="w-full md:w-40 h-40 object-cover rounded-lg mb-4 md:mb-0 md:mr-6 border-2 border-gray-300"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 break-words">{event.eventname}</h2>
                <div className="text-gray-700 space-y-1 text-sm break-words">
                  <p><span className="font-semibold">Type:</span> {event.eventtype}</p>
                  <p><span className="font-semibold">Start Date:</span> {new Date(event.startDate).toLocaleDateString()}</p>
                  <p><span className="font-semibold">End Date:</span> {new Date(event.endDate).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Audience:</span> {event.audienceCount}</p>
                  <p><span className="font-semibold">Organizer:</span> {event.eventOrganizer}</p>
                  <p><span className="font-semibold">Location:</span> {event.location?.city}, {event.location?.state}, {event.location?.country}</p>
                  {expanded[event._id] ? (
                    <p><span className="font-semibold">Description:</span> {event.eventDescription}</p>
                  ) : (
                    <p>
                      <span className="font-semibold">Description:</span> {event.eventDescription.slice(0, 100)}...
                      <button onClick={() => toggleExpand(event._id)} className="text-blue-500 ml-2">View More</button>
                    </p>
                  )}
                  <p className={`font-semibold ${event.isVerified ? "text-green-600" : "text-red-500"}`}>
                    {event.isVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
                <div className="mt-4 flex space-x-3">
                  {!event.isVerified && (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300" onClick={() => verifyEvent(event._id)}>
                      Verify
                    </button>
                  )}
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300" onClick={() => deleteEvent(event._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Event;