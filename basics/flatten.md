# Flatten

## Question:

Implement a function `flatten` that returns a newly-created array with all sub-array elements concatenated recursively into a single level.

Example:

```javascript
// Single-level arrays are unaffected.
flatten([1, 2, 3]); // [1, 2, 3]

// Inner arrays are flattened into a single level.
flatten([1, [2, 3]]); // [1, 2, 3]
flatten([
  [1, 2],
  [3, 4],
]); // [1, 2, 3, 4]

// Flattens recursively.
flatten([1, [2, [3, [4, [5]]]]]); // [1, 2, 3, 4, 5]

```

## Solution:

We will recursively traverse through the array, if its an Array, we call our function traverse else simply push the item to our final array. Order is automatically maintained, as we call traverse as soon as we see a Array.

```javascript
/**
 * @param {Array<*|Array>} value
 * @return {Array}
 */
export default function flatten(value) {
   const ans = []
   
   function traverse(arr){
    arr.forEach((x) => {
      if(Array.isArray(x)){
        traverse(x)
      } else {
        ans.push(x)
      }
    })
    return ans;
   }

   return traverse(value)
}
```
