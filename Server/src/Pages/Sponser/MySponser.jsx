import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const MySponser = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [editingSponsor, setEditingSponsor] = useState(null);
  const [formData, setFormData] = useState({
    sponsername: "",
    email: "",
    type: "",
    price: "",
    minimalAudienceCount: "",
    location: { city: "", state: "", country: "" },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({
    event: null,
    sponsorId: null
  });

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
    fetchSponsors();
  }, []);

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

      const response = await axios.get(
        "https://sponsosync-backend.onrender.com/sponser/admin/mysponserslist",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sponsorsWithEvents = await Promise.all(
        response.data?.sponsers.map(async (sponsor) => {
          const events = await Promise.all(
            sponsor.interested.map(async (eventId) => {
              try {
                const eventRes = await axios.get(
                  `https://sponsosync-backend.onrender.com/event/${eventId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                return eventRes.data;
              } catch (err) {
                console.error("Failed to fetch event", err);
                return null;
              }
            })
          );
          return { ...sponsor, events: events.filter(Boolean) };
        })
      );

      setSponsors(sponsorsWithEvents);
    } catch (err) {
      setError(err.message || "Failed to load sponsors.");
      toast.error(err.message || "Failed to load sponsors.", { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sponsor?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://sponsosync-backend.onrender.com/sponser/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSponsors((prev) => prev.filter((sponsor) => sponsor._id !== id));
      toast.success("Sponsor deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete sponsor.");
    }
  };

  const handleEditClick = (sponsor) => {
    setEditingSponsor(sponsor._id);
    setFormData({
      sponsername: sponsor.sponsername,
      email: sponsor.email,
      type: sponsor.type,
      price: sponsor.price,
      minimalAudienceCount: sponsor.minimalAudienceCount,
      location: { ...sponsor.location },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://sponsosync-backend.onrender.com/sponser/admin/update/${editingSponsor}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSponsors((prev) =>
        prev.map((sponsor) =>
          sponsor._id === editingSponsor
            ? { ...sponsor, ...formData }
            : sponsor
        )
      );
      setEditingSponsor(null);
      toast.success("Sponsor updated successfully!");
    } catch (err) {
      toast.error("Failed to update sponsor.");
    }
  };

  const handleViewEvent = (event, sponsorId) => {
    setSelectedEvent({
      event: event,
      sponsorId: sponsorId
    });
    setIsModalOpen(true);
  };

  const handleApprove = async (sponsorId, event) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");
  
      // Update UI optimistically
      setSponsors(prev => prev.map(sponsor => {
        if (sponsor._id === sponsorId) {
          const updatedEvents = sponsor.events.map(ev => {
            if (ev.event._id === event.event._id) {
              return {
                ...ev,
                event: {
                  ...ev.event,
                  approvedBy: [...(ev.event.approvedBy || []), sponsorId]
                }
              };
            }
            return ev;
          });
          return { ...sponsor, events: updatedEvents };
        }
        return sponsor;
      }));
  
      // Update sponsor's approved field with event ID
      await axios.put(
        `https://sponsosync-backend.onrender.com/sponser/${sponsorId}/approve`,
        { eventId: event.event._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Fetch the event owner's email
      const userId = event.event.createdBy;
      let email;
      try {
        const response = await axios.get(
          `https://sponsosync-backend.onrender.com/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        email = response.data.user.email;
      } catch (err) {
        console.error("Error fetching user data:", err);
        email = null;
      }
  
      // Update the event's approvedBy field with the sponsor ID and email
      await axios.put(
        `https://sponsosync-backend.onrender.com/event/${event.event._id}/approve`,
        { sponserId: sponsorId, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("Event approved successfully!");
    } catch (err) {
      console.error("Failed to approve sponsor", err);
      toast.error("Failed to approve event. Please try again.");
      fetchSponsors(); // Refresh data to get correct state
    }
  };

  const EventModal = ({ event, onClose, sponsorId }) => {
    if (!event) return null;
  
    const isApproved = event.event.approvedBy?.includes(sponsorId);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4">{event.event.eventname}</h2>
          <p className="text-gray-600">
            <strong>Event Type:</strong> {event.event.eventtype}
          </p>
          <p className="text-gray-600">
            <strong>Description:</strong> {event.event.description}
          </p>
          <p className="text-gray-600">
            <strong>Date:</strong>{" "}
            {new Date(event.event.date).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <strong>Address:</strong> {event.event.location.address}
          </p>
          <p className="text-gray-600">
            <strong>City:</strong> {event.event.location.city}
          </p>
          <p className="text-gray-600">
            <strong>State:</strong> {event.event.location.state}
          </p>
          <p className="text-gray-600">
            <strong>Organizer:</strong> {event.event.eventOrganizer}
          </p>
          <p className="text-gray-600">
            <strong>Audience Count:</strong> {event.event.audienceCount}
          </p>
          
          {isApproved && (
            <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
              ✔ You have already approved this event
            </div>
          )}
  
          <button
            onClick={() => navigate(`/chat/${event._id}`)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Chat
          </button>
  
          <button
            onClick={onClose}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster position="top-center" closeButton richColors />
      
      <h1 className="text-2xl font-bold mb-4">My Sponsors</h1>
      {sponsors.length === 0 ? (
        <p className="text-center text-gray-500">No sponsors available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor._id} className="bg-white p-4 shadow-lg rounded-lg">
              {sponsor.logoUrl && (
                <img
                  src={sponsor.logoUrl}
                  alt="Sponsor Logo"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{sponsor.sponsername}</h2>
              <p className="text-gray-600">Email: {sponsor.email}</p>
              <p className="text-gray-600">Type: {sponsor.sponsertype}</p>
              <p className="text-gray-600">Price: ₹{sponsor.price}</p>
              <p className="text-gray-600">
                Minimal Audience: {sponsor.minimalAudienceCount}
              </p>
              <p className="text-gray-600">
                Location: {sponsor.location.city}, {sponsor.location.state},{" "}
                {sponsor.location.country}
              </p>
              <h3 className="text-lg font-semibold mt-4">Interested Events:</h3>
              {sponsor.events.length === 0 ? (
                <p className="text-gray-500">No events found.</p>
              ) : (
                <ul className="list-disc ml-5">
                  {sponsor.events.map((event, index) => {
                    const isApproved = event.event.approvedBy?.includes(sponsor._id);
                    
                    return (
                      <div key={event._id || `event-${index}`}>
                        <li>{event.event.eventname}</li>
                        <button
                          onClick={() => handleViewEvent(event, sponsor._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                        >
                          View Event
                        </button>
                        {!isApproved ? (
                          <button
                            onClick={() => handleApprove(sponsor._id, event)}
                            className="bg-blue-500 text-white px-2 py-1 rounded mt-2 mx-2"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-green-600 ml-2">✔ Approved</span>
                        )}
                      </div>
                    );
                  })}
                </ul>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(sponsor)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sponsor._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {editingSponsor && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Sponsor</h2>
            <input
              type="text"
              name="sponsername"
              value={formData.sponsername}
              onChange={handleChange}
              placeholder="Sponsor Name"
              className="w-full p-2 border mb-2"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Type"
              className="w-full p-2 border mb-2"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-2 border mb-2"
            />
            <input
              type="number"
              name="minimalAudienceCount"
              value={formData.minimalAudienceCount}
              onChange={handleChange}
              placeholder="Minimal Audience Count"
              className="w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full p-2 border mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setEditingSponsor(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isModalOpen && selectedEvent.event && (
        <EventModal 
          event={selectedEvent.event} 
          onClose={() => setIsModalOpen(false)}
          sponsorId={selectedEvent.sponsorId}
        />
      )}
    </div>
  );
};

export default MySponser;