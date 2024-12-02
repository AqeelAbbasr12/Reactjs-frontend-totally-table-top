import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import toastr from 'toastr';

const ResetLayout = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({ password: '' });
    const [errors, setErrors] = useState({});
    const nav = useNavigate();

    useEffect(() => {
        // Retrieve the email from localStorage
        const storedEmail = localStorage.getItem('resetEmail');
        if (storedEmail) {
            setEmail(storedEmail); // Set the email in state
        } else {
            nav("/forget"); 
        }
    }, [nav]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear specific error on input change
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        // Basic validation
        if (!formData.password || !formData.create_password) {
            setErrors({ ...errors, form: "Please fill out all fields." });
            return;
        }
        if (formData.password !== formData.create_password) {
            setErrors({ ...errors, create_password: "Passwords do not match." });
            return;
        }
    
        try {
            // Make the API call
            const response = await fetch(`${API_BASE_URL}/auth/update-forget-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ ...formData, email }), // Include email from local state or props
            });
    
            const result = await response.json();
    
            if (result.status === true) {
                toastr.success(result.message); // Show success notification
                localStorage.removeItem('resetEmail'); // Clear reset email
                nav("/"); // Navigate to home page
            } else {
                setErrors(result.errors || { form: result.error || "An error occurred." });
            }
        } catch (error) {
            console.error("Error during reset:", error);
            setErrors({ form: "An error occurred. Please try again." });
        }
    };
    
    return (
        <div className='w-screen h-screen flex flex-col'>
            <Navbar />

            <div className='bg-darkBlue md:px-[2rem] flex-1 h-[90vh] md:h-[86rem] w-[100vw] flex justify-center items-center flex-col'>
                <div className='w-[80%] md:w-[50%] lg:w-[35%]  p-4 bg-[#0d2539] rounded-md'>
                    <h1 className='text-white text-lg font-semibold text-center'>Create a new password?</h1>
                    <p className='text-white mt-3'>Thanks for verifying your Email. Create a new password below</p>
                    <form onSubmit={handleSubmit}>
    <Input 
        placeholder={"Create Password"} 
        name={"password"} 
        type={"password"} 
        className={`w-[100%] mt-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white ${errors.password ? 'border-red' : ''}`} 
        value={formData.password} 
        onChange={handleChange} 
    />
    {errors.password && <p className='text-red'>{errors.password}</p>}

    <Input 
        placeholder={"Confirm Password"} 
        name={"create_password"} 
        type={"password"} 
        className={`w-[100%] mt-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white ${errors.create_password ? 'border-red' : ''}`} 
        value={formData.create_password} 
        onChange={handleChange} 
    />
    {errors.create_password && <p className='text-red'>{errors.create_password}</p>}

    {errors.form && <p className='text-red'>{errors.form}</p>}
    <Button 
        type="submit" 
        title={"Set new password & login"} 
        className={"mt-3 bg-lightOrange text-white rounded-md h-[2.3rem] w-full"} 
    />
</form>


                </div>
            </div>


        </div>
    )
}

export default ResetLayout
