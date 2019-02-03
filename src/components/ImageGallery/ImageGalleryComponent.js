import React from "react";
//import ImageGallery from "react-image-gallery";
import "./ImageGalleryComponent.css";
import Loader from "../Loader/Loader";
import "react-image-gallery/styles/css/image-gallery.css";

const URL = "https://imagerecognitionapi.azurewebsites.net";

class ImageGalleryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: [],
      images: [],
      drawnImage: "",
      srcSet: "",
      description: "",
      loading: false
    };
    this.handleNavLeft = this.handleNavLeft.bind(this);
    this.handleNavRight = this.handleNavRight.bind(this);
  }

  handleCustomRightNavClick(onClick) {
    //let idx = this._imageGallery.getCurrentIndex();
    this.setState({ loading: true });
    const found = this.state.layers.find(element => {
      return element.loaded === false;
    });

    if (typeof found !== "undefined") {
      this.getLayerImage(this.state.drawnImage, found, onClick);
    }
  }

  getLayerImage(image, layer) {
    this.setState({ loading: true });
    fetch(URL + "/api/GetLayerImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        layer: [{ layer: layer }],
        image: image
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState(prevState => ({
          images: [
            ...prevState.images,
            {
              description: data.images[0].name,
              srcSet: "data:image/png;base64," + data.images[0].picture
            }
          ]
        }));
        //Update the loaded layer image property
        const found = this.state.layers.find(element => {
          return element.layer === layer;
        });

        let layers = [...this.state.layers];
        let index = layers.indexOf(found);
        let item = { ...layers[index] };
        item.loaded = true;
        layers[index] = item;

        //set the state to our new copy
        this.setState({
          layers: layers,
          srcSet: "data:image/png;base64," + data.images[0].picture,
          description: data.images[0].name,
          loading: false
        });
      });
  }

  componentDidMount() {
    //Handle layer names
    let layers = [];
    for (let index = 0; index < this.props.layers.length; index++) {
      const element = this.props.layers[index];
      //First layer image is already loaded so everything else is put to false except the first image
      if (index !== 0) {
        layers.push({ loaded: false, layer: element });
      } else {
        layers.push({ loaded: true, layer: element });
      }
    }

    this.setState({
      layers: layers,
      images: this.props.images,
      drawnImage: this.props.drawnImage,
      srcSet: this.props.images[0].srcSet,
      description: this.props.images[0].description
    });
  }

  handleNavRight = param => e => {
    console.log("RIGHT", param);
    let layers = [...this.state.layers];
    const found = layers.find(element => {
      return element.layer === param.split(".")[0];
    });
    let index = layers.indexOf(found);
    index++;
    if (index >= layers.length) {
      console.log("Index is grater or equal then the length of array.");
      return;
    }

    let item = { ...layers[index] };

    if (item.loaded) {
      let images = [...this.state.images];

      const found = images.find(element => {
        return element.description.split(".")[0] === item.layer;
      });

      this.setState({ srcSet: found.srcSet, description: found.description });
    } else {
      this.getLayerImage(this.state.drawnImage, item.layer);
    }
  };

  handleNavLeft = param => e => {
    console.log("LEFT", param);
    let layers = [...this.state.layers];
    const found = layers.find(element => {
      return element.layer === param.split(".")[0];
    });
    let index = layers.indexOf(found);
    index--;
    if (index < 0) {
      console.log("Index is lower then zero");
      return;
    }
    let item = { ...layers[index] };

    if (item.loaded) {
      let images = [...this.state.images];

      const found = images.find(element => {
        return element.description.split(".")[0] === item.layer;
      });

      this.setState({ srcSet: found.srcSet, description: found.description });
    }
  };

  render() {
    return (
      <div className="slideshow-container">
        <div>
          <div className="mySlides fade">
            <div className="text">{this.state.description}</div>
            <img src={this.state.srcSet} style={{ width: "100%" }} alt="" />
          </div>
          <button
            className="prev"
            onClick={this.handleNavLeft(this.state.description)}
          >
            &#10094;
          </button>
          <button
            className="next"
            onClick={this.handleNavRight(this.state.description)}
          >
            &#10095;
          </button>
        </div>
        <Loader loading={this.state.loading} />
      </div>
    );
  }
}

export default ImageGalleryComponent;
