import React from 'react';
import 'primeicons/primeicons.css';
import "./app.css";
import { NavLink } from 'react-router-dom';
// import PropTypes from 'prop-types';

function Items({item}) {
    return (
        <NavLink to={item.path} className='item' style={{textDecoration: 'none'}} title={item.name}>
            <IconD classn={item.class}/>
            <span className="tooltip">{item.name}</span>
        </NavLink> 
    
     );
}

function IconD({classn}){
return(
    <>
    <i className={classn} style={{ fontSize: '1.2rem' }}></i>
    </>
)
}

export default Items;
