import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import toastr from 'toastr';

const ForgetLayout = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const nav = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        try {
            const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // console.log(result);
            
            if (result.status === true) {
                toastr.success(result.message);
                localStorage.setItem('resetEmail', formData.email);
                nav("/reset");
                
            } else {
                // Handle validation errors
                if (result.error) {
                    toastr.error(result.error);
                    setErrors(result.error);
                } else {
                    setErrors({ form: result.error || "Error Occured" });
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrors({ form: "An error occurred. Please try again." });
        }
    };
    return (
        <div className='w-screen h-screen flex flex-col'>
            <Navbar />

            <div className='bg-darkBlue md:px-[2rem] flex-1 h-[90vh] md:h-[86rem] w-[100vw] flex justify-center items-center flex-col'>
                <div className='w-[80%] md:w-[50%] lg:w-[35%]  p-4 bg-[#0d2539] rounded-md'>
                    <h1 className='text-white text-lg font-semibold text-center'>Forgotten your password?</h1>
                    <p className='text-white mt-3'>Enter the email address you used to register and we'll</p>
                    <p className='text-white mt-1'>send you instruction to reset your password.</p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            placeholder={"Email Address"}
                            name={"email"}
                            type={"text"}
                            className={`w-[100%] h-[2.3rem] px-3 mt-3 rounded-md text-white bg-darkBlue mb-3 outline-none ${errors.email ? 'border-red' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className='text-red'>{errors.email.join(', ')}</p>}

                        <Button type='submit' title={"Reset your password"} className={"mt-3 bg-lightOrange text-white rounded-md h-[2.3rem] w-full"} />
                        
                    </form>
                    <p className='text-white text-center mt-3'>Don't remember which email you used?</p>
                </div>
            </div>

            <div className='bg-[#0d2539] w-[100%] p-[1rem] md:p-[2rem] flex justify-between items-center flex-wrap'>
                <div className='w-[2rem] h-[2rem] rounded-full bg-lightYellow flex justify-center items-center mt-2'>
                    <h1 className='text-2xl text-lightOrange font-bold'>T</h1>
                </div>
                <div className='flex gap-x-3 items-center overflow-x-auto mt-2'>
                    <p className='text-lightGray cursor-pointer text-nowrap'>Contact us </p>
                    <p className='text-lightGray cursor-pointer text-nowrap'>Staying safe</p>
                    <p className='text-lightGray cursor-pointer text-nowrap'>Terms</p>
                    <p className='text-lightGray cursor-pointer text-nowrap'>Cookies</p>
                    <p className='text-lightGray cursor-pointer text-nowrap'>Privacy</p>
                    <p className='text-lightGray cursor-pointer text-nowrap'>Help & Support</p>
                </div>
            </div>
        </div>
    )
}

export default ForgetLayout
