type AddF<A extends number, B extends number> =
  `${A}` extends `${infer A1 extends number}.${infer A2}`
  ? `${B}` extends `${infer B1 extends number}.${infer B2}`
    ? AddD<A2, B2> extends [infer Carry extends number, infer Dec extends number]
      ? `${Add<Add<A1,B1>, Carry>}.${Dec}` extends `${infer R extends number}`
        ? R
        : never
      : never
    : never
  : never;

true satisfies Assert<AddF<3.71, 4.5>, 8.21>;
true satisfies Assert<AddF<3.1, 4.5>, 7.6>;
true satisfies Assert<AddF<0.5, 0.99>, 1.49>;
true satisfies Assert<AddF<3.7, 4.5>, 8.2>;
true satisfies Assert<AddF<3.71, 4.5>, 8.21>;


type ParseInt<T extends string> =
  T extends `0${infer N}`
  ? ParseInt<N>
  : T extends `${infer N extends number}`
    ? N
    : undefined;

true satisfies Assert<ParseInt<"004">, 4>;
true satisfies Assert<ParseInt<"332">, 332>;
true satisfies Assert<ParseInt<"0abc">, undefined>;

// Why?
type arrayLength = ['a', 'b', 'c']['length'];
type stringLength = 'abc'['length'];

type AddD<A extends string, B extends string> =
  Align<A, B> extends [infer Len extends number, infer M extends number, infer N extends number]
  ? Add<M, N> extends infer R extends number
    ? Compare<NumDigits<R>, Len> extends 'GT'
      ? `${R}` extends `1${infer Rest extends number}`
        ? [1, Rest]
        : never
      : [0, R]
    : never
  : never;

true satisfies Assert<AddD<'99', '5'>, [1, 49]>
true satisfies Assert<AddD<'5', '99'>, [1, 49]>
true satisfies Assert<AddD<'50', '005'>, [0, 505]>
true satisfies Assert<AddD<'10', '001'>, [0, 101]>
  
type SafeSubtract<A extends number, B extends number> = 
  Tuple<A> extends [...infer U, ...Tuple<B>]
  ? Length<U>
  : undefined;

true satisfies Assert<SafeSubtract<5, 3>, 2>;
true satisfies Assert<SafeSubtract<2, 3>, undefined>;

type Align<A extends string, B extends string> =
  [NumDigits<A>, NumDigits<B>] extends [infer M extends number, infer N extends number]
  ? SafeSubtract<M, N> extends infer R extends number
    // @ts-ignore
    ? [M, ParseInt<A>, ParseInt<`${B}${Repeat<R, '0'>}`>]
    : SafeSubtract<N, M> extends infer R extends number
      ? [N, ParseInt<`${A}${Repeat<R, '0'>}`>, ParseInt<B>]
      : 'failure to subtract'
  : 'failure to match numDigits';
  

true satisfies Assert<Align<'999', '5'>, [3, 999, 500]>
true satisfies Assert<Align<'5', '999'>, [3, 500, 999]>
true satisfies Assert<Align<'50', '005'>, [3, 500, 5]>

type DivRem10<A extends number> =
  `${A}` extends `${infer L extends number}${infer D extends Digit}`
  ? { div: L, rem: D }
  : { div: 0, rem: A }

true satisfies Assert<DivRem10<43>, {div: 4, rem: 3}>
true satisfies Assert<DivRem10<3>, {div: 0, rem: 3}>

type SplitLeadDigit<A extends number> =
  `${A}` extends `${infer Lead extends Digit}${infer Rest}`
  ? { lead: Lead, rest: Rest }
  : never

true satisfies Assert<SplitLeadDigit<.3>, { lead: 0, rest: '.3' }>;
true satisfies Assert<SplitLeadDigit<3>, { lead: 3, rest: '' }>;
true satisfies Assert<SplitLeadDigit<30>, { lead: 3, rest: '0' }>;
true satisfies Assert<SplitLeadDigit<300>, { lead: 3, rest: '00' }>;
true satisfies Assert<SplitLeadDigit<445>, { lead: 4, rest: '45' }>;

type TNum = Unit[]
type TZero = []
type TOne = [Unit]

type Repeat<Amount extends number, T extends string, Count extends TNum = TZero, Acc extends string = ''> =
  Amount extends Length<Count>
  ? Acc
  : Repeat<Amount, T, IncT<Count>, Append<T, Acc>>;

true satisfies Assert<Repeat<3, '.'>, '...'>;
true satisfies Assert<Repeat<5, '-'>, Join<Tuple<5, '-'>, ''>>;

type Append<A extends string | number, B extends string | number> = `${A}${B}`;
type IncT<Tuple extends TNum> = Push<Unit, Tuple>;
type Push<T, Tuple extends any[]> = [...Tuple, T];