import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Left from '../../components/Left';
import { FaCaretDown } from 'react-icons/fa';
import toastr from 'toastr';
import { fetchWithAuth } from '../../services/apiService';

const Layout = () => {
    const [loading, setLoading] = useState();
    const nav = useNavigate();
    const [settingType, setsettingType] = useState("privacy");
    const [settings, setSettings] = useState({
        profile_changes: 'firends_only',
        your_updates: 'firends_only',
        your_new_friendship: 'firends_only',
        your_convention_attendance: 'firends_only',
        your_convention_accommodation: 'firends_only',

        find_by_username: 'yes',
        find_by_real_name: 'yes',
        find_by_email: 'yes',

    });


    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/settings`, {
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
            setSettings({
                profile_changes: data.profile_changes || "friends_only", // Default value if API doesn't return
                your_updates: data.your_updates || "friends_only",
                your_new_friendship: data.your_new_friendship || "friends_only",
                your_convention_attendance: data.your_convention_attendance || "friends_only",
                your_convention_accommodation: data.your_convention_accommodation || "friends_only",

                find_by_username: data.find_by_username || "yes",
                find_by_real_name: data.find_by_real_name || "yes",
                find_by_email: data.find_by_email || "yes"
            });// Assuming data contains the correct structure
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleChangeWhoCanSee = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => {
            const updatedSettings = {
                ...prevSettings,
                [name]: value
            };
            return updatedSettings;
        });
    };

    const handleSubmitWhoCan = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Create a JSON object from the settings
        const jsonData = JSON.stringify(settings);


        try {
            const response = await fetchWithAuth(`/user/who_can_see_settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to application/json
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: jsonData, // Send the JSON data
            });

            if (!response.ok) {
                const result = await response.json();
                console.error('Error updating settings:', result);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.ok) {
                const result = await response.json();
                toastr.success(result.message);
            }

        } catch (error) {
            console.error('Error submitting settings:', error);
        }
    };

    const handleChangeFindBy = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => {
            const updatedSettings = {
                ...prevSettings,
                [name]: value
            };
            return updatedSettings;
        });
    };

    const handleSubmitFindBy = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Create a JSON object from the settings
        const jsonData = JSON.stringify(settings);


        try {
            const response = await fetchWithAuth(`/user/find_by_settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to application/json
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: jsonData, // Send the JSON data
            });

            if (!response.ok) {
                const result = await response.json();
                console.error('Error updating settings:', result);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.ok) {
                const result = await response.json();
                toastr.success(result.message);
            }

        } catch (error) {
            console.error('Error submitting settings:', error);
        }
    };


    return (
        <div className='flex flex-col w-[100vw] h-[100vh]'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />
            <div className='pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

                {/* LEFT  */}
                <Left />

                {/* RIGHT  */}
                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    <div className='sm:flex justify-between items-center'>
                        <h1 className='text-white text-2xl font-semibold'>Settings</h1>
                        <Button onClickFunc={() => nav("/ownFeed")} title={"Save all changes"} className={'w-[11rem] h-[2.3rem] rounded-md text-white border border-lightOrange sm:mt-0 mt-2'} />
                    </div>

                    <div className='w-[100%] h-[fit] mt-4 rounded-md'>
                        <div className='flex items-center'>
                            <p onClick={() => setsettingType("privacy")} className={`text-white cursor-pointer p-3 ${settingType === "privacy" && "bg-[#0d2539]"}`}>Privacy</p>
                        </div>

                        <div className='bg-[#0d2539] p-3'>
                            <p className='text-white text-wrap'>We take your privacy seriously, and put control in your hands. Use the options below to control who can see your different actions and updates on Totally TableTop. Please refer to our privacy policy for more information about how your data is used.</p>
                            <p className='text-white text-lg font-semibold mt-2'>Who can see you ?</p>

                            {/* Profile Changes Dropdown */}
                            <form onSubmit={handleSubmitWhoCan} className="space-y-4">
                                {/* Profile Changes Dropdown */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap'>
                                    <h1 className='text-white text-md font-semibold'>Changes to your profile</h1>
                                    <div className='w-full sm:w-[12rem] mt-2 sm:mt-0'>
                                        <select
                                            id="profile_changes"
                                            name="profile_changes"
                                            value={settings.profile_changes}
                                            onChange={handleChangeWhoCanSee}
                                            className="w-full h-[2.3rem] rounded-md text-white bg-darkBlue border border-gray-500"
                                        >
                                            <option value="friends_only">Friends Only</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Your Updates Dropdown */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap'>
                                    <h1 className='text-white text-md font-semibold'>Your Post update</h1>
                                    <div className='w-full sm:w-[12rem] mt-2 sm:mt-0'>
                                        <select
                                            id="your_updates"
                                            name="your_updates"
                                            value={settings.your_updates}
                                            onChange={handleChangeWhoCanSee}
                                            className="w-full h-[2.3rem] rounded-md text-white bg-darkBlue border border-gray-500"
                                        >
                                            <option value="friends_only">Friends Only</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Your New Friendships Dropdown */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap'>
                                    <h1 className='text-white text-md font-semibold'>Your new friendships</h1>
                                    <div className='w-full sm:w-[12rem] mt-2 sm:mt-0'>
                                        <select
                                            id="your_new_friendship"
                                            name="your_new_friendship"
                                            value={settings.your_new_friendship}
                                            onChange={handleChangeWhoCanSee}
                                            className="w-full h-[2.3rem] rounded-md text-white bg-darkBlue border border-gray-500"
                                        >
                                            <option value="friends_only">Friends Only</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Your Convention Attendance Dropdown */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap'>
                                    <h1 className='text-white text-md font-semibold'>Your convention attendance</h1>
                                    <div className='w-full sm:w-[12rem] mt-2 sm:mt-0'>
                                        <select
                                            id="your_convention_attendance"
                                            name="your_convention_attendance"
                                            value={settings.your_convention_attendance}
                                            onChange={handleChangeWhoCanSee}
                                            className="w-full h-[2.3rem] rounded-md text-white bg-darkBlue border border-gray-500"
                                        >
                                            <option value="friends_only">Friends Only</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Your Accommodation Dropdown */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap'>
                                    <h1 className='text-white text-md font-semibold'>Your accommodation</h1>
                                    <div className='w-full sm:w-[12rem] mt-2 sm:mt-0'>
                                        <select
                                            id="your_convention_accommodation"
                                            name="your_convention_accommodation"
                                            value={settings.your_convention_accommodation}
                                            onChange={handleChangeWhoCanSee}
                                            className="w-full h-[2.3rem] rounded-md text-white bg-darkBlue border border-gray-500"
                                        >
                                            <option value="friends_only">Friends Only</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='flex justify-end mt-2'>
                                    <Button type='submit' title={"Save Changes"} className={"w-full sm:w-[8rem] h-[2.3rem] rounded-md text-white bg-[#F77F00]"} />
                                </div>
                            </form>



                            <p className='text-white text-lg font-semibold mt-2'>How can other’s find you ?</p>

                            {/* Find By Username Dropdown */}
                            <form onSubmit={handleSubmitFindBy} className="space-y-4">
                                {/* Username Dropdown */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap'>
                                    <h1 className='text-white text-md font-semibold'>Username</h1>
                                    <div className='w-full sm:w-[12rem] mt-2 sm:mt-0'>
                                        <select
                                            id="find_by_username"
                                            name="find_by_username"
                                            value={settings.find_by_username}
                                            onChange={handleChangeFindBy}
                                            className="h-[2.3rem] w-full rounded-md text-white bg-darkBlue border border-gray-500"
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Real Name Dropdown */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap'>
                                    <h1 className='text-white text-md font-semibold'>Real Name</h1>
                                    <div className='w-full sm:w-[12rem] mt-2 sm:mt-0'>
                                        <select
                                            id="find_by_real_name"
                                            name="find_by_real_name"
                                            value={settings.find_by_real_name}
                                            onChange={handleChangeFindBy}
                                            className="h-[2.3rem] w-full rounded-md text-white bg-darkBlue border border-gray-500"
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Email Dropdown */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap'>
                                    <h1 className='text-white text-md font-semibold'>Email</h1>
                                    <div className='w-full sm:w-[12rem] mt-2 sm:mt-0'>
                                        <select
                                            id="find_by_email"
                                            name="find_by_email"
                                            value={settings.find_by_email}
                                            onChange={handleChangeFindBy}
                                            className="h-[2.3rem] w-full rounded-md text-white bg-darkBlue border border-gray-500"
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='flex justify-end mt-2'>
                                    <Button type='submit' title={"Save Changes"} className={"w-full sm:w-[8rem] h-[2.3rem] rounded-md text-white bg-[#F77F00]"} />
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
