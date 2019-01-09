import React, { Component } from "react";
import "./Loader.css";

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: this.props.loading });
  }

  render() {
    return this.props.loading ? (
      <div>
        <div className="loader">
          <div className="inner one" />
          <div className="inner two" />
          <div className="inner three" />
          <h4>Loading....</h4>
        </div>
      </div>
    ) : null;
  }
}

export default Loader;
