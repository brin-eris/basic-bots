'use strict';

const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');

const    Wall = require('../world/Wall');
const    Plant = require('../world/Plant');
const    Meat = require('../world/Meat');
const    Brain = require('../brains/Brain');
const    Dumber = require('../brains/Dumber');
const    DeltaBrain = require('../brains/DeltaBrain');

const    Eye = require('./Eye');

const Vector = require('matter-js').Vector;
const World = require('matter-js').World;
const Bodies = require('matter-js').Bodies;
const Body = require('matter-js').Body;
const Composite = require('matter-js').Composite;

const Mathjs = require('mathjs');
const COLLISION_DAMAGE = 0.005
const SPIKE_DAMAGE = 0.01;
const AGE_DAMAGE = 0.00001;
const HEAT_DAMAGE = 0.003;
const OVEREAT_PENALTY = 0.005;
const BOOST_COST = 0.0008;
const GESTATION_TIMER = 100;


class Bot {
  constructor() {
    this.kills = 0.0;
    this.class = Bot;
    this.brain = new Dumber();
    this.life = 1.0;
    this.maxLife = 1.0;
    this.heat = 0.0;
    this.gluttony = 0.0;
  }

  create(world, position) {

    this.scanner = new Eye();

    this.centerOfUniverse = {x: world.bounds.max.x/2, y: world.bounds.max.y/2};
    this.phantomZone = ( Mathjs.distance([
      0,
      0],
    [ this.centerOfUniverse.x,
      this.centerOfUniverse.y]));


    let group = Body.nextGroup(true);
    this.gestationTimer = GESTATION_TIMER;
    let radius = 10;
    this.radius = radius;
    let eyeRadius = 5;
    let offsetRadius = radius * 1.5 + eyeRadius;
    let offsetLayer2Radius = offsetRadius * 2;

    let eyeAOffset = Vector.create( offsetRadius * Math.cos(0.9), offsetRadius * Math.sin(0.9));
    let eyeA2AOffset = Vector.create( offsetLayer2Radius * Math.cos(2.1), offsetLayer2Radius * Math.sin(2.1));
    let eyeA2BOffset = Vector.create( offsetLayer2Radius * Math.cos(1.6), offsetLayer2Radius * Math.sin(1.6));

    let eyeBOffset = Vector.create( offsetRadius * Math.cos(-0.9),  offsetRadius * Math.sin(-0.9));
    let eyeB2AOffset = Vector.create( offsetLayer2Radius * Math.cos(-2.1),  offsetLayer2Radius * Math.sin(-2.1));
    let eyeB2BOffset = Vector.create( offsetLayer2Radius * Math.cos(-1.6),  offsetLayer2Radius * Math.sin(-1.6));


    let eyeCOffset = Vector.create( offsetRadius * 1.5, 0 );
    let eyeC2AOffset = Vector.create( offsetLayer2Radius  ,  offsetLayer2Radius * Math.sin(-0.5));
    let eyeC2BOffset = Vector.create( offsetLayer2Radius , offsetLayer2Radius * Math.sin(0.5));
    let eyeC3AOffset = Vector.create( offsetLayer2Radius * 1.5,0);


    let soundRadius = offsetLayer2Radius *3;

    let bot = Matter.Composite.create({
      label: 'Bot'
    });

    let body = Bodies.circle(position.x, position.y, radius, {
      collisionFilter: {
        group: group
      },
      density: 0.09,
      restitution: 0.1,
      friction:0.1,
      frictionAir:2.5,
      frictionStatic:0.01

    });

    body.gameObject = this;
    body.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      if(them.gameObject){
        me.gameObject.brain.bodyInput.red += (them.gameColor.red);
        me.gameObject.brain.bodyInput.blue += (them.gameColor.blue);
        me.gameObject.brain.bodyInput.green += (them.gameColor.green);

        if( them.gameObject.class==Bot){

        }
        if(them.gameObject.class==Plant){
//          if(me.speed < 100){
            me.gameObject.eat(them.gameObject);
  //        }


          }else if(them.gameObject.class==Wall){
            let myMomentum = Vector.mult(me.velocity, 1.0);
            let theirMomentum = Vector.mult(them.velocity, 1.0);
            let relativeMomentum = Vector.sub(myMomentum, theirMomentum);

            let damage = (COLLISION_DAMAGE * Math.abs(Vector.magnitude(relativeMomentum)));
              me.gameObject.life -= damage;
              me.gameObject.brain.ouchie += 0.5;
          }else if(them.gameObject.class==Meat){
            me.gameObject.brain.smellMeat = 1.0;
            // only the blood thirsty eat meat
            if(me.gameObject.brain.hawk > 0){
              //console.log('fresh meat!')
              this.gestationTimer-=5;
              me.gameObject.eat(them.gameObject);
              me.gameObject.eat(them.gameObject);

            }
          }
      }

    };
    body.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
        if(them.gameObject && them.gameObject.class==Bot){
          if(them.gameObject.brain.spike > 0.0){
              let myMomentum = Vector.mult(me.velocity, 1.0);
              let theirMomentum = Vector.mult(them.velocity, 1.0);
              let relativeMomentum = Vector.sub(myMomentum, theirMomentum);

              let baseDamage = (COLLISION_DAMAGE  * Math.abs(Vector.magnitude(relativeMomentum)));
              me.gameObject.life -= baseDamage + ((1 + them.gameObject.brain.spike) * SPIKE_DAMAGE);
              me.gameObject.brain.ouchie += 0.5;
              them.gameObject.life -= baseDamage ;
              them.gameObject.brain.ouchie += 0.5;

              if(me.gameObject.life <= 0.0){
                // tell my wife i loved her
                them.gameObject.kills++
                them.gameObject.maxLife++;
              }
          }
        } else if(them.gameObject && them.gameObject.class==Plant){

                  me.gameObject.eat(them.gameObject);

          } else if(them.gameObject && them.gameObject.class==Wall){
            let myMomentum = Vector.mult(me.velocity, 1.0);
            let theirMomentum = Vector.mult(them.velocity, 1.0);
            let relativeMomentum = Vector.sub(myMomentum, theirMomentum);

            let damage = (COLLISION_DAMAGE * Math.abs(Vector.magnitude(relativeMomentum)));
              me.gameObject.life -= damage;
              me.gameObject.brain.ouchie += 0.5;
        } else if(them.gameObject.class==Meat){
          me.gameObject.brain.smellMeat += 0.5;
          // only the blood thirsty eat meat
            if(me.gameObject.brain.hawk > 0){
              //console.log('fresh meat!')
              this.gestationTimer-=5;
              me.gameObject.eat(them.gameObject) ;
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
      if(them.gameObject){
        if(them.gameObject.class==Bot){

              me.gameObject.brain.soundInput += 0.1*them.gameObject.voice ;

              //console.log(them.gameObject.voice);
              if(me.gameObject.brain.give > 0.0 ){
                me.gameObject.give(them.gameObject);
              }
        }else if(them.gameObject.class==Meat){
          me.gameObject.brain.smellMeat += 0.1;
            // only the blood thirsty eat meat
            // if(me.gameObject.brain.hawk > 0){
            //   //console.log('fresh meat!')
            //   this.gestationTimer-=5;
            //   me.gameObject.eat(them.gameObject);
            //   me.gameObject.eat(them.gameObject);
            //
            // }
        }

      }
    };


    let eyeA = Bodies.circle(position.x + eyeAOffset.x, position.y + eyeAOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeA.gameObject = this;
    eyeA.imAfukinSensor = false;
    eyeA.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeAInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeAInput.green += (them.gameColor.green*0.1);
    };
    eyeA.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeAInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeAInput.green += (them.gameColor.green*0.1);
    };
    this.eyeA = eyeA;


