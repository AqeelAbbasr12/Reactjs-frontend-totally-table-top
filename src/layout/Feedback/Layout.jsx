import React from 'react'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useNavigate } from 'react-router-dom'
import Textarea from '../../components/Textarea'
import Bottom from '../../layout/Footer/Bottom'


const FeedBack = () => {
  const nav = useNavigate()

  return (
    <div className='flex flex-col w-[100vw]]'>
        <Navbar />

      <div className='flex justify-between h-[100vh] md:flex-row flex-col bg-darkBlue p-[1rem] md:p-[2rem] gap-x-[4rem]'>

        <div className='md:w-fit w-[100%] md:w-[100%] flex flex-col items-start '>
             <div className='pb-4'>
                <h1 className='text-3xl text-white font-semibold'>Feedback form</h1>
              </div>
              <div className=''>
                <p className='text-white'>The best way to tell us about your experience using</p>
                <p className='text-white pb-4'>TotallyTableTop is to fill in this form, and we’ll get your feedback right away.  </p>
              </div>
        </div>

        <div className='md:w-[40%] w-[100%] md:block flex-col'>
          <div className='w-[100%] md:w-[100%] bg-[#0d2539] px-[2rem] py-[2rem] border-r-2 border-b-2 border-[#f3c15f] boxshadow-[4px 4px 0px #F3C15F]'>
            <div className='pb-4'>
                <h1 className='text-2xl text-white font-semibold'>Tell us what you think</h1>
            </div>
            <form action="" className=''>
             <div>
                <Input placeholder={"Your name"} name={"name"} type={"text"} className={"w-[100%] h-[3rem] px-3 text-white bg-darkBlue mb-5 outline-none"} />
                <Input placeholder={"Your email address"} name={"email"} type={"text"} className={"w-[100%] h-[3rem] px-3 text-white bg-darkBlue mb-2 outline-none"} />
              </div>
              <div className="relative w-full min-w-[200px] pb-4">
                <Textarea name={"biography"} className={`peer h-full min-h-[100px] w-full resize-none px-3 py-2.5 bg-darkBlue mt-3 text-white outline-none`}
                 placeholder={"Your message - write as much as you like"}>
                </Textarea>
              </div>
              <Button onClickFunc={() => nav("/home")} title={"Send feedback"} className={"w-[100%] h-[3rem]  text-white bg-lightOrange"} />
            </form>
          </div>
          
        </div>

      </div>
      
      {/* footer  */}
      <Bottom />
      </div>
  );
}

export default FeedBack
