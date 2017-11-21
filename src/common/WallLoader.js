'use strict';

const Mathjs = require('mathjs');


class WallLoader {
  constructor() {

  }

    // get map matrix some how, file, etc.
    load(){
      this.loaded = true;

      // for now a crap one  walls are 10x10
      this.mapArray = Mathjs.matrix([300,200]);

    }

    applyToWorld(world){
      if(!this.loaded || !world){
        return;
      }
        this.world = world;
    }

}






module.exports = WallLoader;