    let eyeA2A = Bodies.circle(position.x + eyeA2AOffset.x, position.y + eyeA2AOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeA2A.gameObject = this;
    eyeA2A.imAfukinSensor = false;
    eyeA2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeAInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeAInput.green += (them.gameColor.green*0.1);
    };
    eyeA2A.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeAInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeAInput.green += (them.gameColor.green*0.1);
    };
    this.eyeA2A = eyeA2A;

    let eyeA2B = Bodies.circle(position.x + eyeA2BOffset.x, position.y + eyeA2BOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeA2B.gameObject = this;
    eyeA2B.imAfukinSensor = false;
    eyeA2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeAInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeAInput.green += (them.gameColor.green*0.1);
    };
    eyeA2B.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeAInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeAInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeAInput.green += (them.gameColor.green*0.1);
    };

    this.eyeA2B = eyeA2B;


    let eyeB = Bodies.circle(position.x + eyeBOffset.x, position.y + eyeBOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeB.gameObject = this;
    eyeB.imAfukinSensor = false;
    eyeB.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeBInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeBInput.green += (them.gameColor.green*0.1);
    };
    eyeB.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeBInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeBInput.green += (them.gameColor.green*0.1);
    };
    this.eyeB = eyeB;

    let eyeB2A = Bodies.circle(position.x + eyeB2AOffset.x, position.y + eyeB2AOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeB2A.gameObject = this;
    eyeB2A.imAfukinSensor = false;
    eyeB2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeBInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeBInput.green += (them.gameColor.green*0.1);
    };
    eyeB2A.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeBInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeBInput.green += (them.gameColor.green*0.1);
    };
    this.eyeB2A = eyeB2A;


    let eyeB2B = Bodies.circle(position.x + eyeB2BOffset.x, position.y + eyeB2BOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeB2B.gameObject = this;
    eyeB2B.imAfukinSensor = false;
    eyeB2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeBInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeBInput.green += (them.gameColor.green*0.1);
    };
    eyeB2B.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeBInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeBInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeBInput.green += (them.gameColor.green*0.1);
    };
    this.eyeB2B = eyeB2B;


    let eyeC = Bodies.circle(position.x + eyeCOffset.x, position.y + eyeCOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeC.gameObject = this;
    eyeC.imAfukinSensor = false;
    eyeC.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeCInput.red += (them.gameColor.red*0.8);
      me.gameObject.brain.eyeCInput.blue += (them.gameColor.blue*0.8);
      me.gameObject.brain.eyeCInput.green += (them.gameColor.green*0.8);
    };
    eyeC.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeCInput.red += (them.gameColor.red*0.8);
      me.gameObject.brain.eyeCInput.blue += (them.gameColor.blue*0.8);
      me.gameObject.brain.eyeCInput.green += (them.gameColor.green*0.8);
    };
    this.eyeC = eyeC;

    let eyeC2A = Bodies.circle(position.x + eyeC2AOffset.x, position.y + eyeC2AOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeC2A.gameObject = this;
    eyeC2A.imAfukinSensor = false;
    eyeC2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeC2AInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeC2AInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeC2AInput.green += (them.gameColor.green*0.1);
    };
    eyeC2A.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeC2AInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeC2AInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeC2AInput.green += (them.gameColor.green*0.1);
    };
    this.eyeC2A = eyeC2A;

    let eyeC2B = Bodies.circle(position.x + eyeC2BOffset.x, position.y + eyeC2BOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeC2B.gameObject = this;
    eyeC2B.imAfukinSensor = false;
    eyeC2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeC2BInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeC2BInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeC2BInput.green += (them.gameColor.green*0.1);
    };
    eyeC2B.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeC2BInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeC2BInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeC2BInput.green += (them.gameColor.green*0.1);
    };
    this.eyeC2B = eyeC2B;


    let eyeC3A = Bodies.circle(position.x + eyeC3AOffset.x, position.y + eyeC3AOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    eyeC3A.gameObject = this;
    eyeC3A.imAfukinSensor = false;
    eyeC3A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeC3AInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeC3AInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeC3AInput.green += (them.gameColor.green*0.1);
    };
    eyeC3A.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.eyeC3AInput.red += (them.gameColor.red*0.1);
      me.gameObject.brain.eyeC3AInput.blue += (them.gameColor.blue*0.1);
      me.gameObject.brain.eyeC3AInput.green += (them.gameColor.green*0.1);
    };
    this.eyeC3A = eyeC3A;

    let shitA = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeAOffset,
      bodyA: eyeA,
      stiffness: 0.01
    });
    let shitA2A = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeA2AOffset,
      bodyA: eyeA2A,
      stiffness: 0.01
    });
    let shitA2B = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeA2BOffset,
      bodyA: eyeA2B,
      stiffness: 0.01
    });

    let shitB = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeBOffset,
      bodyA: eyeB,
      stiffness: 0.01
    });
    let shitB2A = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeB2AOffset,
      bodyA: eyeB2A,
      stiffness: 0.01
    });
    let shitB2B = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeB2BOffset,
      bodyA: eyeB2B,
      stiffness: 0.01
    });

    let shitC = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeCOffset,
      bodyA: eyeC,
      stiffness: 0.5
    });

    let shitC2A = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeC2AOffset,
      bodyA: eyeC2A,
      stiffness: 0.5
    });
    let shitC2B = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeC2BOffset,
      bodyA: eyeC2B,
      stiffness: 0.5
    });

    let shitC3A = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeC3AOffset,
      bodyA: eyeC3A,
      stiffness: 0.5
    });

    let shitD = Matter.Constraint.create({
      bodyB: body,
      pointB: Vector.create(0,0),
      bodyA: soundSensor,
      stiffness: 0.5
    });
    //let spike = Body.create({});

    Matter.Composite.addBody(bot, body);
    Matter.Composite.addBody(bot, eyeA);
    Matter.Composite.addBody(bot, eyeA2A);
    Matter.Composite.addBody(bot, eyeA2B);
    Matter.Composite.addBody(bot, eyeB);
    Matter.Composite.addBody(bot, eyeB2A);
    Matter.Composite.addBody(bot, eyeB2B);
    Matter.Composite.addBody(bot, eyeC);
    Matter.Composite.addBody(bot, eyeC2A);
    Matter.Composite.addBody(bot, eyeC2B);
    Matter.Composite.addBody(bot, eyeC3A);
    Matter.Composite.addBody(bot, soundSensor);
    Matter.Composite.addConstraint(bot, shitA);
    Matter.Composite.addConstraint(bot, shitA2A);
    Matter.Composite.addConstraint(bot, shitA2B);
    Matter.Composite.addConstraint(bot, shitB);
    Matter.Composite.addConstraint(bot, shitB2A);
    Matter.Composite.addConstraint(bot, shitB2B);
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

    this.eyeA.gameColor = this.eyeA2B.gameColor = this.eyeA2A.gameColor = { red:0, green: 0, blue:0 };
    this.eyeB.gameColor = this.eyeB2B.gameColor = this.eyeB2A.gameColor = { red:0, green: 0, blue:0 };
    this.eyeC.gameColor = this.eyeC2B.gameColor = this.eyeC2A.gameColor = this.eyeC3A.gameColor = { red:0, green: 0, blue:0 };
    this.body.gameColor = { red:0, green: 0, blue:0 };

  }

  tick() {
    // if(this.body.position.x < 0 || this.body.position.y<0 || this.body.position.x > 3000 || this.body.position.y>2000){
    //   this.life = 0.0;
    //   return;
    // }


    this.heat = ( Mathjs.distance([
      this.body.position.x,
      this.body.position.y],
    [ this.centerOfUniverse.x,
      this.centerOfUniverse.y]))/this.phantomZone;

    this.brain.heat = this.heat;
    this.brain.life = this.life;
    let behindUs = this.body.angle+Math.PI;
    let fususj = Vector.create(11 * Math.cos(behindUs) + this.body.position.x, 11 * Math.sin(behindUs) + this.body.position.y)
    this.brain.vision = this.scanner.scan(Composite.allBodies(this.world), fususj, behindUs);


    // set all brain inputs that arent from events
    this.brain.tick();
      let gluttonPenalty = this.gluttony+1;//OVEREAT_PENALTY *

    // get all brain outputs
      this.age = this.brain.age;
      this.voice = this.brain.voice;
      this.farts = this.brain.farts;


      let facing = this.body.angle;
      let thrustLeftSide = this.brain.farts == true ? this.brain.thrust1*3:this.brain.thrust1;
      let turnLeftSide =  (this.brain.turn1 + facing) ;
      let thrustRightSide = this.brain.farts == true ? this.brain.thrust2*3:this.brain.thrust2;
      let turnRightSide =  (this.brain.turn2 + facing) ;

      thrustLeftSide = thrustLeftSide/gluttonPenalty;
      thrustRightSide = thrustRightSide/gluttonPenalty;
      if(this.gluttony>0){
        this.gluttony--;
      }
      let position = Vector.clone(this.body.position);
      let leftButtcheek = Vector.create(-1.5 * Math.cos(facing- 1.5) + position.x, -1.5 * Math.sin(facing-1.5) + position.y);
      let rightButtcheek = Vector.create(-1.5 * Math.cos(facing+1.5) + position.x, -1.5 * Math.sin(facing+1.5) + position.y);
//      let butt = position;
      Matter.Body.applyForce(this.body,
        leftButtcheek,
        Vector.create(thrustLeftSide * Math.cos(turnLeftSide), thrustLeftSide * Math.sin(turnLeftSide)));

      Matter.Body.applyForce(this.body,
        rightButtcheek,
        Vector.create(thrustRightSide * Math.cos(turnRightSide), thrustRightSide * Math.sin(turnRightSide)));


      this.life -= (AGE_DAMAGE * this.brain.age + this.heat * HEAT_DAMAGE );// +   Math.abs(this.heat)
      if(this.brain.farts){
        this.life -= BOOST_COST;
      }

      this.eyeA.gameColor = this.eyeA2B.gameColor = this.eyeA2A.gameColor = this.brain.eyeColorA;
      this.eyeB.gameColor = this.eyeB2B.gameColor = this.eyeB2A.gameColor = this.brain.eyeColorB;
      this.eyeC.gameColor = this.eyeC2B.gameColor = this.eyeC2A.gameColor = this.eyeC3A.gameColor = this.brain.eyeColorA;
      this.body.gameColor = this.brain.bodyColor;

      this.body.render.fillStyle = this.rgbToHex(this.body.gameColor.red * 255, this.body.gameColor.green * 255, this.body.gameColor.blue * 255);
      this.eyeA.render.fillStyle = this.eyeA2B.render.fillStyle = this.eyeA2A.render.fillStyle =this.rgbToHex(this.brain.eyeColorA.red* 255, this.brain.eyeColorA.blue* 255,this.brain.eyeColorA.green* 255);
      this.eyeB.render.fillStyle = this.eyeB2B.render.fillStyle = this.eyeB2A.render.fillStyle = this.rgbToHex(this.brain.eyeColorB.green* 255,this.brain.eyeColorB.red* 255,this.brain.eyeColorB.blue* 255);
      this.eyeC.render.fillStyle = this.eyeC2B.render.fillStyle = this.eyeC2A.render.fillStyle = this.eyeC3A.render.fillStyle = this.rgbToHex(this.brain.eyeColorC.red* 255,this.brain.eyeColorC.blue* 255,this.brain.eyeColorC.green* 255);

      if(this.life > 0.7){
        if(this.gestationTimer < 0 && this.brain.interestedInMating){
          this.spawn(this.body.position);
          this.spawn(this.body.position);

          this.life = this.life * 0.5;
          //console.log('natural birth');
          this.gestationTimer = GESTATION_TIMER;
        }

      }
  }

  eat(food){
    // will only eat if wants to
    // less life the body will make it
    if(this.brain.wantEat +(1-this.life) > 0.0){
      // the amount eaten
      food.life -= 0.02;

      // if eating food bot still only gains life up to max
      if(this.life <= this.maxLife ){
      var speedMod = 1.0 - (this.body.speed -20)/100;
      this.life += (0.02 * speedMod);
    }else {
      // glutton will take a penalty over time
      // otherwise it will take damage and then eat to full having no purpose
      this.gluttony++;
    }

        // eating, full or not ... could be a bad idea lol
        this.gestationTimer--;
    }
    // sitting on food ruins it
    food.life -= 0.008;
    if(food.life <0.0){ food.destroy()}

    //console.log('nom' + food.class);
  }

  give(them){
    let toGive = 0.01 * this.brain.give;
    this.life -=toGive;
    them.life +=toGive;
  }

  spawn(placement){
    let child = new Bot();
    child.maxLife = this.maxLife;
    child.brain = this.brain.mutate();
    child.create(this.world, Vector.create(placement.x -150*Math.random(), placement.y -150*Math.random()));
  }

  componentToHex(c) {
    c = Math.floor(c);
    c = Math.max(c,0);
    var hex = c.toString(16).substring(0,2);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
}


module.exports = Bot
