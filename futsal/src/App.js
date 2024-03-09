import { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./components/nav/main.js";
import Home from "./pages/home.js";
import Court from "./pages/Court.js";
import Bookings from "./pages/Bookings.js";
import Login from "./pages/user/src/Login.js";
import User from "./pages/User.js";
import PaymentSuccess from "./pages/confirmatio.jsx";



        

function App() {
  const [navItems,setNavItems]=useState([
    {name:"Search",path:"/",class:"pi pi-search"},
    {name:"Bookings",path:"/booking",class:"pi pi-heart"},
    {name:"User",path:"/user",class:"pi pi-user"},
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("authToken");
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);

  const delAuthKey = ()=>{
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return isLoggedIn ?(
    <Router>
      <div className="App">
        <Main navItems={navItems} logo={"MyFutsal"}></Main>
        <div>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/Court/:id" element={<Court/>} />
            <Route path="/Court" element={<Home/>} />
            <Route path="/booking" element={<Bookings/>} />
            <Route path="/user" element={<User logOut={delAuthKey}/>} />
            <Route path="/confirmation" element={<PaymentSuccess/>}/>
          </Routes>
        </div>
        <NoOpBox/>
        <footer>
        <p style={{
  display: 'flex',
  height: '20vh',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#333',
  color: 'orange',
}}>Copyright &copy; myfutsal.com</p>
        </footer>
      </div>
    </Router>
  ):<Login setIsLoggedIn={setIsLoggedIn}/>;
}

function NoOpBox(){
  return(
    <div style={{height:"15vh",width:"100%"}}></div>
  )
}

export default App;
