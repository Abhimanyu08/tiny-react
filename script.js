/** @jsx  TinyReact.createElement*/
import TinyReact from "./tiny-react.js";

function Greeting({ name }) {
	return <p>Hello, {name}</p>;
}

function Counter({ startCount }) {
	const [count, setCount] = TinyReact.useState(startCount);
	return (
		<div>
			<span>{count}</span>
			<button onclick={() => setCount((p) => p + 1)}>
				Click to increase count
			</button>
		</div>
	);
}

const component = (
	<div>
		<p>hello</p>
		<p>hello world</p>
		<Counter startCount={0} />
	</div>
);

const container = document.getElementById("root");
TinyReact.render(component, container);
