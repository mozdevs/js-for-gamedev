# El modelo de ejecución de JavaScript

JavaScript se caracteriza por presentar un **modelo de ejecución asíncrono**, donde
los resultados no se encuentran disposibles inmediatamente, sino que lo
estarán en un futuro.

## Ámbito y _hoisting_

Como en muchos lenguajes, los nombres de las variables pueden reutilizarse y
guardar valores distintos, siempre y cuando se encuentren en **ámbitos
distintos**.

El ámbito o _scope_ de una variable es la porción de código donde puede ser
utilizada. Variables con el mismo nombre en ámbitos distintos son variables
distintas.

El ámbito en JavaScript es el **cuerpo de la función**, delimitado entre el
par de llaves `{` y `}` que siguen a la lista de parámetros de la función.

```js
function introduction() {
    // Esta es la variable text.
    var text = 'I\'m Ziltoid, the Omniscient.';
    greetings();
    console.log(text);
}

function greetings(list) {
    // Y esta es otra variable text DISTINTA.
    var text = 'Greetings humans!';
    console.log(text);
}

introduction();
```

En JavaScript, las funciones pueden definirse dentro de otras funciones y, de
esta forma, anidar ámbitos.

El anidamiento de funciones es útil cuando se quieren usar **funciones
auxiliares**, normalmente cortas.

```js
function getEven(list) {
    function isEven(n) {
        return n % 2 === 0;
    }
    return list.filter(isEven);
}

getEven([1, 2, 3, 4, 5, 6]);
```

Como el ámbito es el de la función, el mismo nombre en una función anidada se
puede referir a dos cosas:

1) **Si se usa con `var`**, se estará declarando **otra variable distinta**:

```js
function introduction() {
    // Esta es una variable text.
    var text = 'I\'m Ziltoid, the Omniscient.';

    function greetings(list) {
        // Y esta es OTRA variable text distinta.
        var text = 'Greetings humans!';
        console.log(text);
    }

    greetings();
    console.log(text);
}

introduction();
```

En el caso anterior, decimos que la variable `text` de la función anidada
`greetings` _oculta_ a la variable `text` de la función `introduction`.

Recuerda que para introducir una nueva variable hay que declararla con
`var` antes de usarla (o al mismo tiempo que se asigna).

2) Si se omite la palabra `var`, no se crea una nueva variable, sino que se
**reutiliza** la que ya existía.

```js
function introduction() {
  // Esta es una variable text.
  var text = 'I\'m Ziltoid, the Omniscient.';

  function greetings(list) {
    // Esta es la MISMA variable text que la de afuera.
    text = 'Greetings humans!';
    console.log(text);
  }

  greetings();
  console.log(text);
}

introduction();
```

### _Hoisting_

_Hoisting_ significa "elevación", y en el contexto de la programación nos
referimos a un mecanismo que emplean algunos lenguajes respecto a la declaración
de nombres.

En JavaScript da igual en qué punto de la función se declara una variable.
JavaScript asumirá cualquier declaración como si ocurriese al comienzo de
la función.

Es decir que esto:

```js
function f() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            console.log('i: ', i, ' j: ', j);
        }
    }
}
```

Es equivalente a esto:

```js
function f() {
    var i;
    var j;
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            console.log('i: ', i, ' j: ', j);
        }
    }
}
```

Fíjate que JavaScript **_alza_ la declaración** de la variable (la lleva al
principio), no la inicialización. Es por eso que el siguiente código no falla,
pero imprime `undefined`:

```js
function f() {
    console.log(i);
    var i = 5;
}
f();
```

En **modo estricto**, usar una variable que no ha sido declarada produce
un error.

```js
function f() {
    console.log(i);
    i = 5;
}
f();
```

Con las **declaraciones de funciones** esto no pasa: cuando una declaración de
función se alza, se alza entera, _definición incluida_.

```js
function getEven(list) {
    return list.filter(isEven);

    function isEven(n) {
        return n % 2 === 0;
    }
}

getEven([1, 2, 3, 4, 5, 6]);
```

Esto permite una forma de ordenar el código que quizá sea más clara, situando
las funciones auxiliares a continuación de las funciones que las utilizan.

Así, viendo sólo la primera línea de la función, ya podemos conocer qué es lo
que realiza.

```js
    return list.filter(isEven);
```

Y, si aún tenemos dudas, podemos seguir leyendo e investigar qué hace la función
auxiliar.

```js
    function isEven(n) {
        return n % 2 === 0;
    }
```

Nótese que para que esta manera de escribir código sea clara, el nombre que
utilicemos en las funciones auxiliares tiene que ser adecuado, descriptivo, y
dar una pista sobre cuál es el valor de retorno.


