import React from 'react';

const Input = ({ name, type, placeholder, onChangeFunc, className, onFocusFunction, value, onChange, checked, min }) => {
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocusFunction}
            className={className}
            value={value}  // Bind the value
            checked={checked}
            min={min} // Add min prop here
        />
    );
};

export default Input;
