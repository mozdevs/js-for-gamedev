# Batalla RPG - Guía de la práctica

La guía de la práctica te sugiere un orden para completar con éxito la
implementación de la funcionalidad de la práctica. Prepárate, eso sí, para
**leer mucho JavaScript** y ten a mano Google, la MDN y StackOverflow.

## 1. El modelo de datos

En el juego existen muchos tipos de entidades, algunos relacionados y otros no.

La especificación de tales entidades puede encontrarse en `spec/entities.js` y
la implementación en `src/entities.js`, `src/Character.js` y `src/items.js`.

### Efectos

Quizá el tipo más sencillo sea el tipo `Effect` en `src/items.js` y especificado
en `spec/entities.js`. Comienza por aquí.

### Personajes

Continúa activando los tests relacionados con el tipo `Character` y desactiva
los demás.

A continuación abre `src/Character.js` e implementa las partes que faltan.

### Elementos

Continúa con el módulo `src/items.js` activando paulatinamente las _suites_ para
los tipos `Item`, `Weapon` y `Scroll` que encontrarás en `spec/entities.js`.

### Entidades por defecto

Tienes que crear algunos personajes, armas y pergaminos por defecto para que
otras prácticas puedan usarlos. La _suite_ _built-in entities_ en
`spec/entities.js` incluye incluye todas las espectativas de estas entidades.

Ve al archivo `src/entities.js` y completa las que falten. Fíjate que las
propiedades son _getters_ para que cada acceso a las propiedades te devuelvan
un nuevo personaje.

## 2. La lista de turnos

Esta es fácil. La especificación se encuentra en `spec/TurnList.js` y la
implementación en `src/TurnList.js`. Tan sólo rellena los huecos. Es pura
algoritmia. Quizá tengas que mirarte cómo funciona la función `Array.sort()`
para no implementarte tu propia función de ordenamiento.

## 3. La vista del personaje

La vista del personaje es una representación de sólo lectura de las estadísticas
del mismo. Su especificación está en `spec/CharactersView.js` y su
implementación en `src/CharactersView.js`. Puedes continuar por ahí.

## 4. El grupo de opciones

El grupo de opciones representa las opciones que se pueden elegir en un momento
dado. La especificación está en `spec/CharactersView.js` y la implementación,
casi completa, en `src/CharactersView.js`. Fíjate cómo el tipo `Options`
extiende `EventEmitter`. Tu misión será implementar el método `.select()` para
que al llamarlo se emita un evento acorde con la especificación.

## 5. La pila de opciones

Un RPG se compone normalmente de varios menús apilados. Por ejemplo, el menú
de acciones da paso al menú de hechizos que da paso al menú de objetivos. En
cualquier momento podemos regresar al menú anterior. La pila de opciones en
`src/OptionsStack.js` y especificada en `spec/OptionsStack.js` refleja este
comportamiento.

La API es la misma que el grupo de opciones pero los métodos realmente sólo
se deben redirigir al último menú apilado. Fíjate en cómo se apilan y desapilan
menús nuevos.

## 6. Utilidades

Tranqui. No tienes que hacer nada aquí, tan sólo ten en cuenta que tienes el
módulo `src/utils.js` donde puedes colocar más utilidades si encuentras que
andas repitiendo el mismo código en muchas partes. Te aconsejo que escribas
algún test. Puedes inspirarte en los que ya hay en `spec/utils.js`.

## 7. La batalla

Has llegado al plato fuerte de la práctica. Hasta aquí era todo preparar los
tipos en los que se apoya el tipo `Battle`. Ahora tendrás que implementar
la máquina de estados que controla las acciones de batalla: defender, atacar
y lanzar un hechizo.

Fíjate que los combatientes, sus armas y los hechizos **no son los que vienen
por defecto en `src/entities.js`** sino los que se encuentran en
`spec/samplelib.js`.

La especificación de la batalla está en `spec/Battle.js` y la implementación en
`src/Battle.js`. Para abordar esta implementación con éxito es necesario que
todos los tests hasta ahora pasen.

En esta parte de la práctica no hay recomendaciones sobre qué tests activar
primero. Tendrás que experimentar.

Repasa bien el código, muchos de los ejercicios consisten en dar las
implementaciones de **funciones auxiliares**. Es el caso de:
  + `assignParty`
  + `useUniqueNames`
  + `isAlive`
  + `getCommonParty`

Fíjate entonces en la función `_showAction` que hará que las acciones de
batalla estén disponibles en el atributo `options`.

Ahora concéntrate en las acciones. La implementación de `_defend` está casi
hecha. Sólo tendrás que completar las funciones `_improveDefense` y
`_restoreDefense` para el cálculo de la defensa mejorada.

La acción _defend_ rellena la estructura `this._action` con el nombre de la
acción, los identificadores del personaje activo y del objetivo, el efecto
y la nueva defensa. Todos menos la defensa son necesarios para poder llamar
a la función `_executeAction` que ejecutará la acción e informará del
resultado.

Durante el proceso de implementación de las acciones, tendrás que implementar
también `_showTargets` y `_showScrolls` de manera similar, de acuerdo a la
especificación y a la [descripciónl ejercicio](./README.md).

## 8. Calidad del código
Cuando termines y todos tus tests estén en verde habrás terminado la práctica.

Rotula la rama con un _tag_ o cambia de rama antes de mejorar la calidad del
código.

Lee ahora los errores de estilo que el comando de tests pueda proporcionar y
pasa los tests cada vez que realices una modificación para asegurarte que no
has roto nada.

## Fin

¡Enhorabuena! Has completado la práctica.