## _Closures_

Las funciones son datos y se crean cada vez que se encuentra una instrucción
`function`. De esta forma, podemos crear una función que devuelva funciones.

```js
function buildFunction() {
    return function () { return 42; };
}

var f = buildFunction();
var g = buildFunction();

typeof f === 'function';
typeof g === 'function';

f();
g(); // Las funciones hacen lo mismo...

f !== g; // ...pero NO son la misma función
```

Por sí solo, este no es un mecanismo muy potente, pero sabiendo que una función
anidada puede acceder a las variables de los ámbitos superiores, podemos hacer
algo así:

```js
function newDie(sides) {
  return function () {
    return Math.floor(Math.random() * sides) + 1;
  };
}
var d100 = newDie(100);
var d20 = newDie(20);

d100 !== d20; // distintas, creadas en dos llamadas distintas a newDie.

d100();
d20();
```

En JavaScript, las funciones **retienen el acceso a las variables en ámbitos
superiores**. Una función que se refiere a alguna de las variables en ámbitos
superiores se denomina **_closure_** o clausura.

Esto **no afecta al valor de `this`**, que seguirá siendo el destinatario del
mensaje.

### Métodos, _closures_ y `this`

Considera el siguiente ejemplo:

```js
var diceUtils = {
    history: [], // lleva el histórico de tiradas.

    newDie: function (sides) {
        return function die() {
            var result = Math.floor(Math.random() * sides) + 1;
            this.history.push([new Date(), sides, result]);
            return result;
        }
    }
}
```

La intención es poder crear dados y llevar un registro de todas las tiradas que
se hagan con estos dados.

Sin embargo, esto no funciona:

```js
var d10 = diceUtils.newDie(10);
d10(); // ¡error!
```

Y es así porque **`this` siempre es el destinatario del mensaje** y `d10` se
está llamando como si fuera una función y no un método.

Recuerda que podemos hacer que cualquier función tomara un valor forzoso como
`this` con `.apply()`; por lo que esto sí funciona, pero no es muy conveniente:

```js
d10.apply(diceUtils);
d10.apply(diceUtils);
diceUtils.history;
```

Lo que tenemos que hacer es que la función `die` dentro de `newDie` se refiera
al `this` del ámbito superior, no al suyo.

Puedes lograr esto de dos maneras. La primera es un mero juego de variables,
guardando el `this` en una variable auxiliar (en este caso, `self`):

```js
var diceUtils = {
    history: [], // Lleva el histórico de dados.

    newDie: function (sides) {
        var self = this; // self es ahora el destinatario de newDie.

        return function die() {
            var result = Math.floor(Math.random() * sides) + 1;
            // Usando self nos referimos al destinatario de newDie.
            self.history.push([new Date(), sides, result]);
            return result;
        }
    }
}
```

Esto sí funciona y es mucho más conveniente:

```js
var d10 = diceUtils.newDie(10);
var d6 = diceUtils.newDie(6);
d10();
d6();
d10();
diceUtils.history;
```

La segunda forma es usando el **método [`bind`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind)** de las funciones.

El método `bind` de una función devuelve otra función cuyo `this` será el
primer parámetro de `bind`. De este modo:

```js
var diceUtils = {
    history: [], // Lleva el histórico de dados.

    newDie: function (sides) {
        return die.bind(this); // una nueva función que llamará a die con su
                               // destinatario establecido al primer parámetro.

        function die() {
            var result = Math.floor(Math.random() * sides) + 1;
            this.history.push([new Date(), sides, result]);
            return result;
        }
    }
}
```

Las dos formas son ampliamente utilizadas, pero la segunda se ve escrita
muchas veces de este modo:

```js
var diceUtils = {
    history: [], // Lleva el histórico de dados.

    newDie: function (sides) {
        return function die() {
            var result = Math.floor(Math.random() * sides) + 1;
            this.history.push([new Date(), sides, result]);
            return result;
        }.bind(this); // el bind sigue a la expresión de función.
    }
}
```

## Módulos

Esta sección presenta la característica **módulos**, que es específica de Node.

Una de las principales desventajas de JavaScript ([hasta la próxima versión](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/import))
es que no hay forma de organizar el código en módulos.

Los módulos sirven para aislar funcionalidad relacionada: tipos, funciones,
constantes, configuración…

Node _sí tiene módulos_ y, afortunadamente, existen **herramientas que simulan
módulos** como los de Node en el navegador.

En Node, los ficheros JavaScript acabados en `.js` son módulos. Node nos permite
exponer o **exportar funcionalidad** de un módulo, poniéndola dentro del objeto
`module.exports`:

