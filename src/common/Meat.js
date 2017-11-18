'use strict';

const    Matter = require('matter-js');
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;


class Meat {
  constructor() {
    this.life = 1.0;
    this.class = Meat;
  }

      create(world, position){
        let plant = Matter.Composite.create({
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

          plant.gameObject = this;
          this.parentComposite = plant;
          Matter.Composite.addBody(plant, this.body);
          this.body.gameObject = this;
          this.world = world;
          World.add(world, plant);
      }

      destroy(){
        Matter.Composite.remove(this.world, this.parentComposite, true);
      }





}


module.exports = Meat;
