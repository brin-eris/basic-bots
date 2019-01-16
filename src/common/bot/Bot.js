'use strict';

const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');

const    Wall = require('../world/Wall');
const    Plant = require('../world/Plant');
const    Meat = require('../world/Meat');
const    Brain = require('../brains/Brain');
const    OtherBrain = require('../brains/OtherBrain');
const    Dumber = require('../brains/Dumber');
const    DeltaBrain = require('../brains/DeltaBrain');
//const    OOBrain = require('../brains/OOBrain');

const    Eye = require('./Eye');

const Vector = require('matter-js').Vector;
const World = require('matter-js').World;
const Bodies = require('matter-js').Bodies;
const Body = require('matter-js').Body;
const Composite = require('matter-js').Composite;

const Mathjs = require('mathjs');

const COLLISION_DAMAGE = 0.0003;
const sting_DAMAGE = 10;
const AGE_DAMAGE = 0.000015;
const HEAT_DAMAGE = 0.00015;
const OVEREAT_PENALTY = 0.15;
const BOOST_COST = 0.005;
const GESTATION_TIMER = 2.5;
const GIVE_AMOUNT = 0.1;
const SEXUAL_MATURITY = 5;
const EAT_AMOUNT = 0.15;
const MAX_LIFE = 1.0;

class Bot {
  constructor() {

    this.class = Bot;
    this.brain = Brain.create_new();

    this.life = MAX_LIFE;

    this.heat = 0.0;
    this.isPreggers = false;
    this.gestationTimer = 0;
    this.center_eye = new Eye();
    this.left_eye = new Eye();
    this.right_eye = new Eye();
    this.is_ui_selected = false;
    this.womb = Array();
  }

