'use strict';

const Mathjs = require('mathjs');

const INPUT_SIZE = 39;


class BaseBrain{



    constructor(){
      this.inputSize = INPUT_SIZE;

      this.smellMeat = 0.0;
      this.memory1 = 0.0;
      this.memory2 = 0.0;
      this.memory3 = 0.0;
      this.memory4 = 0.0;
      this.ccClock = 0.0;
      this.turn1 = 0.0;
      this.turn2 = 0.0;
      this.thrust1 = 0.0;
      this.thrust2 = 0.0;
      this.sting = 0.0;
      this.voice = 0.0;
      this.heat = 0.0;
      this.turn = 0.0;
      this.thrust = 0.0;
      this.clock = 0;
      this.smell = Math.random();
      this.soundInput = 0.0;
      this.give = 0.0;
      this.ouchie = 0.0;
      this.age = 1;
      this.life = 1.0

      this.center_eye_vision = { red:0, green: 0, blue:0 };
      this.left_eye_vision = { red:0, green: 0, blue:0 };
      this.right_eye_vision = { red:0, green: 0, blue:0 };

      this.bodyInput = { red:0, green: 0, blue:0 };
      this.eyeAInput = { red:0, green: 0, blue:0 };
      this.eyeBInput = { red:0, green: 0, blue:0 };
      this.eyeCInput = { red:0, green: 0, blue:0 };
      this.eyeC2AInput = { red:0, green: 0, blue:0 };
      this.eyeC2BInput = { red:0, green: 0, blue:0 };
      this.eyeC3AInput = { red:0, green: 0, blue:0 };

      this.bodyColor = { red:0, green: 0, blue:0 };
      this.eyeColorA = { red:0, green: 0, blue:0 };
      this.eyeColorB = { red:0, green: 0, blue:0 };
      this.eyeColorC = { red:0, green: 0, blue:0 };
      this.tailForce = 0;
    }

    getInputs(){
      this.clock++;
      this.clock %= 60;
      if(this.clock  == 0 ){
        this.age++;
      }
      this.ccClock = (this.clock - 30)/30;

      this.inputVector = Mathjs.matrix([

        this.center_eye_vision.red,
        this.center_eye_vision.blue,
        this.center_eye_vision.green,

        this.left_eye_vision.red,
        this.left_eye_vision.blue,
        this.left_eye_vision.green,

        this.right_eye_vision.red,
        this.right_eye_vision.blue,
        this.right_eye_vision.green,

        this.bodyInput.red,
        this.bodyInput.blue,
        this.bodyInput.green,


        this.eyeAInput.red,
        this.eyeAInput.blue,
        this.eyeAInput.green,

        this.eyeBInput.red,
        this.eyeBInput.blue,
        this.eyeBInput.green,

        this.eyeCInput.red +   this.eyeC2AInput.red +   this.eyeC2BInput.red + this.eyeC3AInput.red,
        this.eyeCInput.blue + this.eyeC2AInput.blue + this.eyeC2BInput.blue +   this.eyeC3AInput.blue,
        this.eyeCInput.green + this.eyeC2AInput.green + this.eyeC2BInput.green +   this.eyeC3AInput.green,

         this.bodyColor.red,
         this.bodyColor.blue,
         this.bodyColor.green,


         this.sting,
         this.voice,
        this.heat,
        this.gestation,
        this.soundInput,
        this.ouchie,
        this.life,
        this.ccClock,
         this.give,
        this.smellMeat,
        this.memory1,
        this.memory2,
        this.memory3,
        this.memory4,
        Math.random()*2 - 1.0
        ]);

    }


