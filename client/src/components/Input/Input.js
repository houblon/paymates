import React from 'react';
import './Input.css';

const Input = (props) => (
  <input className={"Input " + props.classes}
    type={props.type}
    name={props.name}
    placeholder={props.placeholder}
    value={props.value}
    id={props.id} // Using the ID parameter for passing ID to function. Asking Michael / Maddy about best practices on this.
    onChange={props.onChange}
  >
    {props.label}
  </input>
);

export default Input;