import React, { Component } from "react";
import "./TableComponent.css";

class TableComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <table className="table-fill">
          <thead>
            <tr>
              <th className="text-center">Number</th>
              <th className="text-center">Probability %</th>
            </tr>
          </thead>
          <tbody className="table-hover">
            {this.props.rows.map(row => {
              return (
                <tr key={row.id}>
                  <td className="text-center">{row.key}</td>
                  <td className="text-center">{row.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TableComponent;
