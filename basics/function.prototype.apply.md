# Function.prototype.apply

## Question:

Implement your own `Function.prototype.apply` without calling the native `apply` method. To avoid overwriting the actual `Function.prototype.apply`, implement the function as `Function.prototype.myApply`.

Example:

```javascript
function multiplyAge(multiplier = 1) {
  return this.age * multiplier;
}

const mary = {
  age: 21,
};

const john = {
  age: 42,
};

multiplyAge.myApply(mary); // 21
multiplyAge.myApply(john, [2]); // 84

```

> The `Function.prototype.apply()` method calls the specified function with a given `this` value, and `arguments` provided as an array (or an array-like object).
>
> _Source:_ [_Function.prototype.apply() - JavaScript | MDN_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_objects/Function/apply)

## Solution:

`bind`, `apply`, and `call` can be viewed as sibling functions. They're highly similar in terms of function signature and usage. Within `Function.prototype` methods, `this` refers to the `Function` object itself.

```javascript
// Solution 1: Using `bind`

Function.prototype.myApply = function (thisArg, argArray = []) {
  return this.bind(thisArg)(...argArray);
};
```

```javascript
// Solution 2: Using `call`

Function.prototype.myApply = function (thisArg, argArray = []) {
  return this.call(thisArg, ...argArray);
};
```

{% hint style="info" %}
`Function.prototype.call` and `Function.prototype.apply` are very similar. Here's an easy way to remember each function's signature:

* `Function.prototype.call` takes in a **c**omma-separated list of arguments.
* `Function.prototype.apply` takes in an **a**rray of arguments.
{% endhint %}

***

## Extra: Function.prototype.call

```javascript
Function.prototype.myCall = function (thisArg, ...argArray) {
  return this.bind(thisArg)(...argArray)
};
```
