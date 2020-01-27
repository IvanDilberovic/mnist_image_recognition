import React,{ Component  } from "react";
import Tilt from "react-tilt";
import Logo from "../Logo/Logo";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      site: ""
    };
  }

  imageClickHome = () => {
    console.log('Home');        
  } 

  imageClickModelSummary = () => {
    console.log('Model summary'); 
  }

  imageClickAbout = () => {
    console.log('About');  
  }

render(){
  return (
    <div className="pa2 ma2 flex items-start">
        <Logo></Logo>
        <div onClick={() => this.imageClickHome()}>
          <Tilt className="Tilt br2 shadow-2 mr2 pointer" style={{ width :150, height:50 }}>
            <div className="Tilt-inner pa3">
              <span>Home</span>
            </div>
          </Tilt>
        </div>
        <div onClick={() => this.imageClickModelSummary()}>
          <Tilt className="Tilt br2 shadow-2 mr2 pointer" style={{ width :150, height:50 }}>
            <div className="Tilt-inner pa3">
              <span>Model summary</span>
            </div>
          </Tilt>
        </div>
        <div onClick={() => this.imageClickAbout()}>
          <Tilt className="Tilt br2 shadow-2 mr2 pointer" style={{ width :150, height:50 }}>
            <div className="Tilt-inner pa3">
              <span>About</span>
            </div>
          </Tilt>
        </div>
    </div>
  )
}

}

export default Navigation;

