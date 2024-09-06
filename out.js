/** @jsx  TinyReact.createElement*/
import TinyReact from "./tiny-react.js";
import TinyReactDom from "./tiny-react-dom.js";
const component = TinyReact.createElement("div", null, TinyReact.createElement("p", null, "hello ", TinyReact.createElement("strong", null, "world"), ". I am making a ", TinyReact.createElement("em", null, "tiny react")), TinyReact.createElement("details", null, TinyReact.createElement("summary", null, "open to know more"), "there's nothing more lol"));
console.log(component);
const container = document.getElementById("root");
TinyReactDom.render(component, container);

