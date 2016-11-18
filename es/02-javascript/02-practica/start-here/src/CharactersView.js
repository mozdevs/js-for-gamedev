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
  var view = {};
  // Usa la lista de características visibles y Object.defineProperty() para
  // devolver un objeto de JavaScript con las características visibles pero
  // no modificables.
  Object.defineProperty(view, 'cada feature', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
    },
    enumerable: true
  });
  // Acuérdate de devolver el objeto.
};

module.exports = CharactersView;
