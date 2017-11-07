'use strict';
// module aliases
const    Engine = require('matter-js').Engine;
const    Render = require('matter-js').Render;
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;
const    Cppn = require('../common/Cppn');
const    Plotter = require('./Plotter');
const    BrainVat = require('../common/BrainVat');

document.addEventListener('DOMContentLoaded', function(e) {

  let urmom = new Cppn();
  urmom.dothing();
  // create an engine
  var engine = Engine.create();

  // create a renderer
  var render = Render.create({
      element: document.body,
      engine: engine
  });

  // create two boxes and a ground
  var boxA = Bodies.rectangle(400, 200, 80, 80);
  var boxB = Bodies.rectangle(450, 50, 80, 80);
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, ground]);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

});
