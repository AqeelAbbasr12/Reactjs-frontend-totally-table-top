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
            nav("/forget"); // Redirect back if email is not found
        }
    }, [nav]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            const response = await fetch(`${API_BASE_URL}/auth/update-forget-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ ...formData, email }),
            });

            const result = await response.json();
            // console.log(result);
            if (result.status === true) {
                toastr.success(result.message);
                localStorage.removeItem('resetEmail'); // Clear email after success
                nav("/");
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    setErrors({ form: result.error || "Error Occurred" });
                }
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
                        <p className="text-white mb-3"></p>
                        <input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            className={`w-[100%] h-[2.3rem] px-3 mt-3 rounded-md text-white bg-darkBlue mb-3 outline-none `}
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {errors.password && <p className='text-red'>{errors.password}</p>}

                        {errors.form && <p className='text-red'>{errors.form}</p>}
                        <Button type='submit' title={"Set new password & login"} className={"mt-3 bg-lightOrange text-white rounded-md h-[2.3rem] w-full"} />
                    </form>

                </div>
            </div>


        </div>
    )
}

export default ResetLayout
