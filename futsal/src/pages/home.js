import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Rating } from "primereact/rating";
import "primereact/resources/themes/bootstrap4-light-purple/theme.css";
import './home.css';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [searchMethod, setSearchMethod] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [sortField, setSortField] = useState('');

  const handleMethodChange = (e) => {
    setSearchMethod(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortField(e.target.value);
  };

  const handleSearch = async () => {
    let apiEndpoint = '';
    if (searchMethod === 'name') {
      apiEndpoint = `http://127.0.0.1:5000/searchByName/${searchValue}`;
    } else if (searchMethod === 'date') {
      apiEndpoint = `http://127.0.0.1:5000/searchByDate/${searchValue}`;
    }

    if (sortField) {
      apiEndpoint += `?sort=${sortField}`;
    }

    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setCards(data); // Update cards state with fetched data
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  function CoolComponent() {
    return (
      <div className="cool-component">
    <h1 className="heading">
    <span>B</span>
    <span>o</span>
    <span>o</span>
    <span>k</span>
    <span className="space"></span>
    <span>N</span>
    <span>o</span>
    <span>w</span>
  </h1>
  <div class="image">
              <img src="media/book-img.svg" alt=""/>
  </div>
      </div>
    );
  }

  return (
    <>
      <Video/>
      <SearchButton
        searchMethod={searchMethod}
        setSearchMethod={setSearchMethod}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleMethodChange={handleMethodChange}
        handleSearch={handleSearch}
        handleSortChange={handleSortChange}
      />
      <NoOpBox/>
      
      <NoOpBox/>
      <div className='card-container'>
      {cards.length === 0 ? <CoolComponent /> : (
        cards.map((card) => (
          <Cards cardTitle={card.name} id={card.id} key={card.id} img={card.image_url} rating={card.rating} price={card.price}/>
        ))
      )}
      <NoOpBox/>
      </div>
    </>
  );
}




function SearchButton({ searchMethod, setSearchMethod, searchValue, setSearchValue, handleMethodChange, handleSearch, handleSortChange }) {
  return (
    <div className="search-container">
      {searchMethod === 'name' && (
        <input
          type="search"
          className='search-box'
          placeholder='Find Futsal by Name'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      )}
      {searchMethod === 'date' && (
        <input
          type="date"
          placeholder='Select Date'
          className="date-input"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      )}
      <div className="select-container">
        <select
          className="select"
          value={searchMethod}
          onChange={handleMethodChange}
          style={{

            backgroundColor: '#f1f1f1',
            border: '1px solid #ccc',
            borderRadius: '20px',
            fontSize: '16px',
            cursor: 'pointer',
            outline: 'none',
            width: '200px', // Adjust width as needed
            height: '40px', // Adjust height as needed
            textAlign: 'center', // Align text to the center
          }}
        >
          <option value="name">By Name</option>
          <option value="date">By Date</option>
        </select>
      </div>
      {searchMethod === 'name' && (
        <div className="select-container">
          <select
            className="select"
            onChange={handleSortChange}
            style={{
              backgroundColor: '#f1f1f1',
              border: '1px solid #ccc',
              borderRadius: '20px',
              fontSize: '16px',
              cursor: 'pointer',
              outline: 'none',
              width: '150px', // Adjust width as needed
              height: '40px', // Adjust height as needed
              textAlign: 'center', // Align text to the center
            }}
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
      )}
      <button type='submit' className='search-button' onClick={handleSearch}>
        <img src='search.png' className='search-img' alt="Search" />
      </button>
    </div>
  );
}









function NoOpBox(){
  return(
    <div style={{height:"15vh",width:"100%"}}></div>
  )
}



function Cards({ cardTitle, id,img,rating,price}) {
  return (
    <div className="block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark w-80">
      <NavLink to={`/Court/${id}`}>
        <img className="rounded-t-lg" src={img} alt="" />
      </NavLink>
      <div className="p-6 text-surface dark:text-white">
        <h5 className="mb-2 text-xl font-medium leading-tight" style={{color:"black"}}>{cardTitle}</h5>
        <p className="mb-4 text-base text-black">
        <Rating value={rating} readOnly cancel={false}/>
        Price:{price.replace(/\$/g, '').trim()}
        </p>

        
          <button
            type="button"
            className="btn btn-primary btn-lg btn-raised pk" style={{backgroundColor:"rgba(255, 165, 0, 0.8)"}}>
            <NavLink to={`/Court/${id}`}>Book Now</NavLink>
          </button>
        
      </div>
    </div>
  );
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
          <img src="img2.jpg" className="d-block w-100" style={{ height: "47vh" }} alt="Soccer Kick" />
        </div>
        <div className={id==1?"carousel-item active":"carousel-item"}>
          <img src="athlete.jpg" className="d-block w-100" style={{ height: "47vh" }} alt="..." />
        </div>
        <div className={id==2?"carousel-item active":"carousel-item"}>
          <img src="soccerball.jpg" className="d-block w-100" style={{ height: "47vh" }} alt="..." />
        </div>
      </div>
    </div>
  );
}

function Video() {
  const scrollToSearchBox = () => {
    const searchBox = document.querySelector('.search-container');
    if (searchBox) {
      searchBox.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="video-container">
      <video autoPlay loop muted>
        <source src="media/vid-1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
    <h3>Let's Play Ball</h3>
    <p>discover new grounds with us, challenge awaits</p>
    <a href="#discover" className="btn" onClick={scrollToSearchBox}>discover more</a>
    </div>
    </div>
  );
}