'use strict';

const Mathjs = require('mathjs');
const Bot   = require('../bot/Bot');


const INPUT_SIZE = 36;


class Dumber{



    constructor(){
      //this.body = body;
      this.smellMeat = 0.0;
      if(Math.random()>0.5){
        this.hawk = 0.0;
        this.dove = 1.0;
      }else{
        this.hawk = 1.0;
        this.dove = 0.0;
      }

      this.spike = 0.0;
      this.voice = 0.0;
      this.heat = 0.0;
      this.turn = 0.0;
      this.thrust = 0.0;
      this.clock = 0;
      //this.sound = 0.0;
      this.soundInput = 0.0;
      this.give = 0.0;
      this.ouchie = 0.0;
      this.age = 1;

      this.vision = { red:0, green: 0, blue:0 };
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
      this.turn1 =0.0;
      this.turn2=0.0;
      this.thrust1=0.0;
      this.thrust2=0.0;

      this.inputWeights = Mathjs.random(Mathjs.matrix([INPUT_SIZE, INPUT_SIZE]));


      this.hiddenBias = Mathjs.random([INPUT_SIZE]);

      this.hiddenWeights = Mathjs.random(Mathjs.matrix([INPUT_SIZE, INPUT_SIZE]));

      this.funkyWeights = Mathjs.random(Mathjs.matrix([INPUT_SIZE, INPUT_SIZE]));

      this.outputBias = Mathjs.random([INPUT_SIZE]);

      this.funkyBias = Mathjs.random([INPUT_SIZE]);



      let sin = function(x){
        return Mathjs.sin(x);
      }
      let cos = function(x){
        return Mathjs.cos(x);
      }
      let sigmoidSuck = function(x){
        let result = 1.0/(1.0 + Mathjs.exp(-1 + x));

        return isNaN(result) ? 1.0 : result;
      }
      let gausSuck = function(x){
        let result = ((Mathjs.PI) * Mathjs.exp((-1 * x*x)/Mathjs.PI));

        return isNaN(result) ? 1.0 : result;
      }
      let gausMoarSuck = function(x){
        let result = ( Mathjs.exp(-1 * x*x));

        return isNaN(result) ? 1.0 : result;
      }
      let sqrRoot = function (x){
        let result = Mathjs.sqrt(x);
          return isNaN(result) ? 1.0 : result;
      }
      let exp = function(x){
        let result = Mathjs.exp(x);
          return isNaN(result) ? 1.0 : result;
      }
      let log = function(x){
        let result = Mathjs.log(x);
          return isNaN(result) ? 1.0 : result;
      }
      let cube = function(x){
        return x*x*x;
      }
      let square = function(x){
        return x*x;
      }
      let minus = function(x){
        return -x;
      }
      let atan = function(x){
        return Mathjs.atan(x);
      }
      let acoth = function(x){
        return Mathjs.acoth(x);
      }
      let atanh = function(x){
        return Mathjs.atanh(x);
      }
      let erf = function(x){
        return Mathjs.erf(x);
      }

      let functions = [ erf, atanh, atan, acoth, minus, square, sin, cos, sigmoidSuck, gausSuck, sqrRoot, gausMoarSuck, cube];
      this.functions = functions;
      let meharray = new Array(INPUT_SIZE);
      for(var i=0;i<meharray.length;i++){
        meharray[i] = Mathjs.pickRandom(functions);
      }
      this.functionMap = meharray;

      this.gothVector = Mathjs.ones(Mathjs.matrix([INPUT_SIZE]))
      this.idgaf = Mathjs.matrix([
        [Mathjs.complex(1, 1)],
        [Mathjs.complex(1, -1)],
        [Mathjs.complex(-1, -1)],
        [Mathjs.complex(-1, 1)]
      ]);
      this.tonyAwards = Mathjs.matrix([
          Mathjs.pickRandom(functions),
          Mathjs.pickRandom(functions),
          Mathjs.pickRandom(functions),
          Mathjs.pickRandom(functions)
      ]);
    }

