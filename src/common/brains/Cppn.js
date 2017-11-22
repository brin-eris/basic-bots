// 'use strict';
//
// const Nerdamer = require('nerdamer/all');
//
//
// class Cppn {
//   constructor(bot) {
//           this.bot = bot;
//
//           bot.heat = 0.0;
//           bot.turn = 0.0;
//           bot.thrust = 0.0;
//           bot.clock = 0;
//           bot.bodyColor = { red:0, green: 0, blue:0 };
//           bot.sound = 0.0;
//           bot.soundInput = 1.0;
//           bot.give = 0.0;
//           bot.ouchie = 0.0;
//           bot.age = 0;
//           bot.eyeAInput = { red:0, green: 0, blue:0 };
//           bot.eyeBInput = { red:0, green: 0, blue:0 };
//           bot.eyeCInput = { red:0, green: 0, blue:0 };
//   }
//
//     tick(){
//         bot = this.bot;
//       this.inputVector = Mathjs.matrix([
//         bot.eyeAInput.red,
//         bot.eyeBInput.red,
//         bot.eyeCInput.red,
//         bot.eyeAInput.blue,
//         bot.eyeBInput.blue,
//         bot.eyeCInput.blue,
//         bot.eyeAInput.green,
//         bot.eyeBInput.green,
//         this.eyeCInput.green,
//         this.heat,
//         this.turn,
//         this.thrust,
//         this.soundInput,
//         this.ouchie,
//         this.life
//         ]);
//
//
//       this.turn = 0;
//       this.thrust = 0;
//       this.red = 0;
//       this.green = 0;
//       this.blue = 0;
//       this.spike = 0;
//       this.give = 0;
//
//       this.soundInput = 0.0;
//       this.ouchie = 0.0;
//       this.heat = 0.0;
//       this.eyeAInput = { red:0, green: 0, blue:0 };
//       this.eyeBInput = { red:0, green: 0, blue:0 };
//       this.eyeCInput = { red:0, green: 0, blue:0 };
//
//     }
//
//     mutate(){}
// }
//
//
//
//
//
//
// module.exports = Cppn;
