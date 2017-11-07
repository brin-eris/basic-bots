'use strict';

const Nerdamer = require('nerdamer/all');


class Cppn {
  constructor() {
  }

  dothing() {
    var e = Nerdamer('x^2+2*(cos(x)+x*x)');
    console.log(e.text());
    Nerdamer.clear('all');

    var e = Nerdamer('diff(x^2+2*(cos(x)+x*x),x)');
    console.log(e.text());
    Nerdamer.clear('all');

    var sol = Nerdamer.solveEquations('0=x^2+4','x');
    console.log(Nerdamer( sol[1].text()).evaluate().text());

    Nerdamer.clear('all');
    var result = nerdamer('x^2').evaluate({x:'i'});
    console.log(result.text());

    var e = Nerdamer.solveEquations('x^2+4-y', 'y');
    console.log(e[0].text());
  }
}






module.exports = Cppn;
