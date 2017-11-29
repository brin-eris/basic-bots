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

const VIEW_ANGLE =  Math.PI/8;
const VIEW_DEPTH = 500;

class Eye {

  constructor() {
    this.class = Eye;

  }


      scan(bodies, startPoint, orientation){

        let outputs = { red:0, blue:0, green:0};

        let maxAngle = orientation + VIEW_ANGLE;
        let minAngle = orientation - VIEW_ANGLE;

        let maxVec = { x: VIEW_DEPTH * Mathjs.cos(maxAngle), y: VIEW_DEPTH * Mathjs.sin(maxAngle) };
        let midVec = { x: VIEW_DEPTH * Mathjs.cos(orientation), y: VIEW_DEPTH * Mathjs.sin(orientation) };
        let minVec = { x: VIEW_DEPTH * Mathjs.cos(minAngle), y: VIEW_DEPTH * Mathjs.sin(minAngle) };

        let collisions = Query.ray(bodies, startPoint, Vector.add(maxVec, startPoint));
        //let physical_object_count = 0;

        for (var i = 0; i < collisions.length; i++) {
            var collision = collisions[i];

            if(collision.bodyA.imAfukinSensor){continue;}

        //    physical_object_count++;

            var modifier =  this.calc_distance_modifier(startPoint, collision.bodyA.position);///physical_object_count;
              //modifier*=modifier;
            outputs.red  +=  (collision.bodyA.gameColor.red  * modifier);
            outputs.blue  +=  (collision.bodyA.gameColor.blue * modifier);
            outputs.green  +=  (collision.bodyA.gameColor.green * modifier);
        }


        collisions = Query.ray(bodies, startPoint, Vector.add(midVec, startPoint));
        //physical_object_count = 0;
        for (var i = 0; i < collisions.length; i++) {
        var collision = collisions[i];

        if(collision.bodyA.imAfukinSensor){continue;}

            //physical_object_count++;
            var modifier =  this.calc_distance_modifier(startPoint, collision.bodyA.position);///physical_object_count;
              // modifier*=modifier;
            outputs.red  +=  (collision.bodyA.gameColor.red  * modifier);
            outputs.blue  +=  (collision.bodyA.gameColor.blue * modifier);
            outputs.green  +=  (collision.bodyA.gameColor.green * modifier);
        }

        collisions = Query.ray(bodies, startPoint, Vector.add(minVec, startPoint));
        //physical_object_count = 0;
        for (var i = 0; i < collisions.length; i++) {
            var collision = collisions[i];

            if(collision.bodyA.imAfukinSensor){continue;}

        //    physical_object_count++;

            var modifier =  this.calc_distance_modifier(startPoint, collision.bodyA.position);///physical_object_count;
            //  modifier*=modifier;
            outputs.red  +=  (collision.bodyA.gameColor.red* modifier);
            outputs.blue  +=  (collision.bodyA.gameColor.blue * modifier);
            outputs.green  +=  (collision.bodyA.gameColor.green * modifier);
        }
        return outputs;
      }

      calc_distance_modifier(startPoint, endpoint){
        let distance = Mathjs.distance([startPoint.x, startPoint.y],
          [endpoint.x, endpoint.y]);
          // want a value from 1 to 0, where 0 is max and 1 is min
          // that shrinks exponentially as distance grows linearly
          //(note anything 0<x<1 will be greater than one, is desired)
        var modifier = -1 * Mathjs.log((distance/VIEW_DEPTH), VIEW_DEPTH);
          // divide by number of ray traces
          return modifier;///3;
      }
}


module.exports = Eye;
