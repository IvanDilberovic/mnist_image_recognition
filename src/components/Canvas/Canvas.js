import React, { Component } from "react";
import "./Canvas.css";
import "tachyons";

let clickX = [];
let clickY = [];
let clickDrag = [];
let paint;

class Canvas extends Component {
  constructor(props) {
    super(props);

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
    context.strokeStyle = "#000000";
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
      //this.setState({ key: Math.random() });
    }
  }

  handleMouseDown(e) {
    const canvas = this.refs.canvas;
    let mouseX = e.pageX - canvas.offsetLeft;
    let mouseY = e.pageY - canvas.offsetTop;

    paint = true;

    this.addClick(mouseX, mouseY);
    this.redraw();

    //console.log("Mouse is down", mouseX, mouseY, paint);
  }

  handleMouseMove(e) {
    if (paint) {
      const canvas = this.refs.canvas;
      let mouseX = e.pageX - canvas.offsetLeft;
      let mouseY = e.pageY - canvas.offsetTop;

      this.addClick(mouseX, mouseY, true);
      this.redraw();

      //console.log("Mouse is moving", mouseX, mouseY, paint);
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
    canvas.setAttribute("width", 200);
    canvas.setAttribute("height", 200);
    canvas.style.backgroundColor = "white"; //bio je white
    canvas.style.border = "2px solid";
    canvas.style.margin = "10px";
    canvas.style.marginLeft = "auto";
    canvas.style.marginRight = "auto";
    canvas.style.display = "block";
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  handleOnSubmitImage() {
    const canvas = this.refs.canvas;
    const image = canvas.toDataURL();

    console.log(image);
  }

  handleOnSubmitClear() {
    const canvas = this.refs.canvas;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    clickX = [];
    clickY = [];
    clickDrag = [];
  }

  render() {
    return (
      <div>
        <canvas
          ref="canvas"
          //key={this.state.key}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
        />
        <input
          type="submit"
          value="SUBMIT"
          onClick={this.handleOnSubmitImage}
        />
        <input type="submit" value="CLEAR" onClick={this.handleOnSubmitClear} />
      </div>
    );
  }
}

export default Canvas;
