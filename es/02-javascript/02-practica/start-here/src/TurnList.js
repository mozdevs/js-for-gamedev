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
  // Haz que calcule el siguiente turno y devuelva el resultado
  // según la especificación. Recuerda que debe saltar los personajes
  // muertos.
};

TurnList.prototype._sortByInitiative = function () {
  // Utiliza la función Array.sort(). ¡No te implementes tu propia
  // función de ordenación!
};

module.exports = TurnList;
