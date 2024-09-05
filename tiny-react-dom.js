function makeDom(element) {
	if (typeof element === "string") {
		const node = document.createTextNode(element);
		return node;
	}
	const node = document.createElement(element.type);
	for (let key of Object.keys(element.props)) {
		if (key === "children") continue;

		node.setAttribute(key, element.props[key]);
	}
	for (let child of element.props.children) {
		node.appendChild(makeDom(child));
	}
	return node;
}

function render(element, container) {
	container.appendChild(makeDom(element));
}

export default { render };
