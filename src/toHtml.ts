import { parseCss } from ".";
import * as fs from "fs";
import * as path from "path";

const code = `h1 {
  font-size: 24px;
  color: orangered;
  disabled: false;
}

`;

const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    span {
      white-space: pre;
        }
    .OpeningCurlyBracket {
      color: purple
    }
    .ClosingCurlyBracket {
      color: purple
    }
    .PropertyName {
      color: orange;
    }
    .Selector {
      color: dodgerblue;
    }
    .PropertyNumericValue {
      color: purple
    }
  </style>
</head>
<body>
  <textarea>
    ${code}
  </textarea>
  <hr>
  <div id="output">
  </div>
  <script>
    import {parseCss} from './index.ts'
    const update = () => {
      const code = document.querySelector('textarea').value
      const start = new Date().getTime()
      const tokens = parseCss(code);
      const end = new Date().getTime()
      console.log(code.length)
      console.log("took"+ (end-start)+"ms")
      const tags = tokens.map(
        (token) => \`<span class="\${token.type}">\${token.text}</span>\`
      );
      output.innerHTML = tags.join("")
    }
    document.querySelector('textarea').oninput = update
    update()
  </script>
</body>
</html>`;
setTimeout(() => {
  fs.writeFileSync(path.join(__dirname, "index.html"), html);
}, 1000);
