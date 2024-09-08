/** @jsx  TinyReact.createElement*/
import TinyReact from "./tiny-react.js";
function Greeting({
  name
}) {
  return TinyReact.createElement("p", null, "Hello, ", name);
}
function Counter({
  startCount
}) {
  const [count, setCount] = TinyReact.useState(startCount);
  return TinyReact.createElement("div", null, TinyReact.createElement("span", null, count), TinyReact.createElement("button", {
    onclick: () => setCount(p => p + 1)
  }, "Click to increase count"));
}
const component = TinyReact.createElement("div", null, TinyReact.createElement("p", null, "hello"), TinyReact.createElement("p", null, "hello world"), TinyReact.createElement(Counter, {
  startCount: 0
}));
const container = document.getElementById("root");
TinyReact.render(component, container);

