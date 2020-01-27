import React from "react";
import Tilt from "react-tilt";
import "./Logo.css";
import logo from "./Logo.png";

const Logo = () => {

  const pageReload = () => {    
      window.location.reload(); 
  }

  const imageClick = () => {
    console.log('Page reload');
    pageReload();
  } 
 
  return (    
      <div className="divLogo ma4 mt0 w5 link mw5 dt hide-child br2 cover bg-center" onClick={() => imageClick()}>
        <Tilt
          className="Tilt br2 shadow-2"
          options={{ max: 60 }}
          style={{ height: 170, width: 200 }}
        >
          <div className="Tilt-inner pa3">
          <img style={{ paddingTop: "5px" }} src={logo} alt="logo" />
          </div>
          <span className="white child pa3 mt5">Refresh the page</span>
        </Tilt>
      </div>   
  );
};

export default Logo;
