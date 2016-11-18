(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RPG = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  "Battle": require('./src/Battle.js'),
  "entities": require('./src/entities.js')
};


},{"./src/Battle.js":3,"./src/entities.js":10}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter;
var CharactersView = require('./CharactersView');
var OptionsStack = require('./OptionsStack');
var TurnList = require('./TurnList');
var Effect = require('./items').Effect;

var utils = require('./utils');
var listToMap = utils.listToMap;
var mapValues = utils.mapValues;

function Battle() {
  EventEmitter.call(this);
  this._grimoires = {};
  this._charactersById = {};
  this._turns = new TurnList();

  this.options = new OptionsStack();
  this.characters = new CharactersView();
}
Battle.prototype = Object.create(EventEmitter.prototype);
Battle.prototype.constructor = Battle;

Object.defineProperty(Battle.prototype, 'turnList', {
  get: function () {
    return this._turns ? this._turns.list : null;
  }
});

Battle.prototype.setup = function (parties) {
  this._grimoires = this._extractGrimoiresByParty(parties);
  this._charactersById = this._extractCharactersById(parties);
  this._states = this._resetStates(this._charactersById);
  this._turns.reset(this._charactersById);

  this.characters.set(this._charactersById);
  this.options.clear();
};

Battle.prototype.start = function () {
  this._inProgressAction = null;
  this._stopped = false;
  this.emit('start', this._getCharIdsByParty());
  this._nextTurn();
};

Battle.prototype.stop = function () {
  this._stopped = true;
};

Object.defineProperty(Battle.prototype, '_activeCharacter', {
  get: function () {
    return this._charactersById[this._turns.activeCharacterId];
  }
});

Battle.prototype._extractGrimoiresByParty = function (parties) {
  var grimoires = {};
  var partyIds = Object.keys(parties);
  partyIds.forEach(function (partyId) {
    var partyGrimoire = parties[partyId].grimoire || [];
    grimoires[partyId] = listToMap(partyGrimoire, useName);
  });
  return grimoires;

  function useName(scroll) {
    return scroll.name;
  }
};

Battle.prototype._extractCharactersById = function (parties) {
  var idCounters = {};
  var characters = [];
  var partyIds = Object.keys(parties);
  partyIds.forEach(function (partyId) {
    var members = parties[partyId].members;
    assignParty(members, partyId);
    characters = characters.concat(members);
  });
  return listToMap(characters, useUniqueName);

  function assignParty(characters, party) {
    characters.forEach(function (character) {
      character.party = party;
    });
  }

  function useUniqueName(character) {
    var name = character.name;
    if (!(name in idCounters)) {
      idCounters[name] = 0;
    }
    var count = idCounters[name];
    idCounters[name]++;
    return name + (count === 0 ? '' : ' ' + (count + 1));
  }
};

Battle.prototype._resetStates = function (charactersById) {
  return Object.keys(charactersById).reduce(function (map, charId) {
    map[charId] = {};
    return map;
  }, {});
};

Battle.prototype._getCharIdsByParty = function () {
  var charIdsByParty = {};
  var charactersById = this._charactersById;
  Object.keys(charactersById).forEach(function (charId) {
    var party = charactersById[charId].party;
    if (!charIdsByParty[party]) {
      charIdsByParty[party] = [];
    }
    charIdsByParty[party].push(charId);
  });
  return charIdsByParty;
};

Battle.prototype._nextTurn = function () {
  if (this._stopped) { return; }
  setTimeout(function () {
    var endOfBattle = this._checkEndOfBattle();
    if (endOfBattle) {
      this.emit('end', endOfBattle);
    } else {
      var turn = this._turns.next();
      this._showActions();
      this.emit('turn', turn);
    }
  }.bind(this), 0);
};

Battle.prototype._checkEndOfBattle = function () {
  var allCharacters = mapValues(this._charactersById);
  var aliveCharacters = allCharacters.filter(isAlive);
  var commonParty = getCommonParty(aliveCharacters);
  return commonParty ? { winner: commonParty } : null;

  function isAlive(character) {
    return !character.isDead();
  }

  function getCommonParty(characters) {
    return characters.reduce(function (common, character) {
      return character.party !== common ? null : common;
    }, characters[0].party);
  }
};

