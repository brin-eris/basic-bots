'use strict';

const Mathjs = require('mathjs');

const BaseBrain = require('./BaseBrain');


class Brain extends BaseBrain{



    constructor(){
      super();

      this.inputWeights = Mathjs.ones(Mathjs.matrix([this.inputSize, this.inputSize]));

      this.inputBias = Mathjs.zeros([this.inputSize]);

      this.hiddenLayerWeights = Mathjs.ones(Mathjs.matrix([this.inputSize, this.inputSize]));

      this.hiddenLayerBias = Mathjs.zeros([this.inputSize]);

    }

    doMagic(inputVector){


      let postInputsWeightsVector = Mathjs.multiply(this.inputWeights, inputVector);

      let postInputsBiasVector = Mathjs.add(postInputsWeightsVector, this.inputBias);

      let hiddenLayerInputVector =  postInputsBiasVector.map(function(value, index, matrix){
      let result = Mathjs.erf(value);

        return isNaN(result) ? 1.0 : result;
        });

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
      let childBrain = new Brain();
      childBrain.hawk = this.hawk + (Math.random()-0.5)*.1;
      childBrain.dove = this.dove + (Math.random()-0.5)*.1;
      if(Math.random() > 0.05){
        childBrain.hawk*=-1;
        childBrain.dove*=-1;
      }

      childBrain.inputWeights = this.inputWeights.map( function(value, index, matrix) {
        if(Math.random() < 0.1){
          return  0.1*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
        }
        return value;
      });

      if(Math.random()< 0.1){
        childBrain.inputWeights = Mathjs.transpose(childBrain.inputWeights);
      }
      if(Math.random()< 0.1){
        childBrain.inputWeights = Mathjs.inv(childBrain.inputWeights);
      }

      childBrain.inputBias = this.inputBias.map( function(value, index, matrix) {
        if(Math.random() < 0.1){
          return 0.1*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
        }
        return value;
      });

      if(Math.random()< 0.1){
        childBrain.inputBias = Mathjs.transpose(childBrain.inputBias);
      }
      // if(Math.random()< 0.2){
      //   childBrain.outputBias = Mathjs.inv(childBrain.outputBias);
      // }

      childBrain.hiddenLayerBias = this.hiddenLayerBias.map( function(value, index, matrix) {
        if(Math.random() < 0.1){
          let newValue =  0.1*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
          return newValue;
        }
        return value;
        });

        if(Math.random()< 0.1){
          childBrain.hiddenLayerBias = Mathjs.transpose(childBrain.hiddenLayerBias);
        }
        // if(Math.random()< 0.2){
        //   childBrain.hiddenBias = Mathjs.inv(childBrain.hiddenBias);
        // }

      childBrain.hiddenLayerWeights = this.hiddenLayerWeights.map(function(value, index, matrix){
        if(Math.random() < 0.1){
          let newValue = 0.1*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
          return newValue;
        }
        return value;
      });

      if(Math.random()< 0.1){
        childBrain.hiddenLayerWeights = Mathjs.transpose(childBrain.hiddenLayerWeights);
      }
      if(Math.random()< 0.1){
        childBrain.hiddenLayerWeights = Mathjs.inv(childBrain.hiddenLayerWeights);
      }
      return childBrain;
    }
}


module.exports = Brain;
