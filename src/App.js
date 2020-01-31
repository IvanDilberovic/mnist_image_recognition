import React, { Component } from "react";
import "./App.css";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import ParticleOptions from "../misc/ParticleOptions";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Particles className="particles" params={ParticleOptions} />
        <Footer />
      </div>
    );
  }
}

export default App;
