import React from 'react';

const Textarea = ({ name, placeholder, onChangeFunc, className,value, onFocusFunction }) => {
    return (
        <textarea 
            name={name} 
            placeholder={placeholder} 
            onChange={(e) => onChangeFunc(e)} 
            className={className} 
            value={value}
            onFocus={onFocusFunction}
        />
    );
}

export default Textarea;
