import React from 'react';
import ReactDOM from 'react-dom';
import "./app.css";
import { NavLink } from 'react-router-dom';
// import PropTypes from 'prop-types';

function Items({item}) {
    return (
        <NavLink to={item.path} className='item' style={{textDecoration: 'none'}}>
            {item.name}
        </NavLink> 
    
     );
}

export default Items;
