/** @jsx  TinyReact.createElement*/
import TinyReact from "./tiny-react.js";
import TinyReactDom from "./tiny-react-dom.js";

const profile = (
	<p>
		hello <strong>world</strong>
	</p>
);

console.log(profile);
const container = document.getElementById("root");
TinyReactDom.render(profile, container);