Battle.prototype._showActions = function () {
  this.options.current = {
    'attack': true,
    'defend': true,
    'cast': true
  };
  this.options.current.on('chose', this._onAction.bind(this));
};

Battle.prototype._onAction = function (action) {
  this._action = {
    action: action,
    activeCharacterId: this._turns.activeCharacterId
  };
  this['_' + action]();
};

Battle.prototype._defend = function () {
  var activeCharacterId = this._action.activeCharacterId;
  var newDefense = this._improveDefense(activeCharacterId);
  this._action.targetId = this._action.activeCharacterId;
  this._action.newDefense = newDefense;
  this._executeAction();
};

Battle.prototype._improveDefense = function (targetId) {
  var states = this._states[targetId];
  var targetCharacter = this._charactersById[targetId];
  if (!states.improvedDefense) {
    states.improvedDefense = {
      originalDefense: targetCharacter.defense
    };
  }
  targetCharacter.defense = Math.ceil(targetCharacter.defense * 1.1);
  return targetCharacter.defense;
};

Battle.prototype._restoreDefense = function (targetId) {
  var states = this._states[targetId];
  if (states.improvedDefense) {
    this._charactersById[targetId].defense =
      states.improvedDefense.originalDefense;
    delete states.improvedDefense;
  }
};

Battle.prototype._attack = function () {
  var self = this;
  var activeCharacter = this._activeCharacter;
  self._showTargets(function onTarget(targetId) {
    self._action.effect = new Effect(activeCharacter.weapon.effect);
    self._action.targetId = targetId;
    self._executeAction();
    self._restoreDefense(targetId);
  });
};

Battle.prototype._cast = function () {
  var self = this;
  var activeCharacter = this._activeCharacter;
  self._showScrolls(function onScroll(scrollId, scroll) {
    self._showTargets(function onTarget(targetId) {
      self._action.effect = new Effect(scroll.effect);
      self._action.targetId = targetId;
      self._action.scrollName = scroll.name;
      activeCharacter.mp -= scroll.cost;
      self._executeAction();
      self._restoreDefense(targetId);
    });
  });
};

Battle.prototype._executeAction = function () {
  var action = this._action;
  var effect = this._action.effect || new Effect({});
  var activeCharacter = this._charactersById[action.activeCharacterId];
  var targetCharacter = this._charactersById[action.targetId];
  var areAllies = activeCharacter.party === targetCharacter.party;

  var wasSuccessful = targetCharacter.applyEffect(effect, areAllies);
  this._action.success = wasSuccessful;

  this._informAction();
  this._nextTurn();
};

Battle.prototype._informAction = function () {
  this.emit('info', this._action);
};

Battle.prototype._showTargets = function (onSelection) {
  var charactersById = this._charactersById;
  var aliveIds = this._turns.list.filter(isAlive);
  var characterIds = listToMap(aliveIds, useItem);
  this.options.current = characterIds;
  this.options.current.on('chose', onSelection);

  function useItem(item) {
    return item;
  }

  function isAlive(characterId) {
    return !charactersById[characterId].isDead();
  }
};

Battle.prototype._showScrolls = function (onSelection) {
  var caster = this._activeCharacter;
  var grimoire = this._grimoires[caster.party];
  var availableScrollsForCaster = mapValues(grimoire).filter(canBeCast);
  var scrollsIds = listToMap(availableScrollsForCaster, useName);
  this.options.current = scrollsIds;
  this.options.current.on('chose', onSelection);

  function canBeCast(scroll) {
    return scroll.canBeUsed(caster.mp);
  }

  function useName(scroll) {
    return scroll.name;
  }
};

