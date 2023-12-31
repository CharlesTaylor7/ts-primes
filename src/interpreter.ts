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

type EvalRPN<Program extends string, Stack extends number[] = []> =
  IntParser<Program> extends [infer N extends number, infer Rest extends string]
  ? EvalRPN<Rest, [N, ...Stack]>
  : OpParser<Program> extends [infer Op extends Operator, infer Rest extends string]
    ? Stack extends [
        infer A extends number, 
        infer B extends number, 
        ...infer Stack extends number[]
      ]
      ? EvalRPN<Rest, [EvalOp<Op, B, A>, ...Stack]>
      : 'not enough on stack'
    : Stack extends [infer Result]
      ? Result
      : 'parse failure'

true satisfies Assert<EvalRPN<"3">, 3>;
true satisfies Assert<EvalRPN<"">, 'parse failure'>;
true satisfies Assert<EvalRPN<"+">, 'not enough on stack'>;
true satisfies Assert<EvalRPN<"3 3 +">, 6>;
true satisfies Assert<EvalRPN<"4 3 -">, 1>;
true satisfies Assert<EvalRPN<"4 5 * 4 -">, 16>;

type OpParser<T extends string> =
  LitParser<T, Operator>

true satisfies Assert<OpParser<"+ 1 2">, ['+', " 1 2"]>;
true satisfies Assert<OpParser<" + 1 2">, ['+', " 1 2"]>;
true satisfies Assert<OpParser<" +1 2">, ['+', "1 2"]>;
true satisfies Assert<OpParser<". 1 2">, undefined>;
true satisfies Assert<OpParser<"1 2">, undefined>;

type LitParser<T extends string, Lit extends string> =
  StripLeading<T, ' '> extends `${infer L extends Lit}${infer Rest}`
  ? [L, Rest]
  : undefined

type StripLeading<T extends string, C extends string> =
  T extends `${C}${infer Rest}`
  ? StripLeading<Rest, C>
  : T

type DigitParser<T extends string, Acc extends string = ''> =
  T extends `${infer D extends Digit}${infer Rest}`
  ? DigitParser<Rest, `${Acc}${D}`>
  : Acc extends ''
    ? undefined
    : [Acc, T]

type IntParser<T extends string> =
  DigitParser<StripLeading<T, ' '> > extends [infer N extends string, infer Rest]
  ? StripLeading<N, '0'> extends `${infer N extends number}`
    ? [N, Rest]
    : [0, Rest]
  : undefined

true satisfies Assert<IntParser<"023 + 1 2">, [23, " + 1 2"]>;
true satisfies Assert<IntParser<"0 ">, [0, " "]>;
true satisfies Assert<IntParser<"0 0 0">, [0, " 0 0"]>;
true satisfies Assert<IntParser<" 00">, [0, ""]>;
true satisfies Assert<IntParser<"23 + 1 2">, [23, " + 1 2"]>;
true satisfies Assert<IntParser<" 23 + 1 2">, [23, " + 1 2"]>;
true satisfies Assert<IntParser<"  + 1 2">, undefined>;

type AsInt<N extends number> = IntParser<`${N}`> extends [N, ""] ? N : never;
true satisfies Assert<AsInt<3.14>, never>;
true satisfies Assert<AsInt<3>, 3>;

type Join<T extends string[], Sep extends string, Acc extends string = ''> = 
  T extends [infer Head extends string, ...infer Tail]
  ? ShowJoin<Tail, Sep, Acc extends '' ? Head : `${Acc}${Sep}${Head}`>
  : Acc;

type Split<T extends string, Sep extends string, Acc extends string[] = []> = 
  T extends `${infer Item}${Sep}${infer Rest}`
  ? Split<Rest, Sep, [...Acc, Item]>
  : [...Acc, T];

true satisfies Assert<Split<"3,2,1,", ",">, ["3","2","1",""]>

type StrToken = Operator | '(' | ')'
type Token = number | StrToken
type Tokenize<T extends string, Acc extends Token[] = []> =
  T extends ''
  ? Acc
  : LitParser<T, StrToken> extends [
      infer Token extends StrToken, 
      infer Rest extends string
    ]
    ? Tokenize<Rest, [...Acc, Token]>
    : IntParser<T> extends [infer Num extends number, infer Rest extends string]
      ? Tokenize<Rest, [...Acc, Num]>
      : undefined;


true satisfies Assert<Tokenize<" 34  +43 ) ( ( *">, [34, "+", 43, ")", "(", "(", "*"]>;

// type Split<
// TODO: 
// - RPN evaluator
// - Eval infix notation
// - Eval Polish Notation
// shunting yard
// https://www.andreinc.net/2010/10/05/converting-infix-to-rpn-shunting-yard-algorithm
// interprets polish notation
/*
type Shunt<Program extends string> =
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
*/