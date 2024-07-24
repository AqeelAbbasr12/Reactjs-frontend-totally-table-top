import React from 'react'
import { TiTick } from 'react-icons/ti'
import Button from '../../components/Button'
import Input from '../../components/Input'
import logoImage from '../../assets/image.png'
import Icon from '../../assets/Icon-check-circle.svg'
import { useNavigate } from 'react-router-dom'
const Layout = () => {
  const nav = useNavigate()
  const data = ["Sell and buy board games in advance of a convention", "Create an agenda for each stand you wish to visit", "Instantly invite friends to play games and events"]
  return (
    <div className='w-screen h-screen bg-darkBlue flex justify-center items-center'>


      <div className='flex justify-center items-start md:flex-row flex-col w-[100%] gap-x-[0rem] md:w-[70%] md:gap-x-[7rem]'>

        <div className='md:w-fit w-[100%] md:block flex  flex-col items-center'>
          {/* LOGO  */}
          <div className='flex'>
            <div className='w-[6rem] h-[6rem] '>
              <img src={logoImage} alt='' />
            </div>
            {/* HEADING  */}
            <div>
              <h1 className='text-5xl text-white font-semibold'>Totally TableTop</h1>
              <p className='text-gray-400 ml-2 mt-2'>CONVENTIONS, MANAGED</p>
            </div>
          </div>
          {/* TICK  */}
          {
            data.map((i, index) => (
              <div className='md:flex hidden gap-x-5 items-center mt-2 '>
                <div className='w-[1.3rem] h-[1.3rem] flex justify-center items-center rounded-full'>
                  <img src={Icon} alt="" />
                </div>
                  {/* <TiTick className='text-white' /> */}
                <div>
                  <p className='text-white'>{i}</p>
                </div>
              </div>
            ))
          }

          <p className='text-white mt-[1rem] md:flex hidden'>Find out more</p>

        </div>

        <div className='md:w-[40%] w-[100%] md:block flex justify-center items-center flex-col'>
          <div className='w-[80%] md:w-[100%] bg-[#0d2539] px-[2rem] py-[2rem] rounded-md'>
            <form action="" className=''>
              <Input placeholder={"Email Address"} name={"email"} type={"text"} className={"w-[100%] h-[2.3rem] px-3 rounded-md text-white bg-darkBlue mb-3 outline-none"} />
              <Input placeholder={"Password"} name={"password"} type={"password"} className={"w-[100%] h-[2.3rem] px-3 rounded-md text-white bg-darkBlue mb-3 outline-none"} />
              <Button onClickFunc={() => nav("/home")} title={"Login"} className={"w-[100%] h-[2.3rem] rounded-md text-white bg-lightOrange"} />
              <p onClick={() => nav("/forget")} className='text-white text-center mt-3 cursor-pointer'>Lost your password ?</p>
            </form>
          </div>
          <div className='w-[80%] md:w-[100%] px-[2rem] py-[2rem] rounded-md'>
            <Button onClickFunc={() => nav("/register")} title={"Create An Account"} className={"w-[100%] h-[2.3rem] rounded-md text-white bg-transparent border border-white mt-3"} />
          </div>
        </div>

      </div>


    </div>
  )
}

export default Layout
