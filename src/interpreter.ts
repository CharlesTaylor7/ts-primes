type EvalOp<Op extends string, A extends number, B extends number> =
  Op extends '+'
  ? Add<A, B>
  : Op extends '-'
    ? Subtract<A, B>
    : Op extends '*'
      ? Multiply<A, B>
      : Op extends '/'
        ? Divide<A, B>
        : Op extends '%'
          ? Remainder<A, B>
          : `unknown operator: ${Op}`
  
true satisfies Assert<EvalOp<'+', 3, 4>, 7>;
true satisfies Assert<EvalOp<'-', 5, 4>, 1>;
true satisfies Assert<EvalOp<'*', 5, 4>, 20>;
true satisfies Assert<EvalOp<'/', 9, 4>, 2>;
true satisfies Assert<EvalOp<'%', 9, 4>, 1>;
true satisfies Assert<EvalOp<'#', 9, 4>, 'unknown operator: #'>;
true satisfies Assert<EvalOp<'.', 9, 4>, 'unknown operator: .'>;

type Operator = '+' | '-' | '*' | '%' | '/';

// interprets polish notation
type Interpret<Program extends string> =
  ParseInt<Program> extends infer N extends number
  ? N
  : Program extends `(${infer Inner})`
    ? Interpret<Inner>
    : Program extends `${infer Op extends Operator} ${infer Rest}`
      ? ParseRest<Rest> extends [infer A extends string, infer B extends string]
        ? EvalOp<Op, Interpret<A>, Interpret<B>>
        : never
      : never;

true satisfies Assert<Interpret<"5">, 5>;
true satisfies Assert<Interpret<"(+ 3 4)">, 7>;
true satisfies Assert<Interpret<"(- (+ 3 4) 7)">, 0>;
true satisfies Assert<Interpret<"(- (+ 2 3) (+ 1 2))">, 2>;
true satisfies Assert<Interpret<"(* 3 (+ 1 2))">, 9>;

type ParseRest<S extends string> =
  S extends `(${infer A}) (${infer B})`
  ? [A,B]
  : S extends `(${infer A}) ${infer B}`
    ? [A, B]
    :  S extends `${infer A} (${infer B})`
      ? [A, B]
      : S extends `${infer A} ${infer B}`
        ? [A, B]
        : undefined

true satisfies Assert<ParseRest<"(2) (4)">, ['2','4']>
true satisfies Assert<ParseRest<"2 4">, ['2','4']>
true satisfies Assert<ParseRest<"(+ 1 2) (4)">, ['+ 1 2','4']>
true satisfies Assert<ParseRest<"(+ 1 2) 4">, ['+ 1 2','4']>
true satisfies Assert<ParseRest<"4 (+ 1 2)">, ['4', '+ 1 2']>

type AddStr<A extends string, B extends string> =
  A extends `${infer A1 extends number}.${infer A2}`
  ?  B extends `${infer B1 extends number}.${infer B2}`
    ? AddD<A2, B2> extends [infer Carry extends number, infer Dec extends number]
      ? `${Add<Add<A1,B1>, Carry>}.${Dec}`
      : Align<A2, B2>
    : 'failed b match'
  : 'failed a match';


true satisfies Assert<AddStr<"3.1", "4.5">, "7.6">;
true satisfies Assert<AddStr<"0.5", "0.99">, "1.49">;
true satisfies Assert<AddStr<"3.7", "4.5">, "8.2">;
true satisfies Assert<AddStr<"3.71", "4.5">, "8.21">;

type ParseInt<T extends string> =
  T extends `0${infer N}`
  ? ParseInt<N>
  : T extends `${infer N extends number}`
    ? N
    : undefined;

true satisfies Assert<ParseInt<"004">, 4>;
true satisfies Assert<ParseInt<"332">, 332>;
true satisfies Assert<ParseInt<"0abc">, undefined>;


type AddF<A extends number, B extends number> =
  AddStr<`${A}`, `${B}`> extends `${infer R extends number}`
  ? R
  : never;
true satisfies Assert<AddF<3.71, 4.5>, 8.21>;

type Digit = Under<10>;

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
  
type Align<A extends string, B extends string> =
  [NumDigits<A>, NumDigits<B>] extends [infer M extends number, infer N extends number]
  ? Subtract<M, N> extends infer R extends number
    ? [M, ParseInt<A>, ParseInt<`${B}${Repeat<R, '0'>}`>]
    : Subtract<N, M> extends infer R extends number
      ? [N, ParseInt<`${A}${Repeat<R, '0'>}`>, ParseInt<B>]
      : 'failure to subtract'
  : 'failure to match numDigits';
  

true satisfies Assert<Align<'999', '5'>, [3, 999, 500]>
true satisfies Assert<Align<'5', '999'>, [3, 500, 999]>
true satisfies Assert<Align<'50', '005'>, [3, 500, 5]>


type NumDigits<A extends string | number, Acc extends number = 0> =
  `${A}` extends `${Digit}${infer Rest}`
  ? NumDigits<Rest, Add<Acc, 1>>
  : Acc;

true satisfies Assert<NumDigits<'43'>, 2>;

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

type Repeat<Amount extends number, T extends string, Count extends Num = Zero, Acc extends string = ''> =
  Amount extends Length<Count>
  ? Acc
  : Repeat<Amount, T, IncT<Count>, Append<T, Acc>>;

true satisfies Assert<Repeat<3, '.'>, '...'>;

type Append<A extends string | number, B extends string | number> = `${A}${B}`;
type IncT<Tuple extends Num> = Push<Unit, Tuple>;
type Push<T, Tuple extends any[]> = [...Tuple, T];