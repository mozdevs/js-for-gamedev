'use strict';

module.exports = {
  listToMap: function (list, getIndex) {
    return list.reduce(function (map, item) {
      map[getIndex(item)] = item;
      return map;
    }, {});
  },

  mapValues: function (map) {
    return Object.keys(map).map(function (key) {
      return map[key];
    });
  }
};
