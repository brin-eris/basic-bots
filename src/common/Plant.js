'use strict';

const    Matter = require('matter-js');
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;


class Plant {
  constructor() {
    this.life = 1.0;
    this.class = Plant;
  }

      create(world, position){
        var particleOptions = {
                friction: 0.05,
                frictionStatic: 0.1,
                render: { visible: true }
            };

          this.body =  Bodies.rectangle(position.x, position.y, 30, 30, {
            friction: 0.5,
            frictionStatic: 0.1,
            isStatic: true
          });

          this.body.onCollideActive = function(me, them){
            if(me.gameObject.life <=0.0){
              Matter.Body.remove(this.world, this.body);
            }
          }

          this.body.gameObject = this;
          this.world = world;
          World.add(world, this.body);

      }

}


module.exports = Plant;
