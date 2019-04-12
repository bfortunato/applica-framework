import * as _ from "underscore";
import * as tokenizer from "./tokenizer";
import TokensWalker from "./tokensWalker";
import {
	TOKEN_BLOCK_START,
	TOKEN_BLOCK_END,
	TOKEN_EXPRESSION_START,
	TOKEN_EXPRESSION_END,
	TOKEN_EXACT_STRING_START,
	TOKEN_EXACT_STRING_END,
	TOKEN_EXACT_STRING,
	TOKEN_FIELD,
	TOKEN_VALUE,
	TOKEN_KEYWORD_AND,
	TOKEN_KEYWORD_OR,
	TOKEN_KEYWORD_TO,
	TOKEN_OPERATOR_COLON,
	TOKEN_KEYWORD_NOT,
	SYMBOL_BLOCK_START,
	SYMBOL_BLOCK_END,
	SYMBOL_KEYWORD_AND,
	SYMBOL_KEYWORD_OR,
	SYMBOL_KEYWORD_TO,
	SYMBOL_OPERATOR_COLON,
	SYMBOL_KEYWORD_NOT,
	SYMBOL_OPERATOR_MINUS,
	SYMBOL_EXPRESSION_START,
	SYMBOL_EXPRESSION_END,
	SYMBOL_EXACT_STRING
} from "./tokens";


export const LIKE = "like"
export const GT = "gt"
export const NE = "ne"
export const GTE = "gte"
export const LT = "lt"
export const LTE = "lte"
export const EQ = "eq"
export const IN = "in"
export const NIN = "nin"
export const ID = "id"
export const OR = "or"
export const AND = "and"
export const RANGE = "range"
export const EXACT = "exact"


export class ParserError extends Error {
	constructor(walker, message) {
		super("At index " + (walker.index) + "\n" + message);
	}
}

let current =  null;
let previous = null;
let negate = false;

function setCurrent(value) {
	if (value !== current) {
		previous = current;
		current = value;
	}
}

function attachToParent(parent, child) {
	if (parent.property == null && parent.type == null) {
		parent.property = child.property;
		parent.type = child.type;
		parent.value = child.value;
	} else if (parent.type === OR || parent.type === AND) {
		if (parent.value == null) {
			parent.value = [];
		}

		parent.value.push(child);
	}
}

function blockStart(parent, walker) {
	setCurrent(parent);

	const t = walker.current();
	const filter = {property: null, type: OR, value: []};

	let closed = false;
	
	while (walker.next() && !closed) {
		if (block(filter, walker)) {
			closed = true;
			break;
		}
	}

	if (!closed) {
		throw new ParserError(walker, `Parser error: expected '${SYMBOL_BLOCK_END}'`);
	}

	attachToParent(parent, filter);

	if (filter.value.length === 1) {
		const unique = filter.value[0];
		filter.property = unique.property;
		filter.type = unique.type;
		filter.value = unique.value;
	}

	setCurrent(filter);
}

function block(parent, walker) {
	setCurrent(parent);

	const t = walker.current();

	if (t.type === TOKEN_BLOCK_END) {
		return true;
	} else {
		exec(parent, walker)
	}
}

function booleanStart(parent, walker, keyword) {
	setCurrent(parent);

	const t = walker.current();

	const left = previous;
	if (!left) {
		throw new ParserError(walker, "Parser error: Expected filter before conditions: " + keyword);
	}

	if (left.type !== keyword) {
		const filter = {
			type: keyword,
			property: null,
			value: [_.assign({}, left)]
		}

		_.assign(left, filter);
	}		

	walker.next();

	setCurrent(left);
	exec(left, walker);

	if (left.value.length === 1) {
		const unique = left.value[0];
		left.property = unique.property;
		left.type = unique.type;
		left.value = unique.value;
	}

	setCurrent(parent);
}

function fieldStart(parent, walker, negate = false) {
	setCurrent(parent);

	const t = walker.current();

	const possibleColon = walker.next();
	if (!possibleColon || possibleColon.type !== TOKEN_OPERATOR_COLON) {
		throw new ParserError(walker, "Parser error: Expected ':' after field declaration: " + t.value);
	}

	if (walker.finished()) {
		throw new ParserError(walker, "Parser error: Expected value for field: " + t.value);
	}
	walker.next();

	const filter = {type: (negate ? NE : EQ), property: t.value};
	
	valueStart(filter, walker);
	attachToParent(parent, filter);
	
	setCurrent(parent);
}

function valueStart(parent, walker) {
	setCurrent(parent);

	const t = walker.current();

	if (t.type === TOKEN_VALUE) {
		parent.value = t.value;

		if (t.value.indexOf("*") != -1) {
			parent.type = LIKE;
		}
	} else if (t.type === TOKEN_EXPRESSION_START) {
		const left = walker.next();
		const to = walker.next();
		const right = walker.next();
		const close = walker.next();

		if (!left || !to || !right || !close) {
			throw new ParserError("Bad expression. Use [{start TO end}] for field " + parent.property);
		}

		parent.type = RANGE;
		parent.value = [left.value, right.value];
	} else if (t.type === TOKEN_EXACT_STRING_START) {
		const str = walker.next();
		const end = walker.next();
		if (!str || !end) {
			throw new ParserError("Unterminated exact string value found for field " + parent.property);
		}
		parent.type = EXACT;
		parent.value = str.value;
	} else {
		exec(parent, walker);
	}
}

function not(parent, walker) {
	walker.next();
	fieldStart(parent, walker, true);
}

function exec(parent, walker) {
	const t = walker.current();

	if (t.type === TOKEN_BLOCK_START) {
		blockStart(parent, walker);
	} else if (t.type === TOKEN_KEYWORD_AND) {
		booleanStart(parent, walker, AND);
	} else if (t.type === TOKEN_KEYWORD_OR) {
		booleanStart(parent, walker, OR);
	} else if (t.type === TOKEN_KEYWORD_NOT) {
		not(parent, walker);
	} else if (t.type === TOKEN_FIELD) {
		fieldStart(parent, walker);
	} else {
		throw new ParserError(walker, `Parser error: Unespected token ${t.value}`);
	}
}

export function parse(queryString) {
	const tree = {type: OR, value: null}
	let query = null;
	
	const tokens = tokenizer.tokenize(queryString);
	const walker = new TokensWalker(tokens);

	while (walker.next()) {
		exec(tree, walker);
	}

	if (tree.value.length === 1 && tree.value[0].type === AND) {
		return tree.value[0].value;
	} else {
		return tree.value
	}
}
