var mockery = require('mockery');

describe('Entities library', function () {

  var entities;

  var Character;
  var Item;
  var Weapon;
  var Scroll;
  var Effect;

  var fakeD100 = 50;
  var fakeDice = {
    d100: function () { return fakeD100; }
  };

  beforeAll(function () {
    mockery.registerMock('./dice', fakeDice);
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    entities = require('../src/entities');

    Character = entities.Character;
    Item = entities.Item;
    Weapon = entities.Weapon;
    Scroll = entities.Scroll;
    Effect = entities.Effect;
  });

  afterAll(function () {
    mockery.disable();
    mockery.deregisterMock('./dice');
  });

  it('includes types for characters, items, weapons and effects.', function () {
    expect(Character).toEqual(jasmine.any(Function));
    expect(Item).toEqual(jasmine.any(Function));
    expect(Weapon).toEqual(jasmine.any(Function));
    expect(Scroll).toEqual(jasmine.any(Function));
    expect(Effect).toEqual(jasmine.any(Function));
  });

  xdescribe('Effect type', function () {

    it('allows specify arbitrary feature alterations.', function () {
      var effect = new Effect({
        hp: 5,
        mp: -5
      });
      expect(effect.hp).toBe(5);
      expect(effect.mp).toBe(-5);
    });

  });

  xdescribe('Character type', function () {
    var features = {
      initiative: 15,
      defense: 55,
      weapon: null,
      hp: 30,
      maxHp: 30,
      mp: 100,
      maxMp: 100
    };

    var character;

    beforeEach(function () {
      character = new Character('Test', features);
    });

    it('allows to create a default character.', function () {
      character = new Character('Default');
      expect(character.name).toBe('Default');
      expect(character.party).toBe(null);
      expect(character.initiative).toBe(0);
      expect(character.defense).toBe(0);
      expect(character.weapon).toBe(null);
      expect(character.mp).toBe(0);
      expect(character.hp).toBe(0);
      expect(character.maxMp).toBe(0);
      expect(character.maxHp).toBe(15);
    });

    it('allows to create characters with specific features.', function () {
      expect(character).toEqual(jasmine.objectContaining(features));
    });

    it('allows to change party at any time.', function () {
      character.party = 'heroes';
      expect(character.party).toBe('heroes');
      character.party = 'monsters';
      expect(character.party).toBe('monsters');
    });

    it('sets maxHp to initial hp if not provided.', function () {
      var partialFeatures = Object.create(features);
      partialFeatures.maxHp = void 0;
      character = new Character('Partial', partialFeatures);
      expect(character.maxHp).toBe(partialFeatures.hp);
    });

    it('sets maxMp to initial mp if not provided.', function () {
      var partialFeatures = Object.create(features);
      partialFeatures.maxMp = void 0;
      character = new Character('Partial', partialFeatures);
      expect(character.maxMp).toBe(partialFeatures.mp);
    });

    it('allows to check if they are dead.', function () {
      character.hp = 1;
      expect(character.isDead()).toBe(false);
      character.hp = 0;
      expect(character.isDead()).toBe(true);
    });

    describe('Effect application', function () {

      var variations;
      var effect;

      beforeEach(function () {
        variations = {
          initiative: -5,
          defense: 5,
          hp: -5,
          maxHp: 5,
          mp: -5,
          maxMp: 5
        };
        effect = new Effect(variations);
      });

      it('applies an effect if the effect comes from an ally.',
      function () {
        var isAlly = true;

        expect(character.applyEffect(effect, isAlly)).toBe(true);
        Object.keys(variations).forEach(function (feature) {
          expect(character[feature])
            .toBe(features[feature] + variations[feature]);
        });
      });

      it('applies an effect if the effect comes from a foe and ' +
      'defense roll fails.',
      function () {
        var isAlly = false;
        fakeD100 = 100;

        expect(character.applyEffect(effect, isAlly)).toBe(true);
        Object.keys(variations).forEach(function (feature) {
          expect(character[feature])
            .toBe(features[feature] + variations[feature]);
        });
      });

      it('does not applie an effect if the effect comes from a foe but ' +
      'defense roll passed.',
      function () {
        var isAlly = false;
        fakeD100 = 1;

        expect(character.applyEffect(effect, isAlly)).toBe(false);
        Object.keys(variations).forEach(function (feature) {
          expect(character[feature]).toBe(features[feature]);
        });
      });

    });

    it('prevents effects from changing name or weapon.', function () {
      var variations = {
        name: 'Avoided',
        weapon: null
      };
      var effect = new Effect(variations);
      var originalName = character.name;
      var originalWeapon = character.weapon;
      character.applyEffect(effect);
      expect(character.name).toBe(originalName);
      expect(character.weapon).toBe(originalWeapon);
    });

    it('keeps mp in the range [0, maxMp].', function () {
      character.mp = -10;
      expect(character.mp).toBe(0);
      character.mp = character.maxMp + 10;
      expect(character.mp).toBe(character.maxMp);
    });

    it('keeps hp in the range [0, maxHp].', function () {
      character.hp = -10;
      expect(character.hp).toBe(0);
      character.hp = character.maxMp + 10;
      expect(character.hp).toBe(character.maxHp);
    });

    it('keeps defense in the range [0, 100]', function () {
      character.defense = -10;
      expect(character.defense).toBe(0);
      character.defense = 200;
      expect(character.defense).toBe(100);
    });

  });

  xdescribe('Item type', function () {

    it('allows to create generic items', function () {
      var item = new Item('testItem', new Effect({ hp: 5 }));
      expect(item.effect).toEqual(jasmine.any(Effect));
      expect(item.effect.hp).toBe(5);
    });

  });

  xdescribe('Weapon type', function () {

    it('is a subtype of Item', function () {
      expect(Weapon.prototype).toEqual(jasmine.any(Item));
      expect(Weapon.prototype.constructor).toBe(Weapon);
    });

    it('allows to create weapons with a reducing hp effect.', function () {
      var weapon = new Weapon('sword', 5);
      expect(weapon.effect).toEqual(jasmine.any(Effect));
      expect(weapon.effect.hp).toBe(-5);
    });

    it('allows to create weapons with extra effect.', function () {
      var weapon = new Weapon('sword', 5, new Effect({ mp: -5 }));
      expect(weapon.effect).toEqual(jasmine.any(Effect));
      expect(weapon.effect.hp).toBe(-5);
      expect(weapon.effect.mp).toBe(-5);
    });

  });

  describe('Scroll type', function () {

    it('is a subtype of Item', function () {
      expect(Scroll.prototype).toEqual(jasmine.any(Item));
      expect(Scroll.prototype.constructor).toBe(Scroll);
    });

    it('allows to create spells with a mp cost and an effect.', function () {
      var health = new Scroll('health', 5, new Effect({ hp: 5 }));
      expect(health.cost).toBe(5);
      expect(health.effect).toEqual(jasmine.any(Effect));
    });

    xit('can test if a character can pay its cost.', function () {
      var health = new Scroll('health', 5, new Effect({ hp: 5 }));
      expect(health.canBeUsed(10)).toBe(true);
      expect(health.canBeUsed(4)).toBe(false);
    });

  });

  describe('Built-in entities', function () {

    it('includes characters and weapons.', function () {
      expect(entities.characters).toEqual(jasmine.any(Object));
      expect(entities.weapons).toEqual(jasmine.any(Object));
      expect(entities.scrolls).toEqual(jasmine.any(Object));
    });

    xdescribe('Characters', function () {

      it('includes a tank.', function () {
        var character = entities.characters.heroTank;
        expect(character).toEqual(jasmine.any(Character));
        expect(character.weapon).toEqual(jasmine.any(Weapon));
        expect(character.weapon).toEqual(entities.weapons.sword);
        expect(character).toEqual(jasmine.objectContaining({
          initiative: 10,
          defense: 70,
          hp: 80,
          maxHp: 80,
          mp: 30,
          maxMp: 30
        }));
      });

      it('includes a wizard.', function () {
        var character = entities.characters.heroWizard;
        expect(character).toEqual(jasmine.any(Character));
        expect(character.weapon).toEqual(jasmine.any(Weapon));
        expect(character.weapon).toEqual(entities.weapons.wand);
        expect(character).toEqual(jasmine.objectContaining({
          initiative: 4,
          defense: 50,
          hp: 40,
          maxHp: 40,
          mp: 100,
          maxMp: 100
        }));
      });

      it('includes a skeleton.', function () {
        var character = entities.characters.monsterSkeleton;
        expect(character).toEqual(jasmine.any(Character));
        expect(character.weapon).toEqual(jasmine.any(Weapon));
        expect(character.weapon).toEqual(entities.weapons.sword);
        expect(character).toEqual(jasmine.objectContaining({
          initiative: 9,
          defense: 50,
          hp: 100,
          maxHp: 100,
          mp: 0,
          maxMp: 0
        }));
      });

      it('includes a slime.', function () {
        var character = entities.characters.monsterSlime;
        expect(character).toEqual(jasmine.any(Character));
        expect(character.weapon).toEqual(jasmine.any(Weapon));
        expect(character.weapon).toEqual(entities.weapons.pseudopode);
        expect(character).toEqual(jasmine.objectContaining({
          initiative: 2,
          defense: 40,
          hp: 40,
          maxHp: 40,
          mp: 50,
          maxMp: 50
        }));
      });

      it('includes a bat.', function () {
        var character = entities.characters.monsterBat;
        expect(character).toEqual(jasmine.any(Character));
        expect(character.weapon).toEqual(jasmine.any(Weapon));
        expect(character.weapon).toEqual(entities.weapons.fangs);
        expect(character).toEqual(jasmine.objectContaining({
          initiative: 30,
          defense: 80,
          hp: 5,
          maxHp: 5,
          mp: 0,
          maxMp: 0
        }));
      });

    });

    xdescribe('Weapons', function () {

      it('includes a sword.', function () {
        var weapon = entities.weapons.sword;
        expect(weapon).toEqual(jasmine.any(Weapon));
        expect(weapon.effect).toEqual(jasmine.objectContaining({
          hp: -25
        }));
      });

      it('includes a wand.', function () {
        var weapon = entities.weapons.wand;
        expect(weapon).toEqual(jasmine.any(Weapon));
        expect(weapon.effect).toEqual(jasmine.objectContaining({
          hp: -5
        }));
      });

      it('includes fangs.', function () {
        var weapon = entities.weapons.fangs;
        expect(weapon).toEqual(jasmine.any(Weapon));
        expect(weapon.effect).toEqual(jasmine.objectContaining({
          hp: -10
        }));
      });

      it('includes pseudopode.', function () {
        var weapon = entities.weapons.pseudopode;
        expect(weapon).toEqual(jasmine.any(Weapon));
        expect(weapon.effect).toEqual(jasmine.objectContaining({
          hp: -5,
          mp: -5
        }));
      });

    });

    xdescribe('Scrolls', function () {

      it('includes health.', function () {
        var scroll = entities.scrolls.health;
        expect(scroll).toEqual(jasmine.any(Scroll));
        expect(scroll.cost).toBe(10);
        expect(scroll.effect).toEqual(jasmine.objectContaining({
          hp: 25
        }));
      });

      it('includes fireball.', function () {
        var scroll = entities.scrolls.fireball;
        expect(scroll).toEqual(jasmine.any(Scroll));
        expect(scroll.cost).toBe(30);
        expect(scroll.effect).toEqual(jasmine.objectContaining({
          hp: -25
        }));
      });

    });

  });
});
