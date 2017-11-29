'use strict';

const Mathjs = require('mathjs');

const BaseBrain = require('./BaseBrain');


class Brain extends BaseBrain{



    constructor(){
      super();

      this.inputWeights = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random() -0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });

      this.inputBias = Mathjs.random([this.inputSize],-0.01,0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random() )*value + (Math.random()-0.5) + value;
        }
        return value;
      });

      this.hiddenLayerWeights = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random() -0.5)*value +(Math.random()-0.5) + value;
        }
        return value;
      });

      this.hiddenLayerBias = Mathjs.random([this.inputSize],-0.01,0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.3){
          return  (Math.random())*value +(Math.random()-0.5) + value;
        }
        return value;
      });

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

        return isNaN(result) ? 1.0 : result;
        });
        return outputVector;
    }


    mutate(){
      let childBrain = new Brain();
      childBrain.hawk = this.hawk + (Math.random()-0.5)*.1;
      childBrain.dove = this.dove + (Math.random()-0.5)*.1;
      if(Math.random() > 0.1){
        childBrain.hawk*=-1;
        childBrain.dove*=-1;
      }

      childBrain.inputWeights = this.inputWeights.map( function(value, index, matrix) {
        if(Math.random() < 0.1){
          value = 0.01*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
        }
        if(Math.random() < 0.01){
          value+= 0.2*(Math.random()-0.5);
        }
        if(Math.random() < 0.001){
          value+= 0.8*(Math.random()-0.5);
        }

        return value;
      });

      if(Math.random()< 0.01){
        childBrain.inputWeights = Mathjs.transpose(childBrain.inputWeights);
      }
      if(Math.random()< 0.01){
        childBrain.inputWeights = Mathjs.inv(childBrain.inputWeights);
      }

      childBrain.inputBias = this.inputBias.map( function(value, index, matrix) {
        if(Math.random() < 0.1){
          value = 0.01*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
        }
        if(Math.random() < 0.01){
          value+= 0.2*(Math.random()-0.5);
        }
        if(Math.random() < 0.001){
          value+= 0.8*(Math.random()-0.5);
        }
        return value;
      });

      // if(Math.random()< 0.1){
      //   childBrain.inputBias = Mathjs.transpose(childBrain.inputBias);
      // }

      childBrain.hiddenLayerBias = this.hiddenLayerBias.map( function(value, index, matrix) {
        if(Math.random() < 0.1){
          value = 0.01*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
        }
        if(Math.random() < 0.01){
          value+= 0.2*(Math.random()-0.5);
        }
        if(Math.random() < 0.001){
          value+= 0.8*(Math.random()-0.5);
        }
        return value;
        });

        // if(Math.random()< 0.01){
        //   childBrain.hiddenLayerBias = Mathjs.transpose(childBrain.hiddenLayerBias);
        // }

      childBrain.hiddenLayerWeights = this.hiddenLayerWeights.map(function(value, index, matrix){
        if(Math.random() < 0.1){
          value = 0.01*(Math.random() - 0.5)*value +0.1*(Math.random()-0.5) + value;
        }
        if(Math.random() < 0.01){
          value+= 0.2*(Math.random()-0.5);
        }
        if(Math.random() < 0.001){
          value+= 0.8*(Math.random()-0.5);
        }
        return value;
      });

      if(Math.random()< 0.01){
        childBrain.hiddenLayerWeights = Mathjs.transpose(childBrain.hiddenLayerWeights);
      }
      if(Math.random()< 0.01){
        childBrain.hiddenLayerWeights = Mathjs.inv(childBrain.hiddenLayerWeights);
      }
      return childBrain;
    }
}


module.exports = Brain;
