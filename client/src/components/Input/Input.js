import React, {Component} from 'react';
import './Input.css';

const Input = (props) => (
  <input class="Input"
    name={props.name}
    placeholder={props.placeholder}
    value={props.value}
    onChange={props.onChange}
  >
    {props.label}
  </input>
);

export default Input;