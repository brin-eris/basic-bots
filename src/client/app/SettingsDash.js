'use strict';

const React = require('react');



class SettingsDash extends React.Component {
  constructor(props) {
    super(props);
  }

    render(){
      return (
        <h2>{this.props.value}</h2>
      );
    }

}

module.exports = SettingsDash;
