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
			{count > 3 ? <p>count is greater than 3</p> : ""}
			<button onclick={() => setCount((p) => p + 1)}>
				Click to increase count
			</button>
		</div>
	);
}

const component = <Counter startCount={0} />;

const container = document.getElementById("root");
TinyReact.render(component, container);
