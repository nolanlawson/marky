markmymark
======

Simple performance timer based on `performance.mark()` and `performance.measure()`, i.e. the [User Timing API](http://caniuse.com/#feat=user-timing). In browsers that don't support this API, it just logs the result.

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

Or via unpkg:

```html
<script src="https://unpkg.com/markymark/dist/markymark.min.js"></script>
<script>
markymark.start('expensive operation');
doExpensiveOperation();
markymark.end();
</script>
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

When you use the built-in `performance` APIs, you get nice visualizations in your Dev Tools:

Plus, you also get high-resolution performance entries that can be easily provided as telemetry:

```js
var measures = performance.getEntries().filter(entry => entry.entryType === 'measure');
sendViaAjax(measures); // send the data to your server
```
