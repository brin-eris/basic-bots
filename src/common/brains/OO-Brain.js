// 'use strict';
//
// const Mathjs = require('mathjs');
//
// const BaseBrain = require('./BaseBrain');
//
//
// class OOBrain extends BaseBrain{
//
//
//   static create_new(){
//     let brain = new OOBrain();
//
//     return brain;
//   }
//
//     constructor(){
//       super();
//      var mutation_rate = 0.4;
//
//      this.nodes = Mathjs.matrix([]};
//
//      this.functions = buildFunctionsArray();
//
//      this.functionMapX  = new Array(5);
//          for(var i=0; i<this.functionMapX.length; i++){
//            this.functionMapX[i] = Mathjs.pickRandom(this.functions);
//      }
//
//      this.functionMapY  = new Array(5);
//          for(var i=0; i<this.functionMapY.length; i++){
//            this.functionMapY[i] = Mathjs.pickRandom(this.functions);
//      }
//
//     }
//
//     doMagic(input_vector){
//
//
//
//         return input_vector;
//     }
//
//     buildFunctionsArray(){
//       let sin = function(x){
//         return Mathjs.sin(x);
//       }
//       let cos = function(x){
//         return Mathjs.cos(x);
//       }
//       let sigmoidSuck = function(x){
//         let result = 1.0/(1.0 + Mathjs.exp(-1 * x));
//
//         return isNaN(result) ? 1.0 : result;
//       }
//       let gausSuck = function(x){
//         let result = (1/(Mathjs.PI) * Mathjs.exp((-1 * x*x)/Mathjs.PI));
//
//         return isNaN(result) ? 1.0 : result;
//       }
//       let gausMoarSuck = function(x){
//         let result = ( Mathjs.exp(-1 * x*x));
//
//         return isNaN(result) ? 1.0 : result;
//       }
//       let sqrRoot = function (x){
//         let result = Mathjs.sqrt(x);
//           return isNaN(result) ? 1.0 : result;
//       }
//       let exp = function(x){
//         let result = Mathjs.exp(x);
//           return isNaN(result) ? 1.0 : result;
//       }
//       let log = function(x){
//         let result = Mathjs.log(x);
//           return isNaN(result) ? 1.0 : result;
//       }
//       let cube = function(x){
//         return x*x*x;
//       }
//       let square = function(x){
//         return x*x;
//       }
//       let minus = function(x){
//         return -x;
//       }
//       let tanh = function(x){
//         return Mathjs.tanh(x);
//       }
//
//       let erf = function(x){
//         return Mathjs.erf(x);
//       }
//
//       let functions = [tanh, square, minus, cube, erf, sin, cos, sigmoidSuck, gausSuck, gausMoarSuck];
//       return functions
//     }
//
//     get_half_chromosomes(){
//
//       return {
//         channel_A: {},
//         channel_B:{}
//       };
//     }
//
//     rebuild(channel_A, channel_B){
//
//     }
//
//     mutate(){
//       let childBrain = new OOBrain();
//
//       return childBrain;
//     }
//
//     mutate_layer(layer){
//
//     }
//
//
//     clone(){
//       let neo = new OOBrain();
//
//       return neo;
//     }
// }
//
//
// module.exports = OOBrain;
