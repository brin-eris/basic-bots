'use strict';

const Nerdamer = require('nerdamer');

class Brain{

    constructor(){}

    tick(){
      this.turn = (Math.random() - 0.5);
      this.thrust = (Math.random() - 0.4);
    }

}


module.exports = Brain;
