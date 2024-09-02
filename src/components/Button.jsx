import React from 'react';

const Button = ({ title, className, onClickFunc }) => {
  return (
    <button className={className} onClick={onClickFunc}>
      {title}
    </button>
  );
};

export default Button;