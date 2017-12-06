'use strict';

const Mathjs = require('mathjs');

const BaseBrain = require('./BaseBrain');


class Brain extends BaseBrain{



    constructor(){
      super();

      this.inputWeightsA = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.15){
          value+= 10* (Math.random()-0.5);
        }
        return value;
      });

      this.inputBiasA = Mathjs.random([this.inputSize],-0.01,0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.15){
          value+= 10* (Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerWeightsA = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.15){
          value+= 10* (Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerBiasA = Mathjs.random([this.inputSize],-0.01,0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.15){
          value+= 10* (Math.random()-0.5);
        }
        return value;
      });

      this.inputWeightsB = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.15){
          value+= 10* (Math.random()-0.5);
        }
        return value;
      });

      this.inputBiasB = Mathjs.random([this.inputSize],-0.01,0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.15){
          value+= 10* (Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerWeightsB = Mathjs.eye(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < 0.15){
          value+= 10* (Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerBiasB = Mathjs.random([this.inputSize],-0.01,0.01).map( function(value, index, matrix) {
        if(Math.random() < 0.15){
          value+= 10* (Math.random()-0.5);
        }
        return value;
      });

    }

    doMagic(input_vector){

      let vec_A = this.proc_channel_A_input(input_vector);
      let vec_B = this.proc_channel_B_input(input_vector);

      let combined = Mathjs.add(vec_A, vec_B);

      vec_A = this.proc_channel_A_hidden(combined);
      vec_B = this.proc_channel_B_hidden(combined);

      combined = Mathjs.add(vec_A, vec_B);

      let outputVector = combined.map(function(value, index, matrix){
        let result = 1.0/(1.0 + Mathjs.exp(-1 + value));

        return isNaN(result) ? 1.0 : result;
        });
        return outputVector;
    }

    proc_channel_A_input(input_vector){
      let postInputsWeightsVector = Mathjs.multiply(this.inputWeightsA, input_vector);

      let postInputsBiasVector = Mathjs.add(postInputsWeightsVector, this.inputBiasA);

      let hiddenLayerInputVector =  postInputsBiasVector.map(function(value, index, matrix){
      let result = 1/Mathjs.exp(value);

        return isNaN(result) ? 1.0 : result;
        });

      return hiddenLayerInputVector;
    }

    proc_channel_B_input(input_vector){
      let postInputsWeightsVector = Mathjs.multiply(this.inputWeightsB, input_vector);

      let postInputsBiasVector = Mathjs.add(postInputsWeightsVector, this.inputBiasB);

      let hiddenLayerInputVector =  postInputsBiasVector.map(function(value, index, matrix){
      let result = 1/Mathjs.exp(value);

        return isNaN(result) ? 1.0 : result;
        });

        return hiddenLayerInputVector;
    }

    proc_channel_A_hidden(hiddenLayerInputVector){
      let postHiddenLayerWeightsVector = Mathjs.multiply(hiddenLayerInputVector, this.hiddenLayerWeightsA);
      let postHiddenLayerBaisVector = Mathjs.add(postHiddenLayerWeightsVector, this.hiddenLayerBiasA)
      return postHiddenLayerBaisVector;
    }

    proc_channel_B_hidden(hiddenLayerInputVector){
      let postHiddenLayerWeightsVector = Mathjs.multiply(hiddenLayerInputVector, this.hiddenLayerWeightsB);
      let postHiddenLayerBaisVector = Mathjs.add(postHiddenLayerWeightsVector, this.hiddenLayerBiasB)
      return postHiddenLayerBaisVector;
    }

    mutate_half(){
      let inputWeights = Math.random() < 0.5 ? Mathjs.clone(this.inputWeightsA) : Mathjs.clone(this.inputWeightsB);

      let inputBias = Math.random() < 0.5 ? Mathjs.clone(this.inputBiasA) : Mathjs.clone(this.inputBiasB);

      let hiddenLayerWeights = Math.random() < 0.5 ? Mathjs.clone(this.hiddenLayerWeightsA) : Mathjs.clone(this.hiddenLayerWeightsB);

      let hiddenLayerBias = Math.random() < 0.5 ? Mathjs.clone(this.hiddenLayerBiasA) : Mathjs.clone(this.hiddenLayerBiasB);

      return {
        inputWeights: inputWeights,
        inputBias: inputBias,
        hiddenLayerWeights: hiddenLayerWeights,
        hiddenLayerBias: hiddenLayerBias
      };
    }

    rebuild(channel_A, channel_B){
      this.inputWeightsA = this.mutate_layer(channel_A.inputWeights);
      this.inputBiasA = this.mutate_layer(channel_A.inputBias);
      this.hiddenLayerWeightsA = this.mutate_layer(channel_A.hiddenLayerWeights);
      this.hiddenLayerBiasA = this.mutate_layer(channel_A.hiddenLayerBias);
      this.inputWeightsB = this.mutate_layer(channel_B.inputWeights);
      this.inputBiasB = this.mutate_layer(channel_B.inputBias);
      this.hiddenLayerWeightsB = this.mutate_layer(channel_B.hiddenLayerWeights);
      this.hiddenLayerBiasB = this.mutate_layer(channel_B.hiddenLayerBias);
    }

    mutate(){
      let childBrain = new Brain();
      childBrain.hawk = this.hawk + (Math.random()-0.5)*.1;
      childBrain.dove = this.dove + (Math.random()-0.5)*.1;
      if(Math.random() > 0.1){
        childBrain.hawk*=-1;
        childBrain.dove*=-1;

      }

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
      return childBrain;
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


    clone(){
      let neo = new Brain();
      neo.hiddenLayerWeightsB = Mathjs.clone(this.hiddenLayerWeightsB);
      neo.hiddenLayerBiasB = Mathjs.clone(this.hiddenLayerBiasB);
      neo.inputWeightsB = Mathjs.clone(this.inputWeightsB);
      neo.inputBiasB = Mathjs.clone(this.inputBiasB);
      neo.hiddenLayerWeightsA = Mathjs.clone(this.hiddenLayerWeightsA);
      neo.hiddenLayerBiasA = Mathjs.clone(this.hiddenLayerBiasA);
      neo.inputWeightsA = Mathjs.clone(this.inputWeightsA);
      neo.inputBiasA = Mathjs.clone(this.inputBiasA);
      neo.hawk = this.hawk;
      neo.dove = this.dove;
      return neo;
    }
}


module.exports = Brain;
