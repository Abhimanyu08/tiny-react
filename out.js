/** @jsx  TinyReact.createElement*/
import TinyReact from "./tiny-react.js";
function Warning({
  count
}) {
  if (count === 0) return TinyReact.createElement("p", null, "start");
  return null;
}
function Counter({
  startCount
}) {
  const [count, setCount] = TinyReact.useState(startCount);
  return TinyReact.createElement("div", null, TinyReact.createElement(Warning, {
    count: count
  }), TinyReact.createElement("span", null, count), TinyReact.createElement("button", {
    onclick: () => setCount(p => p + 1)
  }, "Click to increase count"));
}
const component = TinyReact.createElement(Counter, {
  startCount: 0
});
const container = document.getElementById("root");
TinyReact.render(component, container);

