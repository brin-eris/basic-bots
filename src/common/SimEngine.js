'use strict';
const    Mathjs = require('mathjs');
const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');

const    Bot = require('./bot/Bot');
const    Plant = require('./world/Plant');
const    Meat = require('./world/Meat');
const    Wall = require('./world/Wall');

const STARTING_BOTS = 5;
const MIN_BOTS = 5;
const MAX_BOTS = 30;
const STARTING_PLANTS = 350;
const MIN_PLANTS = 250;
const WALLS = 0;//120;

const WIDTH = 2100;
const HEIGHT = 1800;

// soak the brains in here to get juicy
class SimEngine {
  constructor() {
    this.width = WIDTH;
    this.height = HEIGHT;
  }

  init(){
    this.physicsEngine = Matter.Engine.create({constraintIterations: 100});
    let engine = this.physicsEngine;
    engine.world.bounds.min.x = 0;
    engine.world.bounds.min.y = 0;
    engine.world.bounds.max.x = WIDTH;
    engine.world.bounds.max.y = HEIGHT;


      engine.world.gravity.y = 0;
      engine.world.gravity.x = 0;

  }

  start(){
    let engine = this.physicsEngine;

      // for (let i = 0; i < WALLS; i++){
      //       new Wall().create(engine.world, {
      //         x : Mathjs.round(Math.cos(i*3.14/60) * 500 )+WIDTH/2 ,
      //         y : Mathjs.round(Math.sin(i*3.14/60)* 500 )+HEIGHT/2
      //       });
      // }
      // for (let i = 0; i <= HEIGHT; i++){
      //   new Wall().create(engine.world, {
      //           x : WIDTH,
      //           y : i
      //         });
      //   new Wall().create(engine.world, {
      //                 x : 0,
      //                 y : i
      //     });
      // }
      // for (let i = 0; i <= WIDTH; i++){
      //   new Wall().create(engine.world, {
      //           x : i,
      //           y : 0
      //         });
      //   new Wall().create(engine.world, {
      //                 x : i,
      //                 y : HEIGHT
      //     });
      //   }

      for (let i = 0; i < STARTING_BOTS; i++ ){
        new  Bot().create(engine.world, {
          x : (Math.random() -0.5) * WIDTH + WIDTH/2,
          y : (Math.random() - 0.5) * HEIGHT + HEIGHT/2
        });
      }

      let spacer = 2;

      let food_cell_width = 2 * spacer + Plant.get_width();
      let food_cell_height = 2 * spacer + Plant.get_height();

      let horizontal_center_points = this.horizontal_center_points = Array(Math.floor(WIDTH/food_cell_width));
      let vertical_center_points = this.vertical_center_points = Array(Math.floor(HEIGHT/food_cell_height));

      for (let i = 0; i < horizontal_center_points.length; i++){
        horizontal_center_points[i] = i * food_cell_width + 0.5 * food_cell_width;
      }

      for (let i = 0; i < vertical_center_points.length; i++){
        vertical_center_points[i] = i * food_cell_height + 0.5 * food_cell_height;
      }

      for (let i = 0; i < STARTING_PLANTS; i++){

        new Plant().create(engine.world, {
          x : Mathjs.pickRandom(horizontal_center_points),
          y : Mathjs.pickRandom(vertical_center_points)
          });
      }


      Matter.Events.on(engine, "beforeUpdate", function(e){
        let botCount = 0;
        let plantCount = 0;
        let oldest_brain = {brain: null, age: 0};
        let second_oldest_brain = {brain: null, age: 0};;
          for (var i = 0; i < engine.world.composites.length; i++) {
            let urmom = engine.world.composites[i];
            if(urmom.gameObject != null ){
              if( urmom.gameObject.class == Bot){
                urmom.gameObject.tick();
                if(urmom.gameObject.life <=0 || urmom.gameObject.age < 0){
                    new Meat(urmom.gameObject.maxLife).create(engine.world, urmom.gameObject.body.position);
                    urmom.gameObject = null;
                    Matter.Composite.remove(engine.world, urmom, true);
                    continue;
                }
                botCount++;
                  if( oldest_brain.age < urmom.gameObject.age){
                    second_oldest_brain = oldest_brain;
                    oldest_brain = {brain: urmom.gameObject.brain, age: urmom.gameObject.age };
                  }
                }else if ( urmom.gameObject.class == Plant){
                  plantCount++;
                }
            }
          }
          if(botCount < MIN_BOTS && Math.random()>0.999){

            let child = new Bot( );
            if(oldest_brain.age > 0 && second_oldest_brain.age > 0){
              if( Math.random() < 0.75) {
                child.brain = oldest_brain.brain.mutate();

              } else if( Math.random() < 0.75){
                child.brain = second_oldest_brain.brain.mutate();
              }
            }
            child.create(engine.world, {x: WIDTH/2 +Math.random()*500, y:HEIGHT/2 +Math.random()*500} );

          } else if(botCount > MAX_BOTS){
            oldest_brain.brain.age = -100000;
          }



          if(plantCount < MIN_PLANTS){
            plantCount++;
            new Plant().create(engine.world, {
              x : Mathjs.randomInt(50) * 20,
              y : Mathjs.randomInt(50) * 20
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
