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
      this.give = 0.0;
      this.ouchie = 0.0;
      this.age = 0;
      this.eyeAInput = { red:0, green: 0, blue:0 };
      this.eyeBInput = { red:0, green: 0, blue:0 };
      this.eyeCInput = { red:0, green: 0, blue:0 };

      let inputWeights = Mathjs.ones(Mathjs.matrix([15, 15]));

      this.inputWeights = inputWeights.map( function(value, index, matrix) {

          let newValue = value + Math.random()-0.5;
          return newValue;
        });

      let outputBias = Mathjs.zeros(15);
      this.outputBias = outputBias.map( function(value, index, matrix) {

          let newValue = (Math.random() -0.5);
          return newValue;

      });

    }

    tick(){

      this.clock++;
      this.clock %= 60;
      if(this.clock == 1){
        this.age++;
      }
      this.ccClock = (this.clock - 30)/60;

      this.inputVector = Mathjs.matrix([
        this.eyeAInput.red,
        this.eyeBInput.red,
        this.eyeCInput.red,
        this.eyeAInput.blue,
        this.eyeBInput.blue,
        this.eyeCInput.blue,
        this.eyeAInput.green,
        this.eyeBInput.green,
        this.eyeCInput.green,
        this.ccClock,
        this.turn,
        this.thrust,
        this.smellInput,
        this.ouchie,
        0
        ]);

      this.connectVector = Mathjs.multiply(this.inputWeights, this.inputVector);
      this.outputVector = Mathjs.add(this.connectVector, this.outputBias);
      this.turn = (this.sigmoid(this.outputVector.subset(Mathjs.index(0)))-0.5)/Math.PI;
      this.thrust = (this.sigmoid(this.outputVector.subset(Mathjs.index(1)))-  0.5)/2 ;
      this.red = this.sigmoid(this.outputVector.subset(Mathjs.index(2))) ;
      this.green = this.sigmoid(this.outputVector.subset(Mathjs.index(3))) ;
      this.blue = this.sigmoid(this.outputVector.subset(Mathjs.index(4))) ;
      this.spike = this.sigmoid(this.outputVector.subset(Mathjs.index(5)))-0.5;
      this.give = this.sigmoid(this.outputVector.subset(Mathjs.index(6))) - 0.6;

      this.smellInput = 0.0;
      this.ouchie = 0.0;

      this.eyeAInput.red = 0.0;
      this.eyeBInput.red = 0.0;
      this.eyeCInput.red = 0.0;
      this.eyeAInput.blue = 0.0;
      this.eyeBInput.blue = 0.0;
      this.eyeCInput.blue = 0.0;
      this.eyeAInput.green = 0.0;
      this.eyeBInput.green = 0.0;
      this.eyeCInput.green = 0.0;

    }

    sigmoid(x){
        return 1/(1 + Mathjs.exp(-1 + x));
    }

    mutate(){
      let childBrain = new Brain();
      let childInputWeights = this.inputWeights.clone();
      let childOutputBias = this.outputBias.clone();
      childInputWeights = childInputWeights.map( function(value, index, matrix) {
        if(Math.random() > 0.9){
          if(value!=0){
            let newValue = value + value * (Math.random() -0.5) ;
            return newValue;
          }
        return  (Math.random() -0.5)*0.1;
          //matrix.subset( Mathjs.index(index), newValue);
        }
        return value;
      });

      childOutputBias = childOutputBias.map( function(value, index, matrix) {
        if(Math.random() > 0.9){
          if(value!=0){
            let newValue = value + value * (Math.random() -0.5);
            return newValue;
          }
        return  (Math.random() -0.5)*0.1
          //matrix.subset( Mathjs.index(index), newValue);
        }
        return value;
      });
      childBrain.inputWeights = childInputWeights;
      childBrain.outputBias = childOutputBias;
      return childBrain;
    }
}


module.exports = Brain;
