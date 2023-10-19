// https://dev.to/ecyrbe/how-to-unit-test-your-typescript-utility-types-3cnm
type Assert<T, U> = 
  (<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2)
    ? true
    : `${Show<T>} != ${Show<U>}`;

type Show<T> = 
  T extends string | number | bigint | boolean | null | undefined
  ? T
  : T extends Array<any>
    ? ShowArray<T>
    : T extends symbol
      ? 'some symbol'
      : 'some object';

type ShowArray<T extends any[], Acc extends string = ''> = 
  T extends [infer Head, ...infer Tail]
  ? ShowArray<Tail, Acc extends '' ? Show<Head> : `${Acc}, ${Show<Head>}`>
  : `[${Acc}]`;
