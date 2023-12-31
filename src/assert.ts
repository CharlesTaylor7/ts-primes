// https://dev.to/ecyrbe/how-to-unit-test-your-typescript-utility-types-3cnm
type Assert<T, U> = 
  (<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2)
    ? true
    : `${Show<T>} != ${Show<U>}`;

type Show<T> =
  T extends number | bigint | boolean | null | undefined
  ? T
  : T extends string
    ? `'${T}'`
    : T extends Array<any>
      ? ShowArray<T>
      : T extends symbol
        ? 'some symbol'
        : unknown extends T
          ? 'unknown'
          : 'some object';

type ShowArray<T extends any[]> = 
  `[${ShowJoin<T, ", ">}]`;

true satisfies Assert<ShowArray<[3,1]>, "[3, 1]">;

type ShowJoin<T extends any[], Sep extends string, Acc extends string = ''> = 
  T extends [infer Head, ...infer Tail]
  ? ShowJoin<Tail, Sep, Acc extends '' ? Show<Head> : `${Acc}${Sep}${Show<Head>}`>
  : Acc;

true satisfies Assert<ShowJoin<[3,1], " | ">, "3 | 1">;

