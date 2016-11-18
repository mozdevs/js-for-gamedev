# Canvas

Con la llegada de HTML5, se introdujeron varios elementos HTML y API's de JavaScript que hacen posible la programación de videojuegos con tecnologías y estándares web, entre ellos el elemento `<canvas>` y su API JavaScript, que nos permite pintar gráficos en pantalla, tanto 3D como 2D.

## El elemento `<canvas>`

Esta etiqueta HTML crea un canvas con el ancho y el alto indicado. Sobre este canvas, podremos dibujar posteriormente usando la API de Canvas.

```html
<canvas width="320" height="200"></canvas>
```

Las **dimensiones** del canvas especificadas en la etiqueta HTML con `width` y `height` no tienen por qué corresponderse con las dimensiones en pantalla, sino que se corresponden a una unidad virtual. Por defecto `1` unidad equivale a `1` píxel, pero con CSS podemos realizar un escalado. Por ejemplo, el siguiente código escalaría nuestro canvas anterior a un `200%` del tamaño original.

```css
canvas {
    width: 640px;
    height: 480px;
}
```

Podemos usar esto a nuestro favor y jugar con los escalados, o adaptar nuestro juego a distintos tamaños de pantalla. Por ejemplo, en este artículo se explica cómo usar un escalado para videojuegos retro con pixel art: [_Retro, crisp pixel art in HTML5 games_](https://belenalbeza.com/retro-crisp-pixel-art-in-html-5-games/).

## La API de Canvas

La API de Canvas nos permite realizar operaciones de dibujo 2D en un elemento `<canvas>`. Con ella podemos renderizar imágenes, manipular píxeles, dibujar primitivas gráficas, curvas, etc.

Dos recursos importantes son:

- [Documentación en la MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
- [_Canvas Deep Dive_](http://joshondesign.com/p/books/canvasdeepdive/toc.html): libro online conciso, pero bastante completo.


### Contextos

Para realizar cualquier operación de pintado, necesitamos obtener un **contexto 2D** de un `<canvas>`. Para ello, utilizaremos el método `getContext` y le indicaremos que necesitamos un contexto 2D.

Ejemplo:

```javascript
var ctx = document.querySelector('canvas').getContext('2d');
ctx.fillRect(10, 10, 100, 100);
```

![Screenshot](images/canvas_ex01.png)

Ver el [_snippet_ de código](https://jsfiddle.net/nea366Lm/) online.

### Colores, bordes, etc.

La manera de trabajar que tiene la API de Canvas es similar a la de un programa de dibujo. En el **contexto** indicamos los estilos (color de fondo, grosor de borde, etc.) que queremos que las "herramientas" (en este caso, las operaciones de dibujado) usen.

Hay que tener en cuenta que esto tiene "memoria", y que los estilos se conservan de una operación a la siguiente. Es decir, que si establecemos en el contexto que a partir de ahora usaremos el color rojo, _todas_ las operaciones de dibujado posteriores usarán este color, no sólo la siguiente.

Ejemplo:

```javascript
// red rectangles
ctx.fillStyle = '#FF004D';
ctx.fillRect(10, 10, 100, 100);
ctx.fillRect(190, 10, 100, 100);
// blue rect with white border
ctx.fillStyle = 'rgba(41, 173, 255, 0.8)';
ctx.fillRect(50, 50, 100, 100);
ctx.strokeStyle = '#fff';
ctx.lineWidth = 5;
ctx.strokeRect(50, 50, 100, 100);
```

![Screenshot](images/canvas_ex02.png)

Ver el [_snippet_ de código](https://jsfiddle.net/x8knv6w3/2/) online.


### Imágenes

Podemos renderizar imágenes en el canvas, pero para ello **deberán cargarse previamente**. El método más trivial es usar una imagen cargada con `<img>`, pero podemos obtener imágenes de otras fuentes: la webcam del usuario, un `<video>`, otro elemento `<canvas>`, etc.

Ejemplo:

```html
<img src="kitten.png" alt="A cute kitten" id="kitten">
<canvas width="300" height="300"></canvas>
```

```javascript
window.onload = function () {
    var img = document.getElementById('kitten');
    var ctx = document.querySelector('canvas')
        .getContext('2d');

    ctx.drawImage(img, 0, 0);
}
```

Puedes ver la imagen creada con `<img>`, y el elemento `<canvas>` a su lado con la misma imagen dibujada:

![Screenshot](images/canvas_ex03.png)

El ejemplo funciona porque el **evento `load` de `window`** se dispara cuando todas las imágenes incluidas en el documento HTML se han cargado, así que sabemos con seguridad que está ya disponible para ser pintada en el canvas.

Ver el [_snippet_ de código](https://jsfiddle.net/j4hbb46h/1/) online.

### Cargar imágenes al vuelo

Tener que crear una etiqueta `<img>` en nuestro HTML por cada imagen que queramos cargar es laborioso. La mayoría de motores o librerías de videojuegos o gráficos crean objetos `Image` dinámicamente con JavaScript, que no se añaden al DOM –por lo que no son visibles.

Los pasos a seguir para cargar una imagen de esta manera serían:

1. Usamos el constructor **`Image`**.
2. Nos subscribimos al evento de **`load`** (para pintar la imagen cuando se haya cargado).
3. Establecemos el atributo **`src`** de la imagen para iniciar la carga.


```javascript
window.onload = function () {
    var img = new Image();
    img.addEventListener('load', function () {
        ctx.drawImage(img, 0, 0);
    });
    img.src = 'https://placekitten.com/g/300/300';
}
```

![Screenshot](images/canvas_ex04.png)

Ver el [_snippet_ de código](https://jsfiddle.net/Lm56dcb6/) online.

### Más sobre la carga de imágenes

Los elementos `<img>` que tengan como estilo `display:none` son invisibles al usuario, pero _se siguen cargando_ igualmente. Es habitual usar esto para ocultar las imágenes que se dibujen en el canvas. Como se ha comentado anteriormente, el evento `load` de `window` se dispara cuando –entre otras cosas– todas las imágenes del DOM se han cargado, sean visibles o no. Por ello, podemos cargar imágenes usando únicamente HTML y CSS, aunque es algo laborioso.

Para cargar imágenes desde JavaScript, creando nuevas instancias `Image`, se suelen utilizar [Promesas](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise), o bien un contador para detectar cuándo se han cargado todas.

### Otras operaciones de la API de Canvas

La API de Canvas es extensa y nos permite hacer muchas otras operaciones, entre ellas:

- Dibujar curvas y paths complejos
- Pintar gradientes
- _Clipping_
- Transformaciones
- Manipultar píxeles
- Etc.

## WebGL

WebGL es una API que nos permite operar con **gráficos 3D** en un elemento `<canvas>`. Su filosofía es completamente diferente a la API de Canvas, y es una API bastante más compleja –pero potente.

WebGL es una implementación en JavaScript de **OpenGL ES 2.0**, que es un estándar de la industria para el pintado de gráficos 3D.

Para poder usarla, debemos obtener un **contexto 3D** de un elemento `<canvas>`. Para ello, debemos especificar el parámetro `webgl` –o `experimental-webgl` en algunos navegadores– en la llamada a `getContext`.

Hay [documentación en la MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) sobre esta API.

### Gráficos 2D en WebGL

En el desarrollo de videojuegos, es habitual utilizar una API de gráficos 3D también para videojuegos 2D. La razón no es otra que rendimiento: ciertas operaciones realizadas con gráficos 3D son más eficientes, como el _Z-ordering_, rotaciones, transparencias, etc.

Es posible **simular un mundo 2D** usando una API de gráficos 3D, como WebGL. El "truco" es utilizar una proyección ortográfica, que no deforme los objetos con la perspectiva. Los gráficos 2D serían entonces polígonos con una textura dentro de este espacio 2D.

Muchas librerías y motores de juegos 2D en JavaScript –entre ellos Pixi y Phaser– ofrecen la posibilidad de utilizar WebGL como API de gráficos en lugar de la API de Canvas.

### Recursos

Para aprender más sobre WebGL recomendamos los siguientes recursos:

- [WebGL en la MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API): documentación, guías, tutoriales, etc.
- _Introduction to WebGL_ [parte 1](https://dev.opera.com/articles/introduction-to-webgl-part-1/) y [parte 2](https://dev.opera.com/articles/introduction-to-webgl-part-2-porting-3d/)
- [_WebGL fundamentals_](http://webglfundamentals.org/): tutoriales paso a paso

## Librerías gráficas

Hay dos librerías extremadamente populares para el manejo de gráficos con JavaScript. Son únicamente librerías de gráficos, así que no implementan otras funcionalidades necesarias para un videojuego. Sin embargo, constituyen un buen punto de partida bien para desarrollar un motor propio, bien para cuando sólo se necesite pintar gráficos en un proyecto en concreto.

Muchos motores las utilizan como capa gráfica, así que conviene conocerlas si se quiere modificar un motor o acceder a _features_ de estas librerías no expuestas por el motor.

### Gráficos 2D: Pixi.js

- [www.pixijs.com](http://www.pixijs.com/)
- Funciona por defecto con WebGL, pero tiene fallback a Canvas 2D.
- Phaser utiliza Pixi para renderizar gráficos

### Gráficos 3D: THREE.js

- [www.threejs.org](https://threejs.org/)
- Es la librería de referencia para trabajar con WebGL, y simplifica mucho el uso de esta API.
- Facilita renderizar gráficos para ser usados con WebVR (API Web para realidad virtual)
- Hay infinidad de tutoriales, libros, etc. disponibles.

## Animaciones

Hasta ahora hemos visto cómo renderizar gráficos estáticos en un canvas, pero en un videojuego las imágenes están en movimiento.

En el desarrollo de videojuegos, idealmente vamos a intentar renderizar las imágenes en el canvas **60 veces por segundo** (60 FPS o _frames per second_). Para este cometido **no nos sirven** `setTimeout` ni `setInterval`, ya que no son precisas y no tenemos garantizada su ejecución (puedes ver las razones [en la documentación](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Reasons_for_delays_longer_than_specified)).

La manera adecuada para renderizar animaciones en un canvas es usando `requestAnimationFrame`.

### `requestAnimationFrame`

Esta función acepta un _callback_ que se llamará automáticamente la siguiente vez que el navegador **_pueda_ pintar** en pantalla. En este _callback_ incluiremos tanto las operaciones de dibujo que queramos realizar, como una nueva llamada a `requestAnimationFrame`, para establecer así un **bucle** continuo.

Ejemplo:

```javascript
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(x, 25, 50, 50);
    x = (x + 1) % canvas.width;

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
```

Puedes ver una comparación del mismo código de dibujado ejecutándose con `requestAnimationFrame` y con `setInterval`. Podrás observar que la animación con `requestAnimationFrame` es más fluida, especialmente si cambias de pestaña en el navegador, lo pasas a segundo plano, etc.

- [_Snippet_ de código](https://jsfiddle.net/oxx3h8dp/2/) con `requestAnimationFrame`
- [_Snippet_ de código](https://jsfiddle.net/m92kpe4n/2/) con `setInterval`

### Tiempo delta

El **tiempo delta** es como se llama en desarrollo de videojuegos al tiempo que ha transcurrido entre el _frame_ actual y el anterior. Este tiempo es necesario que sea preciso ya que mucha lógica del juego depende de él: animaciones, físicas, etc.

Mientras que en programación web se usa normalmente `Date` para manejar fechas, crear instancias de `Date` no sólo no es eficiente, sino que estos objetos no tienen la resolución suficiente para un videojuego, que necesita decimales de milisegundos.

Existe una alternativa, y es usar objetos de _timestamp_, `DOMHighResTimeStamp`, como los que devuelve el uso de la interfaz de [`Performance`](https://developer.mozilla.org/en-US/docs/Web/API/Performance). Estos _timestamps_ tienen un margen de error de únicamente 5 microsegundos. Además, para nuestra conveniencia, `requestAnimationFrame` llama a nuestro **_callback_ con un _timestamp_**.

En la práctica, este parámetro nos permite calcular el tiempo delta de forma precisa. El _timestamp_ que optenemos contiene el número de milisegundos transcurrido desde la primera llamada a `requestAnimationFrame`. Si vamos almacenando cuál era el valor del _timestamp_ en el _frame_ anterior, podemos calcular el tiempo delta:

Ejemplo:

```javascript
const SPEED = 60; // pixels per second
var oldTimestamp = 0;

function render(timestamp) {
  var delta = (timestamp - oldTimestamp) / 1000.0;
  oldTimestamp = timestamp;

  // ...
  x = (x + SPEED * delta) % canvas.width;
  requestAnimationFrame(render);
}
```

Puedes probar el [_snippet_ de código](https://jsfiddle.net/0e11fv91/2/) online.

Algunas **consideraciones** a tener en cuenta sobre el tiempo delta:

- _Siempre_ se ha de poner una **cota superior** al valor del tiempo delta (p.ej: 250ms) para evitar _glitches_ en la lógica del juego. Un "salto" grande en el tiempo delta puede causar fallos en las colisiones, funcionamiento anormal en el motor de físicas, etc.

- A veces es recomendable saltarse el _update_ de nuestro juego un _frame_ (por ejemplo, [como hace Phaser](https://github.com/photonstorm/phaser/blob/master/src/core/Game.js#L784)).
