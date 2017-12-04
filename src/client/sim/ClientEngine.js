'use-strict';
const    Mathjs = require('mathjs');
const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');
const    Events = require('matter-js').Events;
const    io = require('socket.io-client')('http://localhost:3000/');

const  Bot = require('../../common/bot/Bot');
const SimEngine = require('../../common/SimEngine')

const selection_holder = {selected: new Bot() };

class ClientEngine extends SimEngine{
  constructor() {
      super();
    }

static save_current_bot(){

  io.emit('save_bot',JSON.stringify( selection_holder.selected.brain));
}

 copy_current_bot(){
let brain = selection_holder.selected.brain;
 let dude = new  Bot();
 dude.brain = brain;
 dude.create(this.physicsEngine.world, {
  x : (Math.random() -0.5) * 150 + selection_holder.selected.body.position.x+50,
  y : (Math.random() - 0.5) * 150 + selection_holder.selected.body.position.y+50
});
}

static set_selected_bot(value){
  selection_holder.selected = value;
}

static get_selected_bot(){
  return selection_holder.selected;
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

                  var bot = ClientEngine.get_selected_bot();
                  if(bot!=null){
                    bot.is_ui_selected = false;
                    ClientEngine.set_selected_bot(null);

                  }

                  if(this.gameObject!=null && this.gameObject.class == Bot){

                    this.gameObject.is_ui_selected = true;
                    ClientEngine.set_selected_bot(this.gameObject);
                  }else if(this.body!=null && this.body.gameObject!=null && this.body.gameObject.class == Bot) {

                    this.body.gameObject.is_ui_selected = true;
                    ClientEngine.set_selected_bot(this.body.gameObject);
                  }

                });
    }

    start(){

        super.start();

        Matter.Render.run(this.render);

    }



}

module.exports = ClientEngine;
