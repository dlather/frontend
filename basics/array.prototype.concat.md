# Array.prototype.concat

## Question:

Implement `Array.prototype.concat`. To avoid overwriting the actual `Array.prototype.concat` which is being used by the autograder, we shall instead implement it as `Array.prototype.myConcat`.

Example:

```javascript
[1, 2, 3].myConcat([4, 5, 6]); // [1, 2, 3, 4, 5, 6]
[1, 2, 3].myConcat(4, 5, 6); // [1, 2, 3, 4, 5, 6]
[1, 2, 3].myConcat(4, [5, 6]); // [1, 2, 3, 4, 5, 6]
```

{% hint style="info" %}
The `Array.prototype.concat` method on JavaScript arrays is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.
{% endhint %}

## Solution:

Start by creating a copy of the original array (`this`) using the spread operator (`[...this]`). This ensures that the polyfill operates on a copy of the array, leaving the original array unchanged.

Iterate through the arguments passed to the `Array.prototype.myConcat` method. For each argument, check if it's an array using `Array.isArray()`. If it's an array, spread its elements into the `newArray`. If it's not an array, simply push the element into the `newArray`.

Finally, return the `newArray`, which contains all the elements from the original array and the arguments passed to `Array.prototype.myConcat`. This mimics the behavior of the native `Array.prototype.concat` method.

```javascript
/**
 * @template T
 * @param {...(T | Array<T>)} items
 * @return {Array<T>}
 */
Array.prototype.myConcat = function (...items) {
  const newArray = [...this];

  for (let i = 0; i < items.length; i++) {
    if (Array.isArray(items[i])) {
      newArray.push(...items[i]);
    } else {
      newArray.push(items[i]);
    }
  }

  return newArray;
};

```