```js
// En diceUtils.js
"use strict"; // pone el módulo en modo estricto.

var history = [];

function newDie(sides) {
    return function die() {
        var result = Math.floor(Math.random() * sides) + 1;
        history.push([new Date(), sides, result]);
        return result;
    };
}

// ¡Lo que se exporta realmente es el objeto module.exports!
module.exports.newDie = newDie;
module.exports.history = history;
```

Realmente, lo que se exporta es **siempre `module.exports`**, que en principio
es un objeto vacío:

```js
typeof module.exports;
module.exports;
```

Ahora podemos ahora **importar ese módulo** desde otro:

```js
// En cthulhuRpg.js
"use strict";

var diceUtils = require('./diceUtils');
var d100 = diceUtils.newDie(100);

var howard = {
    sanity: 45,
    sanityCheck: function () {
        if (d100() <= this.sanity) {
            console.log('Horrible, pero lo superaré. Estuvo cerca.');
        } else {
            console.log(
                '¡Ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn!');
        }
    }
};
howard.sanityCheck();
```

Para importar un módulo desde otro hay que pasar a [`require`](https://nodejs.org/api/modules.html#modules_module_require_id)
la **ruta relativa** hasta el fichero del módulo que queremos importar.

Si en lugar de una ruta, pasamos un nombre, accederemos a la **funcionalidad
que viene por defecto** con Node (los módulos que forman parte de la librería
estándar, como `path` o `fs`) o la que instalemos de terceras partes (por
ejemplo, módulos instalados con el gestor de paquetes npm). Usaremos esta forma
en un par de ocasiones más adelante.

## Diferencias entre ámbitos en Node y en el navegador

Se ha dicho que el ámbito en JavaScript es equivalente a la función, pero
sabemos que podemos abrir una consola o un fichero y empezar a declarar
variables sin necesidad de escribir una función.

Esto es así porque estamos usando el **ámbito global**. El ámbito global está
disponible tanto en el navegador como en Node.

```js
// Esta es una variable text en el ámbito GLOBAL.
var text = 'I\'m Ziltoid, the Omniscient.';

// Esta es una función en el ámbito GLOBAL.
function greetings(list) {
    // Esta es OTRA variable text en el ámbito de la función.
    var text = 'Greetings humans!';
    console.log(text);
}

greetings();
console.log(text);
```

Sin embargo, existe una peculiaridad en Node. El ámbito global es realmente
_local al fichero_. Esto quiere decir que:

```js
// En a.js, text es visible únicamente dentro del FICHERO.
"use strict";
var text = 'I\'m Ziltoid, the Omniscient.';

// En b.js, text es visible únicamente dentro del FICHERO.
"use strict";
var text = 'Greetings humans!';

// En una consola iniciada en el mismo directorio que a y b
require('./a');
require('./b');
text;
```

## Programación asíncrona y eventos

Prueba el siguiente ejemplo (copia, pega y espera 5 segundos):

```js
var fiveSeconds = 5 * 1000; // en milisegundos.

// Esto ocurre ahora.
console.log('T: ', new Date());

setTimeout(function () {
    // Esto ocurre pasados 5 segundos.
    console.log('T + 5 segundos: ', new Date());
}, fiveSeconds);

// Esto ocurre inmediatamente después
console.log('T + delta: ', new Date());
```

Como puedes comprobar, el mensaje se completa pasados 5 segundos porque lo que
hace [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout)
es llamar a la función tan pronto como pasen el número de milisegundos
indicados.

Decimos que una función es un **_callback_** si se llama en algún momento
futuro –es decir, **asíncronamente**– para informar de algún resultado.

En el ejemplo de `setTimeout`, el resultado es que ha pasado la cantidad de
tiempo especificada.

### Eventos

En esta sección veremos el **módulo `readline`**, que es específico de Node.

La programación asíncrona en JavaScript y otros lenguajes se usa para **modelar
eventos**, principalmente esperas por entrada y salida. En otras palabras:
hitos que ocurren pero que no sabemos _cuándo_ ocurren.

La entrada y salida –a partir de ahora IO (del inglés _input / output_)– no
sólo supone lectura de ficheros o peticiones a la red, también incluye esperar
una acción del usuario.

Como ejemplo, vamos a implementar una consola de diálogo por líneas. Usaremos el
módulo [`readline`](https://nodejs.org/api/readline.html), que es parte de la
librería estándar que viene con Node:

```js
// En conversational.js
"use strict";

var readline = require('readline');

var cmd = readline.createInterface({
    input: process.stdin,  // así referenciamos la consola como entrada.
    output: process.stdout, // y así, como salida.
    prompt: '(╯°□°）╯ ' // lo que aparece para esperar la entrada del usuario.
});
```

Lanza ese programa con Node y verás que no hace nada, **pero tampoco termina**.
Esto es típico de los programas asíncronos: el programa queda esperando a que
pase algo. Pulsa `ctrl+c` para terminar el programa.

Ahora prueba:

```js
// Añade al final de conversational.js
console.log('Escribe algo y pulsa enter');
cmd.prompt(); // pide que el usuario escriba algo.

cmd.on('line', function (input) {
    console.log('Has dicho "' + input  + '"');
    cmd.prompt(); // pide que el usuario escriba algo.
});
```

Lo que has conseguido es **escuchar el evento `line`** que se produce
[cada vez que en la entrada se recibe un caracter de cambio de línea](https://nodejs.org/api/readline.html#readline_event_line).

Hablando de eventos, la función que se ejecuta asíncronamente recibe el nombre de
**_listener_**, pero tampoco es raro que se la llame _callback_.

Se habla de "**registrar un _listener_** para un evento", "subscribirse a un
evento" o "escuchar un evento" a utilizar el mecanismo que permite asociar la
ejecución de una función con dicho evento.

Con todo, aún no se puede salir del programa anterior. Necesitamos algunos
cambios más:

```js
// Añade a conversational.js
cmd.on('line', function (input) {
    if (input === 'salir') {
        cmd.close();
    }
});

cmd.on('close', function () {
    console.log('¡Nos vemos!');
    process.exit(0); // sale de node.
});
```

Hemos añadido un segundo _listener_ al evento `line` y **ambos se ejecutarán**.
El primero gestiona el funcionamiento por defecto (que es repetir lo que el
usuario ha introducido) y el segundo trata específicamente el comando `salir`.

Si la línea es exactamente `salir`, cerraremos la interfaz de línea de
comandos. Esto produce un evento `close` y, cuando lo recibamos, utilizaremos el
_listener_ de ese evento para terminar el programa.

El método `on` es un segundo nombre para [`addListener`](https://nodejs.org/api/events.html#events_emitter_addlistener_eventname_listener).

Igual que podemos añadir un _listener_, también podemos eliminarlo con
[`removeListener`](https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener),
y quitarlos todos con
[`removeAllListeners`](https://nodejs.org/api/events.html#events_emitter_removealllisteners_eventname).

Podemos escuchar un evento **sólo una vez** con
[`once`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener).

### Emisores de eventos

Ahora veremos la clase `EventEmitter`, que también es específica de Node.

Los eventos no son un mecanismo estándar de JavaScript. Son una forma
conveniente de modelar determinados tipos de problema, pero un objeto JavaScript,
por sí solo, **no tiene API para emitir eventos**.

En Node contamos con diversas alternativas con el fin de que los objetos emitan
eventos:

- Implementar nuestra propia API de eventos.

- Hacer que nuestros objetos **usen** una instancia de `EventEmitter`.

- Hacer que nuestros objetos **sean instancias** de `EventEmitter`.

La primera supondría crear nuestro propio método `on` y los mecanismos para
emitir eventos. La segunda y la tercera usan la clase
[`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter),
que ya implementa esta API.

Este es un ejemplo de la opción 3 –el cual aprovechamos para repasar la
herencia:

```js
var events = require('events');
var EventEmitter = events.EventEmitter;

function Ship() {
    EventEmitter.apply(this);
    this._ammunition = 'laser charges';
}

Ship.prototype = Object.create(EventEmitter.prototype);
Ship.prototype.constructor = Nave;

var ship = new Ship();
ship.on; // ¡existe!
```

Ahora que la nave puede emitir eventos, vamos a hacer que dispare y que emita un
evento.

```js
Ship.prototype.shoot = function () {
    console.log('PICHIUM!');
    this.emit('shoot', this._ammunition); // parte de la API de EventEmitter.
};

ship.on('shoot', function (ammunition) {
    console.log('CENTRO DE MANDO. La nave ha disparado:', ammunition);
});

ship.shoot();
```

**Emitir un evento** consiste en llamar al método
[`emit`](https://nodejs.org/api/events.html#events_emitter_emit_eventname_arg1_arg2),
que hará que se ejecuten los _listeners_ que escuchan tal evento.

Los eventos son increiblemente útiles para modelar interfaces de usuario de
forma genérica.

Para ello, los modelos deben **publicar** qué les ocurre: cómo cambian, qué
hacen… Todo **a base de eventos**. Las interfaces de usuario se
**suscribirán** a estos eventos y proporcionarán la información visual adecuada.

Este modelo permite además que varias interfaces de usuario funcionen al mismo
tiempo, todas escuchando los mismos eventos. Sin embargo, también permite
dividir la interfaz en otras más especializadas, cada una escuchando un
determinado conjunto de eventos.
