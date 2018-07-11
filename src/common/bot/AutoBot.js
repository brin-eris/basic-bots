'use strict';

const    Matter = require('matter-js');
const    MatterWrap = require('matter-wrap');
const    MatterAttractors = require('matter-attractors');

const    Wall = require('../world/Wall');
const    Plant = require('../world/Plant');
const    Meat = require('../world/Meat');

const    Eye = require('./Eye');

const Vector = require('matter-js').Vector;
const World = require('matter-js').World;
const Bodies = require('matter-js').Bodies;
const Body = require('matter-js').Body;
const Composite = require('matter-js').Composite;

const Mathjs = require('mathjs');

// wrapper for a composite bot
// should have same interface and interchangable in sim with Bot
class AutoBot {

    // get refrences and set up variables needed
    constructor() {

    }

    // construct the bot body and brain
    create(world, position) {

    }

    // parent node
    create_body(){}

    // appendages added to body or other appendages
    add_appendage(){}

    // sensor added to appendages
    // various sensors are eye, touch, sound
    add_sensor(){}

    // position from center of appendage
    // view angle and depth
    add_eye(position_vector, view_vector){

    }

    add_ear(){}

    add_touch(){}

}


module.exports = AutoBot
