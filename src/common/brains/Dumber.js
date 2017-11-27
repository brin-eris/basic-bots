'use strict';

const Mathjs = require('mathjs');
const Bot   = require('../bot/Bot');
const BaseBrain = require('./BaseBrain');

class Dumber extends BaseBrain{

    constructor(){
      super();

      this.inputWeights = Mathjs.ones(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });

      this.inputBias = Mathjs.zeros([this.inputSize]).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });

      this.hiddenLayerWeights = Mathjs.ones(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });
      this.hiddenLayerBias = Mathjs.zeros([this.inputSize]).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });

      this.funkyWeights = Mathjs.ones(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });

      this.funkyBias = Mathjs.random([this.inputSize]);
      this.functions = this.buildFunctionsArray();
      this.numLayers = 1;


      this.buildLayers();
    }

    buildLayers(){

      this.functionMap  = new Array(this.numLayers);
      for(var i=0; i<this.functionMap.length; i++){
        this.functionMap[i] = Mathjs.pickRandom(this.functions);
      }
      this.functionMapY  = new Array(this.numLayers);
      for(var i=0; i<this.functionMapY.length; i++){
        this.functionMapY[i] = Mathjs.pickRandom(this.functions);
      }
      this.XBounds = new Array(this.inputSize);
      for(var i=0; i<this.XBounds.length; i++){
          this.XBounds[i] = (i)* 2 * Math.PI / this.inputSize - Math.PI;
      }
      this.YBounds = new Array(this.inputSize);
      for(var i=0; i<this.YBounds.length; i++){
          this.YBounds[i] = (i)* 2 / this.inputSize - 1;
      }
      this.layers = new Array(this.numLayers);
      for(let i=0; i<this.layers.length; i++){
          let func = this.functionMap[i];
          let funY = this.functionMapY[i];
          let layerColumns = new Array(this.inputSize);
          for(let j = 0; j<layerColumns.length; j++){
            let layerRow = layerColumns[j] = new Array(this.inputSize);
            for (var k = 0; k < layerRow.length; k++) {
              layerRow[k] = func(this.XBounds[j]) * funY(this.YBounds[k]);
            }
          }

          let temp = Mathjs.multiply(Mathjs.matrix(layerColumns), this.funkyWeights);
          temp = temp.map(function(value, index, matrix){
              let result = 1.0/(1.0 + Mathjs.exp(-1 + value));
              result-=0.5;
              return isNaN(result) ? 0.5 : result;
            });

              this.layers[i] = temp;
      }
    }

    buildFunctionsArray(){
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
        let result = (1/(Mathjs.PI) * Mathjs.exp((-1 * x*x)/Mathjs.PI));

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

      let functions = [atan, square, minus, cube, erf, sin, cos, sigmoidSuck, gausSuck, gausMoarSuck];
      return functions
    }

    doMagic(inputVector){

      let postInputsWeightsVector = Mathjs.multiply(this.inputWeights, inputVector);

      let postInputsBiasVector = Mathjs.add(postInputsWeightsVector, this.inputBias);

      let hiddenLayerInputVector =  postInputsBiasVector.map(function(value, index, matrix){
      let result = ((1/(Math.PI)) *Mathjs.exp(-1 * value*value));
        result = result < 0.0005 ? 0.0 : result;
        return isNaN(result) ? 1.0 : result;
        });

        for(var i=0; i<this.layers.length;i++){
           let layer =  this.layers[i];
           hiddenLayerInputVector = Mathjs.multiply(layer, inputVector);//.map(function(value, index, matrix){
            //    let result = Mathjs.exp(-1 * value*value);
            //    result = result < 0.0005 ? 0.0 : result;
            //    return isNaN(result) ? 1.0 : result;
            //  });
        }


      let postHiddenLayerWeightsVector = Mathjs.multiply(hiddenLayerInputVector, this.hiddenLayerWeights);
      let postHiddenLayerBaisVector = Mathjs.add(postHiddenLayerWeightsVector, this.hiddenLayerBias)

      let outputVector = postHiddenLayerBaisVector.map(function(value, index, matrix){
        let result = 1.0/(1.0 + Mathjs.exp(-1 + value));
        result = result < 0.0005 ? 0.0 : result;
        return isNaN(result) ? 1.0 : result;
        });

        return outputVector;
      }

    mutate(){
      let childBrain = new Dumber();
      childBrain.hawk = this.hawk + (Math.random()-0.5)*.1;
      childBrain.dove = this.dove + (Math.random()-0.5)*.1;
      if(Math.random() > 0.01){
        childBrain.hawk*=-1;
        childBrain.dove*=-1;
      }

      for(let i = 0; i< this.functionMap.length; i++){
        childBrain.functionMap[i] = this.functionMap[i];
      }

      if(Math.random() < 0.05){
        var index = Mathjs.randomInt(childBrain.functionMap.length);
        childBrain.functionMap[index] = Mathjs.pickRandom(this.functions);
      }
      for(let i = 0; i< this.functionMapY.length; i++){
        childBrain.functionMapY[i] = this.functionMapY[i];
      }

      if(Math.random() < 0.05){
        var index = Mathjs.randomInt(childBrain.functionMapY.length);
        childBrain.functionMapY[index] = Mathjs.pickRandom(this.functions);
      }

      childBrain.numLayers = this.numLayers;
      if(Math.random() < 0.05){
        childBrain.numLayers++;
        childBrain.functionMap.push(Mathjs.pickRandom(this.functions));
        childBrain.functionMapY.push(Mathjs.pickRandom(this.functions));
      }else if (Math.random() < 0.05 && childBrain.numLayers > 1) {
        childBrain.numLayers--;
        childBrain.functionMap.splice(0,1);
        childBrain.functionMapY.splice(0,1);
      }



      childBrain.inputWeights = this.inputWeights.map( function(value, index, matrix) {
        if(Math.random() < 0.05){
          return (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });

      if(Math.random()< 0.05){
        childBrain.inputWeights = Mathjs.transpose(childBrain.inputWeights);
      }
      if(Math.random()< 0.05){
        childBrain.inputWeights = Mathjs.inv(childBrain.inputWeights);
      }

      childBrain.inputBias = this.inputBias.map( function(value, index, matrix) {
        if(Math.random() < 0.05){
          return (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
        }
        return value ;
      });

      // if(Math.random()< 0.1){
      //   childBrain.inputBias = Mathjs.transpose(childBrain.inputBias);
      // }
      //

      childBrain.hiddenLayerBias = this.hiddenLayerBias.map( function(value, index, matrix) {
        if(Math.random() < 0.05){
          let newValue =  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
          return newValue;
        }
        return value;
        });

      childBrain.hiddenLayerWeights = this.hiddenLayerWeights.map(function(value, index, matrix){
        if(Math.random() > 0.05){
          let newValue = (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
          return newValue;
        }

        return value;
      });

      if(Math.random()< 0.05){
        childBrain.hiddenLayerWeights = Mathjs.transpose(childBrain.hiddenLayerWeights);
      }
      if(Math.random()< 0.05){
        childBrain.hiddenLayerWeights = Mathjs.inv(childBrain.hiddenLayerWeights);
      }

      childBrain.funkyBias = this.funkyBias.map( function(value, index, matrix) {
        if(Math.random() < 0.05){
          let newValue =  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
          return newValue;
        }
        return value;
        });

      childBrain.funkyWeights = this.funkyWeights.map( function(value, index, matrix) {
        if(Math.random() < 0.1){
          return  (Math.random() - 0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });

      if(Math.random()< 0.1){
        childBrain.funkyWeights = Mathjs.transpose(childBrain.funkyWeights);
      }
      if(Math.random()< 0.1){
        childBrain.funkyWeights = Mathjs.inv(childBrain.funkyWeights);
      }
      childBrain.buildLayers();
      return childBrain;
    }
}


module.exports = Dumber;
