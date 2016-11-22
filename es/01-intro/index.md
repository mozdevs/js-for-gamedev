# El entorno de trabajo

## La línea de comandos

La línea de comandos es una aplicación para comunicarse con el sistema operativo
a través de comandos escritos. Gran parte de las herramientas empleadas en el
desarrollo web son aplicaciones de consola, es decir, aplicaciones cuya interfaz
está pensada para usarse a través de una línea de comandos.

En general, no necesitas instalar líneas de comandos de otros desarrolladores
porque los sistemas operativos incluyen las suyas. Consulta una de estas guías
acerca de cómo lanzar estas aplicaciones de acuerdo a tu sistema operativo:

- En caso de trabajar sobre [Windows](http://www.howtogeek.com/235101/10-ways-to-open-the-command-prompt-in-windows-10/).

- En caso de trabajar sobre [Mac OS](http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line).

- En caso de trabajar sobre [Linux](http://askubuntu.com/questions/183775/how-do-i-open-a-terminal).

Conviene familiarizarse con los comandos que ofrecen los distintos sistemas
operativos. Linux y Mac OS ofrecen un conjunto de utilidades muy similar basado
en el estándar [POSIX](https://en.wikipedia.org/wiki/POSIX). Sin embargo,
el conjunto de comandos de Windows es radicalmente distinto.

De acuerdo a tu sistema operativo, utiliza una de las siguientes guías para
aprender los comandos más normales en cada entorno:

- Si tu sistema operativo es Windows, utiliza la guía de http://dosprompt.info/

- Si es Mac OS o Linux, utiliza la guía de [_The Linux Information
Project_](http://www.linfo.org/command_line_lesson_1.html)

También puedes hacer que Windows ofrezca las mismas utilidades que Linux o Mac
OS instalando [Cygwin](https://www.cygwin.com/).

## Node

JavaScript es el lenguaje de programación de la Web y se ejecuta,
principalmente, dentro de una máquina virtual integrada en un navegador.
No obstante, este no es el único entorno en el que podemos utilizar JavaScript.

Node es un intérprete JavaScript basado en V8, la máquina virtual del navegador
Chrome, de Google. Node es ampliamente utilizado en el desarrollo de
aplicaciones en el lado del servidor y será en Node que aprenderemos JavaScript
para enfatizar su independencia del navegador.

Para realizar los ejercicios y prácticas propuestos en esta guía, recomendamos
[instalar cualquier versión de Node 6](https://nodejs.org/en/).

## El editor de texto

Conviene tener en cuenta que para comenzar a programar en JavaScript sólo
necesitas un editor de texto plano. Sin embargo, es recomendable elegir un
editor con algunas características avanzadas que nos permita ser más
productivos.

**Nota**: es importante no confundir un editor de texto plano (como Notepad),
con un procesador de texto (como Microsoft Word).

El editor [Atom](https://atom.io/) es muy popular entre desarrolladores web. Es
una buena opción por ser gratuito, de código abierto y extensible (y, además,
ha sido programado con JavaScript).

Si optas por Atom, te recomendamos que instales el siguiente _add-on_:
[`linter-jshint`](https://github.com/AtomLinter/linter-jshint). Es un _linter_,
un software que analizará tu código JavaScript. No sólo te corregirá el estilo
(por ejemplo, que las líneas no superen cierto número de caracteres), sino que
te avisará de posibles malas prácticas que podrían causar _bugs_ (como,
por ejemplo, usar una variable sin haberla declarado antes).


### Editores de consola

Es conveniente conocer al menos un editor de consola, puesto que no siempre
trabajarás con entornos de escritorio. Hay varios muy buenos, entre ellos
[Vim](http://www.vim.org/).

De todas formas, si nunca has trabajado con un editor de consola, _recomendamos
encarecidamente que uses Atom_ o cualquier otro editor con una interfaz visual.
Es la forma más rápida de comenzar, puesto que la curva de aprendizaje de Vim
es muy pronunciada.

Si, pese a nuestras advertencias, optas por utilizar Vim, no olvides jugar a
[Vim Adventures](http://vim-adventures.com/) y completar el tutorial de
http://www.openvim.com, que te ayudarán a familiarizarte con el editor.
Vim es también altamente configurable y existen varias guías sobre cómo mejorar
la experiencia de programación.

## El navegador

**Cualquier navegador moderno** sirve y, de hecho, recomendamos que instales
varios para que puedas comprobar que el juego sea compatible entre navegadores.

Debes aprender cómo activar las **herramientas de desarrollador** en tu
navegador, ya que te permitirán depurar tu juego, analizar su rendimiento, etc.
En esta guía mostraremos
[Firefox Developer Edition](https://www.mozilla.org/firefox/developer/), que
es una versión de Firefox especial para desarrolladores web e incluye
herramientas y opciones no disponibles en la versión normal de Firefox.
