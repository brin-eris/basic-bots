'use strict';

const Mathjs = require('mathjs');

const BaseBrain = require('./BaseBrain');


class Brain extends BaseBrain{


  static create_new(){
    let brain = new Brain();
    brain.buildLayers();
    return brain;
  }
    constructor(){
      super();
     var mutation_rate = 0.5;
     let weight_mutation_magnitude = 2.0;
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

      // input_vector = input_vector.map(function(value, index, matrix){
      //   let result = (1.0/(1.0 + Mathjs.exp(-1 * value * 2)) - 0.5)*2;
      //   //(value*value)/(1 + value*value);
      //   //Mathjs.sin(value*value);
      //   //1.0/(1.0 + Mathjs.exp(-1 * value));
      //   //(value*value)/(1 + value*value)
      //   if(isNaN(result)){
      //     result = 0.0
      //   }
      //   return result;
      // });
      let postInputsWeightsVector = Mathjs.multiply(this.combined_input_weights, input_vector);

      let postInputsBiasVector = Mathjs.add(postInputsWeightsVector, this.combined_input_bias);

      let hiddenLayerInputVector =  postInputsBiasVector.map(function(value, index, matrix){
        let result = (1.0/(1.0 + Mathjs.exp(-1 * value )) - 0.5)*2;
        //(value*value)/(1 + value*value);
        //Mathjs.sin(value*value);
        //1.0/(1.0 + Mathjs.exp(-1 * value));
        //(value*value)/(1 + value*value)
        if(isNaN(result)){
            result = 0.0
        }
        return result;
        });

        let postHiddenLayerWeightsVector = Mathjs.multiply(hiddenLayerInputVector, this.combined_hidden_weights);
        let postHiddenLayerBaisVector = Mathjs.add(postHiddenLayerWeightsVector, this.combined_hidden_bias);

        let outputVector = postHiddenLayerBaisVector.map(function(value, index, matrix){
          let result = (1.0/(1.0 + Mathjs.exp(-1 * value * 0.75)) - 0.5)*2;
          //(value*value)/(1 + value*value);
          //Mathjs.sin(value*value);
          //1.0/(1.0 + Mathjs.exp(-1 * value));
          if(isNaN(result)){
            result = 0.0
          }
          return result;
          });


        return outputVector;
    }



    get_half_chromosomes(){
      let inputs_result = Math.random();

      let inputWeights = inputs_result < 0.5 ? Mathjs.clone(this.inputWeightsA) : Mathjs.clone(this.inputWeightsB);

      let inputBias = inputs_result < 0.5 ? Mathjs.clone(this.inputBiasA) : Mathjs.clone(this.inputBiasB);

        let hidden_result = Math.random();

      let hiddenLayerWeights = hidden_result < 0.5 ? Mathjs.clone(this.hiddenLayerWeightsA) : Mathjs.clone(this.hiddenLayerWeightsB);

      let hiddenLayerBias = hidden_result < 0.5 ? Mathjs.clone(this.hiddenLayerBiasA) : Mathjs.clone(this.hiddenLayerBiasB);

      return {
        inputWeights: inputWeights,
        inputBias: inputBias,
        hiddenLayerWeights: hiddenLayerWeights,
        hiddenLayerBias: hiddenLayerBias
      };
    }

    rebuild(channel_A, channel_B){
      this.inputWeightsA = this.mutate_layer(channel_A.inputWeights);
      if(Math.random() <.01){
        this.inputWeightsA =  Mathjs.inv(  this.inputWeightsA);
      }
      if(Math.random() <.01){
        this.inputWeightsA =  Mathjs.transpose(  this.inputWeightsA);
      }
      this.inputBiasA = this.mutate_layer(channel_A.inputBias);
      this.hiddenLayerWeightsA = this.mutate_layer(channel_A.hiddenLayerWeights);
      if(Math.random() <.01){
        this.hiddenLayerWeightsA =  Mathjs.inv(  this.hiddenLayerWeightsA);
      }
      if(Math.random() <.01){
        this.hiddenLayerWeightsA =  Mathjs.transpose(  this.hiddenLayerWeightsA);
      }
      this.hiddenLayerBiasA = this.mutate_layer(channel_A.hiddenLayerBias);
      this.inputWeightsB = this.mutate_layer(channel_B.inputWeights);
      if(Math.random() <.01){
        this.inputWeightsB =  Mathjs.inv(  this.inputWeightsB);
      }
      if(Math.random() <.01){
        this.inputWeightsB =  Mathjs.transpose(  this.inputWeightsB);
      }
      this.inputBiasB = this.mutate_layer(channel_B.inputBias);
      this.hiddenLayerWeightsB = this.mutate_layer(channel_B.hiddenLayerWeights);
      if(Math.random() <.01){
          this.hiddenLayerWeightsB =  Mathjs.inv(  this.hiddenLayerWeightsB);
      }
      if(Math.random() <.01){
          this.hiddenLayerWeightsB =  Mathjs.transpose(  this.hiddenLayerWeightsB);
      }
      this.hiddenLayerBiasB = this.mutate_layer(channel_B.hiddenLayerBias);
      this.buildLayers();
      //console.log("combined det: " + Mathjs.det(this.combined_input_weights) );
    }


    mutate_layer(layer){
      layer = layer.map(function(value, index, matrix){
        // if(Math.random() < .5){
        //   value += 0.01*(Math.random()-0.5)*value  ;
        // }
        // if(Math.random() < .5){
        //   value += + 0.001*(Math.random()-0.5) ;
        // }
        // if(Math.random() < 0.1){
        //   value += 0.1*(Math.random()-0.5)*value;
        // }
        // if(Math.random() < 0.1){
        //   value += 0.1*(Math.random()-0.5) ;
        // }
        if(Math.random() < 0.05){
          value += 0.1*(Math.random()-0.5)*(Math.random()-0.5) ;
        }

        if(Math.random() < 0.05){
          value += 0.01*(Math.random()-0.5)*value ;
        }

        value +=  0.001*(Math.random()-0.5)

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

      neo.buildLayers();
      return neo;
    }
}


module.exports = Brain;
