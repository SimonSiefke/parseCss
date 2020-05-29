enum State {
  Content = "Content",
  AfterSelector = "AfterSelector",
  AfterWhitespaceAfterSelector = "AfterWhitespaceAfterSelector",
  AfterOpeningCurlyBracket = "AfterOpeningCurlyBracket",
  AfterPropertyName = "AfterPropertyName",
  AfterPropertyColon = "AfterPropertyColon",
  AfterPropertyValue = "AfterPropertyValue",
  AfterClassDot = "AfterClassDot",
  AfterIdHash = "AfterIdHash",
  Comment = "Comment",
  AfterPropertyValueSemicolon = "AfterPropertyValueSemicolon",
  AfterSelectorComma = "AfterSelectorComma",
  AfterPseudoSelectorColon = "AfterPseudoSelectorColon",
  AfterPseudoSelector = "AfterPseudoSelector",
  AfterOpeningRoundBracket = "AfterOpeningRoundBracket",
  AfterOpeningSquareBracket = "AfterOpeningSquareBracket",
}

export enum TokenType {
  PropertyValueUnit = "PropertyValueUnit",
  Selector = "Selector",
  WhitespaceAfterSelector = "WhitespaceAfterSelector",
  OpeningCurlyBracket = "OpeningCurlyBracket",
  Whitespace = "Whitespace",
  PropertyName = "PropertyName",
  PropertyColon = "PropertyColon",
  PropertyNumericValue = "PropertyNumericValue",
  PropertyValue = "PropertyValue",
  ClosingCurlyBracket = "ClosingCurlyBracket",
  ClassDot = "ClassDot",
  ClassSelector = "ClassSelector",
  IdHash = "IdHash",
  IdSelector = "IdSelector",
  CommentStart = "CommentStart",
  Comment = "Comment",
  CommentEnd = "CommentEnd",
  PropertyValueSemicolon = "PropertyValueSemicolon",
  SelectorComma = "SelectorComma",
  PseudoSelectorColon = "PseudoSelectorColon",
  PseudoSelector = "PseudoSelector",
  OpeningRoundBracket = "OpeningRoundBracket",
  OpeningSquareBracket = "OpeningSquareBracket",
  ClosingSquareBracket = "ClosingSquareBracket",
  ClosingRoundBracket = "ClosingRoundBracket",
  AttributeSelector = "AttributeSelector",
}

export interface Token {
  readonly type: TokenType;
  readonly text: string;
}

