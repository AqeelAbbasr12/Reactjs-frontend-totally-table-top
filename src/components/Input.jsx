import React from 'react';

const Input = ({ name, type, placeholder, onChangeFunc, className, onFocusFunction, value, onChange, checked }) => {
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
        />
    );
};

export default Input;
