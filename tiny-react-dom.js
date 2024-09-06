let nextUnitOfWork = {
	dom: null,
	props: null,
	parent: null,
	type: null,
	child: null,
};

function performUnitOfWork(unitOfWork) {
	// create a dom if the fiber doesn't have a dom yet
	if (!unitOfWork.dom) {
		unitOfWork.dom = makeDom(unitOfWork);
	}

	// attach the dom to the parent.
	if (unitOfWork.parent) {
		unitOfWork.parent.dom.appendChild(unitOfWork.dom);
	}

	// make fibers for every child
	let index = 0;
	let previousSibling = null;
	for (let child of unitOfWork.props.children) {
		let fiber = {
			dom: null,
			props: child.props,
			parent: unitOfWork,
			type: child.type,
		};

		if (index === 0) {
			unitOfWork.child = fiber;
		} else {
			previousSibling.sibling = fiber;
		}

		previousSibling = fiber;
		index++;
	}

	// return next unit of work

	// if it has a child, return that
	if (unitOfWork.child) {
		return unitOfWork.child;
	}

	// otherwise if it has a sibling return that
	if (unitOfWork.sibling) {
		return unitOfWork.sibling;
	}

	while (true) {
		unitOfWork = unitOfWork.parent;
		if (!unitOfWork) return null;
		if (unitOfWork.sibling) {
			return unitOfWork.sibling;
		}
	}
}

function idleCallback(deadline) {
	while (deadline.timeRemaining() > 1 && nextUnitOfWork) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
	}

	requestIdleCallback(idleCallback);
}

requestIdleCallback(idleCallback);

function render(element, container) {
	nextUnitOfWork = {
		dom: container,
		props: {
			children: [element],
		},
	};
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

// function render(element, container) {

// 	for (let child of element.props.children) {
// 		render(child, node);
// 	}
// 	container.appendChild(node);
// }

export default { render };
