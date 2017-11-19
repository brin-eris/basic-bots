'use strict';

const    Matter = require('matter-js');
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;


class Meat {
  constructor(quantity) {
    this.life = quantity * .01;
    this.class = Meat;
  }

      create(world, position){
        let meat = Matter.Composite.create({
          label: 'Meat'
        });

          this.body =  Bodies.circle(position.x, position.y, 10, {
            friction: 0.5,
            frictionStatic: 0.1,
            isStatic: true,
            isSensor: true,
            render: {
              fillStyle: '#FF1111',
              strokeStyle: '#FF1111',
              lineWidth: 3
            }
          });

          this.blue = 0.1;
          this.red = 1.1;
          this.green = 0.1;

          meat.gameObject = this;
          this.parentComposite = meat;
          Matter.Composite.addBody(meat, this.body);
          this.body.gameObject = this;
          this.world = world;
          World.add(world, meat);
      }

      destroy(){
        Matter.Composite.remove(this.world, this.parentComposite, true);
      }

}


module.exports = Meat;
