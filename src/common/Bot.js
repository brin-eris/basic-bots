'use strict';

const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');

const    Wall = require('./Wall');
const    Brain = require('./Brain');
const    Plant = require('./Plant');

const World = require('matter-js').World;
const Bodies = require('matter-js').Bodies;
const Body = require('matter-js').Body;
const Vertices = require('matter-js').Vertices;


class Bot {
  constructor() {
    this.class = Bot;
    this.brain = new Brain();
    this.life = 1.0;
  }

  create(world, position) {
    let group = Body.nextGroup(true);
    let radius = 10;
    let eyeRadius = 5;
    let offsetRadius = radius * 2 + eyeRadius;
    let eyeAOffset = Matter.Vector.create( offsetRadius * Math.cos(0.9), offsetRadius * Math.sin(0.7));
    let eyeBOffset = Matter.Vector.create( offsetRadius * Math.cos(0.9), - offsetRadius * Math.sin(0.7));
    let eyeCOffset = Matter.Vector.create( offsetRadius * 1.5, 0 );
    let smellRadius = radius * 5;

    let bot = Matter.Composite.create({
      label: 'Bot'
    });

    let body = Bodies.circle(position.x, position.y, radius, {
      collisionFilter: {
        group: group
      },
      density: 0.9,
      restitution: 0.1,
      friction: 0.9,
      frictionAir: 0.1,
      frictionStatic: 0.5
    });

    body.gameObject = this;
    body.onCollideActive = function(me, them){
        if(them.gameObject && them.gameObject.class==Plant){
            me.gameObject.eat(them.gameObject);
            // if(them.gameObject.life <= 0.0){
            //   Matter.Composite.remove(them.gameObject.world, them, true);
            //   console.log('deforestation is real');
            // }
          }
    };
    body.onCollide = function(me, them){
        if(them.gameObject && them.gameObject.class==Bot){
            // todo force based spike damage
            me.gameObject.life -= 0.001;
            them.gameObject.life -= 0.001;
            me.gameObject.brain.ouchie = 1.0;
        } else if(them.gameObject && them.gameObject.class==Plant){
              me.gameObject.eat(them.gameObject);
              // if(them.gameObject.life <= 0.0){
              //   Matter.Composite.remove(them.gameObject.world, them, true);
              //   //console.log('deforestation is real');
              // }
        } else if(them.gameObject && them.gameObject.class==Wall){
              me.gameObject.life -= 0.001;
        }
    };

    let smellSensor = Bodies.circle(position.x, position.y, smellRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        visible: false
      }
    });
    smellSensor.gameObject = this;
    smellSensor.onCollideActive = function(me, them){
        if(them.gameObject && them.gameObject.class==Plant){
              me.gameObject.brain.smellInput += 0.1;
        }
        if(them.gameObject && them.gameObject.class==Bot){
              me.gameObject.brain.smellInput += 0.1;
              if(me.gameObject.brain.give > 0.0){
                me.gameObject.give(them.gameObject);
              }
        }
    };


    let eyeA = Bodies.circle(position.x + eyeAOffset.x, position.y + eyeAOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true
    });
    eyeA.gameObject = this;
    eyeA.onCollideActive = function(me, them){
      me.gameObject.brain.eyeAInput.red += them.gameObject.body.red;
      me.gameObject.brain.eyeAInput.blue += them.gameObject.body.blue;
      me.gameObject.brain.eyeAInput.green += them.gameObject.body.green;
    };

    let eyeB = Bodies.circle(position.x + eyeBOffset.x, position.y + eyeBOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true
    });
    eyeB.gameObject = this;
    eyeB.onCollideActive = function(me, them){
      me.gameObject.brain.eyeBInput.red += them.gameObject.body.red;
      me.gameObject.brain.eyeBInput.blue += them.gameObject.body.blue;
      me.gameObject.brain.eyeBInput.green += them.gameObject.body.green;
    };

    let eyeC = Bodies.circle(position.x + eyeCOffset.x, position.y + eyeCOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true
    });
    eyeC.gameObject = this;
    eyeC.onCollideActive = function(me, them){
      me.gameObject.brain.eyeCInput.red += them.gameObject.body.red;
      me.gameObject.brain.eyeCInput.blue += them.gameObject.body.blue;
      me.gameObject.brain.eyeCInput.green += them.gameObject.body.green;
    };

    let shitA = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeAOffset,
      bodyA: eyeA,
      stiffness: 1,
      dampening:1
    });

    let shitB = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeBOffset,
      bodyA: eyeB,
      stiffness: 1,
      dampening:1
    });

    let shitC = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeCOffset,
      bodyA: eyeC,
      stiffness: 1,
      dampening:1
    });

    let shitD = Matter.Constraint.create({
      bodyB: body,
      pointB: Matter.Vector.create(0,0),
      bodyA: smellSensor,
      stiffness: 1,
      dampening:1
    });
    //let spike = Body.create({});

    Matter.Composite.addBody(bot, body);
    Matter.Composite.addBody(bot, eyeA);
    Matter.Composite.addBody(bot, eyeB);
    Matter.Composite.addBody(bot, eyeC);
    Matter.Composite.addBody(bot, smellSensor);
    Matter.Composite.addConstraint(bot, shitA);
    Matter.Composite.addConstraint(bot, shitB);
    Matter.Composite.addConstraint(bot, shitC);
    Matter.Composite.addConstraint(bot, shitD);

    this.body = body;

    bot.gameObject = this;
    this.parentComposite = bot;
    this.smellSensor = smellSensor;
    this.world = world;
    World.add(world, bot);
  }

  tick() {
    this.life -= 0.0001 * this.brain.age;
    this.brain.tick();

    

      let thrust = this.brain.thrust;
      let facing = this.body.angle;
      let turn = this.brain.turn + facing;
      let butt = Matter.Vector.create(-5 * Math.cos(facing) + this.body.position.x, -5 * Math.sin(facing) + this.body.position.y);
      Matter.Body.applyForce(this.body,
        butt,
        Matter.Vector.create(thrust * Math.cos(turn), thrust * Math.sin(turn)));

      if(this.life <=0){
          Matter.Composite.remove(this.world, this.parentComposite, true);
//          console.log('i dead');
      }

      this.body.red = this.brain.red;
      this.body.blue = this.brain.blue;
      this.body.green = this.brain.green;

      this.body.render.fillStyle = this.rgbToHex(this.brain.red, this.brain.green, this.brain.blue);

  }

  eat(food){
    this.life += 0.01;
    food.life -= 0.011;
    //console.log('nom' + food.class);
  }

  give(them){
    let toGive = this.brain.give * 0.01;
    this.life -=toGive;
    them.life +=toGive;
  }

  spawn(){
    let child = new Bot();
    //console.log('spawn');
    child.brain = this.brain.mutate();
    child.create(this.world, this.body.position);
  }

  componentToHex(c) {
    var hex = c.toString(16).substring(0,2);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
}


module.exports = Bot
