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
        <header>
            <h2 id="logo">{logo}<FontAwesomeIcon icon={faFutbol} /></h2>
        </header>
        <div className='nav-container'>
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