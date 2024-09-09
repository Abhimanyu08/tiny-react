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
let deletions = [];

function handleComponent(fiber) {
	let newChildren = fiber.type(fiber.props);
	fiber.props.children = [newChildren];
}

function reconcileChildren(fiber) {
	let index = 0;
	let previousSibling = null;
	let alternateChild = fiber.alternate ? fiber.alternate.child : null;

	while (index < fiber.props.children.length || alternateChild) {
		const child = fiber.props.children[index];
		let tag = "";
		let dom = null;
		if (!alternateChild) {
			tag = "ADD";
		} else if (child) {
			if (alternateChild.type === child.type) {
				tag = "UPDATE";
				dom = alternateChild.dom;
			}
			if (alternateChild.type !== child.type) {
				tag = "ADD";
				deletions.push(alternateChild.dom);
			}
		} else if (!child) {
			deletions.push(alternateChild.dom);
		}
		if (child) {
			let newFiber = {
				dom,
				props: child.props,
				parent: fiber,
				type: child.type,
				alternate: alternateChild,
				tag,
			};

			if (index === 0) {
				fiber.child = newFiber;
			} else {
				previousSibling.sibling = newFiber;
			}

			previousSibling = newFiber;
		}
		index++;
		alternateChild = alternateChild?.sibling;
	}
}

function performWorkOnFiber(fiber) {
	// create a dom if the fiber doesn't have a dom yet
	if (typeof fiber.type === "function") {
		handleComponent(fiber);
	}
	fiber.dom = makeDom(fiber);
	// make fibers for every child
	reconcileChildren(fiber);
	// return next unit of work
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
			console.log(deletions);
			commitFiber(rootFiber);
		}
	}

	requestIdleCallback(idleCallback);
}

function commitFiber(fiber) {
	console.log(fiber);
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
	if (typeof fiber.type === "function") return null;
	let node = fiber.dom;
	// if fiber's tag is add, make a new node
	// if fiber's tag is update, update the current dom node

	if (!node) {
		if (fiber.type === "TEXT_ELEMENT") {
			node = document.createTextNode("");
		} else {
			node = document.createElement(fiber.type);
		}
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
		nextFiber = {
			...currentFiber,
			state: newStateValue,
			alternate: currentFiber,
			props: { ...currentFiber.props, children: [] },
		};
		currentFiber.parent.child = nextFiber;
	};

	return [currentFiber.state, setState];
}

requestIdleCallback(idleCallback);

export default { createElement, render, useState };
