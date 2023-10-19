// unit is so named for having 1 inhabitant
type Unit = undefined;

type Length<A extends any[]> = number & A['length'];

// fixed size tuples can be constructed via recursion and checking their length
type Tuple<
  Size extends number,
  Type = Unit,
  Acc extends Type[] = [],
> = Length<Acc> extends Size ? Acc : Tuple<Size, Type, [...Acc, Type]>;

// Addition is not builtin, but can be defined in terms of tuples
type Add<A extends number, B extends number> = Length<
  [...Tuple<A>, ...Tuple<B>]
>;

// Surpisingly even subtraction of natural numbers can be defined in terms of tuples
type Subtract<A extends number, B extends number> = Tuple<A> extends [
  ...infer U,
  ...Tuple<B>,
]
  ? Length<U>
  : never;

// Comparison can be built in terms of subtraction
type Compare<A extends number, B extends number> = Subtract<A, B> extends never
  ? 'LT'
  : A extends B
  ? 'EQ'
  : 'GT';

// Multiplication can be built from Addition and subtracting recursively
type Multiply<
  A extends number,
  B extends number,
  Acc extends number = 0,
> = A extends 0 ? Acc : Multiply<Subtract<A, 1>, B, Add<Acc, B>>;

// Division can be built by adding and subtracting recursively.
type Division<
  A extends number,
  B extends number,
  Acc extends number = 0,
> = Compare<A, B> extends 'LT' ? Acc : Division<Subtract<A, B>, B, Add<1, Acc>>;

type Remainder<A extends number, B extends number> = Compare<A, B> extends 'LT'
  ? A
  : Remainder<Subtract<A, B>, B>;

type GCD<A extends number, B extends number> = A extends 0
  ? B
  : Compare<A, B> extends 'GT'
  ? GCD<Subtract<A, B>, B>
  : GCD<Subtract<B, A>, A>;

type Wheel = [4, 2, 4, 2, 4, 6, 2, 6 ];
type WheelSize = Length<Wheel>;
type IncWheelIndex<I extends number> = Remainder<Add<I, 1>, WheelSize>
type InitialPrimes = [2, 3, 5];

type PrimesUnder<
  Bound extends number
> =
  Compare<Bound, 11> extends 'LT'
  ? Cap<InitialPrimes, Bound>
  : PrimesUnderRec<Bound, 7, 0, {}, InitialPrimes>


type PrimesUnderRec<
  Bound extends number,
  N extends number,
  I extends number,
  Sieve extends Record<number, boolean>,
  Primes extends number[]
> = Compare<N, Bound> extends 'LT'
  ? Sieve[N] extends true
    ? PrimesUnderRec<Bound, Add<N, Wheel[I]>, IncWheelIndex<I>, Sieve, Primes>
    : PrimesUnderRec<Bound, Add<N, Wheel[I]>, IncWheelIndex<I>, MarkSieve<Bound, N, Sieve>, [...Primes, N]>
  : Primes;

type Cap<T, Bound extends number, Acc extends number[] = []> =
  T extends [infer Head extends number, ...infer Tail]
  ? Compare<Head, Bound> extends 'LT'
    ? Cap<Tail, Bound, [...Acc, Head]>
    : Cap<Tail, Bound, Acc>
  : Acc;

type MarkSieve<
  Bound extends number,
  N extends number,
  Sieve extends Record<number, boolean>,
> = {
  [K in Under<Bound> as 
    Or<
      K extends Multiples<N, Bound> ? K : never, 
      Sieve[K]  extends true ? K : never
    >
  ]: true;
};
type Or<A, B> = A | B;

type Under<
  Bound extends number,
  N extends number = 0,
  Acc = never,
> = N extends Bound ? Acc : Under<Bound, Add<N, 1>, Acc | N>;

type Multiples<
  K extends number,
  Bound extends number,
  N extends number = Add<K, K>,
  Acc = never,
> = Compare<N, Bound> extends 'LT'
  ? Multiples<K, Bound, Add<N, K>, Acc | N>
  : Acc;

// https://dev.to/ecyrbe/how-to-unit-test-your-typescript-utility-types-3cnm
type Assert<T, U> = (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U
  ? 1
  : 2
  ? true
  : `${Show<T>} != ${Show<U>}`;

type Show<T> = T extends number | bigint | boolean | string
  ? T
  : T extends Array<any>
  ? ShowArray<T>
  : 'record';

type ShowArray<T extends any[], Acc extends string = ''> = T extends [
  infer Head,
  ...infer Tail,
]
  ? ShowArray<Tail, Acc extends '' ? Show<Head> : `${Acc}, ${Show<Head>}`>
  : `[${Acc}]`;


true satisfies Assert<PrimesUnder<3>, [2]>;
true satisfies Assert<PrimesUnder<5>, [2,3]>;
true satisfies Assert<PrimesUnder<16>, [2,3,5,7,11,13]>;
true satisfies Assert<GCD<28, 35>, 7>;
true satisfies Assert<Add<3, 4>, 7>;
true satisfies Assert<Subtract<5, 3>, 2>;
true satisfies Assert<Under<3>, 0 | 1 | 2>;
true satisfies Assert<
  MarkSieve<10, 3, {4: true}>,
  { 4: true; 6: true; 9: true; }
>;
true satisfies Assert<Length<PrimesUnder<509>>, 96>;

type testMaxBound = PrimesUnder<512>;
