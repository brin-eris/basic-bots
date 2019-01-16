'use strict';

const Mathjs = require('mathjs');

const BaseBrain = require('./BaseBrain');


class OtherBrain extends BaseBrain{


  static create_new(){
    let brain = new OtherBrain();
    brain.buildLayers();
    return brain;
  }
    constructor(){
      super();
     let mutation_rate = 0.5;
     let weight_mutation_magnitude = 1.0;
     let bias_mutation_magnitude = 1.0;

      this.inputWeightsA = Mathjs.zeros(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  weight_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.inputBiasA = Mathjs.zeros([this.inputSize]).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+= bias_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerWeightsA = Mathjs.zeros(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  weight_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerBiasA = Mathjs.zeros([this.inputSize]).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  bias_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.inputWeightsB = Mathjs.zeros(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  weight_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.inputBiasB = Mathjs.zeros([this.inputSize]).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  bias_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerWeightsB = Mathjs.zeros(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  weight_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenLayerBiasB = Mathjs.zeros([this.inputSize]).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  bias_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });


    }


    buildLayers(){
      this.combined_input_weights = Mathjs.add(this.inputWeightsA, this.inputWeightsB);
      this.combined_input_bias = Mathjs.add(this.inputBiasA, this.inputBiasB);
      this.combined_hidden_weights = Mathjs.add(this.hiddenLayerWeightsA, this.hiddenLayerWeightsB);
      this.combined_hidden_bias = Mathjs.add(this.hiddenLayerBiasA, this.hiddenLayerBiasB);
    }

    doMagic(input_vector){

      input_vector = input_vector.map(function(value, index, matrix){
        let result = (1.0/(1.0 + Mathjs.exp(-1 * value )) - 0.5)*2;
        //(value*value)/(1 + value*value);
        //let result = Mathjs.cos(value);
        //1.0/(1.0 + Mathjs.exp(-1 * value));
        //(value*value)/(1 + value*value)
        if(isNaN(result)){
          result = 0.0
        }
        return result;
      });
      let postInputsWeightsVector = Mathjs.multiply(this.combined_input_weights.map(function(value, index, matrix){
        return Math.random() > Math.abs(value) ? 1 * Math.sign(value) : 0;
        }), input_vector);

      let postInputsBiasVector = Mathjs.add(postInputsWeightsVector, this.combined_input_bias);

      let hiddenLayerInputVector =  postInputsBiasVector.map(function(value, index, matrix){
        let result = (1.0/(1.0 + Mathjs.exp(-1 * value )) - 0.5)*2;

        if(isNaN(result)){
            result = 0.0
        }
        return result;
        });

        let postHiddenLayerWeightsVector = Mathjs.multiply(hiddenLayerInputVector.map(function(value, index, matrix){
            return Math.random() > Math.abs(value) ? 1 * Math.sign(value) : 0;
          }), this.combined_hidden_weights);
        let postHiddenLayerBaisVector = Mathjs.add(postHiddenLayerWeightsVector, this.combined_hidden_bias);

        let outputVector = postHiddenLayerBaisVector.map(function(value, index, matrix){
          let result = (1.0/(1.0 + Mathjs.exp(-1 * value )) - 0.5)*2;

          if(isNaN(result)){
            result = 0.0
          }
          return result;
          });


        return outputVector;
    }



    get_half_chromosomes(){
      let inputs_result = Math.random();

      let inputWeights = Math.random() < 0.5 ? Mathjs.clone(this.inputWeightsA) : Mathjs.clone(this.inputWeightsB);

      let inputBias = Math.random() < 0.5 ? Mathjs.clone(this.inputBiasA) : Mathjs.clone(this.inputBiasB);

        let hidden_result = Math.random();
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
      this.buildLayers();
    }

    mutate(){
      let childBrain = new OtherBrain();


      childBrain.inputWeightsA = this.mutate_layer(this.inputWeightsA);

      if(Math.random()< 0.1){
        childBrain.inputWeightsA = Mathjs.transpose(childBrain.inputWeightsA);
      }
      if(Math.random()< 0.1){
        childBrain.inputWeightsA = Mathjs.inv(childBrain.inputWeightsA);
      }

      childBrain.inputBiasA = this.mutate_layer(this.inputBiasA);


      childBrain.hiddenLayerBiasA = this.mutate_layer(this.hiddenLayerBiasA);


      childBrain.hiddenLayerWeightsA = this.mutate_layer(this.hiddenLayerWeightsA);

      if(Math.random()< 0.1){
        childBrain.hiddenLayerWeightsA = Mathjs.transpose(childBrain.hiddenLayerWeightsA);
      }
      if(Math.random()< 0.1){
        childBrain.hiddenLayerWeightsA = Mathjs.inv(childBrain.hiddenLayerWeightsA);
      }

      childBrain.inputWeightsB = this.mutate_layer(this.inputWeightsB);

      if(Math.random()< 0.1){
        childBrain.inputWeightsB = Mathjs.transpose(childBrain.inputWeightsB);
      }
      if(Math.random()< 0.1){
        childBrain.inputWeightsB = Mathjs.inv(childBrain.inputWeightsB);
      }

      childBrain.inputBiasB = this.mutate_layer(this.inputBiasB);


      childBrain.hiddenLayerBiasB = this.mutate_layer(this.hiddenLayerBiasB);


      childBrain.hiddenLayerWeightsB = this.mutate_layer(this.hiddenLayerWeightsB);

      if(Math.random()< 0.1){
        childBrain.hiddenLayerWeightsB = Mathjs.transpose(childBrain.hiddenLayerWeightsB);
      }
      if(Math.random()< 0.1){
        childBrain.hiddenLayerWeightsB = Mathjs.inv(childBrain.hiddenLayerWeightsB);
      }
      childBrain.buildLayers();
      return childBrain;
    }

    mutate_layer(layer){
      layer = layer.map(function(value, index, matrix){
        if(Math.random() < .5){
          value += 0.01*(Math.random()-0.5)*value + 0.001*(Math.random()-0.5) ;
        }
        if(Math.random() < 0.1){
          value += 0.1*(Math.random()-0.5)*value;
        }
        if(Math.random() < 0.1){
          value += 0.1*(Math.random()-0.5) ;
        }
        if(Math.random() < 0.01){
          value += 0.5*(Math.random()-0.5) ;
        }

        if(Math.random() < 0.01){
          value += (Math.random()-0.5)*value ;
        }

        return value;
      });
      return layer;
    }


    clone(){
      let neo = new OtherBrain();
      neo.hiddenLayerWeightsB = Mathjs.clone(this.hiddenLayerWeightsB);
      neo.hiddenLayerBiasB = Mathjs.clone(this.hiddenLayerBiasB);
      neo.inputWeightsB = Mathjs.clone(this.inputWeightsB);
      neo.inputBiasB = Mathjs.clone(this.inputBiasB);
      neo.hiddenLayerWeightsA = Mathjs.clone(this.hiddenLayerWeightsA);
      neo.hiddenLayerBiasA = Mathjs.clone(this.hiddenLayerBiasA);
      neo.inputWeightsA = Mathjs.clone(this.inputWeightsA);
      neo.inputBiasA = Mathjs.clone(this.inputBiasA);

      neo.buildLayers();
      return neo;
    }
}


module.exports = OtherBrain;
