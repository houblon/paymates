import React, {Component} from 'react';
import './Select.css';

const Select = (props) => (
  <select
    className="Select"
    value={props.value}
    onChange={props.onChange}>
    {
      props.options ? (
        props.options.map(option => (
          <option value={option}>
          {option}
          </option>
        ))
      ) : (null)
    }
  </select>
);

export default Select;