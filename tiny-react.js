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

export default { createElement };
