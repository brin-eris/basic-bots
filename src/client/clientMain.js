'use strict';
const     Mathjs  = require('mathjs');
const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');
const    MatterCollisionEvents = require('matter-collision-events');

Matter.use('matter-wrap', 'matter-attractors', 'matter-collision-events');



const    Bot = require('../common/bot/Bot');
const    Plant = require('../common/world/Plant');
const    Meat = require('../common/world/Meat');
const    Wall = require('../common/world/Wall');

const STARTING_BOTS = 5;
const MIN_BOTS = 5;
const MAX_BOTS = 30;
const STARTING_PLANTS = 800;
const MIN_PLANTS = 200;
const WALLS = 120;

const WIDTH = 2100;
const HEIGHT = 1800;

document.addEventListener('DOMContentLoaded', function(e) {



  var engine = Matter.Engine.create({constraintIterations: 100});
  engine.world.bounds.min.x = 0;
  engine.world.bounds.min.y = 0;
  engine.world.bounds.max.x = WIDTH;
  engine.world.bounds.max.y = HEIGHT;

  // create a renderer
  var render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: WIDTH*1.1,
            height: HEIGHT*1.1,
            // showForce: true,
            //  showAngleIndicator: true,
            //  showCollisions: true,
            // showVelocity: true,
            // showDebug: true,
            wireframes: false
            // hasBounds: true
        }
    });

    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;


    for (let i = 0; i < WALLS; i++){
        //  let  j = i % 60 ;
        // let  k = (i % 3) - 1;
        // let  l = (i+2 % 3) - 1;
          new Wall().create(engine.world, {
            x : Mathjs.round(Math.cos(i*3.14/60) * 500 )+WIDTH/2 +1  ,
            y : Mathjs.round(Math.sin(i*3.14/60)* 500 )+HEIGHT/2
          });
    }

    for (let i = 0; i < STARTING_BOTS; i++ ){
      new  Bot().create(engine.world, {
        x : (Math.random() -0.5) * WIDTH + WIDTH/2,
        y : (Math.random() - 0.5) * HEIGHT + HEIGHT/2
      });
    }

    for (let i = 0; i < STARTING_PLANTS; i++){
      var angle = Math.random() * 2 * Math.PI;
      new Plant().create(engine.world, {
        x : (Math.cos(angle)*(Math.random()+0.25) * WIDTH/2)+ WIDTH/2,// * 45 + WIDTH/2 +20,
        y : (Math.sin(angle)*(Math.random()+0.15) * HEIGHT/2)+ HEIGHT/2 // * 45 + HEIGHT/2 +20
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
              if(urmom.gameObject.life <=0){
                  new Meat(urmom.gameObject.maxLife).create(engine.world, urmom.gameObject.body.position);
                  urmom.gameObject = null;
                  Matter.Composite.remove(engine.world, urmom, true);
                  continue;
              }
              botCount++;
                if(oldestBot == null || oldestBot.age < urmom.gameObject.age){
                  oldestBot = urmom.gameObject;
                }
              }else if ( urmom.gameObject.class == Plant){
                plantCount++;
              }
          }
        }
        if(botCount < MIN_BOTS){
          if(Math.random() < 0.01){
          oldestBot.spawn({x:WIDTH/2 +Math.random()*500, y:HEIGHT/2 +Math.random()*500});
          }
        if(Math.random() <0.01){
          new Bot().create(engine.world,{x:WIDTH/2 +Math.random()*500, y:HEIGHT/2 +Math.random()*500} );
        }

        }else if(botCount > MAX_BOTS){
          oldestBot.life = -1;
        }
        if(plantCount < MIN_PLANTS){
          plantCount++;
          new Plant().create(engine.world, {
            x : Mathjs.round((Math.random() -0.5) * WIDTH/50) * 45 + WIDTH/2 +20,
            y : Mathjs.round((Math.random() - 0.5) * HEIGHT/50) * 45 + HEIGHT/2 +20
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



  // wrapping using matter-wrap plugin
      // var allBodies = Matter.Composite.allBodies(engine.world);
      //
      // for (var i = 0; i < allBodies.length; i++) {
      //     allBodies[i].plugin.wrap = {
      //         min: { x: engine.world.bounds.min.x -100, y: engine.world.bounds.min.y -100},
      //         max: { x: engine.world.bounds.max.x +100, y: engine.world.bounds.max.y +100 }
      //     };
      // }




      // run the engine
      Matter.Engine.run(engine);

  // run the renderer
    Matter.Render.run(render);
  // create runner
    // var runner = Matter.Runner.create();
    // Matter.Runner.run(runner, engine);

});
