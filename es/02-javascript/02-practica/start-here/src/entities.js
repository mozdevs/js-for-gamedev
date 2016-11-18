'use strict';
var items = require('./items');
var Character = require('./Character');

var Effect = items.Effect;


var lib = module.exports = {
  Item: items.Item,
  Weapon: items.Weapon,
  Scroll: items.Scroll,
  Effect: Effect,
  Character: Character,

  weapons: {
    get sword() {
      return new items.Weapon('sword', 25);
    },
    get wand() {
      return new items.Weapon('wand', 5);
    },
    // Implementa los colmillos y el pseudópodo
  },

  characters: {

    get heroTank() {
      return new Character('Tank', {
        initiative: 10,
        weapon: lib.weapons.sword,
        defense: 70,
        hp: 80,
        mp: 30
      });
    },

    // Implementa el mago

    get monsterSkeleton() {
      return new Character('skeleton', {
        initiative: 9,
        defense: 50,
        weapon: lib.weapons.sword,
        hp: 100,
        mp: 0
      });
    },

    // Implementa el limo y el murciélago
  },

  scrolls: {

    get health() {
      return new items.Scroll('health', 10, new Effect({ hp: 25 }));
    },

    // Implementa la bola de fuego

  }
};