    getOutputs(){
      let threshold = 0.0;
      this.turn1 = (this.outputVector.subset(Mathjs.index(0)) - threshold );//*Math.PI;
      this.thrust1 = (this.outputVector.subset(Mathjs.index(1)) - threshold) ;
      this.turn2 = (this.outputVector.subset(Mathjs.index(2)) - threshold);//*Math.PI;
      this.thrust2 = (this.outputVector.subset(Mathjs.index(3)) - threshold)  ;

      this.bodyColor.red = Mathjs.abs(this.outputVector.subset(Mathjs.index(4))) ;
      this.bodyColor.green = Mathjs.abs(this.outputVector.subset(Mathjs.index(5)));
      this.bodyColor.blue = Mathjs.abs(this.outputVector.subset(Mathjs.index(6))) ;


      this.sting = Mathjs.abs(this.outputVector.subset(Mathjs.index(7)));

      this.give = Mathjs.abs(this.outputVector.subset(Mathjs.index(8)));

      this.voice = this.outputVector.subset(Mathjs.index(9)) ;//* Mathjs.compare(this.hawk-this.dove,this.dove-this.hawk);

      this.farts = (this.outputVector.subset(Mathjs.index(10)) > threshold);


      this.eyeColorA.red = Mathjs.abs(this.outputVector.subset(Mathjs.index(12))) + this.sting;
      this.eyeColorA.blue = Mathjs.abs(this.outputVector.subset(Mathjs.index(13))) + this.give;
      this.eyeColorA.green = Mathjs.abs(this.outputVector.subset(Mathjs.index(14)));

      this.eyeColorB.red = Mathjs.abs(this.outputVector.subset(Mathjs.index(15))) + this.sting;
      this.eyeColorB.blue = Mathjs.abs(this.outputVector.subset(Mathjs.index(16))) + this.give;
      this.eyeColorB.green = Mathjs.abs(this.outputVector.subset(Mathjs.index(17)));

      this.eyeColorC.red = Mathjs.abs(this.outputVector.subset(Mathjs.index(18))) + this.sting;
      this.eyeColorC.blue = Mathjs.abs(this.outputVector.subset(Mathjs.index(19))) + this.give;
      this.eyeColorC.green = Mathjs.abs(this.outputVector.subset(Mathjs.index(20)));

      this.interestedInMating = (this.outputVector.subset(Mathjs.index(21)))>threshold;

      this.wantEat = (this.outputVector.subset(Mathjs.index(11))>threshold);
      this.memory1 = this.outputVector.subset(Mathjs.index(22));
      this.memory2 = this.outputVector.subset(Mathjs.index(23));
      this.memory3 = this.outputVector.subset(Mathjs.index(24));
      this.memory4 = this.outputVector.subset(Mathjs.index(25));
    }

    cleanupInputs(){
      this.smellMeat  = 0.0;
      this.soundInput = 0.0;
      this.ouchie = 0.0;
      this.heat = 0.0;
      this.center_eye_vision = { red:0, green: 0, blue:0 };
      this.left_eye_vision = { red:0, green: 0, blue:0 };
      this.right_eye_vision = { red:0, green: 0, blue:0 };
      this.eyeAInput = { red:0, green: 0, blue:0 };
      this.eyeBInput = { red:0, green: 0, blue:0 };
      this.eyeCInput = { red:0, green: 0, blue:0 };
      this.eyeC2AInput = { red:0, green: 0, blue:0 };
      this.eyeC2BInput = { red:0, green: 0, blue:0 };
      this.eyeC3AInput = { red:0, green: 0, blue:0 };
      this.bodyInput = { red:0, green: 0, blue:0 };
    }


    tick(){
      this.getInputs();
      this.outputVector = this.doMagic(this.inputVector);
      this.getOutputs();
      this.cleanupInputs();
    }

    sigmoid(value){
      let result = 1.0/(1.0 + Mathjs.exp(-1 + value));

      return isNaN(result) ? 1.0 : result;
    }

      // mutate(child){
      //   child.smell = this.smell + this.smell * (Math.random() - 0.5)*0.1;
      // }
      clamp(value){
        Math.max(Math.min(value,1.0),0);
      }
}


module.exports = BaseBrain;