module.exports = Battle;

},{"./CharactersView":5,"./OptionsStack":7,"./TurnList":8,"./items":11,"./utils":12,"events":2}],4:[function(require,module,exports){
'use strict';
var dice = require('./dice');

function Character(name, features) {
  features = features || {};
  this.name = name;
  this.party = null;
  this.initiative = features.initiative || 0;
  this.defense = features.defense || 0;
  this.weapon = features.weapon || null;
  this._mp = features.mp || 0;
  this._hp = features.hp || 0;
  this.maxMp = features.maxMp || this.mp;
  this.maxHp = features.maxHp || this.hp || 15;
}

Character.prototype._immuneToEffect = ['name', 'weapon'];

Character.prototype.isDead = function () {
  return this.hp === 0;
};

Character.prototype.applyEffect = function (effect, isAlly) {
  if (isAlly || dice.d100() > this.defense) {
    Object.keys(effect).forEach(function (affectedFeature) {
      var isImmune = this._immuneToEffect.indexOf(affectedFeature) > -1;
      if (!isImmune) {
        this[affectedFeature] += effect[affectedFeature];
      }
    }.bind(this));
    return true;
  }
  return false;
};

Object.defineProperty(Character.prototype, 'mp', {
  get: function () {
    return this._mp;
  },
  set: function (newValue) {
    this._mp = Math.max(0, Math.min(newValue, this.maxMp));
  }
});

Object.defineProperty(Character.prototype, 'hp', {
  get: function () {
    return this._hp;
  },
  set: function (newValue) {
    this._hp = Math.max(0, Math.min(newValue, this.maxHp));
  }
});

Object.defineProperty(Character.prototype, 'defense', {
  get: function () {
    return this._defense;
  },
  set: function (newValue) {
    this._defense = Math.max(0, Math.min(newValue, 100));
  }
});

module.exports = Character;

},{"./dice":9}],5:[function(require,module,exports){
'use strict';

function CharactersView() {
  this._views = {};
}

CharactersView.prototype._visibleFeatures = [
  'name',
  'party',
  'initiative',
  'defense',
  'hp',
  'mp',
  'maxHp',
  'maxMp'
];

CharactersView.prototype.all = function () {
  return Object.keys(this._views).reduce(function (copy, id) {
    copy[id] = this._views[id];
    return copy;
  }.bind(this), {});
};

CharactersView.prototype.allFrom = function (party) {
  return Object.keys(this._views).reduce(function (copy, id) {
    if (this._views[id].party === party) {
      copy[id] = this._views[id];
    }
    return copy;
  }.bind(this), {});
};

CharactersView.prototype.get = function (id) {
  return this._views[id] || null;
};

CharactersView.prototype.set = function (characters) {
  this._views = Object.keys(characters).reduce(function (views, id) {
    views[id] = this._getViewFor(characters[id]);
    return views;
  }.bind(this), {});
};

CharactersView.prototype._getViewFor = function (character) {
  return this._visibleFeatures.reduce(function (partialView, feature) {
    Object.defineProperty(partialView, feature, {
      get: function () {
        return character[feature];
      },
      set: function () {},
      enumerable: true
    });
    return partialView;
  }, {});
};

module.exports = CharactersView;

},{}],6:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter;

function Options(group) {
  EventEmitter.call(this);
  this._group = typeof group === 'object' ? group : {};
}
Options.prototype = Object.create(EventEmitter.prototype);
Options.prototype.constructor = Options;

Options.prototype.list = function () {
  return Object.keys(this._group);
};

Options.prototype.get = function (id) {
  return this._group[id];
};

Options.prototype.select = function (id) {
  var currentGroup = this._group;
  if (!currentGroup.hasOwnProperty(id)) {
    this.emit('choseError', 'option-does-not-exist', id);
  } else {
    this.emit('chose', id, currentGroup[id]);
  }
};

