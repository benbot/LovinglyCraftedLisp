import { Token, TokenType } from "./scanner.ts";

const enum RuleTypes {
  expression = "expression",
  item = "item",
  literal = "literal",
}

interface Statement {
  token: Token;
  rule: RuleTypes;
  subexpressions: Array<Statement>;
}

interface Atom {
  name: string;
}

type Literal = string | number;

function expression(tokens: Array<Token>) {
  switch (tokens[0].type) {
    case TokenType.LPAREN:
      return expression(tokens.slice(1));
    case TokenType.RPAREN:
    default:
      throw new Error("WOAH");
  }
}

function atom(tokens: Array<Token>) {
}

function parse(tokens: Array<Token>): Array<Statement> {
  return [];
}
