// Polish
type Interpret<Program extends string> =
   any;
//true satisfies Assert<Interpret<"(+ 3 4)">, 7>;

type AddF<A extends string, B extends string> =
  A extends `${infer A1 extends number}.${infer A2 extends number}`
  ?  B extends `${infer B1 extends number}.${infer B2 extends number}`
    ? `${Add<Add<A1,B1>, Divide<Add<A2, B2>,10>>}.${Remainder<Add<A2, B2>,10>}`
    : never
  : never;

true satisfies Assert<AddF<"3.1", "4.5">, "7.6">;
true satisfies Assert<AddF<"3.7", "4.5">, "8.2">;
true satisfies Assert<AddF<"3.71", "4.5">, "8.21">;


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