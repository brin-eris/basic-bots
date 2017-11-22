// 'use strict';
//
// const Mathjs = require('mathjs');
// const Bot   = require('./Bot');
//
//
//
// class BaseBrain{
//
//
//
//     constructor(bot){
//       this.bot = bot;
//
//       bot.smellMeat = 0.0;
//
//       if(Math.random()>0.5){
//         this.hawk = 0.0;
//         this.dove = 1.0;
//       }else{
//         this.hawk = 1.0;
//         this.dove = 0.0;
//       }
//
//       bot.spike = 0.0;
//       bot.voice = 0.0;
//       bot.heat = 0.0;
//       bot.turn = 0.0;
//       bot.thrust = 0.0;
//
//       this.clock = 0;
//
//       this.red = 0.0;
//       this.green = 0.0;
//       this.blue = 0.0;
//
//
//       bot.soundInput = 0.0;
//       bot.give = 0.0;
//       bot.ouchie = 0.0;
//       bot.age = 1;
//
//       bot.bodyInput = { red:0, green: 0, blue:0 };
//       bot.eyeAInput = { red:0, green: 0, blue:0 };
//       bot.eyeBInput = { red:0, green: 0, blue:0 };
//       bot.eyeCInput = { red:0, green: 0, blue:0 };
//       bot.eyeC2AInput = { red:0, green: 0, blue:0 };
//       bot.eyeC2BInput = { red:0, green: 0, blue:0 };
//       bot.eyeC3AInput = { red:0, green: 0, blue:0 };
//
//       bot.eyeColorA = { red:0, green: 0, blue:0 };
//       bot.eyeColorB = { red:0, green: 0, blue:0 };
//       bot.eyeColorC = { red:0, green: 0, blue:0 };
//
//
//     }
//
//     tick(){
//       let bot = this.bot;
//       this.clock++;
//       this.clock %= 60;
//       if(this.clock  == 0 ){
//         bot.age++;
//       }
//       this.ccClock = (this.clock - 30)/60;
//
//       this.inputVector = Mathjs.matrix([
//
//         bot.bodyInput.red,
//         bot.bodyInput.blue,
//         bot.bodyInput.green,
//
//
//         bot.eyeAInput.red,
//         bot.eyeAInput.blue,
//         bot.eyeAInput.green,
//
//         bot.eyeBInput.red,
//         bot.eyeBInput.blue,
//         bot.eyeBInput.green,
//
//         bot.eyeCInput.red,
//         bot.eyeCInput.blue,
//         bot.eyeCInput.green,
//
//         bot.eyeC2AInput.red,
//         bot.eyeC2AInput.blue,
//         bot.eyeC2AInput.green,
//
//         bot.eyeC2BInput.red,
//         bot.eyeC2BInput.blue,
//         bot.eyeC2BInput.green,
//
//         bot.eyeC3AInput.red,
//         bot.eyeC3AInput.blue,
//         bot.eyeC3AInput.green,
//
//         bot.spike,
//         bot.voice,
//         bot.heat,
//         bot.turn1 - bot.turn2,
//         bot.thrust1 - bot.thrust2,
//         this.soundInput,
//         this.ouchie,
//         this.life,
//         this.ccClock,
//         this.give,
//
//         this.smellMeat,
//         this.dove - this.hawk
//         ]);
//
//
//       let inputsConnectVector = Mathjs.multiply(this.inputWeights, this.inputVector);
//
//       let tempHiddenVector = Mathjs.add(inputsConnectVector, this.hiddenBias).map(function(value, index, matrix){
//         let result = ((Math.PI) * Mathjs.exp(-1 * value*value)/Math.PI);
//
//         return isNaN(result) ? 1.0 : result;
//         });
//
//       let tempOutputVector = Mathjs.multiply(tempHiddenVector, this.hiddenWeights);
//
//       this.outputVector = Mathjs.add(tempOutputVector, this.outputBias).map(function(value, index, matrix){
//         let result = 1.0/(1.0 + Mathjs.exp(-1 + value));
//
//         return isNaN(result) ? 1.0 : result;
//         });
//
//       this.turn1 = (this.outputVector.subset(Mathjs.index(0))-0.5);
//       this.thrust1 = (this.outputVector.subset(Mathjs.index(1)) - 0.5)  ;
//       this.turn2 = (this.outputVector.subset(Mathjs.index(7))-0.5);
//       this.thrust2 = (this.outputVector.subset(Mathjs.index(8)) - 0.5)  ;
//
//
//       this.spike = (this.outputVector.subset(Mathjs.index(5))-0.5 );//-0.2*this.dove +0.2*this.hawk);
//
//       this.give = (this.outputVector.subset(Mathjs.index(6)) - 0.5 );//+0.2*this.dove -0.2*this.hawk;
//
//       this.voice = (this.outputVector.subset(Mathjs.index(10)) +
//       (this.outputVector.subset(Mathjs.index(13))));//* Mathjs.compare(this.hawk-this.dove,this.dove-this.hawk);
//
//       this.farts = (this.outputVector.subset(Mathjs.index(12))+
//       (this.outputVector.subset(Mathjs.index(11))))>1.5;
//
//       this.red = (this.outputVector.subset(Mathjs.index(2)));//* (this.hawk-this.dove);
//       this.green = (this.outputVector.subset(Mathjs.index(3)));
//       this.blue = (this.outputVector.subset(Mathjs.index(4)));//* (this.dove - this.hawk);
//
//       this.eyeColorA.red =(this.outputVector.subset(Mathjs.index(14)));
//       this.eyeColorA.blue =(this.outputVector.subset(Mathjs.index(15)));
//       this.eyeColorA.green =(this.outputVector.subset(Mathjs.index(16)));
//       this.eyeColorB.red =(this.outputVector.subset(Mathjs.index(17)));
//       this.eyeColorB.green =(this.outputVector.subset(Mathjs.index(18)));
//       this.eyeColorB.blue =(this.outputVector.subset(Mathjs.index(19)));
//       this.eyeColorC.red =(this.outputVector.subset(Mathjs.index(20)));
//       this.eyeColorC.blue =(this.outputVector.subset(Mathjs.index(21)));
//       this.eyeColorC.green =(this.outputVector.subset(Mathjs.index(22)));
//
//       this.strategy = (this.outputVector.subset(Mathjs.index(23)));
//
//
//       this.soundInput = 0.0;
//       this.ouchie = 0.0;
//       this.heat = 0.0;
//       this.eyeAInput = { red:0, green: 0, blue:0 };
//       this.eyeBInput = { red:0, green: 0, blue:0 };
//       this.eyeCInput = { red:0, green: 0, blue:0 };
//       this.eyeC2AInput = { red:0, green: 0, blue:0 };
//       this.eyeC2BInput = { red:0, green: 0, blue:0 };
//       this.eyeC3AInput = { red:0, green: 0, blue:0 };
//       this.bodyInput = { red:0, green: 0, blue:0 };
//     }
//
//
//
//     sigmoid(value){
//       let result = 1.0/(1.0 + Mathjs.exp(-1 + value));
//
//       return isNaN(result) ? 1.0 : result;
//     }
//
//     mutate(){
//       let childBrain = new Brain();
//       }
//       return childBrain;
//     }
// }
//
//
// module.exports = BaseBrain;
