'use strict';
const    Mathjs = require('mathjs');
const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');

const    Bot = require('./bot/Bot');
const    Plant = require('./world/Plant');
const    Meat = require('./world/Meat');
const    Wall = require('./world/Wall');

const STARTING_BOTS = 6;
const MIN_BOTS_PER_SPECIES = 3;
const MAX_BOTS = 28;
const SPECIES = 2;
const STARTING_PLANTS = 250;
const MIN_PLANTS = 150;
const WALLS_PER_SECTION = 20;
const SECTIONS = 3;
const WIDTH = 2300;
const HEIGHT = 2100;


class SimEngine {
  constructor() {
    this.width = WIDTH;
    this.height = HEIGHT;
  }

  init(){
    Matter.use(MatterWrap);
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

      for (let section = 0; section < SECTIONS; section++){
        let section_offset = (section * 6.28/SECTIONS);
        let half_width = (WIDTH/2);
        let half_height = (HEIGHT/2);
        let angle_incriment = 3.14/(WALLS_PER_SECTION*2);
        let radius_incriment = (half_width/ (WALLS_PER_SECTION*1.25));
        for (let i = 0; i < WALLS_PER_SECTION; i++){
          let rnd = (Math.random()-0.5) * 200;
          let radius = (radius_incriment * (i ) + rnd + 175);
          let angle = (i* angle_incriment + section_offset) + (Math.random()-0.5)/10;
              new Wall().create(engine.world, {
                x : Mathjs.round(Math.cos(angle) * radius) + half_width ,
                y : Mathjs.round(Math.sin(angle) * radius) + half_height
              });
        }
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

      for (let k=0;k<SPECIES;k++){
        for (let i = 0; i < STARTING_BOTS; i++ ){
          var b = new  Bot();
          b.create(engine.world, {
            x : (Math.random() -0.5) * WIDTH + WIDTH/2,
            y : (Math.random() - 0.5) * HEIGHT + HEIGHT/2
          });
          b.species = k;
        }
      }

      let oldest_brain = {brain: null, age: 0};


      let someone_needs_to_die = false;

      Matter.Events.on(engine, "beforeUpdate", function(e){
        let populationcount = new Array(SPECIES);
        let total_pop = 0;
          for (let k=0;k<SPECIES;k++){
            populationcount[k] = 0;
          }
        let plantCount = 0;

          for (var i = 0; i < engine.world.composites.length; i++) {
            let urmom = engine.world.composites[i];
            if(urmom.gameObject != null ){
              if( urmom.gameObject.class == Bot){

                urmom.gameObject.tick();
                if(urmom.gameObject.life <=0 || urmom.gameObject.age < 0 || (someone_needs_to_die && Math.random() > 0.99)){
                    new Meat(urmom.gameObject.brain.age).create(engine.world, urmom.gameObject.body.position);
                    urmom.gameObject = null;
                    Matter.Composite.remove(engine.world, urmom, true);
                    someone_needs_to_die = false;
                    continue;
                }

                populationcount[urmom.gameObject.species]++;
                total_pop++;
                }
                if ( urmom.gameObject.class == Plant){
                  plantCount++;
                  urmom.gameObject.tick();
                }
                if ( urmom.gameObject.class == Meat){
                  urmom.gameObject.tick();
                }
            }
          }

          someone_needs_to_die = (total_pop > MAX_BOTS);
          if(someone_needs_to_die){
            console.log('someone_needs_to_die');
          }
          if(plantCount < MIN_PLANTS && Math.random()<0.65){

            new Plant().create(engine.world, {
              x : Mathjs.pickRandom(horizontal_center_points),
              y : Mathjs.pickRandom(vertical_center_points)
              });
          }

          for (let k=0;k<SPECIES;k++){
            var botCount = populationcount[k];

            if(botCount < MIN_BOTS_PER_SPECIES && Math.random()>0.99){

              let child = new Bot( );
              child.species = k;
              child.create(engine.world, {
                x: WIDTH * 0.5 + (Math.random()-0.5) * WIDTH,
                y: HEIGHT * 0.5 + (Math.random()-0.5) * HEIGHT} );
              console.log("Spawned new: " + k);
            }


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
