# Promise.race

## Question:

Let's implement our own version of `Promise.race()`, a `promiseRace` function, with the difference being the function takes in an array instead of an iterable. Be sure to read the description carefully and implement accordingly!

Examples:

```javascript
const p0 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(42);
  }, 100);
});
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Err!');
  }, 400);
});

await promiseRace([p0, p1]); // 42
```

```javascript
const p0 = Promise.resolve(42);
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(21);
  }, 100);
});

await promiseRace([p0, p1]); // 42

```

```javascript
const p0 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(42);
  }, 400);
});
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Err!');
  }, 100);
});

try {
  await promiseRace([p0, p1]);
} catch (err) {
  console.log(err); // 'Err!'
}

```

{% hint style="info" %}


> The `Promise.race()` method returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects, with the value or reason from that promise.&#x20;
>
> If the iterable passed is empty, the promise returned will be forever pending.
>
> If the iterable contains one or more non-promise value and/or an already settled promise, then `Promise.race()` will resolve to the first of these values found in the iterable.

_Source:_ [_Promise.race() - JavaScript | MDN_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Promise/race)
{% endhint %}

## Solution:

There are a few aspects to this question we need to bear in mind and handle:

1. `Promise`s are meant to be chained, so the function needs to return a `Promise`.
2. If the input array is empty, the returned `Promise` will be forever pending.
3. The input array can contain non-`Promise`s.

We'll return a `Promise` at the top level of the function. First check if the input array is empty, if so we need to return a forever-pending promise. That can be done by `return`-ing without calling `resolve()` or `reject()`.

We then need to attempt resolving every item in the input array. This can be achieved using `Array.prototype.forEach` or `Array.prototype.map`.

* If an item is resolved, `resolve()` with the result.
* If an item is rejected, `reject()` with the reason.

Since it's a race, we don't have to do much coordination unlike in `Promise.all`. Whichever item resolves/rejects first wins the race and calls the `resolve`/`reject` function respectively to determine the final state and value/reason of the returned `Promise`.

One thing to note here is that because the input array can contain non-`Promise` values, if we are not `await`-ing them, we need to wrap each value with `Promise.resolve()` which allows us to use `.then()` on each of them so we don't have to differentiate between `Promise` vs non-`Promise` values and whether they need to be resolved.

```javascript
/**
 * @param {Array} iterable
 * @return {Promise}
 */
export default function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    iterable.forEach(async (item) => {
      try {
        const result = await item;
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
}

```
