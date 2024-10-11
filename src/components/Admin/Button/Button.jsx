import React, { useState,useRef } from 'react'

function Button({ button }) {
    const [logo, setLogo] = useState(false);
    const update_logo = () => {
        setLogo(!logo);
    }
    const fileInputRef = useRef(null);

    // Function to trigger file input click
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();  // Programmatically click the hidden input
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file);
            // You can handle the selected file here (e.g., upload it, preview it, etc.)
        }
    };
    return (
        <div className='flex mt-[31px] ms-[20px]' onClick={handleButtonClick}>

            <button className='border-2 border-[#F77F02] h-12 w-44 sm:h-73 sm:w-52  justify-center text-xl leading-10 md:text-26 md:leading-47 font-palanquin-dark'>
                {/* {logo ? 'Update Logo' : 'Upload Logo'} md:w-[249px] */}
                {button}
            </button>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

        </div>
    )
}

export default Button;