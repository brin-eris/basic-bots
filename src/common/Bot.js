'use strict';

const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');

const    Wall = require('./Wall');
const    Brain = require('./Brain');
const    Plant = require('./Plant');
const    Meat = require('./Meat');

const Vector = require('matter-js').Vector;
const World = require('matter-js').World;
const Bodies = require('matter-js').Bodies;
const Body = require('matter-js').Body;

const Mathjs = require('mathjs');

class Bot {
  constructor() {
    this.kills = 0.0;
    this.class = Bot;
    this.brain = new Brain();
    this.life = 1.0;
    this.maxLife = 2.0;
  }

  create(world, position) {
    let group = Body.nextGroup(true);
    this.gestationTimer = 0;
    let radius = 10;
    this.radius = radius;
    let eyeRadius = 5;
    let offsetRadius = radius * 2 + eyeRadius;
    let offsetLayer2Radius = offsetRadius * 2;

    let eyeAOffset = Vector.create( offsetRadius * Math.cos(0.7), offsetRadius * Math.sin(0.7));
    let eyeA2AOffset = Vector.create( offsetLayer2Radius * Math.cos(0.5), offsetLayer2Radius * Math.sin(0.5));
    let eyeA2BOffset = Vector.create( offsetLayer2Radius * Math.cos(0.9), offsetLayer2Radius * Math.sin(0.9));

    let eyeBOffset = Vector.create( offsetRadius * Math.cos(-0.7),  offsetRadius * Math.sin(-0.7));
    let eyeB2AOffset = Vector.create( offsetLayer2Radius * Math.cos(-0.5),  offsetLayer2Radius * Math.sin(-0.5));
    let eyeB2BOffset = Vector.create( offsetLayer2Radius * Math.cos(-0.9),  offsetLayer2Radius * Math.sin(-0.9));


    let eyeCOffset = Vector.create( offsetRadius * 1.3, 0 );
    let eyeC2AOffset = Vector.create( offsetLayer2Radius  ,  offsetLayer2Radius * Math.sin(-0.5));
    let eyeC2BOffset = Vector.create( offsetLayer2Radius , offsetLayer2Radius * Math.sin(0.5));
    let eyeC3AOffset = Vector.create( offsetLayer2Radius * 1.3,0);


    let soundRadius = radius * 5;

    let bot = Matter.Composite.create({
      label: 'Bot'
    });

    let body = Bodies.circle(position.x, position.y, radius, {
      collisionFilter: {
        group: group
      },
      density: 0.5,
      restitution: 0.1,
      friction: 0.9,
      frictionAir: 0.1,
      frictionStatic: 0.5
    });

    body.gameObject = this;
    body.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      if(them.gameObject){
        if(them.gameObject.class==Plant){
          if(me.gameObject.life <= me.gameObject.maxLife){
            me.gameObject.eat(them.gameObject);
          }
          }else if(them.gameObject.class==Wall){
                me.gameObject.life -= 0.001;
                  me.gameObject.brain.ouchie += 0.5;
          }else if(them.gameObject.class==Meat){
            // only the blood thirsty eat meat
            if(me.gameObject.kills > 0){
              console.log('fresh meat!')
              this.gestationTimer-=50;
                me.gameObject.eat(them.gameObject) ;
            }
          }
      }

    };
    body.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
        if(them.gameObject && them.gameObject.class==Bot){
          if(me.gameObject.brain.spike > 0.0){
              let myMomentum = Vector.mult(me.velocity, 1.0);
              let theirMomentum = Vector.mult(them.velocity, 1.0);
              let relativeMomentum = Vector.sub(myMomentum, theirMomentum);

              let damage = (0.01 * me.gameObject.brain.spike * Vector.magnitude(relativeMomentum));
              them.gameObject.life -= damage;
              if(them.gameObject.life <= 0.0){
                // i killed yah biatch
                me.gameObject.kills++
                me.gameObject.maxLife++;
              }
          }
        } else if(them.gameObject && them.gameObject.class==Plant){
              if(me.gameObject.life <=me.gameObject.maxLife){
                  me.gameObject.eat(them.gameObject);
              }
          } else if(them.gameObject && them.gameObject.class==Wall){
                me.gameObject.life -= 0.1;
                me.gameObject.brain.ouchie += 0.5;
        } else if(them.gameObject.class==Meat){
          // only the blood thirsty eat meat
            if(me.gameObject.kills > 0){
              console.log('fresh meat!')
              this.gestationTimer-=50;
              me.gameObject.eat(them.gameObject) ;
          }
        }
    };

    let soundSensor = Bodies.circle(position.x, position.y, soundRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        visible: false
      }
    });
    soundSensor.gameObject = this;
    soundSensor.imAfukinSensor = true;
    soundSensor.onCollideActive = function(me, them){
if(them.imAfukinSensor){return;}
        if(them.gameObject && them.gameObject.class==Bot){
              me.gameObject.brain.soundInput += them.motion ;
              if(me.gameObject.brain.give > 0.0){
                me.gameObject.give(them.gameObject);
              }
        }
    };


    let eyeA = Bodies.circle(position.x + eyeAOffset.x, position.y + eyeAOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeA.gameObject = this;
    eyeA.imAfukinSensor = true;
    eyeA.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += them.gameObject.red;
      me.gameObject.brain.eyeAInput.blue += them.gameObject.blue;
      me.gameObject.brain.eyeAInput.green += them.gameObject.green;
    };

    let eyeA2A = Bodies.circle(position.x + eyeA2AOffset.x, position.y + eyeA2AOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeA2A.gameObject = this;
    eyeA2A.imAfukinSensor = true;
    eyeA2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += (them.gameObject.red);
      me.gameObject.brain.eyeAInput.blue += them.gameObject.blue;
      me.gameObject.brain.eyeAInput.green += them.gameObject.green;
    };
    let eyeA2B = Bodies.circle(position.x + eyeA2BOffset.x, position.y + eyeA2BOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeA2B.gameObject = this;
    eyeA2B.imAfukinSensor = true;
    eyeA2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += them.gameObject.red;
      me.gameObject.brain.eyeAInput.blue += them.gameObject.blue;
      me.gameObject.brain.eyeAInput.green += them.gameObject.green;
    };

    let eyeB = Bodies.circle(position.x + eyeBOffset.x, position.y + eyeBOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeB.gameObject = this;
    eyeB.imAfukinSensor = true;
    eyeB.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += them.gameObject.red;
      me.gameObject.brain.eyeBInput.blue += them.gameObject.blue;
      me.gameObject.brain.eyeBInput.green += them.gameObject.green;
    };
    let eyeB2A = Bodies.circle(position.x + eyeB2AOffset.x, position.y + eyeB2AOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeB2A.gameObject = this;
    eyeB2A.imAfukinSensor = true;
    eyeB2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += them.gameObject.red;
      me.gameObject.brain.eyeBInput.blue += them.gameObject.blue;
      me.gameObject.brain.eyeBInput.green += them.gameObject.green;
    };
    let eyeB2B = Bodies.circle(position.x + eyeB2BOffset.x, position.y + eyeB2BOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeB2B.gameObject = this;
    eyeB2B.imAfukinSensor = true;
    eyeB2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += them.gameObject.red;
      me.gameObject.brain.eyeBInput.blue += them.gameObject.blue;
      me.gameObject.brain.eyeBInput.green += them.gameObject.green;
    };

    let eyeC = Bodies.circle(position.x + eyeCOffset.x, position.y + eyeCOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeC.gameObject = this;
    eyeC.imAfukinSensor = true;
    eyeC.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeCInput.red += them.gameObject.red;
      me.gameObject.brain.eyeCInput.blue += them.gameObject.blue;
      me.gameObject.brain.eyeCInput.green += them.gameObject.green;
    };
    let eyeC2A = Bodies.circle(position.x + eyeC2AOffset.x, position.y + eyeC2AOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeC2A.gameObject = this;
    eyeC2A.imAfukinSensor = true;
    eyeC2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeCInput.red += (them.gameObject.red);
      me.gameObject.brain.eyeCInput.blue += (them.gameObject.blue);
      me.gameObject.brain.eyeCInput.green += (them.gameObject.green);
    };
    let eyeC2B = Bodies.circle(position.x + eyeC2BOffset.x, position.y + eyeC2BOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeC2B.gameObject = this;
    eyeC2B.imAfukinSensor = true;
    eyeC2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeCInput.red += (them.gameObject.red);
      me.gameObject.brain.eyeCInput.blue += (them.gameObject.blue);
      me.gameObject.brain.eyeCInput.green += (them.gameObject.green);
    };
    let eyeC3A = Bodies.circle(position.x + eyeC3AOffset.x, position.y + eyeC3AOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeC3A.gameObject = this;
    eyeC3A.imAfukinSensor = true;
    eyeC3A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeCInput.red += them.gameObject.red;
      me.gameObject.brain.eyeCInput.blue += them.gameObject.blue;
      me.gameObject.brain.eyeCInput.green += them.gameObject.green;
    };

    let shitA = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeAOffset,
      bodyA: eyeA,
      stiffness: 1
    });
    let shitA2A = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeA2AOffset,
      bodyA: eyeA2A,
      stiffness: 1
    });
    let shitA2B = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeA2BOffset,
      bodyA: eyeA2B,
      stiffness: 1
    });

    let shitB = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeBOffset,
      bodyA: eyeB,
      stiffness: 1
    });
    let shitB2A = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeB2AOffset,
      bodyA: eyeB2A,
      stiffness: 1
    });
    let shitB2B = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeB2BOffset,
      bodyA: eyeB2B,
      stiffness: 1
    });

    let shitC = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeCOffset,
      bodyA: eyeC,
      stiffness: 1
    });

    let shitC2A = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeC2AOffset,
      bodyA: eyeC2A,
      stiffness: 1
    });
    let shitC2B = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeC2BOffset,
      bodyA: eyeC2B,
      stiffness: 1
    });

    let shitC3A = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeC3AOffset,
      bodyA: eyeC3A,
      stiffness: 1
    });

    let shitD = Matter.Constraint.create({
      bodyB: body,
      pointB: Vector.create(0,0),
      bodyA: soundSensor,
      stiffness: 1
    });
    //let spike = Body.create({});

    Matter.Composite.addBody(bot, body);
    Matter.Composite.addBody(bot, eyeA);
    //Matter.Composite.addBody(bot, eyeA2A);
    //Matter.Composite.addBody(bot, eyeA2B);
    Matter.Composite.addBody(bot, eyeB);
    //Matter.Composite.addBody(bot, eyeB2A);
    //Matter.Composite.addBody(bot, eyeB2B);
    Matter.Composite.addBody(bot, eyeC);
    Matter.Composite.addBody(bot, eyeC2A);
    Matter.Composite.addBody(bot, eyeC2B);
    Matter.Composite.addBody(bot, eyeC3A);
    Matter.Composite.addBody(bot, soundSensor);
    Matter.Composite.addConstraint(bot, shitA);
    //Matter.Composite.addConstraint(bot, shitA2A);
    //Matter.Composite.addConstraint(bot, shitA2B);
    Matter.Composite.addConstraint(bot, shitB);
    //Matter.Composite.addConstraint(bot, shitB2A);
    //Matter.Composite.addConstraint(bot, shitB2B);
    Matter.Composite.addConstraint(bot, shitC);
    Matter.Composite.addConstraint(bot, shitC2A);
    Matter.Composite.addConstraint(bot, shitC2B);
    Matter.Composite.addConstraint(bot, shitC3A);
    Matter.Composite.addConstraint(bot, shitD);

    this.body = body;

    bot.gameObject = this;
    this.parentComposite = bot;
    this.soundSensor = soundSensor;
    this.world = world;
    World.add(world, bot);
  }

  tick() {


    this.brain.heat = Math.abs(Mathjs.distance([ this.body.position.x, this.body.position.y], [ this.world.bounds.max.x/2, this.world.bounds.max.y/2]));
    this.brain.life = this.life;
    this.brain.tick();



      let thrust = this.brain.thrust;
      let facing = this.body.angle;
      let turn = this.brain.turn + facing;
      let position = Vector.clone(this.body.position);
      let butt = Vector.create(- this.radius * Math.cos(facing) + position.x, -this.radius * Math.sin(facing) + position.y);
      Matter.Body.applyForce(this.body,
        butt,
        Vector.create(thrust * Math.cos(turn), thrust * Math.sin(turn)));


      this.age = this.brain.age;
      this.life -= (0.00005 * this.age + this.brain.heat * 0.000003 );



      this.red = this.brain.red;
      this.blue = this.brain.blue;
      this.green = this.brain.green;

      this.body.render.fillStyle = this.rgbToHex(this.brain.red * 255, this.brain.green * 255, this.brain.blue * 255);
      if(this.age > 50 && this.life > 0.6){
        if(this.gestationTimer <= 0){
          this.spawn();
          this.life *= 0.7;
          console.log('natural birth');
          this.gestationTimer = 400;
        }
        this.gestationTimer--;
      }
  }

  eat(food){
    this.life += 0.004;
    food.life -= 0.005;
    if(food.life <0.0){ food.destroy()}

    //console.log('nom' + food.class);
  }

  give(them){
    let toGive = this.brain.give * 0.01;
    this.life -=toGive;
    them.life +=toGive;
  }

  spawn(){
    let child = new Bot();
    child.kills = this.kills;
    child.brain = this.brain.mutate();
    child.create(this.world, Vector.create(this.body.position.x +10, this.body.position.y +10));
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
