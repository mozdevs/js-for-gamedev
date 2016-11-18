'use strict';

xdescribe('The TurnList type', function () {
  var TurnList = require('../src/TurnList');
  var turnList;
  var characters;

  function FakeCharacter(party, inititative, isDead) {
    this.party = party;
    this.initiative = inititative;
    this._isDead = isDead;
  }
  FakeCharacter.prototype.isDead = function () {
    return this._isDead;
  };

  beforeEach(function () {
    characters = {
      a: new FakeCharacter('heroes', 1),
      b: new FakeCharacter('heroes', 5),
      c: new FakeCharacter('monsters', 10)
    };

    turnList = new TurnList();
    turnList.reset(characters);
  });

  it('accepts a set of characters and sort them by inititative.', function () {
    expect(turnList.turnNumber).toBe(0);
    expect(turnList.activeCharacterId).toBe(null);
    expect(turnList.list).toEqual(['c', 'b', 'a']);
  });

  it('accepts a set of characters and sort them by inititative.', function () {
    var turn = turnList.next();

    expect(turn.number).toBe(1);
    expect(turn.party).toBe(characters.c.party);
    expect(turn.activeCharacterId).toBe('c');

    expect(turnList.turnNumber).toBe(1);
    expect(turnList.activeCharacterId).toBe('c');
  });

  it('ignore all dead characters', function () {
    characters.c._isDead = true;
    characters.b._isDead = true;
    var turn = turnList.next();

    expect(turn.number).toBe(1);
    expect(turn.party).toBe(characters.a.party);
    expect(turn.activeCharacterId).toBe('a');

    expect(turnList.turnNumber).toBe(1);
    expect(turnList.activeCharacterId).toBe('a');
  });

  it('starts over when reaching the end of the list.', function () {
    turnList.next();
    turnList.next();
    turnList.next();
    var turn = turnList.next();

    expect(turn.number).toBe(4);
    expect(turn.party).toBe(characters.c.party);
    expect(turn.activeCharacterId).toBe('c');

    expect(turnList.turnNumber).toBe(4);
    expect(turnList.activeCharacterId).toBe('c');
  });
});
