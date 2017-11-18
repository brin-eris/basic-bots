'use strict';

const Mathjs = require('mathjs');

class Brain{



    constructor(){

      this.heat = 0.0;
      this.turn = 0.0;
      this.thrust = 0.0;
      this.clock = 0;
      this.red = 0.0;
      this.green = 0.0;
      this.blue = 0.0;
      this.sound = 0.0;
      this.soundInput = 1.0;
      this.give = 0.0;
      this.ouchie = 0.0;
      this.age = 0;
      this.eyeAInput = { red:0, green: 0, blue:0 };
      this.eyeBInput = { red:0, green: 0, blue:0 };
      this.eyeCInput = { red:0, green: 0, blue:0 };

      this.inputWeights = Mathjs.random(Mathjs.matrix([15, 15]));


      this.hiddenBias = Mathjs.random([15]);


      this.hiddenWeights = Mathjs.random(Mathjs.matrix([15, 15]));




      this.outputBias = Mathjs.random([15]);

    }

    tick(){

      this.clock++;
      this.clock %= 60;
      if(this.clock % 5 == 0 ){
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
        this.heat,
        this.turn,
        this.thrust,
        this.soundInput,
        this.ouchie,
        this.life
        ]);


      let inputsConnectVector = Mathjs.multiply(this.inputWeights, this.inputVector);

      let tempHiddenVector = Mathjs.add(inputsConnectVector, this.hiddenBias).map(function(value, index, matrix){
        let result = 1.0/(1.0 + Mathjs.exp(-1 + value));

        return isNaN(result) ? 1.0 : result;
        });

      let tempOutputVector = Mathjs.multiply(tempHiddenVector, this.hiddenWeights);

      this.outputVector = Mathjs.add(tempOutputVector, this.outputBias);

      this.turn = (this.sigmoid(this.outputVector.subset(Mathjs.index(0)))-this.sigmoid(this.outputVector.subset(Mathjs.index(7))) );
      this.thrust = (this.sigmoid(this.outputVector.subset(Mathjs.index(1)))* this.sigmoid(this.outputVector.subset(Mathjs.index(8)))) - 0.2 ;
      this.red = this.sigmoid(this.outputVector.subset(Mathjs.index(2))) ;
      this.green = this.sigmoid(this.outputVector.subset(Mathjs.index(3))) ;
      this.blue = this.sigmoid(this.outputVector.subset(Mathjs.index(4))) ;
      this.spike = this.sigmoid(this.outputVector.subset(Mathjs.index(5)))-0.5;
      this.give = this.sigmoid(this.outputVector.subset(Mathjs.index(6))) - 0.5;

      this.soundInput = 0.0;
      this.ouchie = 0.0;
      this.heat = 0.0;
      this.eyeAInput = { red:0, green: 0, blue:0 };
      this.eyeBInput = { red:0, green: 0, blue:0 };
      this.eyeCInput = { red:0, green: 0, blue:0 };

    }

    sigmoid(value){
      let result = 1.0/(1.0 + Mathjs.exp(-1 + value));

      return isNaN(result) ? 1.0 : result;
    }

    mutate(){
      let childBrain = new Brain();

      childBrain.inputWeights = this.inputWeights.map( function(value, index, matrix) {
        if(Math.random() > 0.6){
          return value * (Math.random() - 0.5) + value;
        }
        return value;
      });

      childBrain.outputBias = this.outputBias.map( function(value, index, matrix) {
        if(Math.random() > 0.9){
          return value * Math.random() +value;//weee
        }
        return value + value * 0.1;
      });


      childBrain.hiddenBias = this.hiddenBias.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          let newValue =  value + Math.random()-0.5;
          return newValue;
        }
        return value;
        });




      childBrain.hiddenWeights = this.hiddenWeights.map(function(value, index, matrix){
        if(Math.random() > 0.8){
          let newValue = Math.random() * value + Math.random() -0.5 + value ;
          return newValue;
        }
        return value;
      });


      return childBrain;
    }
}


module.exports = Brain;
