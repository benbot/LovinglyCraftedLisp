export const enum TokenType {
  RPAREN = "rparen",
  LPAREN = "lparen",
  ATOM = "atom",
  STRING = "string",
  NUMBER = "number",
  EOF = "eof",
}

export interface Token {
  type: TokenType;
  value?: string;
}

const atomTerminators = [
  "",
  " ",
  "\n",
  ")",
  "(",
];

function scanString(input: string, value = ""): Token {
  if (
    value.length > 1 && value[value.length - 1] === `"` &&
    value[value.length - 2] !== `\\`
  ) {
    return { type: TokenType.STRING, value } as Token;
  }
  value += input[0];
  return scanString(input.slice(1), value);
}

function scanNum(input: string, value = ""): Token {
  if (isNaN(parseInt(input[0]))) {
    if (input[0] === ".") {
      if (value.includes(".")) {
        throw new Error("num can only contain up to 1 '.'");
      }
    } else if (!isNaN(parseFloat(value))) {
      return { value, type: TokenType.NUMBER };
    }
  }

  value += input[0];
  return scanNum(input.slice(1), value);
}

function scanAtom(input: string, value = ""): Token {
  if (atomTerminators.includes(input[0])) {
    return {
      value,
      type: TokenType.ATOM,
    };
  }
  if (input.length === 1) {
    value += input;
    return {
      value,
      type: TokenType.ATOM,
    };
  }

  value += input[0];
  return scanAtom(input.slice(1), value);
}

export function tokenize(line: string): Array<Token> {
  const tokens: Array<Token> = [];

  let i = 0;
  do {
    let token: Token | undefined;
    switch (line[i]) {
      // single char lexemes
      case "(":
        token = {
          type: TokenType.LPAREN,
        };
        break;
      case ")":
        token = {
          type: TokenType.RPAREN,
        };
        break;
      case `"`:
        token = scanString(line.slice(i));
        break;
      default:
        if (line[i] === " ") {
          break;
        }
        if (!isNaN(parseInt(line[i]))) {
          token = scanNum(line.slice(i));
          break;
        }
        token = scanAtom(line.slice(i));
    }

    token && tokens.push(token);
    i += token?.value?.length || 1;
  } while (i < line.length);

  return tokens;
}
