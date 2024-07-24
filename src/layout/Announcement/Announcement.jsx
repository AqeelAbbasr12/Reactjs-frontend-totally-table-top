import React from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import annoucementImage from '../../assets/annoucement.jpg'
import announceImage from '../../assets/announce.svg'
import Left from '../../components/Left'
import Bottom from '../../layout/Footer/Bottom'
const Layout = () => {

  const nav = useNavigate()
  return (
    <div className='flex flex-col w-[100vw]'>
      <Navbar type={"verified"} />
      <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

        {/* LEFT  */}
        <Left />

        {/* RIGHT  */}
        <div className='flex-1 rounded-md px-2 mb-2'>
          

          <div className='flex items-center gap-x-[1rem] my-[1rem]'>
            <img src={announceImage} alt="" />
            <p className='text-white'>Annoucements</p>

          </div>
          <div className="mb-3">
          <img src={annoucementImage} alt="" className='w-[100%] lg:w-[80%] h-[15rem] rounded-md cursor-pointer' />
          </div>

          <div className="mb-3">
          <img src={annoucementImage} alt="" className='w-[100%] lg:w-[80%] h-[15rem] rounded-md cursor-pointer' />
          </div>
          
          <div className="mb-3">
          <img src={annoucementImage} alt="" className='w-[100%] lg:w-[80%] h-[15rem] rounded-md cursor-pointer' />
          </div>

          <div className=' bg-lime-50 w-[100%] lg:w-[80%] rounded-md p-5 my-4 flex justify-between items-center'>

            <div>
              <p className='text-darkBlue'>New feature added</p>
              <p className='text-darkBlue my-1'>Your account now support direct messaging</p>
            </div>
            {/* <img src={connectImage} alt="" /> */}
          </div>
        </div>


      </div>

      {/* footer  */}
      <Bottom/>
    </div>
  )
}

export default Layout
