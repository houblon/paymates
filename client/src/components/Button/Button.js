import React, {Component} from 'react';
import './Button.css';

const Button = (props) => (
  <button class="Button"
    value={props.value}
    onClick={props.onClick}
  >
    {props.label}
  </button>
);

export default Button;