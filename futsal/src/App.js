import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./components/nav/main.js";
import Home from "./pages/home.js";

function App() {
  const [navItems,setNavItems]=useState([
    {name:"Home",path:"/"},
    {name:"Court",path:"/court"},
    {name:"Activity",path:"/activity"},
    {name:"Community",path:"/community"},
  ]);

  return (
    <Router>
      <div className="App">
        <Main navItems={navItems} logo={"MyFutsal"}></Main>
        <div>
          <Routes>
            <Route path="/" element={<Home/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
