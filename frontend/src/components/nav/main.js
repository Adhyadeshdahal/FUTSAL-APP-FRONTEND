import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol } from '@fortawesome/free-solid-svg-icons';
import Items from './itemComponent';
import "./app.css";


function Main({navItems,logo}) {

    const [sNavItems,setSnavItems]=useState([]);
    useEffect(()=>{
        setSnavItems(navItems);
    },[]);


    return (
        <div>
        <div className='nav-container'>
        <a href="/" class="logo"><span>F</span>utsal</a>
            {sNavItems.map((item=>{
                return (
                <Items item={item} key={item.name}/>
                )
            }))}
        </div>
        </div>
        
    );
}

export default Main;