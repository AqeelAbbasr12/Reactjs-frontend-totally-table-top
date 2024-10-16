import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import FaceImage from '../../assets/face.avif';
import { fetchWithAuth } from "../../services/apiService";
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
    const [notificationData, setNotificationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        fetchNotificationData();
    }, []);

    const fetchNotificationData = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/notification`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            // console.log('Notifications', data);
            setNotificationData(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const acceptFriendRequest = async (friendId, notificationId) => {
        setLoadingId(friendId); // Set loading for the specific button
        try {
            const response = await fetchWithAuth(`/user/friend/${friendId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ status: 'accepted', id: notificationId }),
            });

            if (!response.ok) {
                const result = await response.json();
                toastr.error(result.message || 'Failed to accept friend request');
                return;
            }

            const result = await response.json();
            toastr.success(result.message || 'Friend request accepted');

            fetchNotificationData();
        } catch (error) {
            console.error('Error accepting friend request:', error);
            toastr.error('An error occurred while accepting the friend request.');
        } finally {
            setLoadingId(null); // Reset loading state
        }
    };
    const ignoreFriendRequest = async (friendId, notificationId) => {
        setLoadingId(friendId); // Set loading for the specific button
        try {
            const response = await fetchWithAuth(`/user/friend/${friendId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ status: 'rejected', id: notificationId }),
            });

            if (!response.ok) {
                const result = await response.json();
                toastr.error(result.message || 'Failed to ignore friend request');
                return;
            }

            const result = await response.json();
            toastr.success(result.message || 'Friend request ignore');

            fetchNotificationData();
        } catch (error) {
            console.error('Error ignore friend request:', error);
            toastr.error('An error occurred while ignore the friend request.');
        } finally {
            setLoadingId(null); // Reset loading state
        }
    };

    const acceptInvitation = async (invitationId, notificationId) => {
        console.log(invitationId);
        setLoadingId(invitationId); // Set loading for the specific button
        try {
            const response = await fetchWithAuth(`/user/invitations/${invitationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ status: 'accepted', id: notificationId }),
            });

            if (!response.ok) {
                const result = await response.json();
                toastr.error(result.message || 'Failed to accept invitation request');
                return;
            }

            const result = await response.json();
            toastr.success(result.message || 'Invitation request accepted');

            fetchNotificationData();
        } catch (error) {
            console.error('Error accepting friend request:', error);
            toastr.error('An error occurred while accepting the friend request.');
        } finally {
            setLoadingId(null); // Reset loading state
        }
    };
    const ignoreInvitation = async (invitationId, notificationId) => {
        console.log(invitationId);
        setLoadingId(invitationId); // Set loading for the specific button
        try {
            const response = await fetchWithAuth(`/user/invitations/${invitationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ status: 'rejected', id: notificationId }),
            });

            if (!response.ok) {
                const result = await response.json();
                toastr.error(result.message || 'Failed to ignore invitation request');
                return;
            }

            const result = await response.json();
            toastr.success(result.message || 'Invitation request ignore');

            fetchNotificationData();
        } catch (error) {
            console.error('Error ignore friend request:', error);
            toastr.error('An error occurred while ignore the friend request.');
        } finally {
            setLoadingId(null); // Reset loading state
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen overflow-y-auto bg-[#0d2539]">
            <Navbar type={"verified"} />
            <div className="pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6">
                <div className="flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4">
                    <h1 className="text-white text-2xl font-semibold">Notifications ({notificationData.length} new)</h1>
                    <div className="mt-6">
                        
                        {notificationData.map((notification, index) => (
                            <div key={index} className="bg-[#0d2539] w-[100%] rounded-md p-3 flex justify-between sm:flex-row flex-col mb-3">
                                <div className="flex items-center gap-x-4">
                                    <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-red"></div>
                                    <img src={notification.user_image || FaceImage} alt="" className="w-[3rem] h-[3rem] rounded-full" />
                                    <p className="text-white"><span className="text-lightOrange">{notification.sender_name}</span> {notification.content}</p>
                                </div>
                                {/* condition applied */}
                                {notification.type === 'friend_request' && (
                                    <div className="flex gap-x-4 items-center sm:mt-0 mt-3">
                                        <Button
                                            title={
                                                loadingId === notification.friend_request_id ? 'Ignoring...' : 'Ignore'
                                            }
                                            className="text-white cursor-pointer"
                                            onClickFunc={() => ignoreFriendRequest(notification.friend_request_id, notification.id)}
                                            loading={loadingId === notification.friend_request_id}
                                        />
                                        <Button
                                            title={
                                                loadingId === notification.friend_request_id ? 'Accepting...' : 'Accept'
                                            }
                                            className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange sm:mt-0 mt-2'}
                                            onClickFunc={() => acceptFriendRequest(notification.friend_request_id, notification.id)}
                                            loading={loadingId === notification.friend_request_id}
                                        />
                                    </div>
                                 )} 
                                 {notification.type === 'invitation' && (
                                    <div className="flex gap-x-4 items-center sm:mt-0 mt-3">
                                        <Button
                                            title={
                                                loadingId === notification.invitation_id ? 'Ignoring...' : 'Ignore'
                                            }
                                            className="text-white cursor-pointer"
                                            onClickFunc={() => ignoreInvitation(notification.invitation_id, notification.id)}
                                            loading={loadingId === notification.invitation_id}
                                        />
                                        <Button
                                            title={
                                                loadingId === notification.invitation_id ? 'Accepting...' : 'Accept'
                                            }
                                            className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange sm:mt-0 mt-2'}
                                            onClickFunc={() => acceptInvitation(notification.invitation_id, notification.id)}
                                            loading={loadingId === notification.invitation_id}
                                        />
                                    </div>
                                 )} 
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
        </div>
    );
};

export default Layout;
