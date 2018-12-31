import React from "react";
import ImageGallery from "react-image-gallery";
import { ClimbingBoxLoader } from "react-spinners";
import "react-image-gallery/styles/css/image-gallery.css";

class ImageGalleryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: [],
      images: [],
      drawnImage: "",
      loading: false
    };
    this.handleCustomRightNavClick = this.handleCustomRightNavClick.bind(this);
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

  getLayerImage(image, layer, onClick) {
    fetch("http://localhost:5000/api/GetLayerImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        layer: layer.layer,
        slika: image
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState(
          prevState => ({
            images: [
              ...prevState.images,
              {
                description: data.images[0].name,
                srcSet: "data:image/png;base64," + data.images[0].picture
              }
            ]
          }),
          () => onClick()
        );
        //Update the loaded layer image property
        const found = this.state.layers.find(element => {
          return element === layer;
        });

        let layers = [...this.state.layers];
        let index = layers.indexOf(found);
        let item = { ...layers[index] };
        item.loaded = true;
        layers[index] = item;
        //set the state to our new copy
        this.setState({ layers: layers });

        this.setState({ loading: false });
      });
  }

  myRenderRightNav = (onClick, disabled) => {
    return (
      <button
        type="button"
        className="image-gallery-right-nav"
        disabled={disabled}
        onClick={() => this.handleCustomRightNavClick(onClick)}
        aria-label="Next Slide"
      />
    );
  };

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

    this.setState({ layers: layers });
    //save image array
    this.setState({ images: this.props.images });
    //save drawn image
    this.setState({ drawnImage: this.props.drawnImage });
  }

  render() {
    return (
      <div style={{ width: 800, margin: "auto" }}>
        {this.state.loading ? (
          <ClimbingBoxLoader
            sizeUnit={"px"}
            size={30}
            color={"#ffffff"}
            loading={this.state.loading}
          />
        ) : (
          <ImageGallery
            ref={i => (this._imageGallery = i)}
            items={this.state.images}
            infinite={false}
            showThumbnails={false}
            renderRightNav={this.myRenderRightNav}
          />
        )}
      </div>
    );
  }
}

export default ImageGalleryComponent;
