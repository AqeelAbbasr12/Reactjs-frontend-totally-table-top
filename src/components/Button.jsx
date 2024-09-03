import React from 'react';

const Button = ({ title, className, onClickFunc, type = 'button' }) => {
  return (
    <button className={className} onClick={onClickFunc} type={type}>
      {title}
    </button>
  );
};

export default Button;
