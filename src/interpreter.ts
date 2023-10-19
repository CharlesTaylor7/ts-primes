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
  IntParser<Program> extends [infer N extends number, infer Rest extends string]
  ? [N, Rest]
  : OpParser<Program> extends [infer Op extends Operator, infer Args extends string]
    ? Interpret<Args> extends [infer A extends number, infer Final extends string]
      ? Interpret<Final> extends [infer B extends number, infer Rest extends string]
        ? [EvalOp<Op, A, B>, Rest]
        : 'parse B failed'
      : 'parse A failed'
    : 'parse Op failed'

type testInterpret = Interpret<"- + 3 4 7">;
true satisfies Assert<Interpret<"5">, 5>;
true satisfies Assert<Interpret<"+ 3 4">, 7>;
true satisfies Assert<Interpret<"- + 3 4 7">, 0>;
true satisfies Assert<Interpret<"- + 2 3 + 1 2">, 2>;
true satisfies Assert<Interpret<"* 3 + 1 2">, 9>;

type OpParser<T extends string> =
  StripLeading<T, ' '> extends `${infer Op extends Operator} ${infer Rest}`
  ? [Op, Rest]
  : undefined

true satisfies Assert<OpParser<"+ 1 2">, ['+', "1 2"]>;
true satisfies Assert<OpParser<" + 1 2">, ['+', "1 2"]>;
true satisfies Assert<OpParser<". 1 2">, undefined>;
true satisfies Assert<OpParser<"1 2">, undefined>;

type StripLeading<T extends string, C extends string> =
  T extends `${C}${infer Rest}`
  ? StripLeading<Rest, C>
  : T

type DigitParser<T extends string, Acc extends string = ''> =
  T extends `${infer D extends Digit}${infer Rest}`
  ? DigitParser<Rest, `${Acc}${D}`>
  : Acc extends `${infer N extends number}`
    ? [N, T]
    : never;

type IntParser<T extends string> =
  DigitParser<StripLeading<T, '0' | ' '>>

true satisfies Assert<IntParser<"023 + 1 2">, [23, " + 1 2"]>;
true satisfies Assert<IntParser<"23 + 1 2">, [23, " + 1 2"]>;
true satisfies Assert<IntParser<" 23 + 1 2">, [23, " + 1 2"]>;
