# Batalla RPG

Los objetivos principales de esta práctica son **acostumbrarte a leer código
JavaScript** y que **practiques la implementación de modelos y algoritmos**.

El objetivo secundario es que practiques la metodología **_TDD_**, del inglés
_Test Driven Development_ o desarrollo dirigido por tests.

## Instalación y tests

Clona este repositorio y en el interior del mismo ejecuta:

```js
npm install
```

Ahora puedes pasar los tests con:

```js
npm test
```

La práctica no estará finalizada hasta que no pases los tests con 0 errores y
0 especificaciones pendientes:

```
$ npm test

> pvli2017-rpg-battle@1.0.0 test /Users/salva/workspace/pvli2017-rpg-battle
> node ./node_modules/gulp/bin/gulp.js test

[09:43:57] Using gulpfile ~/workspace/pvli2017-rpg-battle/gulpfile.js
[09:43:57] Starting 'lint'...
[09:43:57] Finished 'lint' after 71 ms
[09:43:57] Starting 'test'...
[09:43:57] Finished 'test' after 41 ms
........................................................................................
88 specs, 0 failures
Finished in 0.4 seconds
```

## Calidad del código

Este proyecto exige que tu código cumpla con ciertos estándares de calidad.
El conjunto de restricciones responde a la [especificación recomendada por
ESLint](http://eslint.org/docs/rules/) con dos alteraciones:
- Se debe usar el estilo _camelCase_ para identificadores.
- Se deben usar comillas simples para las cadenas.
- Se deben poner espacios entre operandos y operadores.
- No se permiten líneas de más de 100 caracteres.
- No se permiten funciones de más de 40 _statements_

En definitiva esas reglas están ahí para que los programas sean fáciles de leer.
La mejor recomendación que puedes seguir es hacer lo que veas que ya está hecho.
Cuando contribuyas a código ajeno, mira y copia.

Las dos últimas reglas están pensadas para que no hagas funciones muy largas,
tanto en horizontal como en vertical. Ten en cuenta que lo que hemos limitado
es el número de _statements_, no de líneas así que el siguiente ejemplo son
realmente 4 _statements_:

```js
function f() {
  var x = 1;
  var y = 2;
  return x + g(y);

  function g(n) {
    return n * n;
  }
}
```

Al encargado de comprobar el estilo del código se lo llama _linter_ y éste
se pasa automáticamente junto con los tests. Un error se muestra así:

```js
/Users/salva/workspace/pvli2017-rpg-battle/src/TurnList.js
  15:8  error  Identifier 'snake_case' is not in camel case  camelcase
```

Ahí se indica dónde está el error mediante la ruta del fichero, la línea y la
columna en formato `fila:columna`.

## Metodología y guía de la práctica

Antes de comenzar lee el documento [TDD.md](./TDD.md) y la guía de la práctica
[GUIDE.md](./GUIDE.md). El primero presenta la metodología que seguirás para
desarrollar la práctica y el segundo te muestra un orden de activación de tests
sensato de cara a completar la práctica con éxito.

## Descripción de la batalla

El objetivo de la práctica es crear una **biblioteca que modele el
funcionamiento de una batalla RPG**.

Los combatientes en la batalla son personajes en distintos bandos que lucharán
entre sí. Cuando sólo queden miembros de un bando este será declarado como
vencedor.

Al comienzo de la batalla, los personajes son ordenados por su iniciativa, de
mayor a menor y los turnos se suceden en este orden hasta que sólo quedan
personajes de un bando. Si un personaje ha muerto, es decir, sus puntos de vida
son 0, su turno se salta.

Cuando le llega el turno a un personaje este puede elegir entre realizar tres
acciones: defender, atacar o lanzar un hechizo.

Si defiende, su defensa aumentará en un 10%. La defensa es importante porque
afecta en el modo en que un personaje bloquea el efecto de las armas y los
hechizos.

Si ataca, lo hará sobre un personaje objetivo que realizará una tirada de
defensa. Si el objetivo supera esta tirada no recibirá ningún efecto pero si la
falla, recibirá todo el daño del arma.

Si finalmente decide utilizar un hechizo, habrá de seleccionar el hechizo y
luego un objetivo. Los hechizos se encuentran en un grimorio común a todo el
bando y consumen puntos de maná. Si el personaje no tiene suficientes puntos
de maná para seleccionar un hechizo, no puede utilizarlo.

## Los bandos

Los bandos tienen un identificador, miembros y hechizos. Al conjunto de hechizos
lo llamamos el grimorio del bando. Por ejemplo, la estructura:

```js
var setup = {
  heroes: {
    members: [heroTank, heroWizard],
    grimoire: [fire, health]
  },
  monsters: {
    members: [fastEnemy],
    grimoire: [fire, health]
  }
};
```

Contiene dos bandos con identificadores `heroes` y `monsters`. El bando
`heroes` tiene dos miembros. `heroTank` y `heroWizard`, mientras que el bando
`monsters` sólo uno, `fastEnemy`. Los dos bandos tienen grimorios con los
hechizos `fire` y `health`.

## Los personajes

Los personajes tienen un **nombre**, un **bando opcional** y una serie de
características que determinan su valor en la batalla. Estas características
son iniciativa, defensa, puntos de vida y de maná, y máximos de vida y de maná.

La **iniciativa** determina el orden en el que los personajes aparecerán en la
lista de turnos. Cuanto más alto, antes aparecen en esta lista.

La **defensa** establece la probabilidad (de 0 a 100) de que un
[efecto](#efectos) actúe sobre el personaje.

Los **puntos de maná** sirven para pagar los costes mágicos de los hechizos y
los **puntos de vida** indican cuánto daño es capaz de resistir el personaje
antes de ser morir (puntos de vida a 0). Ambas características están ligadas a
unos valores máximos **puntos de maná máximos** y **puntos de vida máximos**
respectivamente que no pueden sobrepasar.

La siguiente tabla resume las características numéricas y sus límites.

| Característica | Mínimo | Máximo | Limitado por           |
|:---------------|-------:|-------:|:----------------------:|
| Iniciativa     |      0 |      - |                      - |
| Defensa        |      0 |    100 |                      - |
| Puntos de vida |      0 |      - | Puntos de vida máximos |
| Puntos de maná |      0 |      - | Puntos de maná máximos |

## Las acciones

Si durante su turno, un personaje elije **defender**, entrará en estado de
defensa mejorada aumentando un 10% su defensa (redondeando arriba). El personaje
puede defender tantas veces como quiera, aumentando su defensa en cada turno que
defienda pero tan pronto otro personaje lo ataque, perderá su mejora.

Si elige **atacar**, habrá de elegir un personaje objetivo de entre todos los
personajes vivos que queden en la batalla. El personaje causará el efecto de
su arma al objetivo siguiendo las
[reglas de aplicación de efectos](#reglas-de-efecto).

Por último, un personaje puede **lanzar un hechizo**, en tal caso se debe
elegir un hechizo que se pueda pagar del grimorio del bando y un objetivo.
De nuevo se utilizarán las [reglas de aplicación de efectos](#reglas-de-efecto)
con el efecto del hechizo.

## Efectos

Armas y hechizos contienen efectos. Un arma contendrá un efecto que **siempre
reducirá los puntos de vida**, los hechizos pueden tener efectos variados.
Exceptuando el nombre y el bando, **todas las características son susceptibles
de verse alteradas por efectos**.

### Reglas de efecto

Las reglas de efecto esperan un efecto cualquiera, un objetivo y un indicador
de alianza que indica si el efecto lo aplica un aliado del objetivo o no.

El procedimiento es el siguiente:

  1. Si el indicador de alianza indica que son aliados, continúa con el paso 2.
  Si no:
   1. Genera un número al azar del 1 al 100.
   2. Si el resultado se encuentra por debajo o es igual a la defensa del
    objetivo, suspende estos pasos. Si no, continúa con el paso 2.
  2. Por cada característica afectada por el efecto
   1. Suma el valor del efecto al valor de la característica del objetivo.
   2. Corrige el valor para que se encuentre entre 0 y el máximo para esa
   característica, si tiene.

## Armas y hechizos

Armas y hechizos son elementos con efectos. La diferencia sustancial entre ellos
es que los hechizos tienen un coste en puntos de maná para el lanzador del
hechizo. Este coste se aplica tenga o no tenga éxito la defensa del objetivo.

El efecto de los hechizos puede ser variado así como el de las armas pero en el
caso de las armas el efecto debe reducir los puntos de vida de alguna forma.

## La API de batalla

La batalla tendrá los siguientes métodos:
  + `setup` para establecer la configuración inicial como la que hemos
  mostrados antes.
  + `start` para comenzar la batalla.
  + `stop` para detener la batalla.

Además la batalla expone los siguientes atributos:
  + `characters` para inspeccionar el estado de los personajes.
  + `scrolls` para inspeccionar el estado de los personajes.
  + `options` para controlar la batalla.

La batalla emitirá los siguientes eventos:
  + `start` junto con los identificadores de los combatientes por bando, al
  comienzo de la batalla.
  + `turn` junto con la información del turno, cada vez que le toque a un
  personaje.
  + `info` con el resultado de una acción.
  + `end` cuando sólo quede un bando.

En cualquier caso, el objeto de contexto será la `Batalla`.

## La interfaz de control

Controlar el curso de la batalla consiste en decidir qué ocurre a cada turno.
Para ello tendrás que suscribirte al evento `turn` y elegir entre las
alternativas que se nos ofrecen en `options`:

```js
var battle = new Battle(setup);
battle.on('turn', function (turn) {

  // Los héroes dañan al primer enemigo disponible.
  if (turn.party === 'heroes') {
    this.options.select('attack');
    var candidates = this.options.list();
    var monsters = candidates.filter(isMonster.bind(this));
    this.options.select(monsters[0]);
  }

  // Los monstruos sólo defienden.
  if (turn.party === 'monsters') {
    this.options.select('defend');
  }

  function isMonster(charId) {
    return this.characters.get(charId).party === 'monsters';
  }
});
battle.start();
```

### Las opciones

A cada turno, inicialmente las opciones serán: `defend`, `attack` y `cast`.

Al elegir `defend` se aplican las reglas para la acción defender y pasamos
al siguiente turno.

Si se elige `attack`, las siguientes opciones han de mostrar los identificadores
de los personajes para seleccionar un objetivo. Cuando se elige el objetivo, se
ejecuta la acción atacar y se pasa al siguiente turno.

Si elige `cast`, la siguientes opciones serán los hechizos disponibles (que
pueden ser ninguno) y luego la lista de objetivos. De nuevo al elegir el
objetivo, se efectúa la acción de lanzar hechizo y se pasa al siguiente turno.

### Reglas de formación de identificadores

Los identificadores de los personajes no son los nombres puesto que estos
podrían repetirse. Si un bando tuviera dos personajes murciélago con el nombre
`Bat`, sus identificadores sería `Bat` y `Bat 2`. Las reglas de formación de los
identificadores son:

  1. Recorre todos los bandos. Por cada bando:
    1. Recorre todos los miembros. Por cada miembros:
      1. Recupera el nombre del personaje y comprueba si está en el histograma
      de nombres.
      2. Si no está, añádelo con valor cero.
      3. Recupera el valor para nombre en el histograma de nombres.
      4. Si es 0, el identificador es el nombre.
      5. Si es mayor que 0, el identificador es el nombre seguido de un espacio
      y el valor del histograma más uno.
      6. Incrementa el valor del histograma en 1.
      7. Asigna al personaje ese identificador.
