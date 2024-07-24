import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Left from '../../components/Left'
import FaceImage from '../../assets/face.avif'
import MapIcon from '../../assets/mapMarker.png'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'

const   Profile = () => {
  const nav = useNavigate()
  return (
    <div className='flex flex-col w-[100vw] h-[100vh]'>
      <Navbar type={"verified"} />
      <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

        {/* LEFT  */}
        <Left />

        {/* RIGHT  */}
        <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
          <div className='sm:flex justify-between items-center'>
            <h1 className='text-white text-2xl font-semibold'>Edit your profile</h1>
            <Button onClickFunc={()=>nav("/ownFeed")} title={"View Profile"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange sm:mt-0 mt-2'} />
          </div>

          <div className='w-[100%] h-[fit] mt-4 bg-[#0d2539] rounded-md p-3'>
            <h1 className='text-white font-semibold'>About you</h1>

            <div className='flex justify-between sm:items-center sm:flex-row flex-col'>

              <div>
                <div className='flex justify-start items-center gap-x-5 mt-3'>
                  <Input name={"firstname"} className={`w-[11rem] h-[2.3rem] rounded-md px-3 bg-darkBlue text-white `} placeholder={"Marry"} />
                  <Input name={"lastname"} className={`w-[11rem] h-[2.3rem] rounded-md px-3 bg-darkBlue text-white `} placeholder={"Harward"} />
                </div>
                <Input name={"email"} className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 text-white `} placeholder={"Marry@email.com"} />
                <p className='mt-4 border-b border-b-[#F2F0EF] text-[#F2F0EF] pb-2 '>@gamestories2</p>
                <p className='mt-2 text-[#F2F0EF] pb-2 '>Username cannot be change</p>

                <div className="pb-4">
                  <div className="relative w-[23.3rem] h-[2.3rem] mt-3">
                    <Input
                      name={"location"}
                      className={`w-full h-full rounded-md px-3 bg-darkBlue pr-10 text-white`}
                      placeholder={"Bristol"}
                    />
                    <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                      <img src={MapIcon} alt="Location Icon" className="w-[15px] h-[20px]" />
                    </div>
                  </div>
                </div>


                <div>
                  <div className="relative w-full min-w-[200px] pb-4">
                    <Textarea
                       name={"biography"} className={`peer h-full min-h-[100px] w-full resize-none rounded-md px-3 bg-darkBlue mt-3 px-3 py-2.5 text-white`}
                      placeholder={"Your biography (160 characters)"}></Textarea>
                  </div>
                </div>

                <div className='pb-2'>
                  <Button title={"Save changes"} className={`w-[8rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md`} />
                </div>
              </div>

              <div className='sm:mt-0 mt-3'>
                <img src={FaceImage} alt="" className='w-[10rem] h-[10rem] rounded-full' />
                <Button title={"Upload Picture"} className={`w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md`} />

              </div>

            </div>

            <div className='pb-4'>
              <h1 className='text-white font-semibold mt-3'>Your password</h1>
              <Input name={"cpassword"} className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white `} placeholder={"Current Password"} />
              <Input name={"npassword"} className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white `} placeholder={"New Password"} />
              <Input name={"cnfpsw"} className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white`} placeholder={"Confirm New Password "} />
            </div>

            <div className='pb-4'>
              <Button title={"Update password"} className={`w-[10rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md mt-2`} />
            </div>




          </div>


        </div>


      </div>

    </div>
  )
}

export default Profile
