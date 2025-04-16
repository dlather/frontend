# Function.prototype.bind

## Question:

Implement your own `Function.prototype.bind` without calling the native `bind` method. To avoid overwriting the actual `Function.prototype.bind`, implement the function as `Function.prototype.myBind`.

Example:

```javascript
const john = {
  age: 42,
  getAge: function () {
    return this.age;
  },
};

const unboundGetAge = john.getAge;
console.log(unboundGetAge()); // undefined

const boundGetAge = john.getAge.myBind(john);
console.log(boundGetAge()); // 42

```

{% hint style="info" %}
**Syntax**:

bind(thisArg, arg1, arg2, /\* …, \*/ argN)\
\
Arguments:\
**thisArg:** The value to be passed as the this parameter to the target function func when the bound function is called.

**arg1, …, argN (Optional):** Arguments to prepend to arguments provided to the bound function when invoking func.\
\
[MDN: Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Function/bind)
{% endhint %}

## Solution:&#x20;

Firstly, since the native `bind` is on `Function.prototype`, our `bind` also has to be on it. We'll implement it as `Function.prototype.myBind`.

Secondly, the arguments `Function.prototype.myBind` accepts should be identical to the native one, where the first argument is the `this` keyword that the target function is bound to, after that it takes a variadic list of arguments to prepend to the arguments of the bound function.

Next, it returns a new function, with its `this` bound to the previous context passed to `Function.prototype.myBind` method. When the returned function is invoked, it gets the prepended arguments passed from `Function.prototype.myBind` as well.

How do we refer to the original method that `bind` is called upon in the new returned function? Turns out we can access it via `this` inside `Function.prototype.myBind`, as `Function.prototype.myBind` is invoked as a method call, thus resulting in its `this` bound to the method `foo` implicitly.

Lastly, we can use [`Function.prototype.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Function/call) or [`Function.prototype.apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Function/apply) inside the returned function, to call the original method with the `thisArg` passed to the `myBind` method.

```javascript
/**
 * @param {any} thisArg
 * @param {...*} argArray
 * @return {Function}
 */
Function.prototype.myBind = function (thisArg, ...argArray) {
  const originalMethod = this;
  return function (...args) {
    return originalMethod.apply(thisArg, [...argArray, ...args]);
  };
};
```
