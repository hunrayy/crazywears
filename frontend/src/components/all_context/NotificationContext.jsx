import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import axios from 'axios';
import Feedback from 'react-bootstrap/esm/Feedback';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const authToken = Cookies.get("authToken")
  const [notifications, setNotifications] = useState([]);
  const [badgeCount, setBadgeCount] = useState(() => {
    // Initialize badgeCount from localStorage on first render
});
// return storedBadgeCount ? parseInt(storedBadgeCount, 10) : 0;
const getallUnreadNotification = () => {
  // axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-admin-unread-notifications`,
  //     {
  //         headers: {
  //             Authorization: `Bearer ${authToken}`
  //         }
  //     }
  // ).then((unreadNotifications) => {
  //     console.log(unreadNotifications)
  //     setBadgeCount(unreadNotifications.data.data.length)
  // })
  console.log("hello")

}

// useEffect(() => {
//     getallUnreadNotification()
//     console.log("useEffect called - subscribing to Pusher event");

//     const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
//       cluster: import.meta.env.VITE_PUSHER_CLUSTER,
//     });

//     const channel = pusher.subscribe('user-accounts');

//     channel.bind('new-user', (data) => {
//       console.log("new-user event received:", data);
//       toast.info(`${data.message}`);
//       getallUnreadNotification()

//       // setNotifications((prev) => [...prev, data]);

//       // setBadgeCount((prev) => {
//       //   // Get current badgeCount from localStorage
//       //   const storedBadgeCount = localStorage.getItem('badgeCount');
        
//       //   // If badgeCount exists, parse and increment it; otherwise, set it to 1
//       //   const updatedBadgeCount = storedBadgeCount ? parseInt(storedBadgeCount, 10) + 1 : 1;
        
//       //   // Log the current and updated values
//       //   console.log(`Previous badgeCount: ${storedBadgeCount}, Updated badgeCount: ${updatedBadgeCount}`);
      
//       //   // Update localStorage with new badgeCount
//       //   localStorage.setItem('badgeCount', updatedBadgeCount.toString());
      
//       //   return updatedBadgeCount;
//       // });
//     });

//     return () => {
//       console.log("Cleaning up Pusher subscriptions");
//       channel.unbind_all();
//       channel.unsubscribe();
//     };
// }, []); // Ensure the effect only runs once

// useEffect(() => {
//   // getallUnreadNotification()
//   console.log("useEffect called - subscribing to Pusher event");

//   const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
//     cluster: import.meta.env.VITE_PUSHER_CLUSTER,
//   });

//   const channel = pusher.subscribe('my-channel');

//   channel.bind('message-sent', (data) => {
//     console.log("event received:", data);
//     toast.info(`${data.message}`);
//     getallUnreadNotification()
//   });

//   return () => {
//     console.log("Cleaning up Pusher subscriptions");
//     channel.unbind_all();
//     channel.unsubscribe();
//   };
// }, []);
  return (
    <NotificationContext.Provider value={{ notifications, badgeCount, setBadgeCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

