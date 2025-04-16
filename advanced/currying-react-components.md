# Currying in React: A Deep Dive

## Introduction
This article explores advanced React patterns using functional programming concepts, specifically focusing on currying and partial props application. We'll understand how these patterns can make our React components more reusable and maintainable.

## What is Functional Programming?
Functional Programming (FP) is a programming paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data. Key characteristics include:

1. **Pure Functions**: Functions that always return the same output for the same input
2. **Immutability**: Data once created cannot be changed
3. **First-Class Functions**: Functions can be passed as arguments, returned from other functions, and assigned to variables
4. **Higher-Order Functions**: Functions that take other functions as arguments or return functions

## Understanding Currying
Currying is a technique in functional programming where a function that takes multiple arguments is transformed into a sequence of functions, each taking a single argument.

### Basic Example
```javascript
// Regular function
const sum = (a, b, c) => a + b + c;

// Curried version
const curriedSum = (a) => (b) => (c) => a + b + c;

// Usage
console.log(sum(1, 2, 3));        // 6
console.log(curriedSum(1)(2)(3)); // 6

// Partial application
const addOne = curriedSum(1);
const addOneAndTwo = addOne(2);
console.log(addOneAndTwo(3));     // 6
```

## The `partialProps` Function Explained

The function `partialProps` is a higher-order component (HOC) helper that allows you to "pre-fill" (or partially apply) some of the props to a React functional component. This way, you create a new component that doesn't require those pre-filled props to be provided again when the component is used.

```typescript
import { FC } from 'react';

function partialProps<P extends Record<string, unknown>, K extends keyof P>(
  Component: FC<P>,
  partial: Pick<P, K>,
): FC<Omit<P, K>> {
  return (props) => {
    return <Component {...partial} {...(props as P)} />;
  };
}
```

### Detailed Code Breakdown

#### Import Statement
```typescript
import { FC } from 'react';
```
- **Import Statement:**  
  This imports the `FC` (Functional Component) type from React. It's used to type the components that are passed in and returned from the function.

#### Generic Type Parameters
```typescript
function partialProps<P extends Record<string, unknown>, K extends keyof P>(
```
- **`P extends Record<string, unknown>`:**  
  This generic parameter `P` represents the full props type of the component. By constraining `P` to `Record<string, unknown>`, we ensure that it's an object with string keys. This is common for React component props.

- **`K extends keyof P`:**  
  This generic parameter `K` represents a subset of the keys of `P`. Using `K extends keyof P` guarantees that `K` is one or more keys that exist on `P`.

#### Function Parameters
```typescript
  Component: FC<P>,
  partial: Pick<P, K>,
```
- **`Component: FC<P>`:**  
  This parameter is the original React functional component that expects props of type `P`.

- **`partial: Pick<P, K>`:**  
  This parameter is an object consisting of a subset of props from `P` (only the keys in `K`). The utility type `Pick<P, K>` creates a new type with only the properties whose names are specified in `K`. Essentially, these are the props you want to pre-apply or "fix" for the component.

#### Return Type
```typescript
): FC<Omit<P, K>> {
```
- **`FC<Omit<P, K>>`:**  
  The function returns a new functional component that expects only the remaining props. The type `Omit<P, K>` creates a new type by taking all keys from `P` and removing those listed in `K`. Since you're providing those props via `partial`, the consumer of the new component does not need to supply them again.

#### Function Implementation
```typescript
  return (props) => {
    return <Component {...partial} {...(props as P)} />;
  };
}
```

##### What Happens Inside the Returned Component?

1. **Arrow Function Component:**  
   The returned value is an anonymous functional component. It receives `props`, which are of type `Omit<P, K>`, meaning they are the props that were not pre-set.

