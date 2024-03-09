import React, { useEffect, useState } from 'react';
import './home.css';

export default function Home() {
  let [cards,setCards]=useState([]);
  const onSearchClick = ()=>{
    setTimeout(()=>{
      setCards([1,2]);
      console.log(cards);
    },1000)
    
  };


  return (
    <>
    <Carousel />
    <SearchButton click={onSearchClick}/>
    <NoOpBox/>
    <div className='card-container'>
      { cards.map((card) => {
      return <Cards cardTitle={card} key={card}/>
    })}
    </div>
    
    </>
  );
};


function SearchButton({click}) {

  return (
    <div className="search-container">
      <input type="search" className='search-box' placeholder='Find Futsal'/>
      <input type="date" placeholder='01-jan-2020' className="date-input" />
      <button type='submit' className='search-button' onClick={click} >
        <img src='search.png' className='search-img'></img>
      </button>

    </div>
  );
}

function NoOpBox(){
  return(
    <div style={{height:"15vh",width:"100%"}}></div>
  )
}

function Cards({cardTitle}){
  return(
   
    <div
    class="block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark w-80">
    <a href="#!">
      <img
        class="rounded-t-lg"
        src="https://tecdn.b-cdn.net/img/new/standard/nature/184.jpg"
        alt="" />
    </a>
    <div class="p-6 text-surface dark:text-white">
      <h5 class="mb-2 text-xl font-medium leading-tight">Card title</h5>
      <p class="mb-4 text-base text-black">
        Some quick example text to build on the card title and make up the
        bulk of the card's content.
      </p>
      <button
        type="button"
        class="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
        data-twe-ripple-init
        data-twe-ripple-color="light">
        Button
      </button>
    </div>
  </div>
  )
}



function Carousel() {
  let [id,setActiveId]=useState(0);
  useEffect(()=>{
    setTimeout(()=>{
      setActiveId((id+1)%3);
    },2555);
  },[id]);

  return (
    <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className={id==0?"carousel-item active":"carousel-item"}>
          <img src="img2.jpg" className="d-block w-100" style={{ height: "40vh" }} alt="Soccer Kick" />
        </div>
        <div className={id==1?"carousel-item active":"carousel-item"}>
          <img src="athlete.jpg" className="d-block w-100" style={{ height: "40vh" }} alt="..." />
        </div>
        <div className={id==2?"carousel-item active":"carousel-item"}>
          <img src="soccerball.jpg" className="d-block w-100" style={{ height: "40vh" }} alt="..." />
        </div>
      </div>
    </div>
  );
}
