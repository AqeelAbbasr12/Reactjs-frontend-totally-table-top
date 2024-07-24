import React from 'react';

const Textarea = ({ name, placeholder, onChangeFunc, className, onFocusFunction }) => {
    return (
        <textarea 
            name={name} 
            placeholder={placeholder} 
            onChange={(e) => onChangeFunc(e)} 
            className={className} 
            onFocus={onFocusFunction}
        />
    );
}

export default Textarea;
