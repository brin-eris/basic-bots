'use strict';
const       ReactDOM = require('react-dom');
const          React = require('react');
const        Mathjs  = require('mathjs');
const   ClientEngine = require('./sim/ClientEngine');
const         MainUI = require('./app/MainUI');



const css = require('./css/app.css');

const Engine = new ClientEngine();

document.addEventListener('DOMContentLoaded', function(e) {

      Engine.init(document.getElementById('sim'));
      Engine.start();

      document.getElementById("save").addEventListener("click", function( event ) {
        ClientEngine.save_current_bot();
      }, false);

      document.getElementById("copy").addEventListener("click", function( event ) {
        Engine.copy_current_bot();
      }, false);
});
