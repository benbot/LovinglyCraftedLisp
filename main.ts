import { readLines } from "https://deno.land/std@0.135.0/io/mod.ts";
import { Token, tokenize } from "./scanner.ts";

const enum Errors {
  unimplemented = "unimplemented",
}

async function runFile(filename: string) {
  const file = await Deno.open(filename);
  const tokens: Array<Token> = [];
  for await (const l of readLines(file)) {
    tokenize(l).forEach((token) => tokens.push(token));
  }
  return tokens;
}

const runRepl = () => {
  while (true) {
    try {
      const line = prompt("=>") || "";
      if (line === "q") {
        Deno.exit(0);
      }
      const tokens = tokenize(line);
      console.log(tokens);
    } catch (e) {
      if (e.message === Errors.unimplemented) {
        console.log("this doesn't work yet");
      } else {
        throw e;
      }
    }
  }
};

while (true) {
  try {
    const fileToRun = Deno.args[0] === "run" ? Deno.args[1] : null;
    if (fileToRun) {
      await runFile(fileToRun);
      break;
    } else {
      runRepl();
    }
  } catch (e) {
    if (e.message === Errors.unimplemented) {
      console.log("ERROR: we don't support features yet");
    } else {
      console.log(e);
    }
  }
}