    tick(){

      this.clock++;
      this.clock %= 60;
      if(this.clock  == 0 ){
        this.age++;
      }
      this.ccClock = (this.clock - 30)/60;

      this.inputVector = Mathjs.matrix([

        this.vision.red,
        this.vision.blue,
        this.vision.green,

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
        this.ccClock,
        this.give,

        this.smellMeat,
        this.dove - this.hawk

        ]);



      let inputsConnectVector = Mathjs.multiply(this.inputWeights, this.inputVector);

      let tempHiddenVector = Mathjs.add(inputsConnectVector, this.hiddenBias);
      var values = tempHiddenVector.clone().valueOf();
      for(var i=0; i<this.functionMap.length;i++){
        var func = this.functionMap[i];
        values[i] = func(values[i]);
      }
      let funkyVector =  Mathjs.matrix(values);

      let discoTech = Mathjs.kron(funkyVector, this.idgaf);
      let gothbar = (Mathjs.transpose(discoTech));
      let christ = Mathjs.kron(this.gothVector, this.idgaf);
      let shitLands = Mathjs.multiply(gothbar, christ );
      let funkyTown = Mathjs.multiply(shitLands, this.funkyWeights);

      let hiddenVector = funkyTown.map(function(value, index, matrix){
        let magnitude =  Math.sqrt(Mathjs.multiply(Mathjs.conj(value), value));
        let angle = Mathjs.arg(value);

        let result = Mathjs.atan2(magnitude*Mathjs.cos(angle), magnitude*Math.sin(angle));

        return isNaN(result) ? 1.0 : result;
      });
      // let tempHiddenVector = Mathjs.add(inputsConnectVector, this.hiddenBias).map(function(value, index, matrix){
      //   let result = ((Math.PI) * Mathjs.exp(-1 * value*value)/Math.PI);
      //
      //   return isNaN(result) ? 1.0 : result;
      //   });

      let tempOutputMatrix = Mathjs.multiply(hiddenVector, this.hiddenWeights);
      let thisShitIsOutOfHand = Mathjs.multiply(tempOutputMatrix, this.inputVector);
      this.outputVector = Mathjs.add(thisShitIsOutOfHand, this.outputBias).map(function(value, index, matrix){
        let temp = Mathjs.exp((-1 * value*value));
        let result = Mathjs.erf(temp);
        return isNaN(result) ? 1.0 : result;
        });

      this.turn1 = (this.outputVector.subset(Mathjs.index(0))-0.5);
      this.thrust1 = (this.outputVector.subset(Mathjs.index(1)) -0.5)  ;
      this.turn2 = (this.outputVector.subset(Mathjs.index(7))-0.5);
      this.thrust2 = (this.outputVector.subset(Mathjs.index(8)) -0.5)  ;


      this.spike = (this.outputVector.subset(Mathjs.index(5))-0.5 -0.1*this.dove +0.1*this.hawk);

      this.give = (this.outputVector.subset(Mathjs.index(6))  -0.5);//+0.2*this.dove -0.2*this.hawk;

      this.voice = (this.outputVector.subset(Mathjs.index(10)) +
      (this.outputVector.subset(Mathjs.index(13))));//* Mathjs.compare(this.hawk-this.dove,this.dove-this.hawk);

      this.farts = (this.outputVector.subset(Mathjs.index(12))+
      (this.outputVector.subset(Mathjs.index(11))))>1.5;

      this.bodyColor.red = Mathjs.abs(this.outputVector.subset(Mathjs.index(2)));//* (this.hawk-this.dove);
      this.bodyColor.green = Mathjs.abs(this.outputVector.subset(Mathjs.index(3)));
      this.bodyColor.blue = Mathjs.abs(this.outputVector.subset(Mathjs.index(4)));//* (this.dove - this.hawk);

      this.eyeColorA.red =Mathjs.abs(this.outputVector.subset(Mathjs.index(14)));
      this.eyeColorA.blue =Mathjs.abs(this.outputVector.subset(Mathjs.index(15)));
      this.eyeColorA.green =Mathjs.abs(this.outputVector.subset(Mathjs.index(16)));
      this.eyeColorB.red =Mathjs.abs(this.outputVector.subset(Mathjs.index(17)));
      this.eyeColorB.green =Mathjs.abs(this.outputVector.subset(Mathjs.index(18)));
      this.eyeColorB.blue =Mathjs.abs(this.outputVector.subset(Mathjs.index(19)));
      this.eyeColorC.red =Mathjs.abs(this.outputVector.subset(Mathjs.index(20)));
      this.eyeColorC.blue =Mathjs.abs(this.outputVector.subset(Mathjs.index(21)));
      this.eyeColorC.green =Mathjs.abs(this.outputVector.subset(Mathjs.index(22)));

      this.strategy = (this.outputVector.subset(Mathjs.index(23)));


      this.soundInput = 0.0;
      this.ouchie = 0.0;
      this.heat = 0.0;
      this.vision = { red:0, green: 0, blue:0 };
      this.eyeAInput = { red:0, green: 0, blue:0 };
      this.eyeBInput = { red:0, green: 0, blue:0 };
      this.eyeCInput = { red:0, green: 0, blue:0 };
      this.eyeC2AInput = { red:0, green: 0, blue:0 };
      this.eyeC2BInput = { red:0, green: 0, blue:0 };
      this.eyeC3AInput = { red:0, green: 0, blue:0 };
      this.bodyInput = { red:0, green: 0, blue:0 };
    }

