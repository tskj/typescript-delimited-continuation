import { reset } from '../src';

test('call continuation twice example', async () => {
  const test = await reset<number, number, string>(async (shift) => {
    const b = await shift(async (k) => (1 + (await k(await k(2)))).toString());
    return (b + 3) * 2;
  });
  expect(test).toBe('27');
});

test('call continuation once', async () => {
  const test = await reset<number, number, number>(async (shift) => {
    const x = await shift(async (k) => k(1));
    return x + 2;
  });
  expect(test).toBe(3);
});

test('ignore continuation', async () => {
  const test = await reset<number, number, number>(async (shift) => {
    const x = await shift(async (k) => 1);
    return x + 2;
  });
  expect(test).toBe(1);
});

test('use continuation but ignore result', async () => {
  const test = await reset<number, number, number>(async (shift) => {
    const x = await shift(async (k) => {
      await k(1);
      return 4;
    });
    return x + 2;
  });
  expect(test).toBe(4);
});

test('call continuation once and do stuff', async () => {
  const test = await reset<number, number, number>(async (shift) => {
    const x = await shift(async (k) => 3 * (await k(1)));
    return x + 2;
  });
  expect(test).toBe(9);
});

test('ignore shift itself', async () => {
  const test = await reset<unknown, unknown, number>(async (shift) => {
    return 3 + 2;
  });
  expect(test).toBe(5);
});

test('use shift twice', async () => {
  const test = await reset<number, number, number>(async (shift) => {
    const x = await shift((k) => k(2));
    return reset<number, number, number>(async (shift) => {
      const y = await shift((k) => k(3));
      return x + y;
    });
  });
  expect(test).toBe(5);
});

test('use dynamically scoped shift', async () => {
  const test = await reset<number, number, number>(async function (this: any) {
    console.log("what is this", this)
    const x = await this.shift((k: any) => k(2));
    const y = await this.shift((k: any) => k(7))
    return x + y + 3;
  });
  expect(test).toBe(12);
})

test('wikipedia example', async () => {
  const test = await reset<number, number, number>(async (shift) => {
    return 1 + (await shift((k) => k(5)));
  });
  expect(2 * test).toBe(12);
});
