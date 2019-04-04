'use strict';

const    Matter = require('matter-js');
const    World = require('matter-js').World;
const    Bodies = require('matter-js').Bodies;


class Meat {
  constructor(quantity) {
    this.life = quantity * .15;
    this.class = Meat;
  }

      create(world, position){
        let meat = Matter.Composite.create({
          label: 'Meat'
        });

          this.body =  Bodies.circle(position.x, position.y, 15, {
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


          this.body.gameColor = {red: 1.1, blue: 0.1, green: 0.1}

          meat.gameObject = this;
          this.parentComposite = meat;
          Matter.Composite.addBody(meat, this.body);
          this.body.gameObject = this;
          this.world = world;
          World.add(world, meat);
      }

      tick(){
        this.life-= 0.005;
        if(this.life < 0.0){
          this.destroy();
          return;
        }
        this.body.gameColor = {red: this.life, blue: 0.0, green: 0.0}
        this.body.render.fillStyle = this.rgbToHex(this.life * 255,0,0);

      }

      destroy(){
        Matter.Composite.remove(this.world, this.parentComposite, true);
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


module.exports = Meat;
