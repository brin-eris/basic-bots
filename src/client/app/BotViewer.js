'use strict';

const React = require('react');



class BotViewer extends React.Component {
  constructor(props) {
    super(props);
  }

    render(){
      return (
        <h2>{this.props.age}</h2>
      );
    }

}

module.exports = BotViewer;
