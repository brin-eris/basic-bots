'use strict';

const Mathjs = require('mathjs');

const INPUT_SIZE = 45;
const VISION_MOD = 1.5;
const TOUCH_MOD = 0.9;


class BaseBrain{



    constructor(){
      this.inputSize = INPUT_SIZE;
      this.interestInMating = 0;

      this.voiceInput = 0;

      this.sexytime = 0;

      this.smellMeat = 0.0;
      this.memory1 = 0.0;
      this.memory2 = 0.0;
      this.memory3 = 0.0;
      this.memory4 = 0.0;
      this.memory5 = 0.0;
      this.memory6 = 0.0;
      this.memory7 = 0.0;
      this.memory8 = 0.0;
      this.ccClock = 0.0;
      this.turn1 = 0.0;
      this.turn2 = 0.0;
      this.thrust1 = 0.0;
      this.thrust2 = 0.0;
      this.sting = 0.0;
      this.voice = 0.0;

      this.turn = 0.0;
      this.thrust = 0.0;
      this.clock = 0;
      this.smell = Math.random();
      this.soundInput = 0.0;
      this.give = 0.0;

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

      this.base_body_color = {
        red: 0.5,
        green: 0.5,
        blue: 0.5
      };

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

        this.center_eye_vision.red*VISION_MOD*1.25,
        this.center_eye_vision.blue*VISION_MOD*1.25,
        this.center_eye_vision.green*VISION_MOD*1.25,

        this.left_eye_vision.red*VISION_MOD,
        this.left_eye_vision.blue*VISION_MOD,
        this.left_eye_vision.green*VISION_MOD,

        this.right_eye_vision.red*VISION_MOD,
        this.right_eye_vision.blue*VISION_MOD,
        this.right_eye_vision.green*VISION_MOD,



        this.bodyInput.red*TOUCH_MOD,
        this.bodyInput.blue*TOUCH_MOD,
        this.bodyInput.green*TOUCH_MOD,


        this.armAInput.red*TOUCH_MOD,
        this.armAInput.blue*TOUCH_MOD,
        this.armAInput.green*TOUCH_MOD,

        this.armBInput.red*TOUCH_MOD,
        this.armBInput.blue*TOUCH_MOD,
        this.armBInput.green*TOUCH_MOD,

         (this.armCInput.red +   this.armC2AInput.red +   this.armC2BInput.red + this.armC3AInput.red)*TOUCH_MOD,
         (this.armCInput.blue + this.armC2AInput.blue + this.armC2BInput.blue +   this.armC3AInput.blue)*TOUCH_MOD,
         (this.armCInput.green + this.armC2AInput.green + this.armC2BInput.green +   this.armC3AInput.green)*TOUCH_MOD,

         this.base_body_color.red,
         this.base_body_color.blue,
         this.base_body_color.green,

         (this.soundInput),
         (this.voiceInput),

         this.voice,
         this.sting,
         this.give,
        this.life,
        this.ccClock,

        this.smellMeat,
        this.memory1,
        this.memory2,
        this.memory3,
        this.memory4,
        this.memory5,
        this.memory6,
        this.memory7,
        this.memory8,
        Mathjs.e,
        Mathjs.PI,
        1,
        0,
        -1

        ]);

    }


    getOutputs(){
      let threshold = 0.0;
      this.turn1 = (this.outputVector.subset(Mathjs.index(0)) + this.outputVector.subset(Mathjs.index(1)))*0.75;//*Math.PI;
      this.thrust1 = (this.outputVector.subset(Mathjs.index(2)) + this.outputVector.subset(Mathjs.index(3)) + this.outputVector.subset(Mathjs.index(4)))*0.75 ;
      this.turn2 = (this.outputVector.subset(Mathjs.index(5))+ this.outputVector.subset(Mathjs.index(6)))*0.75;//*Math.PI;
      this.thrust2 = (this.outputVector.subset(Mathjs.index(7)) + this.outputVector.subset(Mathjs.index(8)) + this.outputVector.subset(Mathjs.index(9)))*0.75 ;



      this.sting =  (this.outputVector.subset(Mathjs.index(10)));

      this.give = (this.outputVector.subset(Mathjs.index(11)));

      this.voice = this.outputVector.subset(Mathjs.index(12)) ;

      this.farts = (this.outputVector.subset(Mathjs.index(13)) > threshold);


      this.bodyColor.red = (1.0 - this.life);
      this.bodyColor.blue =   this.sting > 0 ? this.sting : 0.0;
      this.bodyColor.green = this.give > 0 ? this.give : 0.0;

      this.armColorA.red = this.base_body_color.red;// + (this.outputVector.subset(Mathjs.index(4)) )/2 ;
      this.armColorA.blue =   this.base_body_color.blue;// + (this.outputVector.subset(Mathjs.index(5)))/2;//  + this.sting/2;
      this.armColorA.green =  this.base_body_color.green;// + (this.outputVector.subset(Mathjs.index(6)))/2;//  + this.give/2;

      this.armColorB.red = this.base_body_color.red;// + (this.outputVector.subset(Mathjs.index(4)))/2;//
      this.armColorB.blue =  this.base_body_color.blue;// +  (this.outputVector.subset(Mathjs.index(5)))/2;//  + this.sting/2;
      this.armColorB.green =  this.base_body_color.green;// +  (this.outputVector.subset(Mathjs.index(6)))/2;// + this.give/2;

      this.armColorC.red = this.base_body_color.red;// + (this.outputVector.subset(Mathjs.index(4)))/2;//
      this.armColorC.blue = this.base_body_color.blue;// + (this.outputVector.subset(Mathjs.index(5)))/2;// + this.sting/2;
      this.armColorC.green =  this.base_body_color.green;// + (this.outputVector.subset(Mathjs.index(6)))/2;// + this.give/2;

      //this.interestInMating = (this.outputVector.subset(Mathjs.index(11))+this.outputVector.subset(Mathjs.index(26)));


      this.memory1 = ((this.outputVector.subset(Mathjs.index(14)) + this.outputVector.subset(Mathjs.index(22)))) ;
      this.memory2 = ((this.outputVector.subset(Mathjs.index(15)) + this.outputVector.subset(Mathjs.index(23)))) ;
      this.memory3 = ((this.outputVector.subset(Mathjs.index(16)) + this.outputVector.subset(Mathjs.index(24)))) ;
      this.memory4 = ((this.outputVector.subset(Mathjs.index(17)) + this.outputVector.subset(Mathjs.index(25)))) ;
      this.memory5 = ((this.outputVector.subset(Mathjs.index(18)) + this.outputVector.subset(Mathjs.index(26)))) ;
      this.memory6 = ((this.outputVector.subset(Mathjs.index(19)) + this.outputVector.subset(Mathjs.index(27)))) ;
      this.memory7 = ((this.outputVector.subset(Mathjs.index(20)) + this.outputVector.subset(Mathjs.index(28)))) ;
      this.memory8 = ((this.outputVector.subset(Mathjs.index(21)) + this.outputVector.subset(Mathjs.index(29)))) ;


    }

    cleanupInputs(){
      let degridation = 0.0;
      let vision_degridation = 0.0;

      this.sexytime  *= degridation;

      // this.memory1 *= degridation;
      // this.memory2 *= degridation;
      // this.memory3 *= degridation;
      // this.memory4 *= degridation;


      this.smellMeat  *= degridation;
      this.soundInput *= degridation;
      this.voiceInput *= degridation;

      this.center_eye_vision.red *= vision_degridation;
      this.center_eye_vision.blue *= vision_degridation;
      this.center_eye_vision.green *= vision_degridation;

      this.left_eye_vision.red *= vision_degridation;
      this.left_eye_vision.blue *= vision_degridation;
      this.left_eye_vision.green *= vision_degridation;

      this.right_eye_vision.red *= vision_degridation;
      this.right_eye_vision.blue *= vision_degridation;
      this.right_eye_vision.green *= vision_degridation;



      this.bodyInput.red *= degridation;
      this.bodyInput.blue *= degridation;
      this.bodyInput.green *= degridation;


      this.armAInput.red *= degridation;
      this.armAInput.blue *= degridation;
      this.armAInput.green *= degridation;

      this.armBInput.red *= degridation;
      this.armBInput.blue *= degridation;
      this.armBInput.green *= degridation;

      // this.center_eye_vision = { red:0, green: 0, blue:0 };
      // this.left_eye_vision = { red:0, green: 0, blue:0 };
      // this.right_eye_vision = { red:0, green: 0, blue:0 };
      // this.armAInput = { red:0, green: 0, blue:0 };
      // this.armBInput = { red:0, green: 0, blue:0 };
      this.armCInput = { red:0, green: 0, blue:0 };
      this.armC2AInput = { red:0, green: 0, blue:0 };
      this.armC2BInput = { red:0, green: 0, blue:0 };
      this.armC3AInput = { red:0, green: 0, blue:0 };
      //this.bodyInput = { red:0, green: 0, blue:0 };
    }


    tick(){
      this.getInputs();
      this.outputVector = this.doMagic(this.inputVector);
      this.getOutputs();
      this.cleanupInputs();
    }

    clamps(value){
      let result = Math.max(Math.min(value,1.0),-1.0);
      return result;
    }

}


module.exports = BaseBrain;
