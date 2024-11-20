import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'
import { FaExpand, FaGripLines, FaList } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill, BsLine, BsPrinterFill } from 'react-icons/bs'
import ConventionImage from '../../assets/traditional.png'
import Button from '../../components/Button'
import Input from '../../components/Input'
import DraggableList from '../../components/DragAbleTodoList'
import { BiSolidDownload } from 'react-icons/bi'
import { useParams } from 'react-router-dom';
import toastr from 'toastr';
import { fetchWithAuth } from '../../services/apiService';

const NextAgenda = () => {
    const [loading, setLoading] = useState(true);
    const { convention_id } = useParams();  // Get convention_id from URL params
    const [conventions, setConvention] = useState({});
    const [agendaName, setAgenda] = useState({});
      // Agenda item input state
    const nav = useNavigate();

    useEffect(() => {
        fetchConventions(convention_id);  // Fetch convention details using convention_id
        fetchAgendaName(convention_id);
    }, [convention_id]);

    const fetchConventions = async (id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention/${id}`, {
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
            console.log(data);
            setConvention(data);
        } catch (error) {
            // console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAgendaName = async (convention_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/get_convention_agenda/${convention_id}`, {
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
            setAgenda(data);
        } catch (error) {
            // console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
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

            

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3'>
                <a href="/profile" className='text-white'>
                Account
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="/user/convention" className='text-white'>
                Your conventions
                </a>

                
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 flex justify-center items-center'>

                <div className='sm:w-[50%] w-[100%] bg-[#0d2539]  px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'> <img src={conventions.convention_logo || ConventionImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' /></div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'><FaList className='text-white' /></div>
                    </div>
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Your {agendaName.agenda_item} Agenda</h1>

                   
                    <DraggableList convention_id={convention_id} />

                   
                    {/* Form ends here */}
                </div>

            </div>




        </div>
    )
}

export default NextAgenda
