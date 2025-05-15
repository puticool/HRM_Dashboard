import { createContext, useContext, useState, useEffect } from "react";
import api from "@/utils/api";
import PropTypes from "prop-types";

// Create the notification context
const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hr/employees/anniversaries');
      if (response.data && response.data.status === 'success') {
        // Get notifications from API
        const apiNotifications = response.data.data.upcoming_anniversaries || [];
        
        // Get read status from local storage
        const readStatusMap = JSON.parse(localStorage.getItem('notificationReadStatus') || '{}');
        
        // Add read status to notifications
        const notificationsWithReadStatus = apiNotifications.map(notification => ({
          ...notification,
          read: !!readStatusMap[notification.EmployeeID]
        }));
        
        setNotifications(notificationsWithReadStatus);
        
        // Calculate unread count
        const unreadNotifications = notificationsWithReadStatus.filter(n => !n.read);
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a single notification as read
  const markAsRead = (id) => {
    // Update notifications state
    setNotifications(prev => 
      prev.map(notification => 
        notification.EmployeeID === id 
          ? { ...notification, read: true } 
          : notification
      )
    );

    // Update local storage
    const readStatusMap = JSON.parse(localStorage.getItem('notificationReadStatus') || '{}');
    readStatusMap[id] = true;
    localStorage.setItem('notificationReadStatus', JSON.stringify(readStatusMap));
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    // Update notifications state
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );

    // Update local storage
    const readStatusMap = {};
    notifications.forEach(notification => {
      readStatusMap[notification.EmployeeID] = true;
    });
    localStorage.setItem('notificationReadStatus', JSON.stringify(readStatusMap));
    
    // Update unread count
    setUnreadCount(0);
  };

  // Fetch notifications initially and set up periodic refresh
  useEffect(() => {
    fetchNotifications();
    
    // Refresh every 5 minutes
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Exposed values and functions
  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default NotificationContext; 