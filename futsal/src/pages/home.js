import React, { useEffect, useState } from 'react';
import './home.css';

export default function Home() {
  let [cards,setCards]=useState([]);
  const onSearchClick = ()=>{
    setTimeout(()=>{
      setCards([1,2,3]);
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
    <div style={{height:"10vh",width:"100%"}}></div>
  )
}

function Cards({cardTitle}){
  return(
    <div className="card" style={{width: "18rem"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">{cardTitle}</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>
  )
}



function Carousel() {
  let [id,setActiveId]=useState(0);
  useEffect(()=>{
    setTimeout(()=>{
      setActiveId((id+1)%3);
    },2000);
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
