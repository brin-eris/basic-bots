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
        let plant = Matter.Composite.create({
          label: 'Plant'
        });

          this.body =  Bodies.rectangle(position.x, position.y, 30, 30, {
            friction: 0.5,
            frictionStatic: 0.1,
            isStatic: true,
            isSensor: true,
            render: {
              fillStyle: '#00FF00',
              strokeStyle: '#00FF00',
              lineWidth: 3
            }
          });

          this.blue = 0.1;
          this.red = 0.1;
          this.green = 0.9;

          plant.gameObject = this;
          this.parentComposite = plant;
          Matter.Composite.addBody(plant, this.body);
          this.body.gameObject = this;
          this.world = world;
          World.add(world, plant);
      }

      destroy(){
        Matter.Composite.remove(this.world, this.parentComposite, true);
        console.log('deforestization');
      }





}


module.exports = Plant;
