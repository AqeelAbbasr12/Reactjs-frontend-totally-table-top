import React from 'react';

function Input({ name, type, holder, value, onChange, checked, min, readOnly }) {
    return (
        <input
            name={name}
            type={type}
            onChange={onChange}
            placeholder={holder}
            className='w-full h-9 sm:h-[73px] px-3 sm:px-5 focus:outline-none text-white bg-[#102F47] mb-5 text-xs sm:text-xl md:text-2xl lg:text-[28px] leading-4 sm:leading-7 md:leading-10 lg:leading-[35px] tracking-[0.56px]'
            value={value}  // Bind the value
            checked={checked}
            min={min} // Add min prop here
            readOnly={readOnly}
        />
    );
}

export default Input;
