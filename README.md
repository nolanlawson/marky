markymark
======

JavaScript performance timer based on `performance.mark()` and `performance.measure()`, i.e. the
[User Timing API](http://caniuse.com/#feat=user-timing), allowing for high-resolution
timings as well as better Dev Tools integration. Also uses
[PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) for the
minimum impact on runtime performance.

In Node, it uses `process.hrtime`. For browsers that don't support `PerformanceObserver`, it falls back to polling. For
browsers that don't support `performance.mark()`, it falls back to `performance.now()` or `Date.now()`.

Quick start
----

Via npm:

    npm install markymark

```js
var markymark = require('markymark');

markymark.start('expensive operation');
doExpensiveOperation();
markymark.end();
```

Why?
---

First off, it's [more performant](https://twitter.com/Runspired/status/811007272671293440) to use `mark()`/`measure()` rather than `console.time()`/`console.timeEnd()`.

Second off, when you use the built-in `performance` APIs, you get nice visualizations in the Chrome/Edge profilers:

![Chrome Dev Tools screenshot](doc/chrome.png)

![Edge F12 screenshot](doc/edge.png)

These APIs are designed to have the minimum impact on app runtime performance and thus are safe to ship in production.
(In fact, you should ship your `mark()`s and `measure()`s in production! Both Google and Bing already do this.

API
---

`markymark.start()` begins recording, and `markymark.end()` finishes recording:

```js
markymark.start('defendTheCastle');
defendTheCastle();
markymark.end();
```

You can also provide a string to `end()` for more complex scenarios:

```js
function defendTheCastle() {
  markymark.start('defendTheCastle');
  markymark.start('releaseTheHounds');
  releaseTheHounds();
  markymark.end();
  markymark.start('armTheCannons');
  armTheCannons();
  markymark.end();
  markymark.end('defendTheCastle');
}
```

If you don't provide an argument to `end()`, it will use the name from the most recent `start()`.

Asynchronous measurements
----

`Markymark.end()` returns a `Promise` for the measurement of the duration:

```js
markymark.start('manTheTorpedos');
manTheTorpedos();
markymark.end().then(function (duration) {
  console.log('duration'); // duration in milliseconds
});
```

The reason this is done asynchronously is because of how
[PerformanceObserver][https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver] works; it
allows the browser to do the actual measurement work in the background. 

Not using Node/npm/Browserify/Webpack/etc.?
---

You can use Markymark as a script tag:
```html
<script src="https://unpkg.com/markymark/dist/markymark.min.js"></script>
<script>
markymark.start('expensive operation');
doExpensiveOperation();
markymark.end();
</script>
```

Browser support
----

Markymark doesn't require ES6 syntax, but it does use `Promise` and `Map`. If your target environment doesn't support those,
you'll need a polyfill. Or you can use:

```js
var markymark = require('markymark/with-polyfills');
```

Or as a script tag:

```html
<script src="https://unpkg.com/markymark/dist/markymark.with-polyfillsmin.js"></script>
```

Markymark supports the following browsers (with the Promise+Map polyfills):