import React from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Bottom from '../../layout/Footer/Bottom';

const Terms = () => {
    const nav = useNavigate()

    return (
        <>
            <Navbar />
            <div className='flex justify-center md:flex-row flex-col bg-darkBlue p-[1rem] md:p-[2rem] gap-x-[4rem]'>
                <div className=''>
                    <h1 className='text-3xl font-semibold text-white mb-4'>Terms & Conditions</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>These terms and conditions (the “Terms and Conditions”) govern the use of www.totallytabletop.com (the “Site”). This Site is owned and operated by Totally TableTop. This Site is a social media. </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>By using this Site, you indicate that you have read and understand these Terms and Conditions and agree to abide by them at all times.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Intellectual Property</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>All content published and made available on our Site can be re-used in any manner in perpetuity by Totally TableTop and the Site’s creators. This includes, but is not limited to images, text, logos, documents, downloadable files and anything that contributes to the composition of our Site.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Acceptable Use</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>As a user of our Site, you agree to use our Site legally, not to use our Site for illegal purposes, and not to: </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Harass or mistreat other users of our Site; </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Violate the rights of other users of our Site; </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Violate the intellectual property rights of the Site owners or any third party to the Site;</p>  
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Hack into the account of another user of the Site;</p>     
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Act in any way that could be considered fraudulent; or </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Post any material that may be deemed inappropriate or offensive.</p> 
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>If we believe you are using our Site illegally or in a manner that violates these Terms and Conditions, we reserve the right to limit, suspend or terminate your access to our Site. We also reserve the right to take any legal steps necessary to prevent you from accessing our Site.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>User Contributions</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>Users may post the following information on our Site:</p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Items for sale; </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Photos;</p> 
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Videos; and </p> 
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>- Public comments.</p> 
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>By posting publicly on our Site, you agree not to act illegally or violate these Terms and Conditions.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Accounts</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>When you create an account on our Site, you agree to the following: </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>1. You are solely responsible for your account and the security and privacy of your account, including passwords or sensitive information attached to that account; and </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>2. All personal information you provide to us through your account is up to date, accurate, and truthful and that you will update your personal information if it changes. </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>3. We do not accept any business accounts and you agree to not operate as a business from our user accounts. </p>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>We reserve the right to suspend or terminate your account if you are using our Site illegally or if you violate these Terms and Conditions.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Third Party Goods and Services</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>Our Site may offer goods and services from third parties. We cannot guarantee the quality or accuracy of goods and services made available by third parties on our Site.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>User Goods and Services</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>Our Site allows users to sell goods and services. We do not assume any responsibility for the goods and services users sell on our Site. We cannot guarantee the quality or accuracy of any goods and services sold by users on our Site. However, if we are made aware that a user is violating these Terms and Conditions, we reserve the right to suspend or prohibit the user from selling goods and services on our Site.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Links to Other Websites</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>Our Site contains links to third party websites or services that we do not own or control. We are not responsible for the content, policies, or practices of any third party website or service linked to on our Site. It is your responsibility to read the terms and conditions and privacy policies of these third party websites before using these sites.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Limitation of Liability</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>Totally TableTop and our directors, officers, agents, employees, subsidiaries, and affiliates will not be liable for any actions, claims, losses, damages, liabilities and expenses including legal fees from your use of the Site.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Indemnity</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>Except where prohibited by law, by using this Site you indemnify and hold harmless Totally TableTop and our directors, officers, agents, employees, subsidiaries, and affiliates from any actions, claims, losses, damages, liabilities and expenses including legal fees arising out of your use of our Site or your violation of these Terms and Conditions.</p>


                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Applicable Law</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>These Terms and Conditions are governed by the laws of the Country of England.</p>

                    
                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Severability</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>If at any time any of the provisions set forth in these Terms and Conditions are found to be inconsistent or invalid under applicable laws, those provisions will be deemed void and will be removed from these Terms and Conditions. All other provisions will not be affected by the removal and the rest of these Terms and Conditions will still be considered valid.</p>


                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Changes</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>These Terms and Conditions may be amended from time to time in order to maintain compliance with the law and to reflect any changes to the way we operate our Site and the way we expect users to behave on our Site. We will notify users by email of changes to these Terms and Conditions or post a notice on our Site.</p>

                    <h1 className='text-[1.2rem] font-semibold text-white mb-4'>Contact Details</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>Please contact us if you have any questions or concerns. Our contact details are as follows: <span className='text-f3c15f'>hello@totallytabletop.com</span></p>


                    <p className='text-white mb-2 w-[100%] md:w-[80%]'>You can also contact us <span className='text-f3c15f'>through the contact us form available on our Site.</span> </p>
                    
                </div>
            </div>

            <Bottom />
        </>
    )
}

export default Terms
