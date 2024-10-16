import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useParams } from 'react-router-dom';
import toastr from 'toastr';
import { fetchWithAuth } from '../../services/apiService';

const Layout = () => {
    const [loading, setLoading] = useState(true);
    const { convention_id } = useParams();  // Get convention_id from URL params
    const [conventions, setConvention] = useState({});
    const [agendaItem, setAgendaItem] = useState('');  // Agenda item input state
    const nav = useNavigate();

    useEffect(() => {
        fetchConventions(convention_id);  // Fetch convention details using convention_id
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
            setConvention(data);
        } catch (error) {
            // console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        setAgendaItem(e.target.value);  // Update agenda item input state
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission

        try {
            // Make POST request to submit agenda item and convention_id
            const response = await fetchWithAuth(`/user/convention_agenda`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    convention_id,  // Sending convention_id
                    agenda_item: agendaItem  // Sending agenda_item from input state
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toastr.success(data.message);
                setAgendaItem('');  // Reset agenda input after submission
                nav(`/next/agenda/${convention_id}`);
            } else {
                toastr.error('Failed to save the agenda');
            }
        } catch (error) {
            // console.error('Error submitting form:', error);
            toastr.error('An error occurred while saving the agenda');
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

            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 flex justify-center items-center'>
                <div className='sm:w-[50%] w-[100%] bg-[#0d2539] px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>UKGE</div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'><FaList className='text-white' /></div>
                    </div>
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Your {conventions.convention_name} Agenda</h1>

                    {/* Form starts here */}
                    <form onSubmit={handleSubmit}>
                        <Input 
                            name={"agenda"} 
                            placeholder={"Type here to add a new agenda item"} 
                            type={"text"} 
                            className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-4 outline-none bg-darkBlue`} 
                            value={agendaItem}  // Bind input value to agendaItem state
                            onChange={handleInputChange}  // Handle input change
                        />
                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex items-center gap-x-4'>
                                {/* Optional icons */}
                            </div>
                            <Button 
                                title={"Save Agenda"} 
                                className={`w-[8rem] h-[2.3rem] rounded-md text-white bg-lightOrange`}
                                type="submit"  // Set button type to submit
                            />
                        </div>
                    </form>
                    {/* Form ends here */}
                </div>
            </div>
        </div>
    );
}

export default Layout;
