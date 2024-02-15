import React, { useEffect, useState } from 'react';
import Items from './itemComponent';
import "./app.css";


function Main({navItems,logo}) {

    const [sNavItems,setSnavItems]=useState([]);
    useEffect(()=>{
        setSnavItems(navItems);
    },[]);


    return (
        <div className='nav-container'>
            <h2 id="logo">{logo}</h2>

            {sNavItems.map((item=>{
                return (
                <Items item={item} key={item.name}/>
                )
            }))}
        </div>
        
    );
}

export default Main;