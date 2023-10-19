// Polish
type Interpret<Program extends string> =
   any;
//true satisfies Assert<Interpret<"(+ 3 4)">, 7>;

type AdditionParser<Program extends string> =
  Program extends `(+ ${infer A extends number} ${infer B extends number})`
  ? Add<A, B>
  : 'addition parse error';

type SubtractionParser<Program extends string> =
  Program extends `(- ${infer A extends number} ${infer B extends number})`
  ? Subtract<A, B>
  : 'subtraction parse error';
  
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