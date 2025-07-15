import { useState, useEffect } from "react";
import { Menu, X, Bell } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      fetchUser();
      fetchNotifications();
      
      // Set up interval to check for new notifications periodically
      const interval = setInterval(fetchNotifications, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      
      const response = await fetch(`https://sponsosync-backend.onrender.com/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      // Fetch recent events (last 5)
      const eventsResponse = await fetch('https://sponsosync-backend.onrender.com/event/recent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const eventsData = await eventsResponse.json();
      
      // Fetch recent sponsors (last 5)
      const sponsorsResponse = await fetch('https://sponsosync-backend.onrender.com/sponser/recent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sponsorsData = await sponsorsResponse.json();
      console.log("Sponsors Data:", sponsorsData);
      console.log("Events Data:", eventsData);
      
      // Combine and format notifications
      const formattedEvents = eventsData.events?.slice(0, 5).map(event => ({
        id: event._id,
        type: 'event',
        title: event.eventname,
        date: new Date(event.date).toLocaleDateString(),
        isNew: true
      })) || [];
      
      const formattedSponsors = sponsorsData.sponsors?.slice(0, 5).map(sponsor => ({
        id: sponsor._id,
        type: 'sponsor',
        title: sponsor.sponsername,
        date: new Date(sponsor.createdAt).toLocaleDateString(),
        isNew: true
      })) || [];
      
      const allNotifications = [...formattedEvents, ...formattedSponsors]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => n.isNew).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
    setUnreadCount(0);
  };

  const handleNavClick = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const handleProfile = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      navigate(`/user/${userId}`);
    } else {
      navigate("/login");
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'event') {
      navigate(`/event/${notification.id}`);
    } else {
      navigate(`/sponsor/${notification.id}`);
    }
    markAsRead();
  };

  return (
    <nav className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="SponsoSync Logo" className="h-10 w-10" />
            <span className="text-xl font-semibold text-black">SponsoSync</span>
          </div>

          <div className="hidden md:flex space-x-6 items-center mx-auto">
            <NavLink to="/" className="text-black font-medium hover:text-[#3B82F6]">
              Home
            </NavLink>
            <NavLink to="/home" className="text-black font-medium hover:text-[#3B82F6]">
              Sponsors
            </NavLink>
            <NavLink to="/mysponsership" className="text-black font-medium hover:text-[#3B82F6]">
              My SponsorsShip
            </NavLink>
            <NavLink to="/about" className="text-black font-medium hover:text-[#3B82F6]">
              About
            </NavLink>
            <NavLink to="/services" className="text-black font-medium hover:text-[#3B82F6]">
              Services
            </NavLink>
            <NavLink to="/contactUs" className="text-black font-medium hover:text-[#3B82F6]">
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex space-x-4 items-center">
            {isLoggedIn && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(prev => !prev)}
                    className="p-2 rounded-full hover:bg-gray-100 relative"
                >

                  <Bell className="h-6 w-6 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50"
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-medium text-gray-800">Notifications</h3>
                        <button 
                          onClick={markAsRead}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          Mark all as read
                        </button>
                      </div>
                      
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={`${notification.type}-${notification.id}`}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notification.isNew ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                {notification.type === 'event' ? (
                                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600">E</span>
                                  </div>
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-600">S</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {notification.type === 'event' ? 'New event' : 'New sponsor'} • {notification.date}
                                </p>
                              </div>
                              {notification.isNew && (
                                <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-sm text-gray-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLoggedIn ? (
              <>
                <NavLink to="/login" className="border-2 border-[#3B82F6] bg-white text-[#3B82F6] font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-[#3B82F6] hover:text-white">
                  Login
                </NavLink>
                <NavLink to="/register" className="border-2 bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-white hover:text-blue-600">
                  Register
                </NavLink>
              </>
            ) : (
              <div className="flex space-x-4">
                <button 
                  onClick={handleProfile} 
                  className="border-2 border-[#3B82F6] bg-[#3B82F6] text-white font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#3B82F6]"
                >
                  Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="border-2 border-black bg-black text-white font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-white hover:text-black"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="px-4 py-2 flex flex-col space-y-2">
            <NavLink to="/" className="text-black font-medium hover:text-[#3B82F6]" onClick={handleNavClick}>
              Home
            </NavLink>
            <NavLink to="/home" className="text-black font-medium hover:text-[#3B82F6]" onClick={handleNavClick}>
              Our Sponsor
            </NavLink>
            <NavLink to="/services" className="text-black font-medium hover:text-[#3B82F6]" onClick={handleNavClick}>
              Services
            </NavLink>
            <NavLink to="/contactUs" className="text-black font-medium hover:text-[#3B82F6]" onClick={handleNavClick}>
              Contact
            </NavLink>
            {isLoggedIn && (
              <>
                <button 
                  onClick={handleProfile}
                  className="text-left border-2 border-[#3B82F6] bg-[#3B82F6] text-white font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#3B82F6]"
                >
                  Profile
                </button>
              </>
            )}
            {!isLoggedIn ? (
              <>
                <NavLink to="/login" className="border-2 border-[#3B82F6] bg-white text-[#3B82F6] font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-[#3B82F6] hover:text-white" onClick={handleNavClick}>
                  Login
                </NavLink>
                <NavLink to="/register" className="border-2 border-black bg-black text-white font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-white hover:text-black" onClick={handleNavClick}>
                  Register
                </NavLink>
              </>
            ) : (
              <button onClick={handleLogout} className="border-2 border-black bg-black text-white font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-white hover:text-black">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}