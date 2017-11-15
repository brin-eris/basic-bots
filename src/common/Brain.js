'use strict';

const Mathjs = require('mathjs');

class Brain{



    constructor(){
      this.eyeAInput = 1.0;
      this.eyeBInput = 1.0;
      this.eyeCInput = 1.0;
      this.turn = 0.0;
      this.thrust = 0.0;
      this.clock = 0;
      this.red = 0.0;
      this.green = 0.0;
      this.blue = 0.0;
      this.sound = 0.0;
      this.smellInput = 1.0;
      this.eating = 0.0;

      this.inputWeights = Mathjs.matrix([
        [ (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4 ],
        [ (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4 ],
        [ (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4 ],
        [ (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4 ],
        [ (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4 ],
        [ (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4 ],
        [ (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4 ],
        [ (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4,
          (Math.random()-0.5)*4 ]
        ]);

      this.outputBias = Mathjs.matrix([
        (Math.random()-0.5),
        (Math.random()-0.5),
        (Math.random()-0.5),
        (Math.random()-0.5),
        (Math.random()-0.5),
        (Math.random()-0.5),
        (Math.random()-0.5),
        (Math.random()-0.5)
      ]);
      // this.outputBias = Mathjs.matrix([
      //   0,
      //   0,
      //   0,
      //   0,
      //   0,
      //   0
      // ]);
    }

    tick(){

      this.clock++;
      this.clock %= 60;
      this.ccClock = (this.clock - 30)/60;

      this.inputVector = Mathjs.matrix([
        this.eyeAInput,
        this.eyeBInput,
        this.eyeCInput,
        this.ccClock,
        this.turn,
        this.thrust,
        this.smellInput,
        this.eating
        ]);
        //,
        // this.lifeInput,
        // this.turn,
        // this.thrust,
        // this.ccClock
      this.connectVector = Mathjs.multiply(this.inputWeights, this.inputVector);
      this.outputVector = Mathjs.add(this.connectVector, this.outputBias);
      this.turn = (this.sigmoid(this.outputVector.subset(Mathjs.index(0)))-0.5)/Math.PI;
      this.thrust = (this.sigmoid(this.outputVector.subset(Mathjs.index(1)))-  0.5)/2 ;
      this.red = this.sigmoid(this.outputVector.subset(Mathjs.index(2)));
      this.green = this.sigmoid(this.outputVector.subset(Mathjs.index(3)));
      this.blue = this.sigmoid(this.outputVector.subset(Mathjs.index(4)));
      this.spike = this.sigmoid(this.outputVector.subset(Mathjs.index(5)))-0.5;
      this.eyeAInput = 1.0;
      this.eyeBInput = 1.0;
      this.eyeCInput = 1.0;
      this.smellInput = 0.0;
      this.eating = 0.0;
    }

    sigmoid(x){
        return 1/(1 + Mathjs.exp(-1 + x));
    }

}


module.exports = Brain;
