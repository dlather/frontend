# Array.prototype.at

## Question:

Implement `Array.prototype.at`. To avoid overwriting the actual `Array.prototype.at`, we shall instead implement it as `Array.prototype.myAt`.

Example:

```javascript
const arr = [42, 79];
arr.myAt(0); // 42
arr.myAt(1); // 79
arr.myAt(2); // undefined

arr.myAt(-1); // 79
arr.myAt(-2); // 42
arr.myAt(-3); // undefined
```

{% hint style="info" %}
`Array.prototype.at` takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative index counts back from the end of the array — if `index < 0`, `index + array.length` is accessed.\
\
[MDN: Array.prototype.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Array/at)
{% endhint %}

## Solution:

`this` inside the `myAt` represents the array.

```javascript
/**
 * @param {number} index
 * @return {any | undefined}
 */
 
Array.prototype.myAt = function (index) {
  const len = this.length;
  const relativeIndex = Number(index);
  const k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;

  if (k < 0 || k >= len) {
    return undefined;
  }

  return this[k];
};

```
