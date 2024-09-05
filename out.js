/** @jsx  TinyReact.createElement*/
import TinyReact from "./tiny-react.js";
import TinyReactDom from "./tiny-react-dom.js";
const profile = TinyReact.createElement("p", null, "hello ", TinyReact.createElement("strong", null, "world"));
console.log(profile);
const container = document.getElementById("root");
TinyReactDom.render(profile, container);

