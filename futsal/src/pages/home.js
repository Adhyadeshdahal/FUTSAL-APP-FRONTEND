import React from 'react';

export default function Home() {
  return (
    <>
    <Carousel />
    <SearchButton/>
    <NoOpBox/>
    <Cards/>
    
    
    </>
  );
};


function SearchButton() {
  return (
    <div style={{
      position:'fixed',
      left:"25vw",
      right:"25vw",
      height:"12vh",
      background:"red",
      width:"50vw",
      top:"37vh"
    }}>
      <input type="search" placeholder='Find Futsal' style={{ width: "25vw" }} />
      <input type="date" placeholder='01-jan-2020' style={{ width: "5vw" }} />
    </div>
  );
}

function NoOpBox(){
  return(
    <div style={{height:"10vh",width:"100%"}}></div>
  )
}

function Cards(){
  return(
    <div className="card" style={{width: "18rem"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Card title</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>
  )
}



function Carousel() {
  return (
    <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="https://timelinecovers.pro/facebook-cover/download/straight-kick-from-a-soccer-athlete-facebook-cover.jpg" className="d-block w-100" style={{ height: "35vh" }} alt="Soccer Kick" />
        </div>
        <div className="carousel-item">
          <img src="..." className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src="..." className="d-block w-100" alt="..." />
        </div>
      </div>
    </div>
  );
}
