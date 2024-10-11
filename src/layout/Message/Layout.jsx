import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import MessageComponent from '../../components/MessageComponent';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import FaceImage from '../../assets/face.avif';
import { fetchWithAuth } from "../../services/apiService";
import toastr from 'toastr';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
    const nav = useNavigate();
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setcurrentUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const { receiver_id, game_id } = useParams();
    const [messages, setMessages] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const currentUserId = localStorage.getItem('current_user_id'); // Ensure this ID is stored in local storage
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        fetchFriends();
        fetchCurrentUser();
        fetchUsers();
        if (game_id) {
            fetchGame(game_id);  // Only fetch game and send message if game_id is available
        }
    }, [game_id]);
    // Scroll to the latest message whenever 'messages' array updates
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);
    useEffect(() => {
        if (receiver_id) {
            // First check in friends array
            let friend = friends.find(f => f.id === parseInt(receiver_id));

            // If not found in friends, check in users array
            if (!friend) {
                friend = users.find(u => u.id === parseInt(receiver_id));
            }

            // console.log('friend list', friend);

            // If a match is found either in friends or users, proceed with handling the friend click
            if (friend) {
                handleFriendClick(friend);
            }
        }
    }, [receiver_id, friends, users]);

    const fetchFriends = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/messages/friends`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log(data);
            setFriends(data);
            // Check if a friend should be auto-selected based on receiver_id
            if (receiver_id) {
                const friend = data.find(f => f.id === parseInt(receiver_id));
                if (friend) {
                    handleFriendClick(friend);
                }
            }
        } catch (error) {
            console.error('Error fetching friends data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json()
            setUsers(data);

        } catch (error) {
            console.error('Error fetching friends data:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchMessages = async (receiverId) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/messages/${receiverId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            const data = await response.json();
            // console.log(data);
            if (!response.ok) {
                toastr.error(data.errors || 'Failed to fetch messages');
                throw new Error('Network response was not ok');
            }

            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
        finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const updateMessagesStatus = async (receiverId) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/messages/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    friend_id: receiverId
                })

            });

            const data = await response.json();
            // console.log(data);

            if (!response.ok) {
                toastr.error(data.errors || 'Failed to update messages');
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
        finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        fetchMessages(friend.id);
        updateMessagesStatus(friend.id);
        friend.message_count = 0;
    };

    const handleReply = async () => {
        setLoading(true);
        if (!replyContent.trim()) {
            toastr.warning('Please write a message before replying.');
            return;
        }

        try {
            const response = await fetchWithAuth(`/user/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    receiver_id: selectedFriend.id,
                    content: replyContent
                })
            });

            const data = await response.json();

            if (!response.ok) {
                toastr.error(data.errors || 'Failed to send message');
                throw new Error('Network response was not ok');
            }

            // Add the sent message to the messages state
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...data,
                    sender_id: currentUserId,
                    sender_image: currentUser.profile_picture || FaceImage,
                    content: replyContent
                }
            ]);
            setReplyContent('');
            toastr.success('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const fetchCurrentUser = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log(data);
            setcurrentUser(data)
            // console.log(data);
        } catch (error) {
            console.error('Error fetching friends data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewMessage = (newMessage) => {
        setcurrentUser(prevUser => ({
            ...prevUser,
            message_count: (prevUser?.message_count || 0) + 1
        }));
        // Update the messages state with the new message
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const fetchGame = async (game_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/message_game/${game_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
    
            const data = await response.json();
           
            if (!response.ok) {
                toastr.error(data.errors || 'Failed to fetch messages');
                throw new Error('Network response was not ok');
            }
    
    
           // Construct the pre-written message using 'data' directly
        if (data && data.name && data.convention_name) {
            const preWrittenMessage = `Hello, I can see you have this game ${data.name} available to buy at the ${data.convention_name}, please may I ask if it is 100% complete and would you accept ${data.currency_tag}${data.price}? Thank you. ${data.sender_name}.`;
            console.log(preWrittenMessage);
            setReplyContent(preWrittenMessage)
            
        } else {
            console.error('Invalid game data:', data);
        }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
        finally {
            setLoading(false); // Hide loading spinner
        }
    };
    
    return (
        <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-[#0d2539]'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />
            <div className='pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>
                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    <h1 className={`text-white text-2xl font-semibold ${currentUser.message_count > 0 ? 'flex items-center' : ''}`}>
                        New Messages
                        {currentUser.message_count > 0 && (
                            <span className='ml-2 bg-red text-white text-xs font-bold py-0.5 px-2 rounded-full'>
                                {currentUser.message_count}
                            </span>
                        )}
                    </h1>

                    <div className='flex items-start gap-x-6 mt-4 md:flex-row flex-col'>
                        <div className='min-w-full md:mb-0 mb-3 md:min-w-[13rem] p-2 bg-[#0d2539] rounded-md'>
                            {friends.map((friend, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col mb-2 border-b border-gray-500 pb-2 cursor-pointer 
                                ${selectedFriend?.id === friend.id ? 'border-lightOrange' : 'border-gray-500'}`}
                                    onClick={() => handleFriendClick(friend)}
                                >
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center gap-x-3'>
                                            <img
                                                src={friend.profile_image || FaceImage}
                                                alt="Friend"
                                                className='w-[2rem] h-[2rem] rounded-full'
                                            />
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-white'>{friend.user_name}</p>
                                                {friend.message_count > 0 && (
                                                    <span className='bg-red text-white text-xs font-bold py-0.5 px-2 rounded-full'>
                                                        {friend.message_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {friend.is_online == 1 && (
                                            <div
                                                className={`w-[1rem] h-[1rem] rounded-full ${friend.is_online == 1 ? 'bg-green-500' : 'bg-red'}`}
                                            ></div>
                                        )}
                                        {friend.is_online == 0 && (
                                            <span className='text-xs text-gray-400 ml-2'>
                                                {formatDistanceToNow(new Date(friend.updated_at), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <MessageComponent onNewMessage={handleNewMessage} />
                        <div className='flex-1 p-2 bg-[#0d2539] rounded-md'>
                            {selectedFriend ? (
                                <>
                                    {/* Scrollable chatbox */}
                                    <div className="max-h-[40rem] overflow-y-auto p-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`mt-4 flex ${message.sender_id == currentUserId ? 'justify-start' : 'justify-end'} items-start gap-x-[1rem]`}
                                            >
                                                {message.sender_id == currentUserId ? (
                                                    <>
                                                        <img
                                                            src={message.sender_image || FaceImage}
                                                            alt="Sender"
                                                            className="w-[2rem] h-[2rem] rounded-full"
                                                        />
                                                        <div>
                                                            {/* Message bubble */}
                                                            <div className="bg-darkBlue p-2 text-white rounded-md max-w-[70%] md:max-w-[100%]">
                                                                <p className="break-words">{message.content}</p>
                                                            </div>
                                                            {/* Conditionally render timestamp only if created_at exists */}
                                                            {message.created_at && (
                                                                <span className="text-xs text-gray-400 block mt-1">
                                                                    {formatDistanceToNow(parseISO(message.created_at), { addSuffix: true })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            {/* Message bubble */}
                                                            <div className="bg-darkBlue p-2 text-white rounded-md max-w-[70%] md:max-w-[100%] text-right">
                                                                <p className="break-words">{message.content}</p>
                                                            </div>
                                                            {/* Conditionally render timestamp only if created_at exists */}
                                                            {message.created_at && (
                                                                <span className="text-xs text-gray-400 block mt-1">
                                                                    {formatDistanceToNow(parseISO(message.created_at), { addSuffix: true })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <img
                                                            src={message.sender_image || FaceImage}
                                                            alt="Receiver"
                                                            className="w-[2rem] h-[2rem] rounded-full"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        {/* Invisible div at the end of the messages container for scrolling */}
                                        <div ref={messageEndRef} />
                                    </div>

                                    {/* Message input area */}
                                    <div className='flex items-start gap-x-[1rem] mt-4'>
                                        <img
                                            src={currentUser.profile_picture || FaceImage}
                                            alt="Current User"
                                            className='w-[2rem] h-[2rem] rounded-full'
                                        />
                                        <textarea
                                            type="text"
                                            className='w-full bg-darkBlue h-[10rem] rounded-md outline-none text-white resize-none p-3'
                                            placeholder='Write a reply'
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                        />
                                    </div>

                                    <div className='flex justify-between items-center m-3'>
                                        <Button title={"Reply"} className={`w-[8rem] h-[2.3rem] rounded-md text-white bg-[#E78530]`} onClickFunc={handleReply} />
                                    </div>
                                </>
                            ) : (
                                <div className='flex flex-col items-center justify-center'>
                                    <p className='text-white text-lg'>Select a friend to start a conversation.</p>
                                </div>
                            )}
                        </div>
                        );
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
