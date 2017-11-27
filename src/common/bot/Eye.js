'use strict';
const    Mathjs = require('mathjs');
const    Matter = require('matter-js');
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;
const    Query = require('matter-js').Query;
const    Vector = require('matter-js').Vector;

const Bot = require('./Bot');
const Plant = require('../world/Plant');
const Brain = require('../brains/Brain');

const VIEW_ANGLE =  Math.PI/12;
const VIEW_DEPTH = 90;

class Eye {

  constructor() {
    this.class = Eye;

  }

      create(physicsBody){

        this.body = physicsBody;

      }



      scan(bodies, startPoint, orientation){

        let outputs = { red:0, blue:0, green:0};

        let maxAngle = orientation + VIEW_ANGLE;
        let minAngle = orientation - VIEW_ANGLE;

        let maxVec = { x: VIEW_DEPTH * Mathjs.cos(maxAngle), y: VIEW_DEPTH * Mathjs.sin(maxAngle) };
        let midVec = { x: VIEW_DEPTH * Mathjs.cos(orientation), y: VIEW_DEPTH * Mathjs.sin(orientation) };

        let minVec = { x: VIEW_DEPTH * Mathjs.cos(minAngle), y: VIEW_DEPTH * Mathjs.sin(minAngle) };
        let collisions = Query.ray(bodies, startPoint, Vector.add(maxVec, startPoint));

          for (var i = 0; i < collisions.length; i++) {
            var collision = collisions[i];
            // if(collision.bodyA.gameObject.class == Plant){
            //   console.log('omg a fuking plant A');
            // }
            // if(collision.bodyB.gameObject.class == Plant){
            //   console.log('omg a fuking plant B');
            // }
            if(collision.bodyA.imAfukinSensor){continue;}
            var modifier =  (VIEW_DEPTH- Mathjs.distance([startPoint.x, startPoint.y],
              [collision.bodyA.position.x, collision.bodyA.position.y]))/VIEW_DEPTH;
              //modifier*=modifier;
            outputs.red  +=  (collision.bodyA.gameColor.red  * modifier);
            outputs.blue  +=  (collision.bodyA.gameColor.blue * modifier);
            outputs.green  +=  (collision.bodyA.gameColor.green * modifier);
          }

          collisions = Query.ray(bodies, startPoint, Vector.add(midVec, startPoint));
          for (var i = 0; i < collisions.length; i++) {
            var collision = collisions[i];
            // if(collision.bodyA.gameObject.class == Plant){
            //   console.log('omg a fuking plant A');
            // }
            // if(collision.bodyB.gameObject.class == Plant){
            //   console.log('omg a fuking plant B');
            // }
            if(collision.bodyA.imAfukinSensor){continue;}
            var modifier =  (VIEW_DEPTH- Mathjs.distance([startPoint.x, startPoint.y],
              [collision.bodyA.position.x, collision.bodyA.position.y]))/VIEW_DEPTH;
              // modifier*=modifier;
            outputs.red  +=  (collision.bodyA.gameColor.red  * modifier);
            outputs.blue  +=  (collision.bodyA.gameColor.blue * modifier);
            outputs.green  +=  (collision.bodyA.gameColor.green * modifier);
          }

          collisions = Query.ray(bodies, startPoint, Vector.add(minVec, startPoint));
          for (var i = 0; i < collisions.length; i++) {
            var collision = collisions[i];
            // if(collision.bodyA.gameObject.class == Plant){
            //   console.log('omg a fuking plant A');
            // }
            // if(collision.bodyB.gameObject.class == Plant){
            //   console.log('omg a fuking plant B');
            // }
            if(collision.bodyA.imAfukinSensor){continue;}
            var modifier =  (VIEW_DEPTH- Mathjs.distance([startPoint.x, startPoint.y],
              [collision.bodyA.position.x, collision.bodyA.position.y]))/VIEW_DEPTH;
            //  modifier*=modifier;
            outputs.red  +=  (collision.bodyA.gameColor.red* modifier);
            outputs.blue  +=  (collision.bodyA.gameColor.blue * modifier);
            outputs.green  +=  (collision.bodyA.gameColor.green * modifier);
          }
          return outputs;
      }
}


module.exports = Eye;
