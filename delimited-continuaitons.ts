const reset = <Input, Output, Result>(
  computation: (
    shift: (
      effect: (k: (i: Input) => Promise<Output>) => Promise<Result>
    ) => Promise<Input>
  ) => Promise<Output>
): Promise<Result> => {
  type Continuation = (input: Input) => Promise<Output>;
  let _effect: (k: Continuation) => Promise<Result>;
  const k = (input: Input): Promise<Output> =>
    computation(() => Promise.resolve(input));
  return computation((effect: (k: Continuation) => Promise<Result>) => {
    _effect = effect;
    return Promise.reject();
  }).catch(() => _effect(k) as any);
};

const test = await reset<number, number, string>(async (shift) => {
  const b = await shift(async (k) => (1 + (await k(await k(2)))).toString());
  return (b + 3) * 2;
});

console.log('test', test);
