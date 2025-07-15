import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creditAmount, setCreditAmount] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://sponsosync-backend.onrender.com/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error("Failed to fetch user:", data.error);
          setMessage({ text: "Failed to fetch user details", type: "error" });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setMessage({ text: "Error fetching user details", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleCreditUpdate = async (e) => {
    e.preventDefault();
    if (!creditAmount || isNaN(creditAmount)) {
      setMessage({ text: "Please enter a valid number", type: "error" });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`https://sponsosync-backend.onrender.com/user/${userId}/credits`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ credits: Number(creditAmount) }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setMessage({ text: "Credits updated successfully", type: "success" });
        setCreditAmount("");
      } else {
        setMessage({ text: data.error || "Failed to update credits", type: "error" });
      }
    } catch (error) {
      console.error("Error updating credits:", error);
      setMessage({ text: "Error updating credits", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddCredits = (amount) => {
    setCreditAmount(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">User not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back to Users
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">User Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-gray-800">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="text-gray-800">{user.mobile}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Account Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Credits</p>
                <p className="text-2xl font-bold text-gray-800">{user.credits}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-800">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Management Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Credits</h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={() => handleAddCredits(10)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Add 10 Credits
          </button>
          <button
            onClick={() => handleAddCredits(20)}
            className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Add 20 Credits
          </button>
          <button
            onClick={() => handleAddCredits(50)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Add 50 Credits
          </button>
        </div>

        <form onSubmit={handleCreditUpdate} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Credit Amount
            </label>
            <input
              type="number"
              id="creditAmount"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter credit amount"
              min="1"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isUpdating}
              className={`px-4 py-2 rounded-md text-white ${isUpdating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isUpdating ? "Updating..." : "Update Credits"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetail;