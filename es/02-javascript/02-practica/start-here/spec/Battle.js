var mockery = require('mockery');

describe('Battle type', function () {
  'use strict';

  var Battle;
  var EventEmitter;
  var samples;

  var characters;
  var scrolls;

  var heroTank;
  var heroWizard;
  var fastEnemy;

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

    Battle = require('../src/Battle');
    EventEmitter = require('events').EventEmitter;
    samples = require('./samplelib');

    characters = samples.characters;
    scrolls = samples.scrolls;
  });

  afterAll(function () {
    mockery.disable();
    mockery.deregisterMock('./dice');
  });

  function createSimpleBattleSetup() {
    heroTank = characters.heroTank;
    heroWizard = characters.heroWizard;
    fastEnemy = characters.fastEnemy;
    return {
      heroes: {
        members: [heroTank, heroWizard],
        grimoire: [scrolls.fire, scrolls.health]
      },
      monsters: {
        members: [fastEnemy],
        grimoire: [scrolls.fire, scrolls.health]
      }
    };
  }

  var battle;
  var currentSetup;

  beforeEach(function () {
    battle = new Battle();
    currentSetup = createSimpleBattleSetup();
    battle.setup(currentSetup);
  });

  afterEach(function () {
    battle.stop();
  });

  describe('Battle API', function () {

    it('is completely defined.', function () {
      expect(battle).toEqual(jasmine.any(EventEmitter));
      expect(battle.setup).toEqual(jasmine.any(Function));
      expect(battle.start).toEqual(jasmine.any(Function));
    });

  });

  xdescribe('Turn list', function () {

    it('includes all the characters sorted by initiative.', function (done) {
      var sortedByInitiative = ['Fasty', 'Tank', 'Wizz'];

      battle.on('start', function () {
        expect(this.turnList).toEqual(sortedByInitiative);
        done();
      });

      battle.start();
    });

  });

  xdescribe('Start', function () {

    it('includes the characters who are going to fight by party.',
    function (done) {
      battle.on('start', function (charIdsByParty) {
        expect(charIdsByParty).toEqual({
          heroes: ['Tank', 'Wizz'],
          monsters: ['Fasty']
        });
        done();
      });

      battle.start();
    });

  });

  xdescribe('Turns', function () {

    it('include relevant info.', function (done) {
      battle.on('turn', function (turn) {
        expect(turn).toBeDefined();
        expect(turn.number).toBe(1);
        expect(turn.activeCharacterId).toBe('Fasty');
        done();
      });

      battle.start();
    });

    it('ignore dead characters.', function (done) {
      fastEnemy.hp = 0;
      currentSetup.monsters.members.push(characters.fastEnemy);
      battle.setup(currentSetup);

      battle.on('turn', function (turn) {
        expect(turn).toBeDefined();
        expect(turn.number).toBe(1);
        expect(turn.activeCharacterId).toBe('Fasty 2');
        done();
      });

      battle.start();
    });

  });

  xdescribe('Parties in battle', function () {

    it('can contain repeated members, each will be assigned a different id.',
    function () {
      currentSetup.monsters.members.push(characters.fastEnemy);
      battle.setup(currentSetup);
      var characterIds = Object.keys(battle.characters.all());
      expect(characterIds).toContain('Fasty');
      expect(characterIds).toContain('Fasty 2');
    });

  });

  xdescribe('Battle actions', function () {

    it('are 3: attack, defend and cast.', function () {
      battle.on('turn', function () {
        expect(this.options.list()).toEqual(jasmine.arrayContaining([
          'attack',
          'defend',
          'cast'
        ]));
      });

      battle.start();
    });

    xdescribe('Defend action', function () {

      it('informs of the result.', function (done) {
        var currentDefense = fastEnemy.defense;
        var expectedDefense = Math.ceil(currentDefense * 1.1);

        battle.on('turn', function (turn) {
          if (turn.number === 1) {
            this.on('info', function (info) {
              expect(info.action).toBe('defend');
              expect(info.activeCharacterId).toBe('Fasty');
              expect(info.targetId).toBe('Fasty');
              expect(info.newDefense).toEqual(expectedDefense);
              done();
            });
            this.options.select('defend');
          }
        });

        battle.start();
      });

      it('increases defense feature by 10%.', function (done) {
        var currentDefense = fastEnemy.defense;
        fakeD100 = currentDefense + 1;
        var expectedDefense = Math.ceil(currentDefense * 1.1);

        battle.on('turn', function (turn) {
          switch (turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 2:
            expect(fastEnemy.defense).toEqual(expectedDefense);
            done();
            break;
          }
        });

        battle.start();
      });

      it('increases the odds of defending against attack.', function (done) {
        var currentDefense = fastEnemy.defense;
        fakeD100 = currentDefense + 1;
        var expectedDefense = Math.ceil(currentDefense * 1.1);

        battle.on('turn', function (turn) {
          switch (turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 2:
            this.on('info', function (result) {
              expect(result.success).toBe(false);
              done();
            });
            expect(fastEnemy.defense).toEqual(expectedDefense);
            this.options.select('attack');
            this.options.select('Fasty');
            break;
          }
        });

        battle.start();
      });

      it('increases the odds of defending against cast.', function (done) {
        var currentDefense = fastEnemy.defense;
        fakeD100 = currentDefense + 1;
        var expectedDefense = Math.ceil(currentDefense * 1.1);

        battle.on('turn', function (turn) {
          switch (turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 2:
            this.options.select('defend');
            break;
          case 3:
            this.on('info', function (result) {
              expect(result.success).toBe(false);
              done();
            });
            expect(fastEnemy.defense).toEqual(expectedDefense);
            this.options.select('cast');
            this.options.select('Fire');
            this.options.select('Fasty');
            break;
          }
        });

        battle.start();
      });

      it('accumulates turn by turn.', function (done) {
        var currentDefense = fastEnemy.defense;
        var expectedDefense =
            Math.ceil(Math.ceil(currentDefense * 1.1) * 1.1);

        battle.on('turn', function (turn) {
          switch (turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 7:
            expect(fastEnemy.defense).toEqual(expectedDefense);
            done();
            break;
          default:
            this.options.select('defend');
            break;
          }
        });

        battle.start();
      });

    });

    xdescribe('Attack action', function () {

      it('requires to choose a target character.', function (done) {
        battle.on('turn', function () {
          this.options.select('attack');
          expect(this.options.list()).toEqual(jasmine.arrayContaining([
            'Tank',
            'Wizz',
            'Fasty'
          ]));
          done();
        });

        battle.start();
      });

      it('does not allow to choose a dead character.', function (done) {
        currentSetup.heroes.members[1].hp = 0;
        battle.setup(currentSetup);

        battle.on('turn', function () {
          this.options.select('attack');
          expect(this.options.list()).toEqual(jasmine.arrayContaining([
            'Tank',
            'Fasty'
          ]));
          expect(this.options.list()).not.toContain('Wizz');
          done();
        });

        battle.start();
      });

      it('applies weapon effect if defense roll fails.', function (done) {
        fakeD100 = 100;
        var tankHealth = heroTank.hp;
        var clawsDamage = fastEnemy.weapon.effect.hp;

        battle.on('turn', function (turn) {
          switch(turn.number) {
          case 1:
            this.options.select('attack');
            this.options.select('Tank');
            break;
          case 2:
            // damage is a negative number
            expect(heroTank.hp).toEqual(tankHealth + clawsDamage);
            done();
          }
        });

        battle.start();
      });

      it('doesn\'t apply weapon effect if defense roll passes.',
       function (done) {
        fakeD100 = 1;
        var tankHealth = heroTank.hp;

        battle.on('turn', function (turn) {
          switch(turn.number) {
          case 1:
            this.options.select('attack');
            this.options.select('Tank');
            break;
          case 2:
            // damage is a negative number
            expect(heroTank.hp).toEqual(tankHealth);
            done();
          }
        });

        battle.start();
      });

      it('always applies weapon effect if the attack comes from an ally.',
      function (done) {
        heroWizard.defense = 100;
        fakeD100 = 1;

        var wizardHealth = heroWizard.hp;
        var swordDamage = heroTank.weapon.effect.hp;

        battle.on('turn', function (turn) {
          switch(turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 2:
            this.options.select('attack');
            this.options.select('Wizz');
            break;
          case 3:
            // damage is a negative number
            expect(heroWizard.hp).toEqual(wizardHealth + swordDamage);
            done();
          }
        });

        battle.start();
      });

      it('informs after attacking an ally.', function (done) {
        battle.on('turn', function (turn) {
          if (turn.number === 2) {
            this.on('info', function (info) {
              expect(info.action).toBe('attack');
              expect(info.activeCharacterId).toBe('Tank');
              expect(info.targetId).toBe('Wizz');
              expect(info.effect).toEqual(heroTank.weapon.effect);
              done();
            });
            this.options.select('attack');
            this.options.select('Wizz');
          }
          else {
            this.options.select('defend');
          }
        });

        battle.start();
      });

      it('informs after attacking a foe passing the defense roll.',
      function (done) {
        fakeD100 = 100;
        battle.on('turn', function (turn) {
          if (turn.number === 2) {
            this.on('info', function (info) {
              expect(info.action).toBe('attack');
              expect(info.activeCharacterId).toBe('Tank');
              expect(info.targetId).toBe('Fasty');
              expect(info.effect).toEqual(heroTank.weapon.effect);
              expect(info.success).toBe(true);
              done();
            });
            this.options.select('attack');
            this.options.select('Fasty');
          }
          else {
            this.options.select('defend');
          }
        });

        battle.start();
      });

      it('informs after attacking a foe failing the defense roll.',
      function (done) {
        fakeD100 = 1;
        battle.on('turn', function (turn) {
          if (turn.number === 2) {
            this.on('info', function (info) {
              expect(info.action).toBe('attack');
              expect(info.activeCharacterId).toBe('Tank');
              expect(info.targetId).toBe('Fasty');
              expect(info.effect).toEqual(heroTank.weapon.effect);
              expect(info.success).toBe(false);
              done();
            });
            this.options.select('attack');
            this.options.select('Fasty');
          }
          else {
            this.options.select('defend');
          }
        });

        battle.start();
      });

      it('can be cancelled.', function (done) {
        battle.on('turn', function () {
          this.options.select('attack');
          this.options.cancel();
          expect(this.options.list()).toEqual(jasmine.arrayContaining([
            'attack',
            'defend',
            'cast'
          ]));
          done();
        });

        battle.start();
      });

    });

    xdescribe('Acting on a target with improved defense', function () {

      it('(attack) makes the target\'s defense to be restored.',
         function (done) {
           var originalDefense = fastEnemy.defense;

           battle.on('turn', function (turn) {
             switch (turn.number) {
             case 1:
               this.options.select('defend');
               break;
             case 2:
               this.options.select('attack');
               this.options.select('Fasty');
               break;
             case 3:
               expect(fastEnemy.defense).toEqual(originalDefense);
               done();
               break;
             default:
               this.options.select('defend');
               break;
             }
           });

           battle.start();
         });

      it('(cast) makes the target\'s defense to be restored.',
      function (done) {
        var originalDefense = fastEnemy.defense;

        battle.on('turn', function (turn) {
          switch (turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 2:
            this.options.select('defend');
            break;
          case 3:
            this.options.select('cast');
            this.options.select('Health');
            this.options.select('Fasty');
            break;
          case 4:
            expect(fastEnemy.defense).toEqual(originalDefense);
            done();
            break;
          default:
            this.options.select('defend');
            break;
          }
        });

        battle.start();
      });

    });

    xdescribe('Cast action', function () {

      it('requires to choose an scroll.', function (done) {
        battle.on('turn', function () {
          this.options.select('cast');
          expect(this.options.list()).toEqual(jasmine.arrayContaining([
            'Health',
            'Fire'
          ]));
          done();
        });

        battle.start();
      });

      it('requires to choose a target after the scroll.', function (done) {
        battle.on('turn', function () {
          this.options.select('cast');
          this.options.select('Health');
          var targets = this.options.list();
          expect(targets).toContain('Tank');
          expect(targets).toContain('Wizz');
          expect(targets).toContain('Fasty');
          done();
        });

        battle.start();
      });

      it('costs mp.', function (done) {
        var enemyMp = fastEnemy.mp;
        var fireCost = scrolls.fire.cost;
        var expectedMp = enemyMp - fireCost;

        battle.on('turn', function (turn) {
          switch (turn.number) {
          case 1:
            this.options.select('cast');
            this.options.select('Fire');
            this.options.select('Tank');
            break;
          case 2:
            expect(this.characters.get('Fasty').mp).toBe(expectedMp);
            done();
            break;
          }
        });

        battle.start();
      });

      it('requires enough mp', function (done) {
        fastEnemy.mp = 10;
        battle.setup(currentSetup);

        battle.on('turn', function () {
          this.options.select('cast');
          expect(this.options.list()).toEqual(['Health']);
          done();
        });

        battle.start();
      });

      it('applies scroll effect if defense roll fails.', function (done) {
        fakeD100 = 100;
        var enemyHealth = fastEnemy.hp;
        var fireDamage = samples.scrolls.fire.effect.hp;

        battle.on('turn', function (turn) {
          switch(turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 2:
            this.options.select('defend');
            break;
          case 3:
            this.options.select('cast');
            this.options.select('Fire');
            this.options.select('Fasty');
            break;
          case 4:
            // damage is a negative number
            expect(fastEnemy.hp).toEqual(enemyHealth + fireDamage);
            done();
          }
        });

        battle.start();
      });

      it('doesn\'t apply weapon effect if defense roll passes.',
      function (done) {
        fakeD100 = 1;
        var enemyHealth = fastEnemy.hp;

        battle.on('turn', function (turn) {
          switch(turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 2:
            this.options.select('defend');
            break;
          case 3:
            this.options.select('cast');
            this.options.select('Fire');
            this.options.select('Fasty');
            break;
          case 4:
            // damage is a negative number
            expect(fastEnemy.hp).toEqual(enemyHealth);
            done();
          }
        });

        battle.start();
      });

      it('always applies weapon effect if the attack comes from an ally.',
      function (done) {
        heroTank.defense = 100;
        fakeD100 = 1;

        var tankHealth = heroTank.hp;
        var fireDamage = samples.scrolls.fire.effect.hp;

        battle.on('turn', function (turn) {
          switch(turn.number) {
          case 1:
            this.options.select('defend');
            break;
          case 2:
            this.options.select('defend');
            break;
          case 3:
            this.options.select('cast');
            this.options.select('Fire');
            this.options.select('Tank');
            break;
          case 4:
            // damage is a negative number
            expect(heroTank.hp).toEqual(tankHealth + fireDamage);
            done();
          }
        });

        battle.start();
      });

      it('can be cancelled.', function (done) {
        battle.on('turn', function () {
          this.options.select('attack');
          this.options.cancel();
          expect(this.options.list()).toEqual(jasmine.arrayContaining([
            'attack',
            'defend',
            'cast'
          ]));
          done();
        });

        battle.start();
      });

      it('can go back to scroll selection.', function (done) {
        battle.on('turn', function () {
          this.options.select('cast');
          this.options.select('Health');
          this.options.cancel();
          expect(this.options.list()).toEqual(jasmine.arrayContaining([
            'Health',
            'Fire'
          ]));
          done();
        });

        battle.start();
      });

      it('informs after casting on an ally.', function (done) {
        battle.on('turn', function (turn) {
          if (turn.number === 3) {
            this.on('info', function (info) {
              expect(info.action).toBe('cast');
              expect(info.activeCharacterId).toBe('Wizz');
              expect(info.targetId).toBe('Tank');
              expect(info.scrollName).toEqual('Health');
              expect(info.effect).toEqual(scrolls.health.effect);
              done();
            });
            this.options.select('cast');
            this.options.select('Health');
            this.options.select('Tank');
          }
          else {
            this.options.select('defend');
          }
        });

        battle.start();
      });

      it('informs after casting on a foe failing the defense roll.',
      function (done) {
        fakeD100 = 100;
        battle.on('turn', function (turn) {
          if (turn.number === 3) {
            this.on('info', function (info) {
              expect(info.action).toBe('cast');
              expect(info.activeCharacterId).toBe('Wizz');
              expect(info.targetId).toBe('Fasty');
              expect(info.scrollName).toEqual('Health');
              expect(info.effect).toEqual(scrolls.health.effect);
              expect(info.success).toBe(true);
              done();
            });
            this.options.select('cast');
            this.options.select('Health');
            this.options.select('Fasty');
          }
          else {
            this.options.select('defend');
          }
        });

        battle.start();
      });

      it('informs after casting on a foe passing the defense roll.',
      function (done) {
        fakeD100 = 1;
        battle.on('turn', function (turn) {
          if (turn.number === 3) {
            this.on('info', function (info) {
              expect(info.action).toBe('cast');
              expect(info.activeCharacterId).toBe('Wizz');
              expect(info.targetId).toBe('Fasty');
              expect(info.scrollName).toEqual('Health');
              expect(info.effect).toEqual(scrolls.health.effect);
              expect(info.success).toBe(false);
              done();
            });
            this.options.select('cast');
            this.options.select('Health');
            this.options.select('Fasty');
          }
          else {
            this.options.select('defend');
          }
        });

        battle.start();
      });

    });

  });

  xdescribe('Some battles', function () {

    it('are won by heroes.', function (done) {
      heroTank.defense = 0;
      heroWizard.defense = 0;
      fastEnemy.defense = 0;
      battle.setup(currentSetup);

      battle.on('turn', function (turn) {
        switch (turn.number) {
        case 1:
          this.options.select('attack');
          this.options.select('Tank');
          break;
        case 2:
          this.options.select('attack');
          this.options.select('Fasty');
          break;
        case 3:
          this.options.select('attack');
          this.options.select('Fasty');
          break;
        }
      });

      battle.on('end', function (result) {
        expect(result.winner).toEqual('heroes');
        done();
      });

      battle.start();
    });

    it('are won by monsters.', function (done) {
      heroTank.defense = 0;
      heroWizard.defense = 0;
      battle.setup(currentSetup);

      battle.on('turn', function (turn) {
        if (turn.party === 'heroes') {
          this.options.select('defend');
        }
        if (turn.party === 'monsters') {
          this.options.select('attack');
          var candidates = this.options.list();
          var otherParties = candidates.filter(function (candidateId) {
            return this.characters.get(candidateId).party !== 'monsters';
          }.bind(this));
          this.options.select(otherParties[0]);
        }
      });

      battle.on('end', function (result) {
        expect(result.winner).toEqual('monsters');
        done();
      });

      battle.start();
    });

  });
});