2. **Spreading Props into the Original Component:**  
   ```jsx
   <Component {...partial} {...(props as P)} />
   ```
   - **`{...partial}`:**  
     Spreads the pre-filled props (the ones you've already provided) into `Component`.
     
   - **`{...(props as P)}`:**  
     Spreads the rest of the incoming props. The type assertion `as P` is used here because, logically, when you merge `partial` (of type `Pick<P, K>`) with `props` (of type `Omit<P, K>`), the result is the full set of props required by the original component (`P`).  
     
     Even though TypeScript understands that `Omit<P, K> & Pick<P, K>` is equivalent to `P`, the type assertion helps satisfy the compiler.

##### Ordering of the Spread Operators

- The order of spreading is important because later spreads can override earlier ones if there is any overlap. However, in this code, there is no overlap because:
  
  - `partial` contains keys of type `K`.
  - `props` is of type `Omit<P, K>`—it does not include any keys from `K`.
  
  This makes the combination safe and ensures that the final props object exactly matches type `P`.

### Why Use `partialProps`?

This pattern is useful when:

- **Reusing Component Configuration:**  
  You have a component that requires many props, but some values are known constants in a specific context or configuration. Instead of passing them every time, you can "bake in" those props.

- **Simplifying Component Interfaces:**  
  For example, consider a component that renders a styled button:
  
  ```typescript
  type ButtonProps = {
    label: string;
    color: string;
    size: 'small' | 'medium' | 'large';
  };
  
  const Button: FC<ButtonProps> = ({ label, color, size }) => (
    <button className={`${size} ${color}`}>{label}</button>
  );
  ```
  
  If you have a theme where the button should always be red and large, you can create a partially applied component:
  
  ```typescript
  const RedLargeButton = partialProps(Button, { color: 'red', size: 'large' });
  ```
  
  Now, `RedLargeButton` only needs the `label` prop. Its type becomes `FC<Omit<ButtonProps, 'color' | 'size'>>`, i.e., `FC<{ label: string }>`.

- **Encapsulating Configuration:**  
  It allows you to encapsulate and reuse configurations in a clean and type-safe manner.

### Recap

- **Generic Types and Utility Types:**  
  - `P` captures the full props.
  - `K` is a subset of keys from `P` that you want to pre-apply.
  - `Pick<P, K>` represents those pre-applied props.
  - `Omit<P, K>` represents the remaining props needed by the component.

- **Function Signature:**  
  The function takes a component and some of its props, and returns a new component that requires only the remaining props.

- **Usage:**  
  This pattern is essentially a partial application for components. It is similar to function currying where some arguments are fixed in advance, thereby reducing redundancy and simplifying component usage in various contexts.

## Practical Example: Button Component

```typescript
type ButtonProps = {
  color: string;
  size: "small" | "medium" | "large";
  variant: "contained" | "outlined";
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  color,
  size,
  variant,
  onClick,
  children,
}) => {
  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onClick}
      className={`${size} ${variant}`}
    >
      {children}
    </button>
  );
};

// Create a specialized button with predefined props
const ImportantRedButton = partialProps(Button, {
  color: "red",
  size: "large",
  variant: "contained",
});

// Usage
export default function App() {
  return (
    <ImportantRedButton onClick={() => alert("Clicked!")}>
      Delete
    </ImportantRedButton>
  );
}
```

## Other Use Cases

1. **Form Components**:
```typescript
const TextInput = partialProps(Input, {
  type: "text",
  className: "form-control"
});
```

2. **Layout Components**:
```typescript
const MainLayout = partialProps(Layout, {
  header: <Header />,
  sidebar: <Sidebar />
});
```

3. **Data Display Components**:
```typescript
const UserCard = partialProps(Card, {
  theme: "light",
  padding: "medium"
});
```

## Relationship with Higher-Order Components (HOC)

`partialProps` is actually a specialized form of a Higher-Order Component (HOC). Here's why:

1. **HOC Definition**: A HOC is a function that takes a component and returns a new component
2. **partialProps as HOC**: 
   - Takes a component as input
   - Returns a new component with some props pre-filled
   - Adds behavior (prop merging) to the original component

The key difference is that `partialProps` is more focused and type-safe, specifically handling prop partial application rather than general component enhancement.

## Benefits of Using partialProps

1. **Type Safety**: Full TypeScript support with proper type inference
2. **Reusability**: Create specialized components from generic ones
3. **Maintainability**: Reduce prop drilling and duplicate code
4. **Flexibility**: Easy to create variations of components with different default props

## Conclusion
The `partialProps` pattern, combined with currying concepts, provides a powerful way to create reusable and type-safe React components. It's particularly useful when you need to create variations of components with predefined props while maintaining type safety and flexibility. 