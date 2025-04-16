# Array.prototype.filter

## Question:

Implement `Array.prototype.filter`. To avoid overwriting the actual `Array.prototype.filter` which is being used by the autograder, we shall instead implement it as `Array.prototype.myFilter`.

For sparse arrays (e.g. `[1, 2, , 4]`), the empty values should be ignored while traversing the array (i.e. they should not be in the resulting array).

Example:

```javascript
[1, 2, 3, 4].myFilter((value) => value % 2 == 0); // [2, 4]
[1, 2, 3, 4].myFilter((value) => value < 3); // [1, 2]
```

{% hint style="info" %}
`Object.hasOwn`

```javascript
const fruits = ["Apple", "", , "Orange"];
Object.hasOwn(fruits, 1); // true ('')
Object.hasOwn(fruits, 2); // false - not defined
```
{% endhint %}

{% hint style="info" %}
Syntax for filter:

* filter(callbackFn)
* filter(callbackFn, thisArg)

`thisArg (optional):` A value to use as `this` when executing `callbackFn`\
\
[`MDN:`Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Array/filter)
{% endhint %}

## Solution:

Initialize a new array to store the filtered results. As we loop through the array (via `this`), call the callback on each array element with the following parameters: `element`, `index`, `array`, and `this`. This be done by either using `Function.prototype.call` or `Function.prototype.apply`.

If the callback evaluates to `true`, push the element into the `results`.

```javascript
Array.prototype.myFilter = function (callbackFn, thisArg) {
  const len = this.length;
  const results = [];

  for (let k = 0; k < len; k++) {
    const kValue = this[k];
    if (
      // Ignore index if value is not defined for index (e.g. in sparse arrays).
      Object.hasOwn(this, k) &&
      callbackFn.call(thisArg, kValue, k, this)
    ) {
      results.push(kValue);
    }
  }

  return results;
};
```

***

## Extra:

Similarly implement for **Array.prototype.map**

```javascript
Array.prototype.myMap = function (callbackFn, thisArg) {
  const len = this.length;
  const array = new Array(len);

  for (let k = 0; k < len; k++) {
    // Ignore index if value is not defined for index (e.g. in sparse arrays).
    if (Object.hasOwn(this, k)) {
      array[k] = callbackFn.call(thisArg, this[k], k, this);
    }
  }

  return array;
};
```
