'use strict';
const io = require('socket.io')(80);
const React = require('react');



class MainUI extends React.Component {
  constructor(props) {
    super(props);
  }

  renderBot(bot){
    return <BotViewer value={bot} />;
  }

  handleSelectionChange(e) {
      this.props.onSelectionChange(e.target.value);
    }
}

module.exports = MainUI;
