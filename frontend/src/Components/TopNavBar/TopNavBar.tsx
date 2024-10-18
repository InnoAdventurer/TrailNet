import React, { useState, useEffect, useRef } from 'react';
import './TopNavBar.css';
import { IoIosWarning, IoIosLogOut, IoMdClose } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import axios from '../../utils/axiosInstance';
import { formatDistanceToNow } from 'date-fns';
import { toDate } from 'date-fns-tz'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';

const pageTitles: { [key: string]: string } = {
  '/homepage': 'Home',
  '/mapscreen': 'Map',
  '/emergencyscreen': 'Emergency',
  '/settingscreen': 'Settings',
  '/eventpage': 'Event',
  '/weatherpage': 'Weather',
  '/profilepage': 'Profile'
};

interface Notification {
  notification_id: number;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string; // UTC timestamp
  relativeTime: string; 
}

function TopNavBar() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();  // Move useLocation here inside the component
  const markReadTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to track timeout

  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || 'Page';  // Get the dynamic title

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/noti/getByUser`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markAllAsRead = async () => {
    try {
      await axios.patch(`/api/noti/markAllAsRead`);
      setNotifications((prev) =>
        prev.map((noti) => ({ ...noti, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleBellClick = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);

    if (newState) {
      fetchNotifications();

      // Clear existing timeout to prevent redundant reads
      if (markReadTimeoutRef.current) clearTimeout(markReadTimeoutRef.current);

      // Mark all notifications as read after 3 seconds
      markReadTimeoutRef.current = setTimeout(() => {
        markAllAsRead();
      }, 3000);
    }
  };

  const deleteNotification = async (notification_id: number) => {
    try {
      await axios.delete(`/api/noti/delete/${notification_id}`);
      setNotifications((prev) =>
        prev.filter((noti) => noti.notification_id !== notification_id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setShowLogoutMessage(true);
    setTimeout(() => navigate('/'), 1000);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatNotificationTime = (timestamp: string) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = toDate(timestamp, { timeZone: userTimeZone });
    return formatDistanceToNow(localDate, { addSuffix: true });
  };

  const hasUnreadNotifications = notifications.some((notification) => !notification.is_read);

  return (
    <div className="topnavbar-container">
      <Link to="/emergencyscreen">
        <IoIosWarning className="icon" />
      </Link>
      <Link to="/settingscreen">
        <IoSettingsOutline className="icon" />
      </Link>
      <h2>{pageTitle}</h2> {/* Dynamic page title based on route */}
      <div className="notification-container">
        <div className="bell-icon-wrapper">
          <GoBell className="icon" onClick={handleBellClick} />
          {hasUnreadNotifications && <span className="unread-dot"></span>}
        </div>
        {showNotifications && (
          <div className="notification-popup">
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications available</p>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.notification_id}
                    className={notification.is_read ? 'read' : ''}
                  >
                    <div className="notification-content">
                      <span>{notification.message}</span>
                      <span className="notification-time">
                        {formatNotificationTime(notification.created_at)}
                      </span>
                      <IoMdClose
                        className="close-icon"
                        onClick={() => deleteNotification(notification.notification_id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <IoIosLogOut className="icon" onClick={handleLogout} />
      {showLogoutMessage && (
        <div className="logout-message">Logged out. Redirecting...</div>
      )}
    </div>
  );
}

export default TopNavBar;
