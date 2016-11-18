var entities = require('../src/entities');

var Character = entities.Character;
var Weapon = entities.Weapon;
var Scroll = entities.Scroll;
var Effect = entities.Effect;

var lib = module.exports = {
  weapons: {
    get sword() { return new Weapon('Iron sword', 25); },
    get wand() { return new Weapon('Wood wand', 5, { mp: -5 }); },
    get claws() { return new Weapon('Claws', 15); }
  },

  characters: {
    get heroTank() {
      return new Character('Tank', {
        initiative: 10,
        weapon: lib.weapons.sword,
        defense: 70,
        hp: 80,
        maxHp: 80,
        mp: 0,
        maxMp: 0
      });
    },

    get heroWizard() {
      return new Character('Wizz', {
        initiative: 4,
        weapon: lib.weapons.wand,
        defense: 50,
        hp: 40,
        maxHp: 40,
        mp: 100,
        maxMp: 100
      });
    },

    get fastEnemy() {
      return new Character('Fasty', {
        initiative: 30,
        weapon: lib.weapons.claws,
        defense: 40,
        hp: 30,
        maxHp: 30,
        mp: 100,
        maxMp: 100
      });
    }
  },

  scrolls: {
    get health() {
      return new Scroll('Health', 10, new Effect({ hp: 25 }));
    },
    get fire() {
      return new Scroll('Fire', 30, new Effect({ hp: -25 }));
    }
  }
};
