'use strict';

const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');
const    MatterCollisionEvents = require('matter-collision-events');

Matter.use('matter-wrap', 'matter-attractors', 'matter-collision-events');

const    Wall = require('../common/Wall');
const    Cppn = require('../common/Cppn');
const    Plotter = require('./Plotter');
const    BrainVat = require('../common/BrainVat');
const    Bot = require('../common/Bot');
const    Plant = require('../common/Plant');

const MAX_BOTS = 50;
const MAX_PLANTS = 250;
const WALLS = 100;


document.addEventListener('DOMContentLoaded', function(e) {



  var engine = Matter.Engine.create();

  // create a renderer
  var render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 1800,
            height: 1600,
            // showForce: true,
            // showAngleIndicator: true,
            // showCollisions: true,
            // showVelocity: true,
            wireframes: false
        }
    });

    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;


    for (let i = 0; i < WALLS; i++){
        let  j = ((i+1 )% 3) -1 ;
        let  k = (i % 3) - 1;
        let  l = (i+2 % 3) - 1;
          new Wall().create(engine.world, {
            x :  Math.random() * j * i * 20  - Math.random() * 20 * i * k + Math.random() * i * l * 20 + 100,
            y : j * 20  + 20 * i * k + Math.random() * i * l * 20 + 100
          });
    }

    for (let i = 0; i < MAX_BOTS; i++ ){
      new  Bot().create(engine.world, {
        x : Math.random() * 1600,
        y : Math.random() * 1600
      });
    }

    for (let i = 0; i < MAX_PLANTS; i++){
      new Plant().create(engine.world, {
        x : Math.random() * 1500,
        y : Math.random() * 1500
        });
    }


    Matter.Events.on(engine, "beforeUpdate", function(e){
      let botCount = 0;
      let plantCount = 0;
      let oldestBot = null;
        for (var i = 0; i < engine.world.composites.length; i++) {
          let urmom = engine.world.composites[i];
          if(urmom.gameObject != null ){
          if( urmom.gameObject.class == Bot){
            urmom.gameObject.tick();
            botCount++;
            if(oldestBot == null || oldestBot.age < urmom.gameObject.age){
              oldestBot = urmom.gameObject;
            }
          }else if ( urmom.gameObject.class == Plant){
            urmom.gameObject.tick();
            plantCount++;
          }
          }
        }
        if(botCount < MAX_BOTS){
          oldestBot.spawn();
        }
        if(plantCount < MAX_PLANTS){
          new Plant().create(engine.world, {
            x : Math.random() * 1500,
            y : Math.random() * 1500
            });
        }
    });

    Matter.Events.on(engine, "collisionStart", function(e){
          for (var i = 0; i < e.pairs.length; i++) {
            let pair = e.pairs[i];
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;
            if(bodyA.onCollide){
              bodyA.onCollide(bodyA, bodyB);
            }
            if(bodyB.onCollide){
              bodyB.onCollide(bodyB, bodyA);
            }
          }
    });

    Matter.Events.on(engine, "collisionActive", function(e){
          for (var i = 0; i < e.pairs.length; i++) {
            let pair = e.pairs[i];
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;
            if(bodyA.onCollideActive){
              bodyA.onCollideActive(bodyA, bodyB);
            }
            if(bodyB.onCollideActive){
              bodyB.onCollideActive(bodyB, bodyA);
            }
          }
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

        // // fit the render viewport to the scene
        // Matter.Render.lookAt(render, {
        //     min: { x: 0, y: 0 },
        //     max: { x: 800, y: 600 }
        // });

            engine.world.bounds.min.x = 0;
            engine.world.bounds.min.y = 0;
            engine.world.bounds.max.x = 1800;
            engine.world.bounds.max.y = 1600;

  // wrapping using matter-wrap plugin
      var allBodies = Matter.Composite.allBodies(engine.world);

      for (var i = 0; i < allBodies.length; i++) {
          allBodies[i].plugin.wrap = {
              min: { x: engine.world.bounds.min.x, y: engine.world.bounds.min.y },
              max: { x: engine.world.bounds.max.x, y: engine.world.bounds.max.y }
          };
      }




      // run the engine
      Matter.Engine.run(engine);

  // run the renderer
    Matter.Render.run(render);
  // create runner
    // var runner = Matter.Runner.create();
    // Matter.Runner.run(runner, engine);

});