export const parseCss: (text: string) => readonly Token[] = (text) => {
  const tokens: Token[] = [];
  let state: State = State.Content;
  let stateBeforeComment: State;
  let stateBeforeSquareBracket: State;
  let index = 0;
  let next: RegExpMatchArray | null;
  while (index < text.length) {
    switch (state) {
      case State.Content: {
        if ((next = text.slice(index).match(/^[a-zA-Z][a-zA-Z\d]*/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Selector,
            text: tokenText,
          });
          state = State.AfterSelector;
        } else if ((next = text.slice(index).match(/^\s+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Whitespace,
            text: tokenText,
          });
          state = State.Content;
        } else if ((next = text.slice(index).match(/^\/\*/))) {
          stateBeforeComment = state;
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.CommentStart,
            text: tokenText,
          });
          state = State.Comment;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.Comment: {
        if ((next = text.slice(index).match(/^\*\//))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.CommentEnd,
            text: tokenText,
          });
          state = stateBeforeComment;
        } else if ((next = text.slice(index).match(/^([^]+?)(?:\*\/)/))) {
          const tokenText = next[1];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Comment,
            text: tokenText,
          });
          state = State.Comment;
        } else if ((next = text.slice(index).match(/^([^]+)/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Comment,
            text: tokenText,
          });
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterSelector: {
        if ((next = text.slice(index).match(/^\s+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.WhitespaceAfterSelector,
            text: tokenText,
          });
          state = State.AfterWhitespaceAfterSelector;
        } else if ((next = text.slice(index).match(/^\./))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.ClassDot,
            text: tokenText,
          });
          state = State.AfterClassDot;
        } else if ((next = text.slice(index).match(/^\#/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.IdHash,
            text: tokenText,
          });
          state = State.AfterIdHash;
        } else if ((next = text.slice(index).match(/^,/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.SelectorComma,
            text: tokenText,
          });
          state = State.AfterSelectorComma;
        } else if ((next = text.slice(index).match(/^:/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PseudoSelectorColon,
            text: tokenText,
          });
          state = State.AfterPseudoSelectorColon;
        } else if ((next = text.slice(index).match(/^\{/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.OpeningCurlyBracket,
            text: tokenText,
          });
          state = State.AfterOpeningCurlyBracket;
        } else {
          index;
          text.slice(index); //?
          throw new Error("no");
        }
        break;
      }
      case State.AfterPseudoSelectorColon: {
        if ((next = text.slice(index).match(/^[a-zA-Z]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PseudoSelector,
            text: tokenText,
          });
          state = State.AfterPseudoSelector;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterSelectorComma: {
        if ((next = text.slice(index).match(/^\s+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Whitespace,
            text: tokenText,
          });
          state = State.AfterWhitespaceAfterSelector;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterIdHash: {
        if ((next = text.slice(index).match(/^[a-zA-Z]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.IdSelector,
            text: tokenText,
          });
          state = State.AfterSelector;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterClassDot: {
        if ((next = text.slice(index).match(/^[a-zA-Z\d]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.ClassSelector,
            text: tokenText,
          });
          state = State.AfterSelector;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterPseudoSelector: {
        if ((next = text.slice(index).match(/^\(/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.OpeningRoundBracket,
            text: tokenText,
          });
          state = State.AfterOpeningRoundBracket;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterOpeningRoundBracket: {
        if ((next = text.slice(index).match(/[/^\[/]/))) {
          stateBeforeSquareBracket = state;
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.OpeningSquareBracket,
            text: tokenText,
          });
          state = State.AfterOpeningSquareBracket;
        } else if ((next = text.slice(index).match(/^\)/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.ClosingRoundBracket,
            text: tokenText,
          });
          state = State.AfterSelector; //?
          text.slice(index); //?
        } else {
          text.slice(index); //?
          throw new Error("no");
        }
        break;
      }
      case State.AfterOpeningSquareBracket: {
        if ((next = text.slice(index).match(/^]/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.ClosingSquareBracket,
            text: tokenText,
          });
          stateBeforeSquareBracket;
          state = stateBeforeSquareBracket;
        } else if ((next = text.slice(index).match(/^[a-zA-Z]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.AttributeSelector,
            text: tokenText,
          });
          state = State.AfterOpeningSquareBracket;
        } else {
          text.slice(index, index + 10); //?
          index;
          console.log(tokens);
          throw new Error("no");
        }
        break;
      }
      case State.AfterWhitespaceAfterSelector: {
        if ((next = text.slice(index).match(/^{/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.OpeningCurlyBracket,
            text: tokenText,
          });
          state = State.AfterOpeningCurlyBracket;
        } else if ((next = text.slice(index).match(/^[a-zA-Z]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Selector,
            text: tokenText,
          });
          state = State.AfterSelector;
        } else if ((next = text.slice(index).match(/^,/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.SelectorComma,
            text: tokenText,
          });
          state = State.AfterSelectorComma;
        } else {
          text.slice(index, index + 5); //?
          throw new Error("no");
        }
        break;
      }
      case State.AfterOpeningCurlyBracket: {
        if ((next = text.slice(index).match(/^\s+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Whitespace,
            text: tokenText,
          });
          state = State.AfterOpeningCurlyBracket;
        } else if ((next = text.slice(index).match(/^[a-zA-Z\-\d]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyName,
            text: tokenText,
          });
          state = State.AfterPropertyName;
        } else if ((next = text.slice(index).match(/^\/\*/))) {
          stateBeforeComment = state;
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.CommentStart,
            text: tokenText,
          });
          state = State.Comment;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterPropertyName: {
        if ((next = text.slice(index).match(/^:/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyColon,
            text: tokenText,
          });
          state = State.AfterPropertyColon;
        } else if ((next = text.slice(index).match(/^\s+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Whitespace,
            text: tokenText,
          });
          state = State.AfterPropertyName;
        } else if ((next = text.slice(index).match(/^\/\*/))) {
          stateBeforeComment = state;
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.CommentStart,
            text: tokenText,
          });
          state = State.Comment;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterPropertyColon: {
        if ((next = text.slice(index).match(/^\s+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Whitespace,
            text: tokenText,
          });
          state = State.AfterPropertyColon;
        } else if ((next = text.slice(index).match(/^[a-zA-Z\-]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyValue,
            text: tokenText,
          });
          state = State.AfterPropertyValue;
        } else if ((next = text.slice(index).match(/^\d+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyNumericValue,
            text: tokenText,
          });
          state = State.AfterPropertyValue;
        } else if ((next = text.slice(index).match(/^\/\*/))) {
          stateBeforeComment = state;
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.CommentStart,
            text: tokenText,
          });
          state = State.Comment;
        } else {
          throw new Error("no");
        }
        break;
      }
      case State.AfterPropertyValue: {
        if ((next = text.slice(index).match(/^;/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyValueSemicolon,
            text: tokenText,
          });
          state = State.AfterPropertyValueSemicolon;
        } else if ((next = text.slice(index).match(/^\s+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Whitespace,
            text: tokenText,
          });
          state = State.AfterPropertyValue;
        } else if ((next = text.slice(index).match(/^}/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.ClosingCurlyBracket,
            text: tokenText,
          });
          state = State.Content;
        } else if ((next = text.slice(index).match(/^\/\*/))) {
          stateBeforeComment = state;
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.CommentStart,
            text: tokenText,
          });
          state = State.Comment;
        } else if ((next = text.slice(index).match(/^(%|px)/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyValueUnit,
            text: tokenText,
          });
        } else if ((next = text.slice(index).match(/^[a-zA-Z]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyValue,
            text: tokenText,
          });
          state = State.AfterPropertyValue;
        } else if ((next = text.slice(index).match(/^\d+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyNumericValue,
            text: tokenText,
          });
          state = State.AfterPropertyValue;
        } else {
          text.slice(index); //?
          throw new Error("no");
        }
        break;
      }
      case State.AfterPropertyValueSemicolon: {
        if ((next = text.slice(index).match(/^\s+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.Whitespace,
            text: tokenText,
          });
          state = State.AfterPropertyValueSemicolon;
        } else if ((next = text.slice(index).match(/^[a-zA-Z\d\-]+/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.PropertyName,
            text: tokenText,
          });
          state = State.AfterPropertyName;
        } else if ((next = text.slice(index).match(/^\/\*/))) {
          stateBeforeComment = state;
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.CommentStart,
            text: tokenText,
          });
          state = State.Comment;
        } else if ((next = text.slice(index).match(/^}/))) {
          const tokenText = next[0];
          index += tokenText.length;
          tokens.push({
            type: TokenType.ClosingCurlyBracket,
            text: tokenText,
          });
          state = State.Content;
        } else {
          text.slice(index, index + 10); //?
          throw new Error("no");
        }
        break;
      }
      default: {
        throw new Error("invalid state");
      }
    }
  }
  return tokens;
};

// const fs = require("fs");
// const path = require("path");
// const code = fs
//   .readFileSync(path.join(__dirname, "../fixtures/bootstrap.css"))
//   .toString();
// parseCss(code); //?

// for (let i = 0; i < 100000; i++) {
//   parseCss(`audio${Math.round(Math.random() * 100)} {
//     display: none;
//     height: 0;
//   }`); //?.
// }

// const r = parseCss(
//   `
//   h1 { font-size : 24px ; }
// `.repeat(1)
// ); //?

// if (!fs.existsSync("./out.json")) {
//   fs.writeFileSync("./out.json", JSON.stringify(r, null, 2));
// }
