import React, { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/face.avif'
import ConventionImage from '../../assets/convention.jpeg'
import { FaBuilding, FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { useParams } from 'react-router-dom';
import { TiTick } from 'react-icons/ti'
import { fetchWithAuth } from '../../services/apiService';



const Layout = () => {
    // const data = [1, 2, 3, 4, 5]
    const [loading, setLoading] = useState(true);
    const nav = useNavigate()
    const [convention, setConvention] = useState([]);
    const [attendance, setAttendance] = useState();
    const { convention_id } = useParams();
    // console.log(convention_id);

    useEffect(() => {
        fetchConventions(convention_id);
        fetchAttendanceData(convention_id);
    }, []);

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
            //   console.log(data);
        } catch (error) {
            console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch saved attendance data
    const fetchAttendanceData = async (convention_id) => {
        try {
            const response = await fetchWithAuth(`/user/convention_attendance/${convention_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                toastr.error(data.message);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setAttendance(data); // Expecting data to be an array of attendance records
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };


    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 '>
                <span className='text-white'>Account</span>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
                <span className='text-white'>Your conventions</span>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3'>

                <div className='flex justify-between items-start sm:items-center flex-wrap w-[100%] sm:flex-row flex-col'>
                    <div className='flex items-center gap-x-4'>
                        <div className='min-w-[3rem] min-h-[3rem] rounded-full bg-lightOrange  flex justify-center items-center'>UKGE</div>
                        <h1 className='text-3xl font-bold text-white'>{convention.convention_name}</h1>
                    </div>
                    <div className='flex items-center gap-x-3 sm:mt-0 mt-3'>
                        <p className='text-white '>Actions</p>
                        <BsFillCaretDownFill className='text-lightOrange rotate-360' />
                    </div>
                </div>

                <div className='w-[100%] bg-[#0d2539]  px-3 py-5 rounded-md mt-6'>

                    <div className='flex justify-between items-center'>
                        <div className='flex gap-x-3 items-center'>
                            <div className='w-[2rem] h-[2rem] flex justify-center items-center rounded-full bg-lightOrange'><TiTick className='text-[#0d2539]' /></div>
                            <p className='text-white'>You’re going!</p>
                        </div>
                        <div>
                            <Button 
                                onClickFunc={() => { nav(`/conventionAttendance/${convention.id}`); }} 
                                title={attendance && attendance.length > 0 ? "Change" : "Mark here"} 
                                className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white`} 
                            />
                        </div>
                    </div>

                    {attendance && attendance.length > 0 ? (
                        <p className='text-white mt-2'>
                            Marked as attending on{' '}
                            {attendance.map((record, index) => (
                                <span key={index}>
                                    {record.attendance_date}
                                    {index < attendance.length - 1 && (
                                        <span>{' and maybe on  '}</span>
                                    )}
                                    {index === attendance.length - 1 && attendance.length > 1}
                                </span>
                            ))}
                        </p>
                    ) : (
                        <p className='text-white mt-2'>
                            Please Mark Your Attendance First
                        </p>
                    )}


                </div>

                {attendance && attendance.length > 0 && (
                    <div className='sm:flex justify-center items-center gap-x-8 mt-6'>
                        <div className='flex-1 bg-[#0d2539] p-3 rounded-md'>
                            <div className='flex items-center gap-x-4'>
                                <FaList className='text-white' />
                                <p className='text-white'>Agenda</p>
                            </div>
                            <div className='flex justify-between items-center mt-3'>
                                <p className='text-white'>Not Started</p>
                                <Button 
                                    onClickFunc={() => { nav(`/agenda/${convention_id}`) }} 
                                    title={"Create"} 
                                    className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} 
                                    />
                            </div>
                        </div>
                        <div className='flex-1 bg-[#0d2539] p-3 rounded-md sm:mt-0 mt-3'>
                            <div className='flex items-center gap-x-4'>
                                <FaBuilding className='text-white' />
                                <p className='text-white'>Accommodation</p>
                            </div>
                            <div className='flex justify-between items-center mt-3'>
                                <p className='text-white'>1 Stay</p>
                                <Button title={"Edit"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                            </div>
                        </div>
                    </div>
                )}

                {attendance && attendance.length > 0 && (
                    <div className='sm:flex justify-center items-center gap-x-8 mt-6'>
                        <div className='flex-1 bg-[#0d2539] p-3 rounded-md'>
                            <div className='flex items-center gap-x-4'>
                                <FaCalendarAlt className='text-white' />
                                <p className='text-white'>Events</p>
                            </div>
                            <div className='flex justify-between items-center mt-3'>
                                <p className='text-white'>Nothing Yet</p>
                                <Button title={"Create"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                            </div>
                        </div>
                        <div className='flex-1 bg-[#0d2539] p-3 rounded-md sm:mt-0 mt-3'>
                            <div className='flex items-center gap-x-4'>
                                <FaDiceFive className='text-white' />
                                <p className='text-white'>Games</p>
                            </div>
                            <div className='flex justify-between items-center mt-3'>
                                <p className='text-white'>1 For Sale</p>
                                <Button title={"Games"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                            </div>
                        </div>
                    </div>
                )}

               

            </div>




        </div>
    )
}

export default Layout
