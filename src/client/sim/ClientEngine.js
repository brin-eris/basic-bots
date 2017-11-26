'use-strict';
const    Mathjs = require('mathjs');
const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');
const    Events = require('matter-js').Events;
const    io = require('socket.io');



const SimEngine = require('../../common/SimEngine')

class ClientEngine extends SimEngine{
  constructor() {
      super();
    }
    init(rendererElement){
      super.init();

      this.rendererElement = rendererElement;

      this.render = Matter.Render.create({
            element: this.rendererElement,
            engine: this.physicsEngine,
            options: {
                width: this.width*1.1,
                height: this.height*1.1,
                // showForce: true,
                //  showAngleIndicator: true,
                //  showCollisions: true,
                // showVelocity: true,
                // showDebug: true,
                wireframes: false,
                 hasBounds: true
            }
        });

        this.mouse = Matter.Mouse.create(this.render.canvas);

        let mouseConstraint = Matter.MouseConstraint.create(this.physicsEngine, {
                mouse: this.mouse,
                    constraint: {
                        stiffness: 0.2,
                        render: {
                            visible: false
                        }
                    }
                });

                this.render.mouse = this.mouse;
                Matter.World.add(this.physicsEngine.world, mouseConstraint);

                Events.on(mouseConstraint, "mousedown", function(event){
                  let urmom = event;
                });
    }

    start(){

        super.start();

        Matter.Render.run(this.render);

    }



}

module.exports = ClientEngine;
