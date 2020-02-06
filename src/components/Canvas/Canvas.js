import React, { Component } from "react";
import "./Canvas.css";
import "tachyons";
import TableComponent from "../Table/TableComponent";
import ImageGalleryComponent from "../ImageGallery/ImageGalleryComponent";
import Loader from "../Loader/Loader";

let clickX = [];
let clickY = [];
let clickDrag = [];
let paint;
let id = 0;
let rows = [];
const URL = "https://image-recognition-api.herokuapp.com";

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "",
      layers: [],
      predictions: [],
      layerImages: [],
      showResults: false,
      loading: false,
      showTableResults: false,
      showImageResults: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleOnSubmitImage = this.handleOnSubmitImage.bind(this);
    this.handleOnSubmitClear = this.handleOnSubmitClear.bind(this);
  }

  addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }

  redraw() {
    const canvas = this.refs.canvas;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = "black";
    context.lineJoin = "round";
    context.lineWidth = 10;

    for (var i = 0; i < clickX.length; i++) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
      } else {
        context.moveTo(clickX[i] - 1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.stroke();

      this.forceUpdate();
    }
  }

  handleMouseDown(e) {
    const canvas = this.refs.canvas;
    let mouseX = e.pageX - canvas.offsetLeft;
    let mouseY = e.pageY - canvas.offsetTop;

    paint = true;

    this.addClick(mouseX, mouseY);
    this.redraw();
  }

  handleMouseMove(e) {
    if (paint) {
      const canvas = this.refs.canvas;
      let mouseX = e.pageX - canvas.offsetLeft;
      let mouseY = e.pageY - canvas.offsetTop;

      this.addClick(mouseX, mouseY, true);
      this.redraw();
    }
  }

  handleMouseUp() {
    paint = false;
  }

  handleMouseLeave() {
    paint = false;
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    canvas.setAttribute("width", 150);
    canvas.setAttribute("height", 150);
    canvas.style.backgroundColor = "white"; //bio je white
    canvas.style.border = "2px solid";
    canvas.style.margin = "10px";
    canvas.style.marginLeft = "auto";
    canvas.style.marginRight = "auto";
    canvas.style.display = "block";
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const canvas2 = this.refs.canvasNetwork;
    canvas2.setAttribute("width", 150);
    canvas2.setAttribute("height", 150);
    canvas2.style.backgroundColor = "white"; //bio je white
    canvas2.style.border = "2px solid";
    canvas2.style.margin = "10px";
    canvas2.style.marginLeft = "auto";
    canvas2.style.marginRight = "auto";
    canvas2.style.display = "block";
    canvas2.style.display = "none";
    const context2 = canvas2.getContext("2d");
    context2.fillStyle = "white";
    context2.fillRect(0, 0, canvas2.width, canvas2.height);
  }

  handleOnSubmitImage() {
    this.setState({
      loading: true
    });

    const canvas = this.refs.canvas;
    const context = canvas.getContext("2d");

    //Put white background behind the image
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "white";
    context.fillRect(0, 0, 150, 150);

    //get destination canvas
    const destCanvas = this.refs.canvasNetwork;
    const destContext = destCanvas.getContext("2d");

    let image_Data = context.getImageData(0, 0, 150, 150);
    let data = image_Data.data;
    //invert color of image
    for (var i = 0; i < data.length; i += 4) {
      // red
      data[i] = 255 - data[i];
      // green
      data[i + 1] = 255 - data[i + 1];
      // blue
      data[i + 2] = 255 - data[i + 2];
    }

    // set original image on destination canvas and take the url from canvas
    destContext.putImageData(image_Data, 0, 0);
    const image = destCanvas.toDataURL("image/png");

    //save the drawn image in the state
    this.setState({
      image: image
    });
    //get all layer names
    this.getLayerNames(image);

    destContext.clearRect(0, 0, context.canvas.width, context.canvas.height);
    destContext.beginPath();

    //resize the image for CNN network
    let small_image = new Image();
    var imgWidth = 28 / 2;
    var imgHeight = 28 / 2;

    small_image.onload = () => {
      destContext.drawImage(
        small_image,
        destCanvas.width / 2 - imgWidth,
        destCanvas.height / 2 - imgHeight,
        28,
        28
      );
    };

    small_image.src = image;
  }

  getLayerNames(image) {
    fetch(URL + "/api/GetLayerNames", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Layers", data.results);
        this.setState({
          layers: data.results
        });
        //send image to network for prediction
        this.sendToNetwork(image);
      });
  }

  sendToNetwork(image) {
    console.log(
      "DATA SENT -> ",
      JSON.stringify({
        image: image
      })
    );
    fetch(URL + "/api/GetPrediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: image
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("DATA RECEIVED -> ", data);
        this.handleData(data);
        //Get first image from first layer after prediction
        this.getLayerImage(image);
        //get all layer images
        //this.getAllLayerImages(image);
      });
  }

  handleData(data) {
    for (let index = 0; index < 4; index++) {
      const element = data.results[index];
      rows.push(this.createData(element.key, element.value));
    }

    this.setState({
      predictions: rows
    });
  }

  createData(key, value) {
    id += 1;
    return {
      id,
      key,
      value
    };
  }

  getLayerImage(image) {
    fetch(URL + "/api/GetLayerImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        layer: [
          {
            layer: this.state.layers[0]
          }
          /*{ layer: this.state.layers[1] }*/
        ],
        image: image
      })
    })
      .then(response => response.json())
      .then(data => {
        //Prepare image array
        let img = [];
        for (let index = 0; index < data.images.length; index++) {
          const element = data.images[index];
          img.push({
            description: element.name,
            srcSet: "data:image/png;base64," + element.picture
          });
        }

        this.setState(
          {
            layerImages: img
          },
          () => {
            console.log("CALLBACK", this.state.layerImages);
            this.setState({
              showResults: true,
              loading: false
            });
          }
        );
        //this.setState({ showResults: true, loading: false });
      });
  }

  getAllLayerImages(image) {
    fetch(URL + "/api/GetAllLayerImages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: image
      })
    })
      .then(response => response.json())
      .then(data => {
        //Prepare image array
        let img = [];
        for (let index = 0; index < data.images.length; index++) {
          const element = data.images[index];
          img.push({
            description: element.name,
            srcSet: "data:image/png;base64," + element.picture
          });
        }
        this.setState(
          prevState => ({
            layerImages: [...prevState.layerImages, img]
          }),
          () => console.log(this.state.layerImages)
        );
        this.setState({
          showResults: true,
          showImageResults: true
        });
      });
  }

  getWeightImage() {
    fetch(URL + "/api/GetWeightImage", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.images);
      });
  }

  handleOnSubmitClear() {
    const canvas = this.refs.canvas;
    const context = canvas.getContext("2d");

    const destCanvas = this.refs.canvasNetwork;
    const destContext = destCanvas.getContext("2d");

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();

    destContext.clearRect(
      0,
      0,
      destContext.canvas.width,
      destContext.canvas.height
    );
    destContext.beginPath();

    clickX = [];
    clickY = [];
    clickDrag = [];
    rows = [];

    this.setState({
      image: "",
      layers: [],
      predictions: [],
      layerImages: [],
      showResults: false,
      loading: false
    });
  }

  render() {
    return (
      <div className="pb6">
        <h2>MNIST image recognition</h2>
        <h3>Please draw a number between 0 - 9</h3>
        <canvas
          ref="canvas"
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
        />
        <input
          type="submit"
          value="SUBMIT"
          onClick={this.handleOnSubmitImage}
          className="w4 pa4 mv4 mr3 f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black outline-0"
        />
        <input
          type="submit"
          value="CLEAR"
          onClick={this.handleOnSubmitClear}
          className="w4 pa4 mv4 ml3 f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black outline-0"
        />
        <canvas ref="canvasNetwork" />

        {this.state.showResults ? (
          <div className="pb6">
            <TableComponent rows={this.state.predictions} />
            <hr />
            <ImageGalleryComponent
              images={this.state.layerImages}
              layers={this.state.layers}
              drawnImage={this.state.image}
            />
          </div>
        ) : (
          <Loader loading={this.state.loading} />
        )}
      </div>
    );
  }
}

export default Canvas;
