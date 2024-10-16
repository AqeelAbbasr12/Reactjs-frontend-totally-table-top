import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/face.avif'
import ConventionImage from '../../assets/convention.jpeg'
import { FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import toastr from 'toastr';
import { fetchWithAuth } from '../../services/apiService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
    const data = [1, 2, 3, 4, 5]
    const nav = useNavigate()
    const [convention, setConvention] = useState([]);
    const [accommodations, setAccommodation] = useState([]);
    const [loading, setLoading] = useState(true);
    const { accommodation_id, convention_id } = useParams();

    useEffect(() => {
        fetchAccommodation(convention_id);
        fetchConventions(convention_id);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
        const day = date.getDate();
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
        const year = date.getFullYear();

        // Add the 'st', 'nd', 'rd', 'th' suffix
        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
            day % 10 === 2 && day !== 12 ? 'nd' :
                day % 10 === 3 && day !== 13 ? 'rd' : 'th';

        return `${weekday}, ${day}${suffix}, ${month}, ${year}`;
    };
    const fetchConventions = async (convention_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention/${convention_id}`, {
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
            setConvention(data);
            console.log(data);
        } catch (error) {
            // console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAccommodation = async (convention_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention_accommodation/${convention_id}`, {
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
            setAccommodation(data);
        } catch (error) {
            // console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {

        try {
            const response = await fetch(`${API_BASE_URL}/user/convention_accommodation/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    // Add other headers if necessary, such as Authorization
                },
            });

            if (response.ok) {
                // Optionally show a success message
                toastr.success('Accommodation deleted successfully!');

                fetchAccommodation(convention_id);

                // Change to the desired route
            } else {
                // console.error('Failed to delete accommodation', response.statusText);
                // Optionally show an error message
            }
        } catch (error) {
            // console.error('Error deleting accommodation:', error);
            // Optionally show an error message
        }

    }

    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3'>
                <a href="#" className='text-white'>
                    Account
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="/user/convention" className='text-white'>
                    Your conventions
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="#" className='text-white'>
                    UK Games Expo
                </a>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 overflow-y-auto'>

                <div className='flex justify-between items-start sm:items-center flex-wrap w-[100%] sm:flex-row flex-col'>
                    <div className='flex items-center gap-x-4'>
                        <div className='min-w-[3rem] min-h-[3rem] rounded-full bg-lightOrange  flex justify-center items-center'>UKGE</div>
                        <h1 className='text-3xl font-bold text-white'>{convention.convention_name} Accomodation</h1>
                    </div>
                    <Button onClickFunc={() => { nav(`/new/accomodation/${convention_id}`) }} title={"Add New"} className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white sm:mt-0 mt-3`} />
                </div>


                <div className='mt-6'>
                    {
                        accommodations.map((accommodation) => (
                            <div
                                key={accommodation.id}
                                className="w-full sm:h-[10rem] bg-[#0d2539] p-3 rounded-md flex justify-between items-start relative sm:flex-row flex-col mt-4"
                            >
                                <div className="w-full sm:w-auto">
                                    <h1 className="text-lg font-semibold text-white truncate">{accommodation.location_name}</h1>

                                    <div className="flex flex-wrap items-center gap-2 mt-4">
                                        {/* From Date */}
                                        <FaCalendarAlt className="text-lightOrange" />
                                        <span className="text-white">From Date:</span>
                                        <p className="text-white">{formatDate(accommodation.from_date)}</p>

                                        {/* To Date */}
                                        <FaCalendarAlt className="text-lightOrange" />
                                        <span className="text-white">To Date:</span>
                                        <p className="text-white">{formatDate(accommodation.to_date)}</p>
                                    </div>

                                    {/* Buttons Section */}
                                    <div className="flex flex-wrap items-center gap-3 mt-4 w-full">
                                        <Button
                                            onClickFunc={() => {
                                                nav(`/edit/accommodation/${accommodation.id}/convention/${convention_id}`);
                                            }}
                                            title={"Edit"}
                                            className="w-full sm:w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white"
                                        />
                                        <Button
                                            onClickFunc={() => handleDelete(accommodation.id)}
                                            title={"Delete"}
                                            className="w-full sm:w-[8rem] h-[2.3rem] rounded-md border border-red text-white"
                                        />
                                    </div>
                                </div>

                                {/* Image Section */}
                                <div className="sm:mt-0 mt-4 w-full sm:w-auto">
                                    <img
                                        src={ConventionImage && accommodation.location_image}
                                        alt=""
                                        className="h-[10rem] w-full sm:w-auto object-cover"
                                    />
                                </div>
                            </div>

                        ))
                    }



                </div>


            </div>




        </div>
    )
}

export default Layout
