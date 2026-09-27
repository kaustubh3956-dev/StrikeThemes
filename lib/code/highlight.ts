export type TokenType =
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "builtin"
  | "fn"
  | "punct"
  | "plain";

export interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "function",
  "const",
  "let",
  "var",
  "return",
  "if",
  "else",
  "for",
  "while",
  "new",
  "class",
  "await",
  "async",
  "of",
  "in",
  "true",
  "false",
  "null",
  "undefined",
]);

const BUILTINS = new Set(["Map", "Set", "console", "Math", "Array", "Object"]);

const PATTERN =
  /(\/\/[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([{}()[\].,;:+\-*/%<>=!&|?]+)/g;

/** Minimal JS tokenizer. Avoids pulling a highlighter dependency for one panel. */
export function highlight(code: string): Token[][] {
  return code.split("\n").map((line) => {
    const tokens: Token[] = [];
    let lastIndex = 0;
    PATTERN.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = PATTERN.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: "plain", value: line.slice(lastIndex, match.index) });
      }

      const [value, comment, str, num, ident, punct] = match;

      if (comment) tokens.push({ type: "comment", value });
      else if (str) tokens.push({ type: "string", value });
      else if (num) tokens.push({ type: "number", value });
      else if (ident) {
        const after = line[match.index + value.length];
        if (KEYWORDS.has(value)) tokens.push({ type: "keyword", value });
        else if (BUILTINS.has(value)) tokens.push({ type: "builtin", value });
        else if (after === "(") tokens.push({ type: "fn", value });
        else tokens.push({ type: "plain", value });
      } else if (punct) tokens.push({ type: "punct", value });

      lastIndex = match.index + value.length;
    }

    if (lastIndex < line.length) {
      tokens.push({ type: "plain", value: line.slice(lastIndex) });
    }

    return tokens;
  });
}

export const tokenColor: Record<TokenType, string> = {
  comment: "var(--fg-muted)",
  string: "var(--accent-electric)",
  number: "var(--accent-warm)",
  keyword: "var(--accent-blue)",
  builtin: "var(--accent-gold)",
  fn: "var(--accent)",
  punct: "var(--fg-tertiary)",
  plain: "var(--fg-secondary)",
};
