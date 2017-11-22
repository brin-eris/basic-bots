'use strict';

const    Matter = require('matter-js');
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;


class Wall {
  constructor() {
    this.class = Wall;
  }

      create(world, position){


          this.body =  Bodies.rectangle(position.x, position.y, 14, 14, {
            friction: 0.5,
            frictionStatic: 0.1,
            isStatic: true,
            render: {
              fillStyle: '#0000FF',
              strokeStyle: '#0000FF',
              lineWidth: 3
            }
          });

          this.body.gameColor = {red: 0.2, blue: 1.0, green: 0.0}


          // this.body.onCollideActive = function(me, them){
          //
          // }

          this.body.gameObject = this;
          this.world = world;
          World.add(world, this.body);
      }
}


module.exports = Wall;
