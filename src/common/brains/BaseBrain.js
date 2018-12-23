'use strict';

const Mathjs = require('mathjs');

const INPUT_SIZE = 43;


class BaseBrain{



    constructor(){
      this.inputSize = INPUT_SIZE;

      this.voiceInput = 0;
      this.isPreggers = 0;
      this.sexytime = 0;
      this.happy = 0;
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
      this.armAInput = { red:0, green: 0, blue:0 };
      this.armBInput = { red:0, green: 0, blue:0 };
      this.armCInput = { red:0, green: 0, blue:0 };
      this.armC2AInput = { red:0, green: 0, blue:0 };
      this.armC2BInput = { red:0, green: 0, blue:0 };
      this.armC3AInput = { red:0, green: 0, blue:0 };

      this.bodyColor = { red:0, green: 0, blue:0 };
      this.armColorA = { red:0, green: 0, blue:0 };
      this.armColorB = { red:0, green: 0, blue:0 };
      this.armColorC = { red:0, green: 0, blue:0 };
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


        this.armAInput.red,
        this.armAInput.blue,
        this.armAInput.green,

        this.armBInput.red,
        this.armBInput.blue,
        this.armBInput.green,

        this.armCInput.red +   this.armC2AInput.red +   this.armC2BInput.red + this.armC3AInput.red,
        this.armCInput.blue + this.armC2AInput.blue + this.armC2BInput.blue +   this.armC3AInput.blue,
        this.armCInput.green + this.armC2AInput.green + this.armC2BInput.green +   this.armC3AInput.green,

         this.bodyColor.red,
         this.bodyColor.blue,
         this.bodyColor.green,

         this.voiceInput,
         this.isPreggers,
         this.sting,
         this.voice,
        this.heat,
        this.gestation,
        this.soundInput,
        this.ouchie,
        this.happy,
        this.life,
        this.ccClock,
         this.give,
        this.smellMeat,
        this.memory1,
        this.memory2,
        this.memory3,
        this.memory4,
        Math.random()*2 - 1.0,
        this.sexytime
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


      this.armColorA.red = Mathjs.abs(this.outputVector.subset(Mathjs.index(12)));// + this.sting;
      this.armColorA.blue = Mathjs.abs(this.outputVector.subset(Mathjs.index(13)));// + this.give;
      this.armColorA.green = Mathjs.abs(this.outputVector.subset(Mathjs.index(14)));

      this.armColorB.red = Mathjs.abs(this.outputVector.subset(Mathjs.index(15)));// + this.sting;
      this.armColorB.blue = Mathjs.abs(this.outputVector.subset(Mathjs.index(16)));// + this.give;
      this.armColorB.green = Mathjs.abs(this.outputVector.subset(Mathjs.index(17)));

      this.armColorC.red = Mathjs.abs(this.outputVector.subset(Mathjs.index(18)));// + this.sting;
      this.armColorC.blue = Mathjs.abs(this.outputVector.subset(Mathjs.index(19)));// + this.give;
      this.armColorC.green = Mathjs.abs(this.outputVector.subset(Mathjs.index(20)));

      this.interestInMating = (this.outputVector.subset(Mathjs.index(21)));

      this.wantEat = (this.outputVector.subset(Mathjs.index(11)));
      this.memory1 = this.outputVector.subset(Mathjs.index(22));
      this.memory2 = this.outputVector.subset(Mathjs.index(23));
      this.memory3 = this.outputVector.subset(Mathjs.index(24));
      this.memory4 = this.outputVector.subset(Mathjs.index(25));

    //  this.pivotEye1 =  this.outputVector.subset(Mathjs.index(26)) * this.outputVector.subset(Mathjs.index(28))/5;
    //  this.pivotEye2 =  this.outputVector.subset(Mathjs.index(27)) * this.outputVector.subset(Mathjs.index(29))/5;
    }

    cleanupInputs(){
      this.sexytime  = 0.5*  this.sexytime;
      if(this.sexytime <0.01){
        this.sexytime = 0;
      }
        this.happy  = 0.5*  this.happy;
        if(this.happy <0.01){
          this.happy = 0;
        }
          this.ouchie = 0.5 * this.ouchie;
          if(this.ouchie <0.01){
            this.ouchie = 0;
          }
      this.smellMeat  = 0.0;
      this.soundInput = 0.0;
      this.voiceInput = 0.0;
      this.heat = 0.0;
      this.center_eye_vision = { red:0, green: 0, blue:0 };
      this.left_eye_vision = { red:0, green: 0, blue:0 };
      this.right_eye_vision = { red:0, green: 0, blue:0 };
      this.armAInput = { red:0, green: 0, blue:0 };
      this.armBInput = { red:0, green: 0, blue:0 };
      this.armCInput = { red:0, green: 0, blue:0 };
      this.armC2AInput = { red:0, green: 0, blue:0 };
      this.armC2BInput = { red:0, green: 0, blue:0 };
      this.armC3AInput = { red:0, green: 0, blue:0 };
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
