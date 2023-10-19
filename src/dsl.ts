type OpParser<Program extends string> =
  Program extends 
    `${infer Op extends string} ${infer A extends number} ${infer B extends number}`
  ? Op extends '+'
    ? Add<A, B>
    : Op extends '-'
      ? Subtract<A, B>
      : Op extends '*'
        ? Multiply<A, B>
        : Op extends '/'
          ? Divide<A, B>
          : Op extends '%'
            ? Remainder<A, B>
            : never
  : never;

true satisfies Assert<OpParser<"+ 3 4">, 7>;
true satisfies Assert<OpParser<"- 5 4">, 1>;
true satisfies Assert<OpParser<"* 5 4">, 20>;
true satisfies Assert<OpParser<"% 9 4">, 1>;
true satisfies Assert<OpParser<"/ 9 4">, 2>;

// polish interpreter
// type Interpret<Program extends string> = any;
//true satisfies Assert<Interpret<"(+ 3 4)">, 7>;

type AddStr<A extends string, B extends string> =
  A extends `${infer A1 extends number}.${infer A2}`
  ?  B extends `${infer B1 extends number}.${infer B2}`
    ? Align<A2, B2> extends [infer Len extends number, infer A3 extends number, infer B3 extends number]

      ? `${Add<Add<A1,B1>, Divide<Add<A3, B3>,10>>}.${Remainder<Add<A3, B3>,10>}`
      : Align<A2, B2>
    : 'failed b match'
  : 'failed a match';


true satisfies Assert<AddStr<"3.1", "4.5">, "7.6">;
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
type testlen = 'abc'['length'];

//type StrLen<foo extends string> = foo['length'];
type Align<A extends string, B extends string> =
  [NumDigits<A>, NumDigits<B>] extends [infer M extends number, infer N extends number]
  ? Subtract<M, N> extends infer R extends number
    ? [M, ParseInt<A>, ParseInt<`${B}${Repeat<R, '0'>}`>]
    : Subtract<N, M> extends infer R extends number
      ? [N, ParseInt<`${A}${Repeat<R, '0'>}`>, ParseInt<B>]
      : 'failure to subtract'
  : 'failure to match numDigits';
// 'stub' // [`${A}`,`${B}${Repeat<R, '0'>}`]
  

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

type Repeat<Amount extends number, T extends string, Count extends Num = Zero, Acc extends string = ''> =
  Amount extends Length<Count>
  ? Acc
  : Repeat<Amount, T, IncT<Count>, Append<T, Acc>>;

true satisfies Assert<Repeat<3, '.'>, '...'>;

type Append<A extends string | number, B extends string | number> = `${A}${B}`;

type IncT<Tuple extends Num> = Push<Unit, Tuple>;

type Push<T, Tuple extends any[]> = [...Tuple, T];
type Diff<A extends number, B extends number> = Or<Subtract<A, B>, Subtract<B,A>>;
type diff = Diff<3, 3>;
