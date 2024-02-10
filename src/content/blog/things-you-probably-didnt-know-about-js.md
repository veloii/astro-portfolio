---
title: "Things you probably didn't know about JS"
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Feb 10 2024'
heroImage: '/obscure-js.png'
---
# Things you probably didn’t know about JavaScript

You probably will not know *most* of the things I'm about to show you, and to be honest that's for good reason because a lot of these **you really shouldn't do**. Anyway that being said I'm not going to pad this out with another 3 paragraphs of text. Here goes...

## Proxy Objects

The proxy object is used to define custom behavior for fundamental operations (e.g., property lookup, assignment, enumeration, function invocation, etc.). It's a powerful way to create an abstraction on top of an existing object.

This is completely fine to use (unlike some others) and I would recommend it.

```jsx
let handler = {
    get: function(obj, prop) {
        return prop in obj ? obj[prop] : 42;
    }
};

let p = new Proxy({}, handler);
p.a = 1;
console.log(p.a, p.b); // 1, 42
```

## Reflect API

The Reflect API exposes the internal methods of what JS does for you. It’s very useful when used in combination with proxies.

```jsx
let obj = { x: 1, y: 2 };
Reflect.set(obj, 'z', 3);
console.log(obj); // { x: 1, y: 2, z: 3 }
```

```jsx
let handler = {
	deleteProperty(targetObject, property) {
	      // Custom functionality: log the deletion
      console.log("Deleting property:", property);

      // Execute the default introspection behavior
      return Reflect.deleteProperty(targetObject, property);
  },
};

let p = new Proxy({ x: 1, y: 2 }, handler);
delete p.x // Deleting property: x
```

## Generators and yield

Generator functions allow you to define an iterative algorithm by writing a single function whose execution is not continuous. Generators are functions that can be exited and later re-entered, keeping their context (variable bindings) across re-entrances.

A simple way to think about generators is that the function execution is paused when you `yield` and will only continue when you do .next() on it.

Personally, I would never use these but you do you!

```jsx
function* idGenerator() {
    let id = 0;
    while (true) {
        yield id++;
    }
}

let gen = idGenerator();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

## Symbol Type

A symbol is a unique and immutable primitive value and may be used as the key of an object. It's often used to add unique property keys to objects that won't collide with keys any other code might add to the object, and which are hidden from any mechanisms other code will typically use to access the object.

```jsx
let mySymbol = Symbol('mySymbol');
let obj = {[mySymbol]: 'value'};
console.log(obj[mySymbol]); // 'value'
```

## Arguments Object

Inside a function, the arguments object is an array-like object that contains all of the arguments passed to the function. This allows you to write functions that can accept any number of arguments without explicitly defining them. Note that arguments is not an actual array, so array methods cannot be directly applied.

I would really not recommend doing this today as we have the spread operator, but you still use `var` for defining all your variables then this is for you. no offense :)

```jsx
function sum() {
    let total = 0;
    for(let i = 0; i < arguments.length; i++) {
        total += arguments[i];
    }
    return total;
}
console.log(sum(1, 2, 3, 4)); // 10
```

## With statement

The with statement in JavaScript is used to simplify working with deeply nested objects by temporarily extending the scope chain. It creates a new scope in which the specified object's properties are treated as if they are variables local to the block, without any definitions. This can make the code more concise but also more ambiguous and harder to maintain, and it is generally discouraged, especially in strict mode, where it is not allowed.

Please for the love of God, **do not** do this ever ever ever... There is a reason not even `tsserver` (Intellisense) can understand this code.

```jsx
let obj = {a: 1, b: 2, c: 3};
with (obj) {
    console.log(a + b + c); // 6
}
```

## Function constructor

The Function constructor is a way to create new function objects. It allows you to dynamically create and compile functions at runtime by passing strings of code. While it provides dynamic capabilities similar to eval, it's often discouraged due to potential security vulnerabilities and difficulties in debugging.

```jsx
let sum = new Function('a', 'b', 'return a + b');
console.log(sum(2, 6)); // 8
```

## Label statements

Labels provide a way to identify a loop or block of code and can be used with break or continue statements for greater control over the flow of the program. This is particularly useful in nested loops, where you might want to break out of or continue an outer loop from within an inner loop.

```jsx
outerLoop: for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        if (i === 2 && j === 2) {
            break outerLoop;
        }
        console.log(`i: ${i}, j: ${j}`);
    }
}
```

## do…while

It’s the exact the same as while loop, but it executes the do block at the start, even if the while condition is false.

```jsx
let i = 0;
do {
    console.log(i);
    i++;
} while (i < 5);
```
