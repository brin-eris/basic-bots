'use strict';

const Nerdamer = require('nerdamer/all');


class Cppn {
  constructor() {


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
  }

    tick(){
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


      this.turn = 0;
      this.thrust = 0;
      this.red = 0;
      this.green = 0;
      this.blue = 0;
      this.spike = 0;
      this.give = 0;

      this.soundInput = 0.0;
      this.ouchie = 0.0;
      this.heat = 0.0;
      this.eyeAInput = { red:0, green: 0, blue:0 };
      this.eyeBInput = { red:0, green: 0, blue:0 };
      this.eyeCInput = { red:0, green: 0, blue:0 };

    }

    mutate(){}
}






module.exports = Cppn;
