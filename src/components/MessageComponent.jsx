import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Pusher from 'pusher-js';
import toastr from 'toastr';
import messageSound from '../assets/message.wav';

let notificationShown = false;

const MessageComponent = ({ onNewMessage }) => {
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

    const channel = pusher.subscribe('messages');

    const audio = new Audio(messageSound);

    channel.bind('App\\Events\\UserMessageSent', function (data) {
      // console.log(data);

      const userIdFromNotification = parseInt(data.receiver_id);
      const currentUserIdNum = parseInt(currentUserId);

      if (userIdFromNotification === currentUserIdNum) {

        if (!notificationShown) {
          notificationShown = true;
          toastr.success('You have a new message');
          audio.play().catch(error => console.error('Error playing sound:', error));

          // if (onNewMessage) {
          //   onNewMessage(data);
          // }

          setTimeout(() => {
            notificationShown = false; // Reset after some time
          }, 2000); // To allow for repeated notifications after 2 seconds
        }
        // Call the onNewMessage callback with the new message data
        if (onNewMessage) {
          onNewMessage(data);
        }

      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [onNewMessage]);

  return null;
};

export default MessageComponent;
