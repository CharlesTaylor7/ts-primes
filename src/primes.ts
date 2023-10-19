type Unit = null;
type Zero = []
type One = [Unit]

type Length<A extends any[]> = number & A['length'];

type Tuple<
  Size extends number,
  Type = Unit,
  Acc extends Type[] = Zero,
> = Length<Acc> extends Size ? Acc : Tuple<Size, Type, [...Acc, Type]>;

true satisfies Assert<Length<Tuple<999>>, 999>;


// https://softwaremill.com/developing-type-level-algorithms-in-typescript/#basic-algebra
type Add<A extends number, B extends number> = Length<
  [...Tuple<A>, ...Tuple<B>]
>;
true satisfies Assert<Add<3, 4>, 7>;


type Subtract<A extends number, B extends number> = 
  Tuple<A> extends [...infer U, ...Tuple<B>]
  ? Length<U>
  : never;
true satisfies Assert<Subtract<5, 3>, 2>;
true satisfies Assert<Subtract<2, 3>, never>;

type Compare<A extends number, B extends number> = 
  A extends B 
  ? 'EQ'
  : Tuple<A> extends [...any, ...Tuple<B>]
    ? 'GT'
    : 'LT'

true satisfies Assert<Compare<3,3>, 'EQ'>;
true satisfies Assert<Compare<3,4>, 'LT'>;
true satisfies Assert<Compare<6,4>, 'GT'>;

type Multiply<
  A extends number,
  B extends number,
  Acc extends number = 0,
> = 
  A extends 0 
  ? Acc 
  : Multiply<Subtract<A, 1>, B, Add<Acc, B>>;

type Divide<
  A extends number,
  B extends number,
  Acc extends number = 0,
> = 
  Compare<A, B> extends 'LT' 
  ? Acc 
  : Divide<Subtract<A, B>, B, Add<1, Acc>>;

type Remainder<A extends number, B extends number> = 
  Compare<A, B> extends 'LT'
  ? A
  : Remainder<Subtract<A, B>, B>;

type GCD<A extends number, B extends number> = 
  A extends 0
  ? B
  : Compare<A, B> extends 'GT'
    ? GCD<Subtract<A, B>, B>
    : GCD<Subtract<B, A>, A>;

true satisfies Assert<GCD<28, 35>, 7>;

type Wheel = [4, 2, 4, 2, 4, 6, 2, 6 ];
type WheelSize = Length<Wheel>;
type IncWheelIndex<I extends number> = Remainder<Add<I, 1>, WheelSize>
type InitialPrimes = [2, 3, 5];

type PrimesUnder<
  Bound extends number
> =
  Compare<Bound, 11> extends 'LT'
  ? Cap<InitialPrimes, Bound>
  : PrimesGo<Bound, 7, 0, {}, InitialPrimes>

true satisfies Assert<PrimesUnder<3>, [2]>;
true satisfies Assert<PrimesUnder<5>, [2,3]>;
true satisfies Assert<PrimesUnder<16>, [2, 3, 5, 7, 11, 13]>;
true satisfies Assert<Length<PrimesUnder<509>>, 96>;
  

type PrimesGo<
  Bound extends number,
  N extends number,
  I extends number,
  Sieve extends Record<number, boolean>,
  Primes extends number[]
> = Compare<N, Bound> extends 'LT'
  ? Sieve[N] extends true
    ? PrimesGo<Bound, Add<N, Wheel[I]>, IncWheelIndex<I>, Sieve, Primes>
    : PrimesGo<Bound, Add<N, Wheel[I]>, IncWheelIndex<I>, MarkSieve<Bound, N, Sieve>, [...Primes, N]>
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

true satisfies Assert<
  MarkSieve<10, 3, {4: true}>,
  { 4: true; 6: true; 9: true; }
>;

type Or<A, B> = A | B;

type Under<
  Bound extends number,
  N extends number = 0,
  Acc = never,
> = N extends Bound ? Acc : Under<Bound, Add<N, 1>, Acc | N>;

true satisfies Assert<Under<3>, 0 | 1 | 2>;

type Multiples<
  K extends number,
  Bound extends number,
  N extends number = Add<K, K>,
  Acc = never,
> = Compare<N, Bound> extends 'LT'
  ? Multiples<K, Bound, Add<N, K>, Acc | N>
  : Acc;

true satisfies Assert<Multiples<3, 10>, 6 | 9>