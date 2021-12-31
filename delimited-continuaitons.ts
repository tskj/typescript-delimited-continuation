/**
 * Basic continuation type
 *
 * From `Input` to `Output`, but a `Promise` of an `Output`,
 * because the way this works is we're hijacking the async/await machinery
 */
type Continuation<Input, Output> = (input: Input) => Promise<Output>;

/**
 * An "effect" is a function that takes a continuation `k`
 * and eventually evaluates to a `Result`
 *
 * But again, a `Promise<Result>` for technical reasons
 */
type Effect<Input, Output, Result> = (
  k: Continuation<Input, Output>
) => Promise<Result>;

/**
 * Wrap your computation in this `reset` function and
 * call the provided `shift` function with en "effect"
 * which takes a "continuation" `k`.
 *
 * You can call this continuation 0, 1, or many times.
 *
 * The result of this "effect" is the result of the entire call to `reset`.
 *
 * The `Input` and `Output` type parameters are the input and output of the continuation,
 * and the `Result` type parameter is the resulting type of the entire expression.
 */
export const reset = async <Input, Output, Result>(
  computation: (
    shift: (effect: Effect<Input, Output, Result>) => Promise<Input>
  ) => Promise<Output>
): Promise<Result> => {
  const k: Continuation<Input, Output> = (i) =>
    computation(() => Promise.resolve(i));

  let _effect: Effect<Input, Output, Result>;
  return await computation((effect: Effect<Input, Output, Result>) => {
    _effect = effect;
    return Promise.reject();
  }).catch(() => _effect(k) as any);
};

const test = await reset<number, number, string>(async (shift) => {
  const b = await shift(async (k) => (1 + (await k(await k(2)))).toString());
  return (b + 3) * 2;
});

console.log('test', test);
