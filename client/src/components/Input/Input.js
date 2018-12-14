import React from 'react';
import './Input.css';

const Input = (props) => (
  <input className="Input"
    type={props.type}
    name={props.name}
    placeholder={props.placeholder}
    value={props.value}
    onChange={props.onChange}
  >
    {props.label}
  </input>
);

export default Input;