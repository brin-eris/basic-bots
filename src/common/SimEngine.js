'use strict';
const    Mathjs = require('mathjs');
const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');

const    Bot = require('./bot/Bot');
const    Plant = require('./world/Plant');
const    Meat = require('./world/Meat');
const    Wall = require('./world/Wall');

const STARTING_BOTS = 15;
const MIN_BOTS = 5;
const MAX_BOTS = 30;
const STARTING_PLANTS = 350;
const MIN_PLANTS = 350;
const WALLS = 120;

const WIDTH = 2500;
const HEIGHT = 2000;

// soak the brains in here to get juicy
class SimEngine {
  constructor() {
    this.width = WIDTH;
    this.height = HEIGHT;
  }

  init(){
    this.physicsEngine = Matter.Engine.create({constraintIterations: 100});
    let engine = this.physicsEngine;
    engine.world.bounds.min.x = 100;
    engine.world.bounds.min.y = 100;
    engine.world.bounds.max.x = WIDTH;
    engine.world.bounds.max.y = HEIGHT;


      engine.world.gravity.y = 0;
      engine.world.gravity.x = 0;

  }

  start(){
    let engine = this.physicsEngine;

      for (let i = 0; i < WALLS; i++){
            new Wall().create(engine.world, {
              x : Mathjs.round(Math.cos(i*3.14/60) * 500 )+WIDTH/2 ,
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

      Matter.Engine.run(engine);

  }
}


module.exports = SimEngine;
