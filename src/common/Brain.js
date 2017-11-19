'use strict';

const Mathjs = require('mathjs');

const INPUT_SIZE = 25;

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
      this.eyeC2AInput = { red:0, green: 0, blue:0 };
      this.eyeC2BInput = { red:0, green: 0, blue:0 };
      this.eyeC3AInput = { red:0, green: 0, blue:0 };

      this.inputWeights = Mathjs.ones(Mathjs.matrix([INPUT_SIZE, INPUT_SIZE]));


      this.hiddenBias = Mathjs.random([INPUT_SIZE], -1.5, 1.5);

      this.hiddenWeights = Mathjs.ones(Mathjs.matrix([INPUT_SIZE, INPUT_SIZE]));

      this.outputBias = Mathjs.random([INPUT_SIZE], -1.5, 1.5);

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
        this.eyeAInput.blue,
        this.eyeAInput.green,

        this.eyeBInput.red,
        this.eyeBInput.blue,
        this.eyeBInput.green,

        this.eyeCInput.red,
        this.eyeCInput.blue,
        this.eyeCInput.green,

        this.eyeC2AInput.red,
        this.eyeC2AInput.blue,
        this.eyeC2AInput.green,

        this.eyeC2BInput.red,
        this.eyeC2BInput.blue,
        this.eyeC2BInput.green,

        this.eyeC3AInput.red,
        this.eyeC3AInput.blue,
        this.eyeC3AInput.green,

        this.heat,
        this.turn1 - this.turn2,
        this.thrust1 - this.thrust2,
        this.soundInput,
        this.ouchie,
        this.life,
        Math.random()
        ]);


      let inputsConnectVector = Mathjs.multiply(this.inputWeights, this.inputVector);

      let tempHiddenVector = Mathjs.add(inputsConnectVector, this.hiddenBias).map(function(value, index, matrix){
        let result = 1.0/(1.0 + Mathjs.exp(-1 + value));

        return isNaN(result) ? 1.0 : result;
        });

      let tempOutputVector = Mathjs.multiply(tempHiddenVector, this.hiddenWeights);

      this.outputVector = Mathjs.add(tempOutputVector, this.outputBias);

      this.turn1 = (this.sigmoid(this.outputVector.subset(Mathjs.index(0)))*this.sigmoid(this.outputVector.subset(Mathjs.index(9)))*(this.sigmoid(this.outputVector.subset(Mathjs.index(10)))>0.5 ? -1:1 )  );
      this.thrust1 = (this.sigmoid(this.outputVector.subset(Mathjs.index(1))) - 0.49)/5  ;
      this.turn2 = (this.sigmoid(this.outputVector.subset(Mathjs.index(7)))*this.sigmoid(this.outputVector.subset(Mathjs.index(13)))*(this.sigmoid(this.outputVector.subset(Mathjs.index(12)))>0.5 ? -1:1 )  );
      this.thrust2 = (this.sigmoid(this.outputVector.subset(Mathjs.index(8))) - 0.49)/5  ;

      this.red = Math.abs(this.sigmoid(this.outputVector.subset(Mathjs.index(2)))  );
      this.green = Math.abs(this.sigmoid(this.outputVector.subset(Mathjs.index(3))) );
      this.blue = Math.abs(this.sigmoid(this.outputVector.subset(Mathjs.index(4)))  );
      this.spike = this.sigmoid(this.outputVector.subset(Mathjs.index(5)))-0.5;
      this.give = this.sigmoid(this.outputVector.subset(Mathjs.index(6))) - 0.5;

      this.soundInput = 0.0;
      this.ouchie = 0.0;
      this.heat = 0.0;
      this.eyeAInput = { red:0, green: 0, blue:0 };
      this.eyeBInput = { red:0, green: 0, blue:0 };
      this.eyeCInput = { red:0, green: 0, blue:0 };
      this.eyeC2AInput = { red:0, green: 0, blue:0 };
      this.eyeC2BInput = { red:0, green: 0, blue:0 };
      this.eyeC3AInput = { red:0, green: 0, blue:0 };
    }

    sigmoid(value){
      let result = 1.0/(1.0 + Mathjs.exp(-1 + value));

      return isNaN(result) ? 1.0 : result;
    }

    mutate(){
      let childBrain = new Brain();

      childBrain.inputWeights = this.inputWeights.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          return  (Math.random() - 0.5)*(Math.random()-0.5) + value;
        }
        return value;
      });

      childBrain.outputBias = this.outputBias.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          return (Math.random() - 0.5)*(Math.random()-0.5) +value;//weee
        }
        return value ;
      });


      childBrain.hiddenBias = this.hiddenBias.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          let newValue =  value +(Math.random()-0.5)*(Math.random()-0.5);
          return newValue;
        }
        return value;
        });


      childBrain.hiddenWeights = this.hiddenWeights.map(function(value, index, matrix){
        if(Math.random() > 0.8){
          let newValue = (Math.random()-0.5)*(Math.random()-0.5)   + value ;
          return newValue;
        }
        return value;
      });


      return childBrain;
    }
}


module.exports = Brain;
