/** @jsx  TinyReact.createElement*/
import TinyReact from "./tiny-react.js";
import TinyReactDom from "./tiny-react-dom.js";

const component = (
	<div>
		<p>
			hello <strong>world</strong>. I am making a <em>tiny react</em>
		</p>
		<details>
			<summary>open to know more</summary>
			there's nothing more lol
		</details>
	</div>
);

console.log(component);
const container = document.getElementById("root");
TinyReactDom.render(component, container);
