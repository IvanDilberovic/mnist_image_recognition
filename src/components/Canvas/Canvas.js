import React, { Component } from "react";
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Line, Text } from "react-konva";
import './Canvas.css'

class Canvas extends React.Component {
  state = {
    lines: []
  };

  handleMouseDown = () => {
    this._drawing = true;
    // add line
    this.setState({
      lines: [...this.state.lines, []]
    });
  };

  handleMouseMove = e => {
    // no drawing - skipping
    if (!this._drawing) {
      return;
    }
    const stage = this.stageRef.getStage();
    const point = stage.getPointerPosition();
    const { lines } = this.state;

    let lastLine = lines[lines.length - 1];
    // add point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    this.setState({
      lines: lines.concat()
    });
  };

  handleMouseUp = () => {
    this._drawing = false;
  };
  handleExportClick = () => {
    console.log(this.stageRef.getStage().toDataURL());
  };
  render() {
    return (
      <div className='mainCanvasDiv'> 
        <Stage
          id='canvasID'
          width={150}
          height={150}
          onContentMousedown={this.handleMouseDown}
          onContentMousemove={this.handleMouseMove}
          onContentMouseup={this.handleMouseUp}          
          ref={node => { this.stageRef = node; }}>
          <Layer>            
            {this.state.lines.map((line, i) => (
              <Line key={i} points={line} stroke="black" />
            ))}
          </Layer>
        </Stage>
        <button style={{ position: "absolute", top: "500" }} onClick={this.handleExportClick}>Send image to network</button>
      </div>
    );
  }
}

export default Canvas;