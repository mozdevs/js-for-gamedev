'use strict';

describe('Utils module', function () {
  var utils = require('../src/utils');

  it('has a listToMap() to convert from a list to an object choosing the key. ',
  function () {
    var list = [
      { name: 'a', hp: 1 },
      { name: 'b', hp: 2 },
      { name: 'c', hp: 3 }
    ];
    expect(utils.listToMap(list, useName)).toEqual({
      a: { name: 'a', hp: 1 },
      b: { name: 'b', hp: 2 },
      c: { name: 'c', hp: 3 }
    });

    function useName(item) { return item.name; }
  });

  it('has mapValues() returning a list of the values of a map', function () {
    var map = {
      a: { name: 'a', hp: 1 },
      b: { name: 'b', hp: 2 },
      c: { name: 'c', hp: 3 }
    };
    expect(utils.mapValues(map)).toEqual([
      { name: 'a', hp: 1 },
      { name: 'b', hp: 2 },
      { name: 'c', hp: 3 }
    ]);
  });

});
