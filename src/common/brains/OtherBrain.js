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
     var mutation_rate = 0.25;
     let weight_mutation_magnitude = 0.5;
     let bias_mutation_magnitude = 0.15;

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

      this.hiddenTwoLayerWeightsA = Mathjs.zeros(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  weight_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenTwoLayerBiasA = Mathjs.zeros([this.inputSize]).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  bias_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenTwoLayerWeightsB = Mathjs.zeros(Mathjs.matrix([this.inputSize, this.inputSize])).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  weight_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.hiddenTwoLayerBiasB = Mathjs.zeros([this.inputSize]).map( function(value, index, matrix) {
        if(Math.random() < mutation_rate){
          value+=  bias_mutation_magnitude*(Math.random()-0.5);
        }
        return value;
      });

      this.base_body_colorA = { red: Math.random()*0.5, blue: Math.random()*0.5, green: Math.random()*0.5 };
      this.base_body_colorB = { red: Math.random()*0.5, blue: Math.random()*0.5, green: Math.random()*0.5 };

    }


    buildLayers(){
      this.combined_input_weights = Mathjs.add(this.inputWeightsA, this.inputWeightsB);
      this.combined_input_bias = Mathjs.add(this.inputBiasA, this.inputBiasB);
      this.combined_hidden_weights = Mathjs.add(this.hiddenLayerWeightsA, this.hiddenLayerWeightsB);
      this.combined_hidden_bias = Mathjs.add(this.hiddenLayerBiasA, this.hiddenLayerBiasB);
      this.combined_hidden_two_weights = Mathjs.add(this.hiddenTwoLayerWeightsA, this.hiddenTwoLayerWeightsB);
      this.combined_hidden_two_bias = Mathjs.add(this.hiddenTwoLayerBiasA, this.hiddenTwoLayerBiasB);

      this.base_body_color.red = this.base_body_colorA.red + this.base_body_colorB.red;
      this.base_body_color.blue = this.base_body_colorA.blue + this.base_body_colorB.blue;
      this.base_body_color.green = this.base_body_colorA.green + this.base_body_colorB.green;
    }

    doMagic(input_vector){

      let postInputsWeightsVector = Mathjs.multiply(this.combined_input_weights, input_vector);

      let postInputsBiasVector = Mathjs.add(postInputsWeightsVector, this.combined_input_bias);

      let hiddenLayerInputVector =  postInputsBiasVector.map(function(value, index, matrix){
        //value*=Mathjs.PI;
        //let result = (1.0/(1.0 + Mathjs.exp(-1 * value )) - 0.5)*Mathjs.e;
        let result = Mathjs.sin(value)*Mathjs.PI;
        //Mathjs.sin(value*(index+1))/(index+1);
        if(isNaN(result)){
            result = 0.0
        }
        return result;
        });

        let postHiddenLayerWeightsVector = Mathjs.multiply(hiddenLayerInputVector, this.combined_hidden_weights);
        let postHiddenLayerBaisVector = Mathjs.add(postHiddenLayerWeightsVector, this.combined_hidden_bias);

        let postFirstHiddenLayer  = postHiddenLayerBaisVector.map(function(value, index, matrix){
          //value*=Mathjs.PI/2;
          let result = Mathjs.sin(value)*Mathjs.PI/2;
          //Mathjs.sin(value*(index+1))/(index+1);

          if(isNaN(result)){
            result = 0.0
          }
          return result;
        });


        let postHiddenTwoLayerWeightsVector = Mathjs.multiply(postFirstHiddenLayer, this.combined_hidden_two_weights);
        let postHiddenTwoLayerBaisVector = Mathjs.add(postHiddenTwoLayerWeightsVector, this.combined_hidden_two_bias);

        let outputVector = postHiddenTwoLayerBaisVector.map(function(value, index, matrix){
          //value*=Mathjs.PI;
          let result = Mathjs.sin(value);

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

      let hidden_two_result = Math.random();

      let hiddenTwoLayerWeights = hidden_two_result < 0.5 ? Mathjs.clone(this.hiddenTwoLayerWeightsA) : Mathjs.clone(this.hiddenTwoLayerWeightsB);

      let hiddenTwoLayerBias = hidden_two_result < 0.5 ? Mathjs.clone(this.hiddenTwoLayerBiasA) : Mathjs.clone(this.hiddenTwoLayerBiasB);

      let body_color_result = Math.random();

      let base_body_color = body_color_result < 0.5 ? this.base_body_colorA : this.base_body_colorB;

      //{red: 0, blue:0, green:0 };



      return {
        inputWeights: inputWeights,
        inputBias: inputBias,
        hiddenLayerWeights: hiddenLayerWeights,
        hiddenLayerBias: hiddenLayerBias,
        hiddenTwoLayerWeights: hiddenTwoLayerWeights,
        hiddenTwoLayerBias: hiddenTwoLayerBias,
        base_body_color: base_body_color
      };
    }

    rebuild(channel_A, channel_B){
      let mut_rate = 0.025;
      this.inputWeightsA = this.mutate_layer(channel_A.inputWeights);
      if(Math.random() < mut_rate){
        this.inputWeightsA =  Mathjs.inv(  this.inputWeightsA);
      }
      if(Math.random() < mut_rate){
        this.inputWeightsA =  Mathjs.transpose(  this.inputWeightsA);
      }
      this.inputBiasA = this.mutate_layer(channel_A.inputBias);

      this.hiddenLayerWeightsA = this.mutate_layer(channel_A.hiddenLayerWeights);
      if(Math.random() < mut_rate){
        this.hiddenLayerWeightsA =  Mathjs.inv(  this.hiddenLayerWeightsA);
      }
      if(Math.random() < mut_rate){
        this.hiddenLayerWeightsA =  Mathjs.transpose(  this.hiddenLayerWeightsA);
      }
      this.hiddenLayerBiasA = this.mutate_layer(channel_A.hiddenLayerBias);

      this.hiddenTwoLayerWeightsA = this.mutate_layer(channel_A.hiddenTwoLayerWeights);
      if(Math.random() < mut_rate){
        this.hiddenTwoLayerWeightsA =  Mathjs.inv(  this.hiddenTwoLayerWeightsA);
      }
      if(Math.random() < mut_rate){
        this.hiddenTwoLayerWeightsA =  Mathjs.transpose(  this.hiddenTwoLayerWeightsA);
      }
      this.hiddenTwoLayerBiasA = this.mutate_layer(channel_A.hiddenTwoLayerBias);


      this.inputWeightsB = this.mutate_layer(channel_B.inputWeights);
      if(Math.random() < mut_rate){
        this.inputWeightsB =  Mathjs.inv(  this.inputWeightsB);
      }
      if(Math.random() < mut_rate){
        this.inputWeightsB =  Mathjs.transpose(  this.inputWeightsB);
      }
      this.inputBiasB = this.mutate_layer(channel_B.inputBias);

      this.hiddenLayerWeightsB = this.mutate_layer(channel_B.hiddenLayerWeights);
      if(Math.random() < mut_rate){
          this.hiddenLayerWeightsB =  Mathjs.inv(  this.hiddenLayerWeightsB);
      }
      if(Math.random() < mut_rate){
          this.hiddenLayerWeightsB =  Mathjs.transpose(  this.hiddenLayerWeightsB);
      }
      this.hiddenLayerBiasB = this.mutate_layer(channel_B.hiddenLayerBias);

      this.hiddenTwoLayerWeightsB = this.mutate_layer(channel_B.hiddenTwoLayerWeights);
      if(Math.random() < mut_rate){
          this.hiddenTwoLayerWeightsB =  Mathjs.inv(  this.hiddenTwoLayerWeightsB);
      }
      if(Math.random() < mut_rate){
          this.hiddenTwoLayerWeightsB =  Mathjs.transpose(  this.hiddenTwoLayerWeightsB);
      }
      this.hiddenTwoLayerBiasB = this.mutate_layer(channel_B.hiddenTwoLayerBias);

      let body_color_mute = 0.15;
      this.base_body_colorA = channel_A.base_body_color;
      if(Math.random()<mut_rate*10){
        this.base_body_colorA.red += (Math.random() - 0.5) * body_color_mute;
      }
      if(Math.random()<mut_rate*10){
        this.base_body_colorA.blue += (Math.random() - 0.5) * body_color_mute;
      }
      if(Math.random()<mut_rate*10){
        this.base_body_colorA.green += (Math.random() - 0.5) * body_color_mute;
      }

      this.base_body_colorB = channel_B.base_body_color;
      if(Math.random()<mut_rate*10){
        this.base_body_colorB.red += (Math.random() - 0.5) * body_color_mute;
      }
      if(Math.random()<mut_rate*10){
        this.base_body_colorB.blue += (Math.random() - 0.5) * body_color_mute;
      }
      if(Math.random()<mut_rate*10){
        this.base_body_colorB.green += (Math.random() - 0.5) * body_color_mute;
      }

      this.buildLayers();
      //console.log("combined det: " + Mathjs.det(this.combined_input_weights) );
    }


    mutate_layer(layer){
      layer = layer.map(function(value, index, matrix){

        let mutation = 0;

        let mut_rate = 0.0015;
        let mut_magnitude = 0.25;

        // always mutatate a small amount
        //mutation +=  mut_magnitude*mut_rate*(Math.random()-0.5);


        if(Math.random() < mut_rate){
          mutation += mut_magnitude*(Math.random()-0.5);
        }

        if(Math.random() < mut_rate){
          mutation += mut_magnitude*(Math.random()-0.5)*value ;
        }

        if(Math.random() < mut_rate/10){
          mutation += mut_magnitude*(Math.random()-0.5)*10;
        }

        if(Math.random() < mut_rate/10){
          mutation += mut_magnitude*(Math.random()-0.5)*value*10;
        }


        return value + mutation;
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
      neo.hiddenTwoLayerWeightsA = Mathjs.clone(this.hiddenTwoLayerWeightsA);
      neo.hiddenTwoLayerBiasA = Mathjs.clone(this.hiddenTwoLayerBiasA);
      neo.hiddenTwoLayerWeightsB = Mathjs.clone(this.hiddenTwoLayerWeightsB);
      neo.hiddenTwoLayerBiasB = Mathjs.clone(this.hiddenTwoLayerBiasB);
      neo.base_body_colorA = this.base_body_colorA;
      neo.base_body_colorB = this.base_body_colorB;

      neo.buildLayers();
      return neo;
    }
}


module.exports = OtherBrain;
