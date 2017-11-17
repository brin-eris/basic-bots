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

          this.body =  Bodies.rectangle(position.x, position.y, 40, 40, {
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

          this.body.blue = 0.0;
          this.body.red = 0.0;
          this.body.green = 1.0;

          plant.gameObject = this;
          this.parentComposite = plant;
          Matter.Composite.addBody(plant, this.body);
          this.body.gameObject = this;
          this.world = world;
          World.add(world, plant);
      }

      tick(){
        //console.log(this.life);
        if(this.life <= 0.0){
            Matter.Composite.remove(this.world, this.parentComposite, true);
            console.log('deforestization');
        }

      }

}


module.exports = Plant;
