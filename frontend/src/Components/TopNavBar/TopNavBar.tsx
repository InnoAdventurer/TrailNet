// frontend/src/Components/TopNavBar/TopNavBar.tsx

import React, { useState, useEffect } from 'react';
import './TopNavBar.css';
import { IoIosWarning, IoIosLogOut, IoMdClose } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { formatDistanceToNow } from 'date-fns';
import { toDate } from 'date-fns-tz'; 

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

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/noti/getByUser`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notification_id: number) => {
    try {
      await axios.patch(`/api/noti/markAsRead`);

      setNotifications((prev) =>
        prev.map((noti) =>
          noti.notification_id === notification_id ? { ...noti, is_read: true } : noti
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationOpen = (notification_id: number) => {
    setTimeout(() => markAsRead(notification_id), 5000);
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

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const hasUnreadNotifications = notifications.some((notification) => !notification.is_read);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setShowLogoutMessage(true);
    setTimeout(() => navigate('/'), 3000);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatNotificationTime = (timestamp: string) => {
    console.log(timestamp);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = toDate(timestamp, { timeZone: userTimeZone });
    return formatDistanceToNow(localDate, { addSuffix: true });
  };

  return (
    <div className="topnavbar-container">
      <Link to="/emergencyscreen">
        <IoIosWarning className="icon" />
      </Link>
      <Link to="/settingscreen">
        <IoSettingsOutline className="icon" />
      </Link>
      <h2>Home</h2>
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
                  <li key={notification.notification_id} onMouseEnter={() => handleNotificationOpen(notification.notification_id)}>
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