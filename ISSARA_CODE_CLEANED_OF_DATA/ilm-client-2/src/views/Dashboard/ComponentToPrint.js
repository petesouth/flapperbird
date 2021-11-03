import React from "react";


class ComponentToPrint extends React.Component {
    constructor(props) {
        super();
  
        this.state = {
          render: props.render
        }
  
    }
  
    render() {
      return (
        <div>{this.state.render()}</div>
      );
    }
  }
  
  export default (ComponentToPrint);