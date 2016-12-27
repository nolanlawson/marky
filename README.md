markymark
======

Simple performance timer based on `performance.mark()` and `performance.measure()`, i.e. the [User Timing API](http://caniuse.com/#feat=user-timing), allowing for high-resolution timings as well as better Dev Tools integration. Also uses [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) for the minimum impact on runtime app performance.

In Node, it uses `process.hrtime`. For browsers that don't support `PerformanceObserver`, it falls back to polling. For
browsers that don't support `performance.mark()`, it falls back to `performance.now()` or `Date.now()`.

Usage
----

Via npm:

    npm install markymark

```js
var markymark = require('markymark');

markymark.start('expensive operation');
doExpensiveOperation();
markymark.end();
```

You can also provide a string to `end()` for more complex scenarios:

```js
markymark.start('release the hounds');
markymark.start('release rover');
releaseRover();
markymark.end('relese rover');
markymark.start('release cujo');
releaseCujo();
markymark.end('release cujo');
markymark.end('release the hounds');
```

If you don't provide an argument to `end()`, it will use the most recent name from `start()`.

Why?
---

First off, it's more performant to use `mark()`/`measure()` rather than `console.time()`/`console.timeEnd()`.

Second off, when you use the built-in `performance` APIs, you get nice visualizations in your Dev Tools:

Since this is a standard API, it also shows up in Edge and Windows Performance Analyzer:

These APIs are designed to have the minimum impact on app runtime performance and thus are safe to ship in production.
(In fact, you should ship your measurements in production! Both Google and Bing already do this.)