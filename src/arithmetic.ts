type Digit = Under<10>;
type NumDigits<A extends string | number, Acc extends number = 0> =
  `${A}` extends `${Digit}${infer Rest}`
  ? NumDigits<Rest, Add<Acc, 1>>
  : Acc;

true satisfies Assert<NumDigits<'43'>, 2>;
true satisfies Assert<NumDigits<9999>, 4>;

/* Comparison */
type Compare<A extends number, B extends number> = 
  A extends B 
  ? 'EQ'
  : CompareSmall<NumDigits<A>, NumDigits<B>> extends infer R
    ? R extends 'EQ'
      ? CompareDigits<`${A}`, `${B}`>
      : R
    : never;

true satisfies Assert<Compare<3,3>, 'EQ'>;
true satisfies Assert<Compare<3,4>, 'LT'>;
true satisfies Assert<Compare<6,4>, 'GT'>;
true satisfies Assert<Compare<300, 400>, 'LT'>;
true satisfies Assert<Compare<3000, 4000>, 'LT'>;
true satisfies Assert<Compare<5000, 5000>, 'EQ'>;
true satisfies Assert<Compare<5001, 5000>, 'GT'>;
true satisfies Assert<Compare<999_999_999, 999_888_888>, 'GT'>;
true satisfies Assert<Compare<9007199254740991, 9007199254740998>, 'LT'>

type CompareSmall<A extends number, B extends number> = 
  A extends B 
  ? 'EQ'
  : Tuple<A> extends [...any, ...Tuple<B>]
    ? 'GT'
    : 'LT'

true satisfies Assert<CompareSmall<3,3>, 'EQ'>;
true satisfies Assert<CompareSmall<3,4>, 'LT'>;
true satisfies Assert<CompareSmall<6,4>, 'GT'>;

type CompareDigits<A extends string, B extends string> =
  A extends `${infer A_Digit extends Digit}${infer A_Rest}`
  ? B extends `${infer B_Digit extends Digit}${infer B_Rest}`
    ? CompareSmall<A_Digit, B_Digit> extends infer R
      ? R extends 'EQ'
        ? CompareDigits<A_Rest, B_Rest>
        : R
      : never
    : never
  : never;

/* Restrict to ints */
type IntGuard<T extends number> =
  IntParser<`${T}`> extends [T, ""]
  ? T
  : never

/* Addition */
type AddInt<A extends number, B extends number> =
  AddIntImpl<Reverse<`${A}`>, Reverse<`${B}`>>
  
type test = [any] extends [never] ? 'never' : '43'
type testG = [IntGuard<43.3>];
true satisfies Assert<AddInt<43.2, 32>, never>
true satisfies Assert<AddInt<43, 32>, 75>
// TODO: Add digit by digit using AddSmall
type AddIntImpl<
  A extends string, 
  B extends string,
  Acc extends string = "",
  Carry extends boolean = false,
> =
  [FirstDigit<A>, FirstDigit<B>] extends [
    [infer DA extends Digit, infer A_Rest extends string], 
    [infer DB extends Digit, infer B_Rest extends string]
  ]
  ? (A_Rest | B_Rest) extends undefined
    ? AddDigits<DA, DB, Carry> extends [infer Carry extends boolean, infer Sum extends number]
      ? AddIntImpl<A_Rest, B_Rest, `${Sum}${Acc}`, Carry>
      : 'AddDigits match failure'
    : [Acc, A_Rest, B_Rest]
  : 'LastDigits match failure';

type Interpolatable = string | number | undefined;

type ToString<T extends Interpolatable> = 
  T extends string
  ? T
  : `${T}`

type FirstDigit<T extends string> =
  T extends `${infer D extends Digit}${infer Rest}`
  ? [D, Rest]
  : [0, undefined]

true satisfies Assert<FirstDigit<'undefined'>, [0, undefined]>;
true satisfies Assert<FirstDigit<"">, [0, undefined]>;
true satisfies Assert<FirstDigit<'32'>, [3, '2']>;
true satisfies Assert<FirstDigit<'3999'>, [3, '999']>;
true satisfies Assert<FirstDigit<'09'>, [0, '9']>;

true satisfies Assert<AddDigits<9, 9, false>, [true, 8]>;
true satisfies Assert<AddDigits<3, 9, false>, [true, 2]>;
// true satisfies Assert<Add<3000, 4000>, 7000>;
// true satisfies Assert<Add<7505, 2505>, 10010>;

type AddDigits<A extends Digit, B extends Digit, Carry extends boolean> =
  Length<[...Tuple<A>, ...Tuple<B>, ...Tuple<Carry extends true ? 1 : 0>]> extends infer Sum extends number
  ? `${Sum}` extends `${1}${infer Rem extends Digit}`
    ? [true, Rem]
    : [false, Sum]
  : never;
true satisfies Assert<AddDigits<0, 1, true>, [false, 2]>;
true satisfies Assert<AddDigits<9, 9, true>, [true, 9]>;
true satisfies Assert<AddDigits<9, 9, false>, [true, 8]>;
true satisfies Assert<AddDigits<3, 9, false>, [true, 2]>;


type BigTuple<
  Size extends bigint,
  Type = Unit
> =
  Tuple<BigIntToNum<Size>, Type>;

type AddBig<A extends bigint, B extends bigint> =
  Length<[...BigTuple<A>, ...BigTuple<B>]>;

type bigStr = `${33242n}`;


type BigIntToNum<T extends bigint> = 
  IntParser<`${T}`> extends [infer N extends number, ""]
  ? N
  : never

type Reverse<T extends string, Acc extends string = ''> =
  T extends `${infer Head}${infer Rest}`
  ? Reverse<Rest, `${Head}${Acc}`>
  : Acc

true satisfies Assert<Reverse<'abc'>, 'cba'>;