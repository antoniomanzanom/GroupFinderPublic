import './App.css';
import { Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import Home from "./pages/Home/Home.jsx";
import Personajes from "./pages/Personajes/Personajes.jsx";
import GroupFinder from "./pages/GroupFinder/GroupFinder.jsx";
import GroupCreation from "./pages/GroupCreation/GroupCreation.jsx";
import LoginRegister from "./pages/LoginRegister/LoginRegister.jsx"
import NavBar from "./components/navbar/Navbar"
import Footer from "./components/footer/footer"
import Profile from "./pages/Profile/Profile.jsx"
import Verification from './pages/Verification/Verification';

function App() {
  const[ loggedIn, setLoggedIn ]= useState(false)
  const [page, setPage] = useState()
  const [footerOptions,setFooterOptions]=useState(true)

  useEffect(() => {
    if (window.localStorage.getItem('user_id')!=null){
      setLoggedIn(true)
    }
  }, [loggedIn])


  return (
    <>
      <NavBar {...{loggedIn,page,setFooterOptions}}/>
      <Switch>
        <Route exact path="/" render={()=><Home setLoggedIn={setLoggedIn} setPage={setPage}></Home>}></Route>
        <Route exact path="/characters" render={()=><Personajes setLoggedIn={setLoggedIn} setPage={setPage}></Personajes>}></Route>
        <Route exact path="/groupcreation" render={()=><GroupCreation setLoggedIn={setLoggedIn} setPage={setPage}></GroupCreation>}></Route>
        <Route exact path="/groupfinder" render={()=><GroupFinder setLoggedIn={setLoggedIn} setPage={setPage}></GroupFinder>}></Route>
        <Route exact path="/login-register" render={()=><LoginRegister setLoggedIn={setLoggedIn} setPage={setPage}></LoginRegister>} ></Route>
        <Route exact path="/profile" render={()=><Profile setLoggedIn={setLoggedIn} setPage={setPage}></Profile>}></Route>
        <Route exact path="/verification" render={()=><Verification setLoggedIn={setLoggedIn} setPage={setPage}></Verification>}></Route>
      </Switch>
      {footerOptions? <Footer/>:<></>}
      
    </>
  );
}

export default App;
