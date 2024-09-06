import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Pusher from 'pusher-js';
import toastr from 'toastr';
import notificationSound from '../assets/notification.wav';

const NotificationComponent = ({ onNotificationCountChange }) => {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    let currentUserId = null;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        currentUserId = decodedToken.sub || decodedToken.sub;
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('notifications');

    const audio = new Audio(notificationSound);

    channel.bind('App\\Events\\NotificationSent', function (data) {
      const userIdFromNotification = parseInt(data.notification.user_id);
      const currentUserIdNum = parseInt(currentUserId);

      if (userIdFromNotification === currentUserIdNum) {
        switch (data.notification.type) {
          case 'friend_request':
            toastr.success('You have a new friend request!');
            break;
          case 'accept_friend_request':
            toastr.success('Your friend request has been accepted!');
            break;
          default:
            toastr.success(data.notification.content);
        }

        if (audio) {
          audio.play().catch(error => console.error('Error playing sound:', error));
        }

        // Update and persist notification count
        let count = parseInt(localStorage.getItem('notificationCount') || '0', 10);
        count += 1;
        localStorage.setItem('notificationCount', count);
        onNotificationCountChange(count);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [onNotificationCountChange]);

  return null;
};

export default NotificationComponent;
