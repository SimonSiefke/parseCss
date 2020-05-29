import * as s from "stylis";

for (let i = 0; i < 100000; i++) {
  s(
    ``,
    `audio${Math.round(Math.random() * 100)} {
    display: none;
    height: 0;
  }`
  ); //?.
}

s(``, `h1{color: dodgerblue}`); //?.