  create(world, position) {


    this.centerOfUniverse = {x: world.bounds.max.x/2, y: world.bounds.max.y/2};
    this.phantomZone = Math.abs( Mathjs.distance([
      0,
      0],
    [ this.centerOfUniverse.x,
      this.centerOfUniverse.y]));


    let group = Body.nextGroup(true);

    let radius = 10;
    this.radius = radius;
    let armRadius = 6;
    let offsetRadius = radius * 1.6 + armRadius;
    let offsetLayer2Radius = offsetRadius * 1.6;

    let armAOffset = Vector.create( offsetRadius * Math.cos(1.1), offsetRadius * Math.sin(1.1));
    let armA2AOffset = Vector.create( offsetRadius* Math.cos(2.1), offsetRadius * Math.sin(2.1));
    let armA2BOffset = Vector.create( offsetRadius * Math.cos(1.6), offsetRadius * Math.sin(1.6));

    let armBOffset = Vector.create( offsetRadius * Math.cos(-1.1),  offsetRadius * Math.sin(-1.1));
    let armB2AOffset = Vector.create( offsetRadius* Math.cos(-2.1),  offsetRadius * Math.sin(-2.1));
    let armB2BOffset = Vector.create( offsetRadius * Math.cos(-1.6),  offsetRadius * Math.sin(-1.6));


    let armCOffset = Vector.create( offsetRadius * 1.5, 0 );
    let armC2AOffset = Vector.create( offsetLayer2Radius  ,  offsetLayer2Radius * Math.sin(-0.3));
    let armC2BOffset = Vector.create( offsetLayer2Radius , offsetLayer2Radius * Math.sin(0.3));
    let armC3AOffset = Vector.create( offsetLayer2Radius * 1.3,0);


    let soundRadius = 200;

    let bot = Matter.Composite.create({
      label: 'Bot',
      plugin: {
        wrap: {
          min: {
            x: 0,
            y: 0
          },
          max: {
            x: world.bounds.max.x,
            y: world.bounds.max.y
          }
        }
      }
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

            let damage = (COLLISION_DAMAGE * Math.abs(Vector.magnitude(relativeMomentum)))*10;
              me.gameObject.life -= damage;
              me.gameObject.brain.ouchie += damage;
          }else if(them.gameObject.class==Meat){
            me.gameObject.brain.smellMeat += 1.0;
            // only the blood thirsty eat meat
          //  if(me.gameObject.species == 0){
              me.gameObject.eat(them.gameObject);

          //  }

          }
      }

    };
    body.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
        if(them.gameObject && them.gameObject.class==Bot){
          let myMomentum = Vector.mult(me.velocity, 1.0);
          let theirMomentum = Vector.mult(them.velocity, 1.0);
          let relativeMomentum = Vector.sub(myMomentum, theirMomentum);

          let baseDamage = (COLLISION_DAMAGE  * Math.abs(Vector.magnitude(relativeMomentum)));

          if(them.gameObject.brain.sting > 0.0){
            //one of thier body parts stung me
            let damage_stung = baseDamage * (1 + (them.gameObject.brain.sting)*(them.gameObject.brain.sting) * sting_DAMAGE);
              me.gameObject.life -= damage_stung;
              me.gameObject.brain.ouchie += damage_stung;
              //console.log("damage_stung:" + damage_stung + "; baseDamage:" + baseDamage + "; stinger:" + them.gameObject.brain.sting);
              if(me.gameObject.life <= 0.0){
                // tell my wife i loved her
                console.log("tell my wife i loved her: " + me.gameObject.species);

              }
          }else{
            // they didnt sting me, but i still got hit
            me.gameObject.life -= baseDamage ;
            me.gameObject.brain.ouchie += baseDamage;
          }

        } else if(them.gameObject && them.gameObject.class==Plant){

                  me.gameObject.eat(them.gameObject);

          } else if(them.gameObject && them.gameObject.class==Wall){
            let myMomentum = Vector.mult(me.velocity, 1.0);
            let theirMomentum = Vector.mult(them.velocity, 1.0);
            let relativeMomentum = Vector.sub(myMomentum, theirMomentum);

            let damage = (COLLISION_DAMAGE * Math.abs(Vector.magnitude(relativeMomentum)))*10;
              me.gameObject.life -= damage;
              me.gameObject.brain.ouchie += damage;
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

          let distance = Math.abs(( Mathjs.distance([
            me.gameObject.body.position.x,
            me.gameObject.body.position.y],
          [ them.gameObject.body.position.x,
            them.gameObject.body.position.y])));
            me.gameObject.brain.soundInput += (distance*them.speed)/(soundRadius*100);
              me.gameObject.brain.voiceInput +=  them.gameObject.voice ;

              if(me.gameObject.species == them.gameObject.species){
                if(me.gameObject.will_mate && them.gameObject.will_mate){
                  me.gameObject.brain.sexytime += them.gameObject.brain.interestInMating;
                }
              }

              //console.log(them.gameObject.voice);
              // if(me.gameObject.brain.give > 0.0 ){
              //   me.gameObject.give(them.gameObject);
              // }
        }else if(them.gameObject.class==Meat){
          let distance = Math.abs(( Mathjs.distance([
            me.gameObject.body.position.x,
            me.gameObject.body.position.y],
          [ them.gameObject.body.position.x,
            them.gameObject.body.position.y])));
          me.gameObject.brain.smellMeat += .1 + 1/distance;
        }
      }
    };

    soundSensor.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      if(them.gameObject){


      }
    };


    let armA = Bodies.circle(position.x + armAOffset.x, position.y + armAOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armA.gameObject = this;
    armA.imAfukinSensor = false;
    armA.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armAInput.red += (them.gameColor.red);
      me.gameObject.brain.armAInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armAInput.green += (them.gameColor.green);
    };
    armA.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armAInput.red += (them.gameColor.red);
      me.gameObject.brain.armAInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armAInput.green += (them.gameColor.green);
    if(them.gameObject.class == Bot){
      if(me.gameObject.brain.give > 0.0 ){
        me.gameObject.give(them.gameObject);
      }
    }
    };
    this.armA = armA;


    let armA2A = Bodies.circle(position.x + armA2AOffset.x, position.y + armA2AOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armA2A.gameObject = this;
    armA2A.imAfukinSensor = false;
    armA2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armAInput.red += (them.gameColor.red);
      me.gameObject.brain.armAInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armAInput.green += (them.gameColor.green);
    };
    armA2A.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armAInput.red += (them.gameColor.red);
      me.gameObject.brain.armAInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armAInput.green += (them.gameColor.green);
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
      }
    };
    this.armA2A = armA2A;

    let armA2B = Bodies.circle(position.x + armA2BOffset.x, position.y + armA2BOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armA2B.gameObject = this;
    armA2B.imAfukinSensor = false;
    armA2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armAInput.red += (them.gameColor.red);
      me.gameObject.brain.armAInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armAInput.green += (them.gameColor.green);
    };
    armA2B.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armAInput.red += (them.gameColor.red);
      me.gameObject.brain.armAInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armAInput.green += (them.gameColor.green);
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
      }
    };

    this.armA2B = armA2B;


    let armB = Bodies.circle(position.x + armBOffset.x, position.y + armBOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armB.gameObject = this;
    armB.imAfukinSensor = false;
    armB.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armBInput.red += (them.gameColor.red);
      me.gameObject.brain.armBInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armBInput.green += (them.gameColor.green);
    };
    armB.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armBInput.red += (them.gameColor.red);
      me.gameObject.brain.armBInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armBInput.green += (them.gameColor.green);
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
      }
    };
    this.armB = armB;

    let armB2A = Bodies.circle(position.x + armB2AOffset.x, position.y + armB2AOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armB2A.gameObject = this;
    armB2A.imAfukinSensor = false;
    armB2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armBInput.red += (them.gameColor.red);
      me.gameObject.brain.armBInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armBInput.green += (them.gameColor.green);
    };
    armB2A.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armBInput.red += (them.gameColor.red);
      me.gameObject.brain.armBInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armBInput.green += (them.gameColor.green);
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
      }
    };
    this.armB2A = armB2A;


    let armB2B = Bodies.circle(position.x + armB2BOffset.x, position.y + armB2BOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armB2B.gameObject = this;
    armB2B.imAfukinSensor = false;
    armB2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armBInput.red += (them.gameColor.red);
      me.gameObject.brain.armBInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armBInput.green += (them.gameColor.green);
    };
    armB2B.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armBInput.red += (them.gameColor.red);
      me.gameObject.brain.armBInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armBInput.green += (them.gameColor.green);
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
      }
    };
    this.armB2B = armB2B;


    let armC = Bodies.circle(position.x + armCOffset.x, position.y + armCOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armC.gameObject = this;
    armC.imAfukinSensor = false;
    armC.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armCInput.red += (them.gameColor.red);
      me.gameObject.brain.armCInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armCInput.green += (them.gameColor.green);
    };
    armC.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armCInput.red += (them.gameColor.red);
      me.gameObject.brain.armCInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armCInput.green += (them.gameColor.green);
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
        if(me.gameObject.species == them.gameObject.species){
              me.gameObject.brain.sexytime +=  me.gameObject.brain.interestInMating ;
                //console.log('sexytime: '+me.gameObject.brain.sexytime);
              if(me.gameObject.brain.sexytime > 3.0 && me.gameObject.will_mate){

                me.gameObject.mate(me.gameObject.brain, them.gameObject.brain);

          }
        }
      }
    };
    this.armC = armC;

    let armC2A = Bodies.circle(position.x + armC2AOffset.x, position.y + armC2AOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armC2A.gameObject = this;
    armC2A.imAfukinSensor = false;
    armC2A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armC2AInput.red += (them.gameColor.red);
      me.gameObject.brain.armC2AInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armC2AInput.green += (them.gameColor.green);
    };
    armC2A.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armC2AInput.red += (them.gameColor.red);
      me.gameObject.brain.armC2AInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armC2AInput.green += (them.gameColor.green);
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
         if(me.gameObject.species == them.gameObject.species){
           me.gameObject.brain.sexytime +=  me.gameObject.brain.interestInMating  ;
             //console.log('sexytime: '+me.gameObject.brain.sexytime);
           if(me.gameObject.brain.sexytime > 3.0 && me.gameObject.will_mate){

            me.gameObject.mate(me.gameObject.brain, them.gameObject.brain);

          }
        }
      }
    };
    this.armC2A = armC2A;

    let armC2B = Bodies.circle(position.x + armC2BOffset.x, position.y + armC2BOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armC2B.gameObject = this;
    armC2B.imAfukinSensor = false;
    armC2B.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armC2BInput.red += (them.gameColor.red);
      me.gameObject.brain.armC2BInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armC2BInput.green += (them.gameColor.green);
    };
    armC2B.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armC2BInput.red += (them.gameColor.red);
      me.gameObject.brain.armC2BInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armC2BInput.green += (them.gameColor.green);
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
          if(me.gameObject.species == them.gameObject.species){
            me.gameObject.brain.sexytime +=   me.gameObject.brain.interestInMating  ;
              //console.log('sexytime: '+me.gameObject.brain.sexytime);
            if(me.gameObject.brain.sexytime > 3.0 && me.gameObject.will_mate){

            me.gameObject.mate(me.gameObject.brain, them.gameObject.brain);

          }
        }
      }
    };
    this.armC2B = armC2B;


    let armC3A = Bodies.circle(position.x + armC3AOffset.x, position.y + armC3AOffset.y, armRadius, {
      collisionFilter: {
        group: group
      },
      restitution: 0.3,
      isSensor: false,
      render: {
        fillStyle: '#aaaaaa'
      }
    });
    armC3A.gameObject = this;
    armC3A.imAfukinSensor = false;
    armC3A.onCollideActive = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armC3AInput.red += (them.gameColor.red);
      me.gameObject.brain.armC3AInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armC3AInput.green += (them.gameColor.green);
    };
    armC3A.onCollide = function(me, them){
      if(them.imAfukinSensor){return;}
      me.gameObject.brain.armC3AInput.red += (them.gameColor.red);
      me.gameObject.brain.armC3AInput.blue += (them.gameColor.blue);
      me.gameObject.brain.armC3AInput.green += (them.gameColor.green);
      if(them.gameObject.class != Plant && them.gameObject.class != Meat){
        me.gameObject.brain.sexytime +=  0.1;
      }
      if(them.gameObject.class == Bot){
        if(me.gameObject.brain.give > 0.0 ){
          me.gameObject.give(them.gameObject);
        }
          if(me.gameObject.species == them.gameObject.species){

            me.gameObject.brain.sexytime +=  me.gameObject.brain.interestInMating  ;
              //console.log('sexytime: '+me.gameObject.brain.sexytime);
            if(me.gameObject.brain.sexytime > 3.0 && me.gameObject.will_mate){
              me.gameObject.mate(me.gameObject.brain, them.gameObject.brain);
            }
        }
      }
    };
    this.armC3A = armC3A;





    let shitA = Matter.Constraint.create({
      bodyB: body,
      pointB: armAOffset,
      bodyA: armA,
      stiffness: 0.1
    });
    this.armAConstraint = shitA;
    let shitA2A = Matter.Constraint.create({
      bodyB: body,
      pointB: armA2AOffset,
      bodyA: armA2A,
      stiffness: 0.1
    });
    let shitA2B = Matter.Constraint.create({
      bodyB: body,
      pointB: armA2BOffset,
      bodyA: armA2B,
      stiffness: 0.1
    });

    let shitB = Matter.Constraint.create({
      bodyB: body,
      pointB: armBOffset,
      bodyA: armB,
      stiffness: 0.1
    });
    this.armBConstraint = shitB;
    let shitB2A = Matter.Constraint.create({
      bodyB: body,
      pointB: armB2AOffset,
      bodyA: armB2A,
      stiffness: 0.1
    });
    let shitB2B = Matter.Constraint.create({
      bodyB: body,
      pointB: armB2BOffset,
      bodyA: armB2B,
      stiffness: 0.1
    });

    let shitC = Matter.Constraint.create({
      bodyB: body,
      pointB: armCOffset,
      bodyA: armC,
      stiffness: 0.5
    });

    let shitC2A = Matter.Constraint.create({
      bodyB: body,
      pointB: armC2AOffset,
      bodyA: armC2A,
      stiffness: 0.5
    });
    let shitC2B = Matter.Constraint.create({
      bodyB: body,
      pointB: armC2BOffset,
      bodyA: armC2B,
      stiffness: 0.5
    });

    let shitC3A = Matter.Constraint.create({
      bodyB: body,
      pointB: armC3AOffset,
      bodyA: armC3A,
      stiffness: 0.5
    });

    let shitD = Matter.Constraint.create({
      bodyB: body,
      pointB: Vector.create(0,0),
      bodyA: soundSensor,
      stiffness: 0.5
    });
    //let sting = Body.create({});

    Matter.Composite.addBody(bot, body);
    Matter.Composite.addBody(bot, armA);
    Matter.Composite.addBody(bot, armA2A);
    Matter.Composite.addBody(bot, armA2B);
    Matter.Composite.addBody(bot, armB);
    Matter.Composite.addBody(bot, armB2A);
    Matter.Composite.addBody(bot, armB2B);
    Matter.Composite.addBody(bot, armC);
    Matter.Composite.addBody(bot, armC2A);
    Matter.Composite.addBody(bot, armC2B);
    Matter.Composite.addBody(bot, armC3A);
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

    this.armA.gameColor = this.armA2B.gameColor = this.armA2A.gameColor = { red:0, green: 0, blue:0 };
    this.armB.gameColor = this.armB2B.gameColor = this.armB2A.gameColor = { red:0, green: 0, blue:0 };
    this.armC.gameColor = this.armC2B.gameColor = this.armC2A.gameColor = this.armC3A.gameColor = { red:0, green: 0, blue:0 };
    this.body.gameColor = { red:0, green: 0, blue:0 };

  }

  tick() {



    this.heat = Math.abs( Mathjs.distance([
      this.body.position.y,
      this.body.position.y],
    [ this.centerOfUniverse.x,
      this.centerOfUniverse.y])/(this.phantomZone));

    this.brain.heat = this.heat;
    this.brain.life = this.life;
    let behindUs = this.body.angle+Math.PI;

    let center_eye_position = Vector.create(11 * Math.cos(behindUs) + this.body.position.x, 11 * Math.sin(behindUs) + this.body.position.y)
    this.brain.center_eye_vision = this.center_eye.scan(Composite.allBodies(this.world), center_eye_position, behindUs);

    let left_eye_angle = behindUs - Math.PI/12;
    let left_eye_position = Vector.create(11 * Math.cos(left_eye_angle) + this.body.position.x, 11 * Math.sin(left_eye_angle) + this.body.position.y)
    this.brain.left_eye_vision = this.left_eye.scan(Composite.allBodies(this.world), left_eye_position, left_eye_angle);

    let right_eye_angle = behindUs + Math.PI/12;
    let right_eye_position = Vector.create(11 * Math.cos(right_eye_angle) + this.body.position.x, 11 * Math.sin(right_eye_angle) + this.body.position.y)
    this.brain.right_eye_vision = this.right_eye.scan(Composite.allBodies(this.world), right_eye_position, right_eye_angle);

    //this.brain.senseSexualAdvance
    this.brain.gestation = this.gestationTimer/GESTATION_TIMER;
    // think
    this.brain.tick();


    // get all brain outputs
      this.age = this.brain.age;
      this.voice = this.brain.voice;
      this.farts = this.brain.farts;


      let facing = this.body.angle;
      let thrustLeftSide = this.brain.farts == true ? this.brain.thrust1 + 0.75:this.brain.thrust1;
      let turnLeftSide =  (facing - this.brain.turn1 ) ;
      let thrustRightSide = this.brain.farts == true ? this.brain.thrust2 + 0.75:this.brain.thrust2;
      let turnRightSide =  (facing + this.brain.turn2) ;


      let position = Vector.clone(this.body.position);
      let leftButtcheek = Vector.create(1.5 * Math.cos(facing -0.01) + position.x, 1.5 * Math.sin(facing -0.01) + position.y);
      let rightButtcheek = Vector.create(1.5 * Math.cos(facing +0.01) + position.x, 1.5 * Math.sin(facing +0.01) + position.y);

      Matter.Body.applyForce(this.body,
        leftButtcheek,
        Vector.create(thrustLeftSide * Math.cos(turnLeftSide), thrustLeftSide * Math.sin(turnLeftSide)));

      Matter.Body.applyForce(this.body,
        rightButtcheek,
        Vector.create(thrustRightSide * Math.cos(turnRightSide), thrustRightSide * Math.sin(turnRightSide)));


      let heatDamage =  (this.heat * this.heat * HEAT_DAMAGE );
      let ageDamage = AGE_DAMAGE * this.brain.age;
      this.life -= (heatDamage + ageDamage);
      if(this.isPreggers){
        this.life -= (ageDamage );
      }

      if(this.brain.farts){
        this.life -= BOOST_COST;
      }

      this.armA.gameColor = this.armA2B.gameColor = this.armA2A.gameColor = this.brain.armColorA;
      this.armB.gameColor = this.armB2B.gameColor = this.armB2A.gameColor = this.brain.armColorB;
      this.armC.gameColor = this.armC2B.gameColor = this.armC2A.gameColor = this.armC3A.gameColor = this.brain.armColorA;
      this.body.gameColor = this.brain.bodyColor;

      this.body.render.fillStyle = this.rgbToHex(this.body.gameColor.red * 255, this.body.gameColor.green * 255, this.body.gameColor.blue * 255);
      this.armA.render.fillStyle = this.armA2B.render.fillStyle = this.armA2A.render.fillStyle =this.rgbToHex(this.brain.armColorA.red* 255, this.brain.armColorA.green* 255,this.brain.armColorA.blue* 255);
      this.armB.render.fillStyle = this.armB2B.render.fillStyle = this.armB2A.render.fillStyle = this.rgbToHex(this.brain.armColorB.red* 255,this.brain.armColorB.green* 255,this.brain.armColorB.blue* 255);
      this.armC.render.fillStyle = this.armC2B.render.fillStyle = this.armC2A.render.fillStyle = this.armC3A.render.fillStyle = this.rgbToHex(this.brain.armColorC.red* 255,this.brain.armColorC.green* 255,this.brain.armColorC.blue* 255);

      if(this.is_ui_selected){
         console.log('age damage: '+ ageDamage);
         console.log('heat damage: '+ heatDamage);
         console.log('life: '+ this.life);
        // console.log('speed: '+this.body.speed);
        console.log('gestation: '+ this.gestationTimer);
        this.body.render.strokeStyle =  this.rgbToHex(150,50,0);
        this.armA.render.strokeStyle =  this.rgbToHex(150,50,0);
        this.armB.render.strokeStyle =  this.rgbToHex(150,50,0);
        this.armC.render.strokeStyle =  this.rgbToHex(150,50,0);

        this.body.render.lineWidth = 8;
        this.armA.render.lineWidth = 8;
        this.armB.render.lineWidth = 8;
        this.armC.render.lineWidth = 8;
      }else{
        this.ui_selection_counter=0;

        this.body.render.lineWidth = 0;
        this.armA.render.lineWidth = 0;
        this.armB.render.lineWidth = 0;
        this.armC.render.lineWidth = 0;
      }


        if( this.brain.interestInMating > 0  && this.brain.age > SEXUAL_MATURITY ){
          this.will_mate = true;

        }else{
          this.will_mate = false;
        }

        if(this.gestationTimer < 0 && this.isPreggers){
          this.giveBirth();
        }

        if(this.gestationTimer> GESTATION_TIMER *2 ){
              console.log('self love');
          this.mate(this.brain, this.brain);

        }

  }

    concieve(channel_A, channel_B){
      console.log('knocked up: ' + this.species);
      this.gestationTimer = GESTATION_TIMER;
      this.isPreggers = true;
      this.womb.push({ channel_A: channel_A, channel_B:channel_B});
    }

    giveBirth(){
      console.log('birth: ' + this.species + ' litter of: ' + this.womb.length);
      while(this.womb.length > 0){
        let genes = this.womb.pop();
        let child = new Bot();
        child.species = this.species;
        child.brain.rebuild(genes.channel_A, genes.channel_B);
        child.create(this.world, Vector.create(this.body.position.x - 300*(Math.random()-0.5), this.body.position.y - 300*(Math.random()-0.5)));

        this.health = this.health *.9;
        child.health = this.health;
      }
      this.gestationTimer = 0;
      this.isPreggers = false;
    }

    mate(p1, p2){
      this.brain.happy += this.brain.sexytime;
      this.brain.sexytime = 0;
      console.log('mating: ' + this.species);
      if(!this.isPreggers){
        if(Math.random() < 0.75){
          this.concieve(p1.get_half_chromosomes(), p2.get_half_chromosomes());
          if(Math.random() < 0.55){
            this.concieve(p1.get_half_chromosomes(), p2.get_half_chromosomes());
            if(Math.random() < 0.55){
                this.concieve(p1.get_half_chromosomes(), p2.get_half_chromosomes());
                if(Math.random() < 0.55){
                    this.concieve(p1.get_half_chromosomes(), p2.get_half_chromosomes());
                }
            }
          }
        }
      }

    }

  eat(food){
    // will only eat if wants to
    if(this.brain.wantEat > 0){

      let speedMod = Mathjs.abs(1.0 - (this.body.speed)/150);
      let effectiveGain =   (this.brain.wantEat * (speedMod )*EAT_AMOUNT);
      food.life -= this.brain.wantEat * EAT_AMOUNT;

      this.brain.happy += effectiveGain;

      // if eating food bot still only gains life up to max
    if(this.life < MAX_LIFE ){
      this.life += effectiveGain;
      // if(this.is_ui_selected){
      //   console.log('Food eaten: '+effectiveGain);
      //   console.log('Gestation: '+this.gestationTimer);
      // }
      if(!this.isPreggers && this.brain.age > SEXUAL_MATURITY){
        this.gestationTimer+=effectiveGain;
      }
      if(this.isPreggers){
          this.gestationTimer -= effectiveGain;
          this.brain.happy += effectiveGain;
      }
    }else {

      // if(this.isPreggers){
      //   this.gestationTimer -= effectiveGain;
      //   this.brain.happy += effectiveGain;
      // }else{
        this.life -= OVEREAT_PENALTY * effectiveGain;
        this.brain.ouchie += effectiveGain;
      // }
    }


    }
    // sitting on food ruins it
    food.life -= 0.01;
    if(food.life <0.0){ food.destroy()}
    //console.log('nom' + food.class);
  }

  give(them){
    if(them.life< MAX_LIFE ){
      let toGive = GIVE_AMOUNT * this.brain.give;
      this.life -=toGive + GIVE_AMOUNT*0.9;
      them.life +=toGive;
      them.brain.happy+= this.brain.give;
    }

  }

  spawn(brain){
    let child = new Bot();
    child.species = this.species;
    child.brain.rebuild(brain.get_half_chromosomes(), brain.get_half_chromosomes());
    child.create(this.world, Vector.create(this.body.position.x - 300*(Math.random()-0.5), this.body.position.y - 300*(Math.random()-0.5)));

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


module.exports = Bot
