'use strict';

const Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');
const    MatterCollisionEvents = require('matter-collision-events');

Matter.use('matter-wrap', 'matter-attractors', 'matter-collision-events')


// module aliases
const    Engine = require('matter-js').Engine;
const    Render = require('matter-js').Render;
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;
const    Cppn = require('../common/Cppn');
const    Plotter = require('./Plotter');
const    BrainVat = require('../common/BrainVat');
const    Bot = require('../common/Bot');
const    Plant = require('../common/Plant');

const MAX_BOTS = 15;
const MAX_PLANTS = 50;


document.addEventListener('DOMContentLoaded', function(e) {


  var engine = Matter.Engine.create();

  // create a renderer
  var render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            showForce: true,
            showAngleIndicator: true,
            showCollisions: true,
            showVelocity: true
            //wireframes: false
        }
    });

    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;

    for (let i = 0; i < MAX_BOTS; i++ ){
      new  Bot().create(engine.world, {
        x : Math.random() * 600,
        y : Math.random() * 600
      });
    }

    for (let i = 0; i < MAX_PLANTS; i++){
      new Plant().create(engine.world, {
        x : Math.random() * 800,
        y : Math.random() * 800
        });
    }

    Matter.Events.on(engine, "beforeUpdate", function(e){

        for (var i = 0; i < engine.world.composites.length; i++) {
          let urmom = engine.world.composites[i];
          if(urmom.gameObject != null && urmom.gameObject.class == Bot){
            urmom.gameObject.tick();
          }
        }
    });

    Matter.Events.on(engine, "collisionStart", function(e){

    });

    var mouse = Matter.Mouse.create(render.canvas),
            mouseConstraint = Matter.MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        Matter.World.add(engine.world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;

        // fit the render viewport to the scene
        Matter.Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        });


  // wrapping using matter-wrap plugin
      var allBodies = Matter.Composite.allBodies(engine.world);

      for (var i = 0; i < allBodies.length; i += 1) {
          allBodies[i].plugin.wrap = {
              min: { x: render.bounds.min.x - 100, y: render.bounds.min.y },
              max: { x: render.bounds.max.x + 100, y: render.bounds.max.y }
          };
      }
      // run the engine
      Engine.run(engine);

  // run the renderer
    Matter.Render.run(render);
  // create runner
    // var runner = Matter.Runner.create();
    // Matter.Runner.run(runner, engine);

});
