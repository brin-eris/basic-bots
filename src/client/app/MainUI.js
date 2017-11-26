'use strict';
const io = require('socket.io');
const React = require('react');
const BotViewer = require('./BotViewer');


class MainUI extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return <BotViewer  />;
  }

  renderBot(bot){
    return <BotViewer value={bot} />;
  }

  handleSelectionChange(e) {
      this.props.onSelectionChange(e.target.value);
    }
}

module.exports = MainUI;
