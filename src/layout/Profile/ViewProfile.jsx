
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'
import { FaCaretDown, FaRegStar } from 'react-icons/fa'
// import FaceImage from '../../assets/face.avif'
import FaceImage from "../../assets/Icon-user-circle.png";
import Button from '../../components/Button'
import { FaMessage } from 'react-icons/fa6'
import { IoIosAlert } from 'react-icons/io'
import { useParams, useLocation } from 'react-router-dom';
import Input from '../../components/Input'
import toastr from 'toastr';
import { useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../../services/apiService';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewProfile = () => {
    const data = [1, 2, 3, 4, 5, 6, 7]
    const [ProfileDetail, setProfileDetail] = useState([]);
    const currentLocation = useLocation().pathname
    const [loading, setLoading] = useState(true);
    const { user_id } = useParams();
    const [loadingId, setLoadingId] = useState(null); // Track which user is being processed
    const nav = useNavigate()
    useEffect(() => {
        if (user_id) {
            fetchProfileDetail(user_id);  // Pass the friendId to fetchProfileDetail
        }
    }, [user_id]);

    const fetchProfileDetail = async (user_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/viewprofile/${user_id}`, {
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

            setProfileDetail(data);
        } catch (error) {
            console.error('Error fetching friends data:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendFriendRequest = async (friendId) => {
        setLoadingId(friendId); // Set loading for the specific button
        try {
            const response = await fetchWithAuth(`/user/friend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ friend_id: friendId }),
            });

            if (!response.ok) {
                const result = await response.json();
                toastr.error(result.message); // Show the error message from the backend
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            toastr.success(result.message);

            // Fetch updated user data
            fetchProfileDetail();
        } catch (error) {
            console.error('Error sending friend request:', error);
        } finally {
            setLoadingId(null); // Reset loading state
        }
    };
    return (
        <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-darkBlue'>
            {/* Loading Spinner */}
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />
            {
                currentLocation.includes("ownFeed") && (
                    <div className='bg-white p-2 flex items-center gap-x-3'>
                        <IoIosAlert className='text-red' />
                        <p>You are viewing your own profile</p>
                    </div>
                )
            }

            <div className='flex justify-between items-center md:px-[2rem] px-[1rem] mt-4'>
                <h1 className='text-xl text-white font-semibold'>{ProfileDetail.username}’s Profile</h1>
                <div className='flex items-center gap-x-4'>
                    {
                        currentLocation.includes("ownFeed") && (
                            <Button title={"Post update"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                        )
                    }

                    {/* <div className='border border-[#707070] w-[13rem] h-[2.3rem] rounded-md bg-transparent flex justify-center items-center gap-x-4 cursor-pointer'>
                        <p className='text-white'>Showing all updates</p>
                        <FaCaretDown className='text-white' />
                    </div> */}
                </div>
            </div>

            <div className='flex justify-center md:flex-row flex-col mt-[10rem] md:px-[2rem] px-[1rem] gap-x-[2rem]'>
                <div className='bg-[#0d2539] relative min-w-full md:min-w-[20rem] p-2 rounded-md h-[fit] md:mb-0 mb-3'>
                    <img src={ProfileDetail.profile_picture || FaceImage} alt="" className=' absolute top-[-3rem] left-[40%] md:left-[34%] w-[6rem] h-[6rem] rounded-full object-cover' />
                    <p className='text-center text-white font-semibold mt-[2.5rem] text-lg'>{ProfileDetail.first_name} {ProfileDetail.last_name}</p>
                    <p className='text-center text-white mt-2'>@{ProfileDetail.username}</p>
                    {/* 
                    <Button
                        title={
                            loadingId === user_id ? 'Sending...' : 'Add As Friend'
                        }
                        className={`w-full h-[2.3rem] text-white rounded-md bg-lightOrange my-2`}
                        onClickFunc={() => sendFriendRequest(user_id)} // Attach click handler
                        loading={loadingId === user_id} // Show loading indicator for the specific button
                    /> */}
                    {
                        ProfileDetail.friend_status === 'pending' ? (
                            <Button
                                title={'Request Sent'}
                                className={`w-full h-[2.3rem] text-white rounded-md border border-lightOrange my-2`}
                            />
                        ) : (
                            <Button
                                title={loadingId === user_id ? 'Sending...' : 'Add As Friend'}
                                className={`w-full h-[2.3rem] text-white rounded-md bg-lightOrange my-2`}
                                onClickFunc={() => sendFriendRequest(user_id)} // Attach click handler
                                loading={loadingId === user_id} // Show loading indicator for the specific button
                            />
                        )
                    }
                    <Button onClickFunc={() => {
                        nav(`/messages/${user_id}`);  // Removed the extra curly brace here
                    }} title={currentLocation.includes("ownFeed") ? "Edit Profile" : "Message"} className={`w-full h-[2.3rem] border border-white text-white rounded-md my-2`} />
                    <p className='text-center text-white mt-2'>{ProfileDetail.total_friends} friends</p>
                    <p className='text-center text-white my-2'>Member since {ProfileDetail.member_since}</p>

                </div>

            </div>
        </div>
    )
}

export default ViewProfile
