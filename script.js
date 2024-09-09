/** @jsx  TinyReact.createElement*/
import TinyReact from "./tiny-react.js";

function Warning({ count }) {
	if (count === 0) return <p>start</p>;

	return null;
}

function Counter({ startCount }) {
	const [count, setCount] = TinyReact.useState(startCount);

	return (
		<div>
			<Warning count={count} />
			<span>{count}</span>
			<button onclick={() => setCount((p) => p + 1)}>
				Click to increase count
			</button>
		</div>
	);
}

const component = <Counter startCount={0} />;

const container = document.getElementById("root");
TinyReact.render(component, container);
