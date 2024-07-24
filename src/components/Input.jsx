import React from 'react'

const Input = ({ name, type, placeholder, onChangeFunc, className,onFocusFunction, onChange, checked}) => {
    return (
        <input  onFocus={onFocusFunction} name={name} type={type} placeholder={placeholder} onChange={onChange} className={className}  checked={checked} />
    )
}

export default Input
