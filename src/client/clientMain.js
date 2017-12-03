'use strict';
const       ReactDOM = require('react-dom');
const          React = require('react');
const        Mathjs  = require('mathjs');
const   ClientEngine = require('./sim/ClientEngine');
const         MainUI = require('./app/MainUI');



const css = require('./css/app.css');

const Engine = new ClientEngine();

document.addEventListener('DOMContentLoaded', function(e) {


  var wut = ReactDOM.render(
    <MainUI />,
    document.getElementById('ui')
  );


      Engine.init(document.getElementById('sim'));
      Engine.start();
      ClientEngine.up_date_ui_fool = function(bot){
        wut.renderBot(bot);
      }

});
