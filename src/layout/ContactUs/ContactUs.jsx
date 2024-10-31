import React from 'react'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useNavigate } from 'react-router-dom'
import Textarea from '../../components/Textarea'
import Bottom from '../../layout/Footer/Bottom'


const ContactUS = () => {
  const nav = useNavigate()

  return (
    <div className='flex flex-col w-full'>
  <Navbar />

  <div className='flex flex-col md:flex-row h-screen bg-darkBlue p-4 md:p-8 gap-4 justify-center items-center'>
    <div className='md:w-1/2 w-full flex flex-col items-start'>
      <div className='pb-4'>
        <h1 className='text-3xl text-white font-semibold'>Contact Us</h1>
      </div>
      <div>
        <p className='text-white'>
          The best way to get in touch with us is to fill in this form,
        </p>
        <p className='text-white pb-4'>and we’ll get your message right away.</p>
        <p className='text-white'>
          Alternatively, you can email{' '}
          <span className='text-f3c15f'>hello@totallytabletop.com</span>
        </p>
      </div>
    </div>

    <div className='md:w-1/2 w-full flex flex-col'>
      <div className='w-full bg-[#0d2539] px-4 py-4 border-r-2 border-b-2 border-[#f3c15f] shadow-[4px 4px 0px #F3C15F]'>
        <div className='pb-4'>
          <h1 className='text-2xl text-white font-semibold'>Send us a message</h1>
        </div>
        <form className=''>
          <div>
            <Input
              placeholder={"Your name"}
              name={"name"}
              type={"text"}
              className={"w-full h-12 px-3 text-white bg-darkBlue mb-5 outline-none"}
            />
            <Input
              placeholder={"Your email address"}
              name={"email"}
              type={"text"}
              className={"w-full h-12 px-3 text-white bg-darkBlue mb-2 outline-none"}
            />
          </div>
          <div className="relative w-full pb-4">
            <Textarea
              name={"biography"}
              className={`peer h-full min-h-[100px] w-full resize-none px-3 py-2.5 bg-darkBlue mt-3 text-white outline-none`}
              placeholder={"Your message - write as much as you like"}
            />
          </div>
          <Button
            onClickFunc={() => nav("/home")}
            title={"Send message"}
            className={"w-full h-12 text-white bg-lightOrange"}
          />
        </form>
      </div>
    </div>
  </div>

  {/* Footer */}
  <Bottom />
</div>

  );
}

export default ContactUS
