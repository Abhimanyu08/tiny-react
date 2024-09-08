function createElement(nodeName, attributes, ...children) {
	return {
		type: nodeName,
		props: {
			...attributes,
			children: children.map((child) =>
				typeof child === "object" ? child : createTextElement(child)
			),
		},
	};
}

function createTextElement(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: [],
		},
	};
}
let nextFiber = null;

let rootFiber = null;

function handleComponent(fiber) {
	let newChildren = fiber.type(fiber.props);
	console.log(
		"old children",
		fiber.alternate ? fiber.alternate.props.children : undefined
	);
	console.log("new children", newChildren);
	fiber.props.children = [newChildren];
}

function performWorkOnFiber(fiber) {
	// create a dom if the fiber doesn't have a dom yet
	if (typeof fiber.type === "function") {
		handleComponent(fiber);
	} else if (!fiber.dom) {
		fiber.dom = makeDom(fiber);
	}
	// make fibers for every child
	let index = 0;
	let previousSibling = null;
	for (let child of fiber.props.children) {
		let newFiber = {
			dom: null,
			props: child.props,
			parent: fiber,
			type: child.type,
		};

		if (index === 0) {
			fiber.child = newFiber;
		} else {
			previousSibling.sibling = newFiber;
		}

		previousSibling = newFiber;
		index++;
	}

	// return next unit of work

	// if it has a child, return that
	if (fiber.child) {
		return fiber.child;
	}

	// otherwise if it has a sibling return that
	if (fiber.sibling) {
		return fiber.sibling;
	}

	while (true) {
		fiber = fiber.parent;
		if (!fiber) return null;
		if (fiber.sibling) {
			return fiber.sibling;
		}
	}
}

function idleCallback(deadline) {
	while (deadline.timeRemaining() > 1 && nextFiber) {
		nextFiber = performWorkOnFiber(nextFiber);
		if (!nextFiber) {
			commitFiber(rootFiber);
		}
	}

	requestIdleCallback(idleCallback);
}

function commitFiber(fiber) {
	let parent = fiber.parent;
	if (parent && fiber.dom) {
		while (!parent.dom) {
			parent = parent.parent;
		}
		parent.dom.appendChild(fiber.dom);
	}
	let sibling = fiber.sibling;
	while (sibling) {
		commitFiber(sibling);
		sibling = sibling.sibling;
	}
	let child = fiber.child;
	if (child) {
		commitFiber(child);
	}
}

function render(element, container) {
	rootFiber = {
		dom: container,
		props: {
			children: [element],
		},
	};
	nextFiber = rootFiber;
}

function makeDom(fiber) {
	let node;

	if (fiber.type === "TEXT_ELEMENT") {
		node = document.createTextNode("");
	} else {
		node = document.createElement(fiber.type);
	}
	for (let key of Object.keys(fiber.props)) {
		if (key === "children") continue;

		node[key] = fiber.props[key];
	}
	return node;
}

function useState(intialValue) {
	let currentFiber = nextFiber;
	if (!Object.hasOwn(currentFiber, "state")) {
		currentFiber.state = intialValue;
	}
	const setState = (newValue) => {
		let newStateValue;
		if (typeof newValue === "function") {
			newStateValue = newValue(currentFiber.state);
		} else {
			newStateValue = newValue;
		}
		currentFiber.state = newStateValue;
		console.log(currentFiber);
		nextFiber = { ...currentFiber, alternate: currentFiber };
	};

	return [currentFiber.state, setState];
}

requestIdleCallback(idleCallback);

export default { createElement, render, useState };
