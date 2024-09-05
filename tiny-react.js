function createElement(nodeName, attributes, ...children) {
	return {
		type: nodeName,
		props: {
			...attributes,
			children,
		},
	};
}

export default { createElement };
