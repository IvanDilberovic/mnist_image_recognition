import React, { Component } from "react";
import Tilt from "react-tilt";
import Logo from "../Logo/Logo";
import Canvas from "../Canvas/Canvas";
import About from "../About/About";
import "./Navigation.css";
import mnist from "./mnist.jpeg";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      site: ""
    };
  }

  imageClickHome = () => {
    this.setState({ site: "draw" });
  };

  imageClickModelSummary = () => {
    this.setState({ site: "model" });
  };

  imageClickAbout = () => {
    this.setState({ site: "about" });
  };

  render() {
    let site = this.state.site;
    let component = "";

    if (site === "draw") {
      component = <Canvas />;
    } else if (site === "model") {
      component = <h1>Model summary</h1>;
    } else if (site === "about") {
      component = <About />;
    } else {
      component = (
        <div>
          <h1>Welcome to MNIST image recognition.</h1>
          <Tilt
            className="Tilt br2 shadow-2 center"
            options={{ max: 60 }}
            style={{ height: 200, width: 200 }}
          >
            <div className="Tilt-inner">
              <img src={mnist} alt="logo" />
            </div>
          </Tilt>
          <h4>Click on the "Draw" button to start using the application.</h4>
        </div>
      );
    }

    return (
      <div>
        <div className="pa2 ma2 flex items-start">
          <Logo />
          <div onClick={() => this.imageClickHome()}>
            <Tilt
              className="Tilt br2 shadow-2 mr2 pointer"
              style={{ width: 150, height: 50 }}
            >
              <div className="Tilt-inner pa3">
                <span>Draw</span>
              </div>
            </Tilt>
          </div>
          <div onClick={() => this.imageClickModelSummary()}>
            <Tilt
              className="Tilt br2 shadow-2 mr2 pointer"
              style={{ width: 150, height: 50 }}
            >
              <div className="Tilt-inner pa3">
                <span>Model summary</span>
              </div>
            </Tilt>
          </div>
          <div onClick={() => this.imageClickAbout()}>
            <Tilt
              className="Tilt br2 shadow-2 mr2 pointer"
              style={{ width: 150, height: 50 }}
            >
              <div className="Tilt-inner pa3">
                <span>About</span>
              </div>
            </Tilt>
          </div>
        </div>
        {component}
      </div>
    );
  }
}

export default Navigation;