module.exports = Options;

},{"events":2}],7:[function(require,module,exports){
'use strict';
var Options = require('./Options');

function OptionsStack() {
  this._stack = [];
  Object.defineProperty(this, 'current', {
    get: function () {
      return this._stack[this._stack.length - 1];
    },
    set: function (v) {
      if (!(v instanceof Options)) {
        v = new Options(v);
      }
      return this._stack.push(v);
    }
  });
}

OptionsStack.prototype.select = function (id) {
  return this.current.select(id);
};

OptionsStack.prototype.list = function () {
  return this.current.list();
};

OptionsStack.prototype.get = function (id) {
  return this.current.get(id);
};

OptionsStack.prototype.cancel = function () {
  this._stack.pop();
};

OptionsStack.prototype.clear = function () {
  this._stack = [];
};

module.exports = OptionsStack;

},{"./Options":6}],8:[function(require,module,exports){
'use strict';

function TurnList() {}

TurnList.prototype.reset = function (charactersById) {
  this._charactersById = charactersById;

  this._turnIndex = -1;
  this.turnNumber = 0;
  this.activeCharacterId = null;
  this.list = this._sortByInitiative();
};

TurnList.prototype.next = function () {
  this.turnNumber++;
  do {
    this._turnIndex++;
    this._turnIndex = this._turnIndex % this.list.length;
    this.activeCharacterId = this.list[this._turnIndex];
    var activeCharacter = this._charactersById[this.activeCharacterId];
  } while (activeCharacter.isDead());

  return {
    number: this.turnNumber,
    party: activeCharacter.party,
    activeCharacterId: this.activeCharacterId
  };
};

TurnList.prototype._sortByInitiative = function () {
  var charactersById = this._charactersById;
  return Object.keys(charactersById).sort(byDecreasingInitiative);

  function byDecreasingInitiative(idA, idB) {
    var initiativeA = charactersById[idA].initiative;
    var initiativeB = charactersById[idB].initiative;
    return initiativeB - initiativeA;
  }
};

module.exports = TurnList;

},{}],9:[function(require,module,exports){
'use strict';

module.exports.d100 = function () {
  return Math.floor(Math.random() * 100) + 1;
};

},{}],10:[function(require,module,exports){
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
    get fangs() {
      return new items.Weapon('fangs', 10);
    },
    get pseudopode() {
      return new items.Weapon('pseudopode', 5, new Effect({ mp: -5 }));
    }
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

    get heroWizard() {
      return new Character('Wizz', {
        initiative: 4,
        defense: 50,
        weapon: lib.weapons.wand,
        hp: 40,
        mp: 100
      });
    },

    get monsterSkeleton() {
      return new Character('skeleton', {
        initiative: 9,
        defense: 50,
        weapon: lib.weapons.sword,
        hp: 100,
        mp: 0
      });
    },

    get monsterSlime() {
      return new Character('slime', {
        initiative: 2,
        defense: 40,
        weapon: lib.weapons.pseudopode,
        hp: 40,
        mp: 50
      });
    },

    get monsterBat() {
      return new Character('bat', {
        initiative: 30,
        defense: 80,
        weapon: lib.weapons.fangs,
        hp: 5,
        mp: 0
      });
    }
  },

  scrolls: {

    get health() {
      return new items.Scroll('health', 10, new Effect({ hp: 25 }));
    },

    get fireball() {
      return new items.Scroll('fireball', 30, new Effect({ hp: -25 }));
    }

  }
};

},{"./Character":4,"./items":11}],11:[function(require,module,exports){
'use strict';

function Item(name, effect) {
  this.name = name;
  this.effect = effect;
}

function Weapon(name, damage, extraEffect) {
  extraEffect = extraEffect || new Effect({});
  extraEffect.hp = -damage;
  Item.call(this, name, extraEffect);
}
Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

function Scroll(name, cost, effect) {
  Item.call(this, name, effect);
  this.cost = cost;
}
Scroll.prototype = Object.create(Item.prototype);
Scroll.prototype.constructor = Scroll;

Scroll.prototype.canBeUsed = function (mp) {
  return this.cost <= mp;
};

function Effect(variations) {
  Object.keys(variations).forEach(function (feature) {
    this[feature] = variations[feature];
  }.bind(this));
}

module.exports = {
  Item: Item,
  Weapon: Weapon,
  Scroll: Scroll,
  Effect: Effect
};

},{}],12:[function(require,module,exports){
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

},{}]},{},[1])(1)
});