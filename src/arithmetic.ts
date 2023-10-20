type Digit = Under<10>;
type NumDigits<A extends string | number, Acc extends number = 0> =
  `${A}` extends `${Digit}${infer Rest}`
  ? NumDigits<Rest, Add<Acc, 1>>
  : Acc;

true satisfies Assert<NumDigits<'43'>, 2>;
true satisfies Assert<NumDigits<9999>, 4>;


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
