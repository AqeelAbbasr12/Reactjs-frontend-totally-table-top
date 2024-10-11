import React,{useState} from 'react'
import img1 from '../../../assets/Icon metro-image.svg';
import Button from '../Button/Button';
function Upload() {
    
    return (
        <>
            <div className='w-[200px] h-[200px] sm:w-[302px] sm:h-[302px] mt-2 sm:mt-9 lg:w-[252px] lg:h-[252px] xl:w-[302px] xl:h-[302px] bg-[#102F47] rounded-full flex justify-center items-center'>
                <img src={img1} alt="" />
            </div>
        </>
    )
}

export default Upload;