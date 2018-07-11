'use strict';

const Mathjs = require('mathjs');
const Bot   = require('../bot/Bot');
const BaseBrain = require('./BaseBrain');

class Dumber extends BaseBrain{

    static create_new(){
      let brain = new Dumber();
      brain.buildLayers();
      return brain;
    }

    constructor(){
      super();

      this.inputWeightsA = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+=  10*(Math.random()-0.5);
        }
        return value;
      });

      this.inputBiasA = Mathjs.random([this.inputSize],-0.01, 0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+= 10*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerWeightsA = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+=  10*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerBiasA = Mathjs.random([this.inputSize],-0.01, 0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+= 10*(Math.random()-0.5);
        }
        return value;
      });

      this.funkyWeightsA = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+=  10*(Math.random()-0.5);
        }
        return value;
      });

      this.funkyBiasA = Mathjs.random([this.inputSize],-0.01,0.01);

      this.inputWeightsB = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+=  10*(Math.random()-0.5);
        }
        return value;
      });

      this.inputBiasB = Mathjs.random([this.inputSize],-0.01, 0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+= 10*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerWeightsB = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+=  10*(Math.random()-0.5);
        }
        return value;
      });
      this.hiddenLayerBiasB = Mathjs.random([this.inputSize],-0.01, 0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+= 10*(Math.random()-0.5);
        }
        return value;
      });

      this.funkyWeightsB = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.2){
          value+=  10*(Math.random()-0.5);
        }
        return value;
      });

      this.funkyBiasB = Mathjs.random([this.inputSize],-0.01,0.01);


      this.functions = this.buildFunctionsArray();


        this.functionMapX  = new Array(1);
            for(var i=0; i<this.functionMapX.length; i++){
              this.functionMapX[i] = Mathjs.pickRandom(this.functions);
        }

        this.functionMapY  = new Array(1);
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


    }

    buildLayers(){


      let numLayers = this.functionMapX.length < this.functionMapY.length ?  this.functionMapX.length : this.functionMapY.length;


      this.layers = new Array(numLayers);

      for(let i=0; i<this.layers.length; i++){
          let func = this.functionMapX[i];
          let funY = this.functionMapY[i];
          let layerColumns = new Array(this.inputSize);
          for(let j = 0; j<layerColumns.length; j++){
            let layerRow = layerColumns[j] = new Array(this.inputSize);
            for (var k = 0; k < layerRow.length; k++) {
              layerRow[k] = func(this.XBounds[j]) * funY(this.YBounds[k]);
            }
          }
          let funkyWeights = Mathjs.add(this.funkyWeightsA, this.funkyWeightsB);
          let temp = Mathjs.multiply(Mathjs.matrix(layerColumns), funkyWeights);
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

      let postInputsWeightsVectorA = Mathjs.multiply(this.inputWeightsA, inputVector);
      let postInputsWeightsVectorB = Mathjs.multiply(this.inputWeightsB, inputVector);

      let postInputsWeightsVector = Mathjs.add(postInputsWeightsVectorA, postInputsWeightsVectorB);

      let postInputsBiasVectorA = Mathjs.add(postInputsWeightsVector, this.inputBiasA);
      let postInputsBiasVectorB = Mathjs.add(postInputsWeightsVector, this.inputBiasB);

      let hiddenLayerInputVectorA =  postInputsBiasVectorA.map(function(value, index, matrix){
          let result = ((1/(Math.PI)) *Mathjs.exp(-1 * value*value));
          result = result < 0.0005 ? 0.0 : result;
          return isNaN(result) ? 1.0 : result;
      });

      for(var i=0; i<this.layers.length;i++){
           let layer =  this.layers[i];
           hiddenLayerInputVectorA = Mathjs.multiply(layer, hiddenLayerInputVectorA);
      }


      let hiddenLayerInputVectorB =  postInputsBiasVectorB.map(function(value, index, matrix){
              let result = ((1/(Math.PI)) *Mathjs.exp(-1 * value*value));
              result = result < 0.0005 ? 0.0 : result;
              return isNaN(result) ? 1.0 : result;
      });

      for(var i=0; i<this.layers.length;i++){
             let layer =  this.layers[i];
             hiddenLayerInputVectorB = Mathjs.multiply(layer, hiddenLayerInputVectorB);
      }


      let postHiddenLayerWeightsVectorA = Mathjs.multiply(hiddenLayerInputVectorA, this.hiddenLayerWeightsA);
      let postHiddenLayerWeightsVectorB = Mathjs.multiply(hiddenLayerInputVectorB, this.hiddenLayerWeightsB);




      let postHiddenLayerBaisVectorA = Mathjs.add(postHiddenLayerWeightsVectorA, this.hiddenLayerBiasA);
      let postHiddenLayerBaisVectorB = Mathjs.add(postHiddenLayerWeightsVectorB, this.hiddenLayerBiasB);

      let postHiddenLayerBaisVector = Mathjs.add(postHiddenLayerBaisVectorA, postHiddenLayerBaisVectorB);

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

      childBrain.functionMapX = new Array(this.functionMapX.length);

      for(let i = 0; i< this.functionMapX.length; i++){
        childBrain.functionMapX[i] = this.functionMapX[i];
      }

      if(Math.random() < 0.01){
        var index = Mathjs.randomInt(childBrain.functionMapX.length);
        childBrain.functionMapX[index] = Mathjs.pickRandom(this.functions);
      }

      childBrain.functionMapY = new Array(this.functionMapY.length);

      for(let i = 0; i< this.functionMapY.length; i++){
        childBrain.functionMapY[i] = this.functionMapY[i];
      }

      if(Math.random() < 0.01){
        var index = Mathjs.randomInt(childBrain.functionMapY.length);
        childBrain.functionMapY[index] = Mathjs.pickRandom(this.functions);
      }



      childBrain.functionMapX = childBrain.mutate_map(childBrain.functionMapX);

      childBrain.functionMapY = childBrain.mutate_map(childBrain.functionMapY);

      childBrain.inputWeightsA = this.mutate_layer(this.inputWeightsA);

      if(Math.random()< 0.01){
        childBrain.inputWeightsA = Mathjs.transpose(childBrain.inputWeightsA);
      }
      if(Math.random()< 0.01){
        childBrain.inputWeightsA = Mathjs.inv(childBrain.inputWeightsA);
      }

      childBrain.inputBiasA = this.mutate_layer(this.inputBiasA);


      childBrain.hiddenLayerBiasA = this.mutate_layer(this.hiddenLayerBiasA);

      childBrain.hiddenLayerWeightsA = this.mutate_layer(this.hiddenLayerWeightsA);

      if(Math.random()< 0.01){
        childBrain.hiddenLayerWeightsA = Mathjs.transpose(childBrain.hiddenLayerWeightsA);
      }
      if(Math.random()< 0.01){
        childBrain.hiddenLayerWeightsA = Mathjs.inv(childBrain.hiddenLayerWeightsA);
      }

      childBrain.funkyBiasA = this.mutate_layer(this.funkyBiasA);

      childBrain.funkyWeightsA = this.mutate_layer(this.funkyWeightsA);

      if(Math.random()< 0.01){
        childBrain.funkyWeightsA = Mathjs.transpose(childBrain.funkyWeightsA);
      }
      if(Math.random()< 0.01){
        childBrain.funkyWeightsA = Mathjs.inv(childBrain.funkyWeightsA);
      }

      childBrain.inputWeightsB = this.mutate_layer(this.inputWeightsB);

      if(Math.random()< 0.01){
        childBrain.inputWeightsB = Mathjs.transpose(childBrain.inputWeightsB);
      }
      if(Math.random()< 0.01){
        childBrain.inputWeightsB = Mathjs.inv(childBrain.inputWeightsB);
      }

      childBrain.inputBiasB = this.mutate_layer(this.inputBiasB);


      childBrain.hiddenLayerBiasB = this.mutate_layer(this.hiddenLayerBiasB);

      childBrain.hiddenLayerWeightsB = this.mutate_layer(this.hiddenLayerWeightsB);

      if(Math.random()< 0.01){
        childBrain.hiddenLayerWeightsB = Mathjs.transpose(childBrain.hiddenLayerWeightsB);
      }
      if(Math.random()< 0.01){
        childBrain.hiddenLayerWeightsB = Mathjs.inv(childBrain.hiddenLayerWeightsB);
      }

      childBrain.funkyBiasB = this.mutate_layer(this.funkyBiasB);

      childBrain.funkyWeightsB = this.mutate_layer(this.funkyWeightsB);

      if(Math.random()< 0.01){
        childBrain.funkyWeightsB = Mathjs.transpose(childBrain.funkyWeightsB);
      }
      if(Math.random()< 0.01){
        childBrain.funkyWeightsB = Mathjs.inv(childBrain.funkyWeightsB);
      }

      childBrain.buildLayers();
      return childBrain;
    }

    rebuild(channel_A, channel_B){
      this.inputWeightsA = this.mutate_layer(channel_A.inputWeights);
      this.inputBiasA = this.mutate_layer(channel_A.inputBias);
      this.hiddenLayerWeightsA = this.mutate_layer(channel_A.hiddenLayerWeights);
      this.hiddenLayerBiasA = this.mutate_layer(channel_A.hiddenLayerBias);
      this.funkyBiasA = this.mutate_layer(channel_A.funkyBias);
      this.funkyWeightsA = this.mutate_layer(channel_A.funkyWeights);
      this.functionMapX = this.mutate_map(channel_A.functionMap);

      this.inputWeightsB = this.mutate_layer(channel_B.inputWeights);
      this.inputBiasB = this.mutate_layer(channel_B.inputBias);
      this.hiddenLayerWeightsB = this.mutate_layer(channel_B.hiddenLayerWeights);
      this.hiddenLayerBiasB = this.mutate_layer(channel_B.hiddenLayerBias);
      this.funkyBiasB = this.mutate_layer(channel_B.funkyBias);
      this.funkyWeightsB = this.mutate_layer(channel_B.funkyWeights);
      this.functionMapY = this.mutate_map(channel_B.functionMap);

      this.buildLayers();
    }

    mutate_map(map){
      if(Math.random() < 0.1){
        map.push(Mathjs.pickRandom(this.functions));

      }else if (Math.random() < 0.01 && map.length > 1) {
        map.splice(0,1);
      }
      return map;
    }

    mutate_layer(layer){
      layer = layer.map(function(value, index, matrix){
        if(Math.random() < 0.1){
          value += 0.0001*(Math.random() - 0.5)*value +0.0001*(Math.random()-0.5) ;
        }
        if(Math.random() < 0.01){
          value += 0.001*(Math.random()-0.5)*value +0.001*(Math.random()-0.5) ;
        }
        if(Math.random() < 0.001){
          value += 0.01*(Math.random()-0.5)*value +0.01*(Math.random()-0.5) ;
        }
        if(Math.random() < 0.0001){
          value += (Math.random()-0.5)*value ;
        }
        return value;
      });
      return layer;
    }

    get_half_chromosomes(){


      let inputWeights = Math.random() < 0.5 ? Mathjs.clone(this.inputWeightsA) : Mathjs.clone(this.inputWeightsB);

      let inputBias = Math.random() < 0.5 ? Mathjs.clone(this.inputBiasA) : Mathjs.clone(this.inputBiasB);

      let hiddenLayerWeights = Math.random() < 0.5 ? Mathjs.clone(this.hiddenLayerWeightsA) : Mathjs.clone(this.hiddenLayerWeightsB);

      let hiddenLayerBias = Math.random() < 0.5 ? Mathjs.clone(this.hiddenLayerBiasA) : Mathjs.clone(this.hiddenLayerBiasB);

      let funkyWeights = Math.random() < 0.5 ? Mathjs.clone(this.funkyWeightsA) : Mathjs.clone(this.funkyWeightsB);

      let funkyBias = Math.random() < 0.5 ? Mathjs.clone(this.funkyBiasA) : Mathjs.clone(this.funkyBiasB);

      let tempFunctionMap = Math.random() < 0.5 ? (this.functionMapX) : (this.functionMapY);


      let functionMap = new Array(tempFunctionMap.length);

      for(let i = 0; i< tempFunctionMap.length; i++){
        functionMap[i] = tempFunctionMap[i];
      }
      return {
        inputWeights: inputWeights,
        inputBias: inputBias,
        hiddenLayerWeights: hiddenLayerWeights,
        hiddenLayerBias: hiddenLayerBias,
        funkyBias: funkyBias,
        funkyWeights: funkyWeights,
        functionMap: functionMap
      };
    }


    clone(){
      let neo = new Dumber();
      neo.hiddenLayerWeightsB = Mathjs.clone(this.hiddenLayerWeightsB);
      neo.hiddenLayerBiasB = Mathjs.clone(this.hiddenLayerBiasB);
      neo.inputWeightsB = Mathjs.clone(this.inputWeightsB);
      neo.inputBiasB = Mathjs.clone(this.inputBiasB);
      neo.funkyWeightsB = Mathjs.clone(this.funkyWeightsB);
      neo.funkyBiasB = Mathjs.clone(this.funkyBiasB);

      neo.hiddenLayerWeightsA = Mathjs.clone(this.hiddenLayerWeightsA);
      neo.hiddenLayerBiasA = Mathjs.clone(this.hiddenLayerBiasA);
      neo.inputWeightsA = Mathjs.clone(this.inputWeightsA);
      neo.inputBiasA = Mathjs.clone(this.inputBiasA);
      neo.funkyWeightsA = Mathjs.clone(this.funkyWeightsA);
      neo.funkyBiasA = Mathjs.clone(this.funkyBiasA);

      neo.functionMapX = new Array(this.functionMapX.length);

      for(let i = 0; i< this.functionMapX.length; i++){
        neo.functionMapX[i] = this.functionMapX[i];
      }

      neo.functionMapY = new Array(this.functionMapY.length);

      for(let i = 0; i< this.functionMapY.length; i++){
        neo.functionMapY[i] = this.functionMapY[i];
      }

      neo.hawk = this.hawk;
      neo.dove = this.dove;

      neo.buildLayers();
      return neo;
    }
}


module.exports = Dumber;
