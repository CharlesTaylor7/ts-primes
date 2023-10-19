type Num = Unit[];
type Zero = [];
type One = [Unit]


type AddT<A extends Num, B extends Num> =
  [...A, ...B];

type SubtractT<A extends Num, B extends Num> = 
  A extends [...infer U, ...B]
  ? U
  : never;


type CompareT<A extends Num, B extends Num> = SubtractT<A, B> extends never
  ? 'LT'
  : A extends B
  ? 'EQ'
  : 'GT';

type RemainderT<A extends Num, B extends Num> = CompareT<A, B> extends 'LT'
  ? A
  : RemainderT<SubtractT<A, B>, B>;


type WheelT = Tuples<[4, 2, 4, 2, 4, 6, 2, 6 ]>;

type Tuples<A extends number[], Acc extends Num[] = []> =
  A extends [infer Head extends number, ...infer Tail extends number[]]
  ? Tuples<Tail, [...Acc, Tuple<Head>]>
  : Acc

type IncWheelIndexT<I> = RemainderT<AddT<I, One>, Tuple<WheelSize>>

type PrimesUnderT<
  Bound extends Num,
  N extends Num = Tuple<7>,
  I extends Num = Zero,
  Sieve extends Record<number, boolean> = {},
  Primes extends number[] = [2, 3, 5]
> = CompareT<N, Bound> extends 'LT'
  ? Sieve[Length<N>] extends true
    ? PrimesUnderT<Bound, AddT<N, WheelT[Length<I>]>, IncWheelIndexT<I>, Sieve, Primes>
    : PrimesUnderT<Bound, AddT<N, WheelT[Length<I>]>, IncWheelIndexT<I>, MarkSieveT<Bound, N, Sieve>, [...Primes, Length<N>]>
  : Primes;

type CapT<T, Bound extends Num, Acc extends Num[] = []> =
  T extends [infer Head extends Num, ...infer Tail]
  ? CompareT<Head, Bound> extends 'LT'
    ? CapT<Tail, Bound, [...Acc, Head]>
    : CapT<Tail, Bound, Acc>
  : Acc;

type MarkSieveT<
  Bound extends Num,
  N extends Num,
  Sieve extends Record<number, boolean>,
> = {
  [K in UnderT<Bound> as 
    Or<
      K extends MultiplesT<N, Bound> ? K : never, 
      Sieve[K] extends true ? K : never
    >
  ]: true;
};

type UnderT<
  Bound extends Num,
  N extends Num = Zero,
  Acc = never,
> = N extends Bound ? Acc : UnderT<Bound, AddT<N, One>, Acc | Length<N>>;

type MultiplesT<
  K extends Num,
  Bound extends Num,
  N extends Num = AddT<K, K>,
  Acc = never,
> = CompareT<N, Bound> extends 'LT'
  ? MultiplesT<K, Bound, AddT<N, K>, Acc | Length<N>>
  : Acc;


true satisfies Assert<PrimesUnderT<Tuple<20>>, [2, 3, 5, 7, 11, 13, 17, 19]>;

/*
true satisfies Assert<Length<PrimesUnder<509>>, 96>;

type testMaxBound = PrimesUnder<512>;
*/