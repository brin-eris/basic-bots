'use strict';

const    Matter = require('matter-js');
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;


class Plant {

  static get_height(){
    return 50;
  }

  static get_width(){
    return 50;
  }

  constructor() {
    this.life = 1.0;
    this.class = Plant;
  }

      create(world, position){
        let plant = Matter.Composite.create({
          label: 'Plant'
        });

          this.body =  Bodies.rectangle(position.x, position.y, Plant.get_width(), Plant.get_height(), {
            friction: 0.5,
            frictionStatic: 0.1,
            isStatic: true,
            isSensor: true,
            render: {
              fillStyle: '#11DD11',
              strokeStyle: '#11DD11',
              lineWidth: 3
            }
          });

          this.body.gameColor = {red: 0.0, blue: 0.0, green: this.life}


          plant.gameObject = this;
          this.parentComposite = plant;
          Matter.Composite.addBody(plant, this.body);
          this.body.gameObject = this;
          this.world = world;
          World.add(world, plant);
      }

      tick(){
        this.life+= 0.0001;
        this.body.gameColor = {red: 0.0, blue: 0.0, green: this.life}
        this.body.render.fillStyle = this.rgbToHex(0,this.life * 255,0);
      }

      destroy(){
        Matter.Composite.remove(this.world, this.parentComposite, true);
        //console.log('deforestization');
      }

      componentToHex(c) {
        c = Math.floor(c);
        c = Math.min(Math.max(c,0),255);
        var hex = c.toString(16).substring(0,2);
        return hex.length == 1 ? "0" + hex : hex;
      }

      rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
      }


}


module.exports = Plant;
