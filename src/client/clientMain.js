'use strict';
const       ReactDOM = require('react-dom');
const          React = require('react');
const        Mathjs  = require('mathjs');
const   ClientEngine = require('./sim/ClientEngine');
const         MainUI = require('./app/MainUI');



const css = require('./css/app.css');

const Engine = new ClientEngine();

document.addEventListener('DOMContentLoaded', function(e) {


  ReactDOM.render(
    <MainUI />,
    document.getElementById('ui')
  );


});

document.addEventListener('DOMContentLoaded', function(e) {

    Engine.init(document.getElementById('sim'));
    Engine.start();

    // context for MatterTools.Demo
  // return {
  //   engine: engine,
  //   runner: runner,
  //   render: render,
  //   canvas: render.canvas,
  //   stop: function() {
  //     Matter.Render.stop(render);
  //     Matter.Runner.stop(runner);
  //   }
});