    sigmoid(value){
      let result = 1.0/(1.0 + Mathjs.exp(-1 + value));

      return isNaN(result) ? 1.0 : result;
    }

    mutate(){
      let childBrain = new Dumber();
      childBrain.hawk = this.hawk + (Math.random()-0.5)*.1;
      childBrain.dove = this.dove + (Math.random()-0.5)*.1;
      if(Math.random() > 0.5){
        childBrain.hawk*=-1;
        childBrain.dove*=-1;
      }

      childBrain.functionMap = this.functionMap;
      if(Math.random() < 0.9){
        var index = Mathjs.randomInt(this.functionMap.length);
        childBrain.functionMap[index] = Mathjs.pickRandom(this.functions);
      }

      childBrain.inputWeights = this.inputWeights.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          return  (Math.random() - 0.5)*(Math.random() - 0.5)+ value;
        }
        return value;
      });

      if(Math.random()< 0.1){
        childBrain.inputWeights = Mathjs.transpose(childBrain.inputWeights);
      }
      if(Math.random()< 0.1){
        childBrain.inputWeights = Mathjs.inv(childBrain.inputWeights);
      }

      childBrain.outputBias = this.outputBias.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          return (Math.random() - 0.5)*(Math.random() - 0.5) + value;
        }
        return value ;
      });

      if(Math.random()< 0.1){
        childBrain.outputBias = Mathjs.transpose(childBrain.outputBias);
      }
      // if(Math.random()< 0.2){
      //   childBrain.outputBias = Mathjs.inv(childBrain.outputBias);
      // }

      childBrain.hiddenBias = this.hiddenBias.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          let newValue =  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
          return newValue;
        }
        return value;
        });

        if(Math.random()< 0.1){
          childBrain.hiddenBias = Mathjs.transpose(childBrain.hiddenBias);
        }
        // if(Math.random()< 0.2){
        //   childBrain.hiddenBias = Mathjs.inv(childBrain.hiddenBias);
        // }

      childBrain.hiddenWeights = this.hiddenWeights.map(function(value, index, matrix){
        if(Math.random() > 0.8){
          let newValue = (Math.random() - 0.5)*(Math.random() - 0.5)  + value;
          return newValue;
        }

        return value;
      });

      if(Math.random()< 0.1){
        childBrain.hiddenWeights = Mathjs.transpose(childBrain.hiddenWeights);
      }
      if(Math.random()< 0.1){
        childBrain.hiddenWeights = Mathjs.inv(childBrain.hiddenWeights);
      }


      childBrain.funkyWeights = this.funkyWeights.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          return  (Math.random() - 0.5)*(Math.random() - 0.5)+ value;
        }
        return value;
      });

      if(Math.random()< 0.1){
        childBrain.funkyWeights = Mathjs.transpose(childBrain.funkyWeights);
      }
      if(Math.random()< 0.1){
        childBrain.funkyWeights = Mathjs.inv(childBrain.funkyWeights);
      }

      return childBrain;
    }
}


module.exports = Dumber;
