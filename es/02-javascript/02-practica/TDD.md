# TDD: Desarrollo dirigido por tests

Practicando TDD, iremos escribiendo código de forma que los tests pasen. Los
tests vienen dados pero están desactivados. La [guía de la práctica](
./GUIDE.md) recomienda en qué orden activar los tests para completar la práctica
poco a poco.

### Tests y suites

En esta práctica usamos [**Jasmine**](http://jasmine.github.io) como framework
para tests. En Jasmine escribimos suites y tests. Las suites se pueden anidar
y pueden llevar código de inicialización. En general, la API de Jasmine es muy
clara y no necesita mayor explicación. De todas formas, aquí tienes un ejemplo:

```js
describe('Las suites en Jasmine', function () {

  describe('pueden anidarse', function () {

    it('y encierran tests con expectativas', function () {
      expect(2 + 2).toBe(4);
    });

  });

});
```

Se llama test a un fragmento de código que pone a prueba una funcionalidad
específica. El test puede pasar o fallar. En caso de fallo, la consola mostrará
por qué ha fallado en la forma de una traza:

```js
15.2) Expected 'b' to be 'c'.
    Error: Expected 'b' to be 'c'.
        at stack (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1640:17)
        at buildExpectationResult (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1610:14)
        at Spec.expectationResultFactory (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:655:18)
        at Spec.addExpectationResult (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:342:34)
        at Expectation.addExpectationResult (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:599:21)
        at Expectation.toBe (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1564:12)
        at Object.<anonymous> (/Users/salva/workspace/pvli2017-rpg-battle/spec/TurnList.js:39:36)
        at attemptSync (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1950:24)
        at QueueRunner.run (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1938:9)
        at QueueRunner.execute (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1923:10)
```

La traza contiene el fallo y dónde se ha producido en el conjunto de llamadas
desde la más reciente hasta la más vieja. A veces los fallos son producto de
implementaciones que no cumplen las expectativas, otras veces serán fallos en
tiempo de ejecución y otras serán fallos de sintaxis.

Acostúmbrate a fallar y a encontrar en la traza el punto exacto del código que
está bajo tu control para solucionarlo. Para ello busca las carpetas `spec` y
`src` entre la traza. El primer número tras la ruta es la línea del fallo.

### Activando y desactivando tests

Los tests y las suites pueden desactivarse añadiendo el prefijo `x`. Por
ejemplo:

```js
describe('Las suites en Jasmine', function () {

  describe('pueden anidarse', function () {

    it('y encierran tests con expectativas', function () {
      expect(2 + 2).toBe(4);
    });

    xit('este test está desactivado', function () {

    });

  });

  xdescribe('la suite y todos sus tests están desactivados.', function () {

  });

});
```

Los tests desactivados no comprueban las expectativas pero Jasmine te
informa de que están desactivados.

### El ciclo de desarrollo

Cuando estés desarrollando, es conveniente que pases los test a menudo por dos
motivos:

- Comprobar que avanzas.
- Comprobar que no has roto nada.

Para ello puedes ejecutar el comando:

```
$ npm run-script watch
```

Esta tarea monitoriza los cambios en los archivos de las carpetas `spec` y
`src` y cuando detecte un cambio, lanzara todos los tests.

A veces, el error es tan estrepitoso que rompe la monitorización. En tal caso
tendrás que reintroducir el comando manualmente.

Cada vez que realices una modificación y los tests pasen, haz un commit nuevo.

### Depurando tests asíncronos

Algunos tests son asíncronos y pueden producir _timeouts_. En general un
_timeout_ no es un resultado positivo. El problema de los _timeouts_ es que
pueden ralentizar toda la suite así que la recomendación en estos casos es
afrontarlos uno a uno, desactivando el resto y activándolos poco a poco.

Reconocerás un test asíncrono porque lleva un parámetros `done` como en el
ejemplo:

```js
var EventEmitter = require('events').EventEmitter;

describe('EventEmitter', function () {

  it('emite eventos arbitrarios', function (done) {
    var ee = new EventEmitter();
    ee.on('turn', function(turn) {
      expect(turn.number).toBe(1);
      done();
    });
    ee.emit('turn', { number: 1 });
  });

});
```

## Estrategia general para la depuración

Es muy recomendable que mantengas una rama estable donde todos los tests pasen
y los que no estén desactivados. Cuando te embarques en la tarea de hacer que
un test pase, crea una rama para esa tarea y cuando termines mézclala con la
rama estable.

Cuando encuentres un error, intenta seguir los siguientes pasos:
  1. Desactiva los tests asíncronos que estén tardando rápido. **Necesitas un
  ciclo de desarrollo rápido.**
  2. **¡¡Lee el error!!**.
  3. Busca en la traza el lugar donde se original el error:
    1. Si es un fallo en una expectativa, localiza el punto de entrada en
    tu código.
    2. Deja trazas con `console.log()` inspeccionando el estado de tus objetos.
  4. Salva y relanza los tests a menudo.
