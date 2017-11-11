'use strict';
const Brain = require('./Brain');
const Matter = require('matter-js')
const World = require('matter-js').World;
const Bodies = require('matter-js').Bodies;
const Body = require('matter-js').Body;
const Vertices = require('matter-js').Vertices;

// soak the brains in here to get juicy
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
    let offsetRadius = radius + eyeRadius + 8;
    let eyeAOffset = Matter.Vector.create( offsetRadius * Math.cos(0.9), offsetRadius * Math.sin(0.9));
    let eyeBOffset = Matter.Vector.create( offsetRadius * Math.cos(0.9), - offsetRadius * Math.sin(0.9));
    let eyeCOffset = Matter.Vector.create( offsetRadius, 0 );

    let bot = Matter.Composite.create({
      label: Bot
    });

    let body = Bodies.circle(position.x, position.y, radius, {
      collisionFilter: {
        group: group
      },
      density: 0.9,
      restitution: 0.1,
      friction: 0.5,
      render: {
        fillStyle: '#C44D58',
        strokeStyle: '#C44D58',
        lineWidth: 3
      }
    });

    let eyeA = Bodies.circle(position.x + eyeAOffset.x, position.y + eyeAOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true
    });

    let eyeB = Bodies.circle(position.x + eyeBOffset.x, position.y + eyeBOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true
    });

    let eyeC = Bodies.circle(position.x + eyeCOffset.x, position.y + eyeCOffset.y, eyeRadius, {
      collisionFilter: {
        group: group
      },
      isSensor: true
    });

    let shitA = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeAOffset,
      bodyA: eyeA,
      stiffness: 1,
      length: 0
    });

    let shitB = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeBOffset,
      bodyA: eyeB,
      stiffness: 1,
      length: 0
    });

    let shitC = Matter.Constraint.create({
      bodyB: body,
      pointB: eyeCOffset,
      bodyA: eyeC,
      stiffness: 1,
      length: 0
    });

    //let spike = Body.create({});

    Matter.Composite.addBody(bot, body);
    Matter.Composite.addBody(bot, eyeA);
    Matter.Composite.addBody(bot, eyeB);
    Matter.Composite.addBody(bot, eyeC);
    Matter.Composite.addConstraint(bot, shitA);
    Matter.Composite.addConstraint(bot, shitB);
    Matter.Composite.addConstraint(bot, shitC);

    this.body = body;

    bot.gameObject = this;

    this.world = world;
    World.add(world, bot);
  }

  tick() {
    this.brain.tick();
    let thrust = this.brain.thrust;
    let facing = this.body.angle;
    let turn = this.brain.turn + facing;
    let butt = Matter.Vector.create(-5 * Math.cos(facing) + this.body.position.x, -5 * Math.sin(facing) + this.body.position.y);
    Matter.Body.applyForce(this.body,
      butt,
      Matter.Vector.create(thrust * Math.cos(turn), thrust * Math.sin(turn)));
  }

}


module.exports = Bot
