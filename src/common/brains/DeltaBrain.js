'use strict';

const Mathjs = require('mathjs');
const Bot   = require('../bot/Bot');
const BaseBrain = require('./BaseBrain');


class DeltaBrain extends BaseBrain{



    constructor(){
      super();

      this.lastTurnInputs = Mathjs.zeros([this.inputSize]);
      this.lastTurnOutputs = Mathjs.zeros([this.inputSize]);


      this.inputWeights = Mathjs.ones(Mathjs.matrix([this.inputSize, this.inputSize]));
      this.inputBias = Mathjs.zeros([this.inputSize]);
      this.hiddenLayerWeights = Mathjs.ones(Mathjs.matrix([this.inputSize, this.inputSize]));
      this.hiddenLayerBias = Mathjs.zeros([this.inputSize]);

    }

    doMagic(inputVector){

      let lastTurnInputDelta = Mathjs.subtract(inputVector, this.lastTurnInputs);
      let postInputsWeightsVector = Mathjs.multiply(this.inputWeights, this.inputVector);
      let mergedInputs = Mathjs.multiply(lastTurnInputDelta, postInputsWeightsVector);
      let lastTurnMolestedOutputs = Mathjs.dotMultiply(this.lastTurnOutputs, mergedInputs);

      let postInputsBiasVector = Mathjs.add(postInputsWeightsVector, this.inputBias);
      let hiddenLayerInputVector = postInputsBiasVector.map(function(value, index, matrix){
      let result = (1/Math.PI *Mathjs.exp(-1 * value*value/Math.PI));

        return isNaN(result) ? 1.0 : result;
        });

      let postHiddenLayerWeightsVector = Mathjs.multiply(hiddenLayerInputVector, this.hiddenLayerWeights);
      let postHiddenLayerBaisVector = Mathjs.add(postHiddenLayerWeightsVector, this.hiddenLayerBias)
      let outputVector = postHiddenLayerBaisVector.map(function(value, index, matrix){
        let result = 1.0/(1.0 + Mathjs.exp(-1 + value));

        return isNaN(result) ? 1.0 : result;
        });


        this.lastTurnInputs = inputVector.clone();
        this.lastTurnOutputs = outputVector.clone();
        return outputVector;
      }



    mutate(){
      let childBrain = new DeltaBrain();
      childBrain.hawk = this.hawk + (Math.random()-0.5)*.1;
      childBrain.dove = this.dove + (Math.random()-0.5)*.1;
      if(Math.random() > 0.5){
        childBrain.hawk*=-1;
        childBrain.dove*=-1;
      }

      childBrain.inputWeights = this.inputWeights.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          return  0.1*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
        }
        return value;
      });

      if(Math.random()< 0.25){
        childBrain.inputWeights = Mathjs.transpose(childBrain.inputWeights);
      }
      if(Math.random()< 0.25){
        childBrain.inputWeights = Mathjs.inv(childBrain.inputWeights);
      }

      childBrain.inputBias = this.inputBias.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          return 0.1*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
        }
        return value;
      });

      if(Math.random()< 0.25){
        childBrain.inputBias = Mathjs.transpose(childBrain.inputBias);
      }
      // if(Math.random()< 0.2){
      //   childBrain.outputBias = Mathjs.inv(childBrain.outputBias);
      // }

      childBrain.hiddenLayerBias = this.hiddenLayerBias.map( function(value, index, matrix) {
        if(Math.random() > 0.8){
          let newValue =  0.1*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
          return newValue;
        }
        return value;
        });

        if(Math.random()< 0.25){
          childBrain.hiddenBias = Mathjs.transpose(childBrain.hiddenBias);
        }
        // if(Math.random()< 0.2){
        //   childBrain.hiddenBias = Mathjs.inv(childBrain.hiddenBias);
        // }

      childBrain.hiddenLayerWeights = this.hiddenLayerWeights.map(function(value, index, matrix){
        if(Math.random() > 0.8){
          let newValue = 0.1*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
          return newValue;
        }
        return value;
      });

      if(Math.random()< 0.25){
        childBrain.hiddenLayerWeights = Mathjs.transpose(childBrain.hiddenLayerWeights);
      }
      if(Math.random()< 0.25){
        childBrain.hiddenLayerWeights = Mathjs.inv(childBrain.hiddenLayerWeights);
      }
      return childBrain;
    }
}


module.exports = DeltaBrain;
