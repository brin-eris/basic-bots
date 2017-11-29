'use strict';

const Mathjs = require('mathjs');

const INPUT_SIZE = 43;


class BaseBrain{



    constructor(){
      this.inputSize = INPUT_SIZE;

      this.smellMeat = 0.0;
      if(Math.random()>0.5){
        this.hawk = 0.0;
        this.dove = 1.0;
      }else{
        this.hawk = 1.0;
        this.dove = 0.0;
      }
      this.ccClock = 0.0;
      this.turn1 = 0.0;
      this.turn2 = 0.0;
      this.thrust1 = 0.0;
      this.thrust2 = 0.0;
      this.spike = 0.0;
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

    }

    getInputs(){
      this.clock++;
      this.clock %= 60;
      if(this.clock  == 0 ){
        this.age++;
      }
      this.ccClock = (this.clock - 30)/60;

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


        this.spike,
        this.voice,
        this.heat,
        this.turn1 - this.turn2,
        this.thrust1 - this.thrust2,
        this.soundInput,
        this.ouchie,
        this.life,
        Mathjs.sin(this.ccClock*Mathjs.PI/180),
        this.give,
        Mathjs.PI,
        this.smellMeat,
        this.dove - this.hawk
        ]);

    }


    getOutputs(){
      this.turn1 = (this.outputVector.subset(Mathjs.index(30))-0.5);
      this.thrust1 = (this.outputVector.subset(Mathjs.index(31)) - 0.5)  ;
      this.turn2 = (this.outputVector.subset(Mathjs.index(40))-0.5);
      this.thrust2 = (this.outputVector.subset(Mathjs.index(41)) - 0.5)  ;


      this.spike = (this.outputVector.subset(Mathjs.index(5))-0.5 -0.1*this.dove +0.1*this.hawk);//-0.2*this.dove +0.2*this.hawk);

      this.give = 0;//(this.outputVector.subset(Mathjs.index(6)) - 0.5 +0.1*this.dove -0.1*this.hawk);//+0.2*this.dove -0.2*this.hawk;

      this.voice = (this.outputVector.subset(Mathjs.index(10)) +
      (this.outputVector.subset(Mathjs.index(13))))/2;//* Mathjs.compare(this.hawk-this.dove,this.dove-this.hawk);

      this.farts = (this.outputVector.subset(Mathjs.index(12))+
      (this.outputVector.subset(Mathjs.index(11))))/2>0.75;

      this.bodyColor.red = (this.outputVector.subset(Mathjs.index(2)));//* (this.hawk-this.dove);
      this.bodyColor.green = (this.outputVector.subset(Mathjs.index(3)));
      this.bodyColor.blue = (this.outputVector.subset(Mathjs.index(4)));//* (this.dove - this.hawk);

      this.eyeColorA.red =(this.outputVector.subset(Mathjs.index(14)));
      this.eyeColorA.blue =(this.outputVector.subset(Mathjs.index(15)));
      this.eyeColorA.green =(this.outputVector.subset(Mathjs.index(16)));
      this.eyeColorB.red =(this.outputVector.subset(Mathjs.index(17)));
      this.eyeColorB.green =(this.outputVector.subset(Mathjs.index(18)));
      this.eyeColorB.blue =(this.outputVector.subset(Mathjs.index(19)));
      this.eyeColorC.red =(this.outputVector.subset(Mathjs.index(20)));
      this.eyeColorC.blue =(this.outputVector.subset(Mathjs.index(21)));
      this.eyeColorC.green =(this.outputVector.subset(Mathjs.index(22)));

      this.interestedInMating = ((this.outputVector.subset(Mathjs.index(23))-0.5)+
      (this.outputVector.subset(Mathjs.index(24))-0.5)+
      (this.outputVector.subset(Mathjs.index(25))-0.5))>0.0;

      this.wantEat = (this.outputVector.subset(Mathjs.index(26))-0.5);
      //this.strategy = (this.outputVector.subset(Mathjs.index(23)));

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
