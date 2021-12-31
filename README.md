# Delimited Continuations in Typescript

This is a tiny experiment in pushing javascript as far as it will go. Don't use this in production please. Nevertheless you can try it out:

```bash
npm i --save typescript-delimited-continuation
```

Delimited Continuations is a super cool concept, you can read more about it on [Wikipedia](https://en.wikipedia.org/wiki/Delimited_continuation). Turns out delimited continuations are isomorphic to Monads, and by god if Promises aren't monadic. And guess what uses Javascript Promises - async/await syntax! The async/await syntax is syntax sugar for promises, so what this library does is abuse promises to hijack the async/await syntax to implement delimited continuations control flow.

What a mouthful. Check out this example from the Wikipedia article in Scheme:

```scheme
(* 2 (reset (+ 1 (shift k (k 5)))))
```

Translated to Typescript, this looks like this:

```typescript
import { reset } from 'typescript-delimited-continuation'

const x =
  await reset<number, number, number>(async (shift) => {
    return 1 + (await shift((k) => k(5)));
  });

const result = 2 * x;
```

The way this works is that promises essentially capture a continuation because of the way the async/await syntax works, and using this we can devise a simple api to call it directly, like we do in the shift function. Check out the implementation for some comments and more details.
