import React from 'react';
import './Button.css';

const Button = (props) => (
  <button className={"Button " + props.className}
    value={props.value}
    onClick={props.onClick}
  >
    {props.label}
  </button>
);

export default Button;