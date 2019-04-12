import * as _ from "underscore";
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
import StringWalker from "./stringWalker";


export class SyntaxError extends Error {
	constructor(walker, message) {
		super("At column " + (walker.index + 1) + "\n" + message);
	}
}


function isWhiteSpace(c) {
	return c === " ";
}

function isLetter(str) {
  return str.length === 1 && str.match(/[^\:\(\)\]\[-]/i);
}

function isNumber(str) {
  return str.length === 1 && str.match(/[0-9]/i);
}

function isFullNumber(str) {
	return !isNaN(parseFloat(str))
}

function isPoint(str) {
	return str === ".";
}

function mkToken(type, value) {
	return {type, value};
}

function blockStart(tokens, walker) {
	tokens.push(mkToken(TOKEN_BLOCK_START, SYMBOL_BLOCK_START));

	let closed = false;
	
	while (walker.next() && !closed) {
		if (block(tokens, walker)) {
			closed = true;
			break;
		}
	}

	if (!closed) {
		throw new SyntaxError(walker, `Syntax error: expected '${SYMBOL_BLOCK_END}'`);
	}

	tokens.push(mkToken(TOKEN_BLOCK_END, SYMBOL_BLOCK_END));

}

function block(tokens, walker) {
	const c = walker.current();

	if (c === SYMBOL_BLOCK_END) {
		return true;
	} else {
		exec(tokens, walker)
	}
}

function exactStringStart(tokens, walker) {
	tokens.push(mkToken(TOKEN_EXACT_STRING_START, SYMBOL_EXACT_STRING));

	const ref = {value: ""}

	let closed = false;
	
	while (walker.next() && !closed) {
		if (exactString(tokens, walker, ref)) {
			closed = true;
			break;
		}
	}

	if (!closed) {
		throw new SyntaxError(walker, `Syntax error: expected '${SYMBOL_EXACT_STRING}'`);
	}

	tokens.push(mkToken(TOKEN_EXACT_STRING, ref.value));
	tokens.push(mkToken(TOKEN_EXACT_STRING_END, SYMBOL_EXACT_STRING));
}

function exactString(tokens, walker, ref) {
	const c = walker.current();

	if (c === SYMBOL_EXACT_STRING) {
		return true;
	} else {
		ref.value += c;
	}
}

function stringStart(tokens, walker) {
	const ref = {value: ""}
	
	let closed = false;

	while (!walker.finished() && !closed) {
		if (string(tokens, walker, ref)) {
			closed = true;
			break;
		} else {
			walker.next();
		}
	}

	if (ref.value === SYMBOL_KEYWORD_AND) {
		tokens.push(mkToken(TOKEN_KEYWORD_AND, ref.value));
	} else if (ref.value === SYMBOL_KEYWORD_OR) {
		tokens.push(mkToken(TOKEN_KEYWORD_OR, ref.value));
	} else if (ref.value === SYMBOL_KEYWORD_TO) {
		tokens.push(mkToken(TOKEN_KEYWORD_TO, ref.value));
	} else if (ref.value === SYMBOL_KEYWORD_NOT) {
		tokens.push(mkToken(TOKEN_KEYWORD_NOT, ref.value));
	} else if (ref.value !== "") {
		tokens.push(mkToken(TOKEN_VALUE, ref.value));
	}

	return ref.value;
}

function string(tokens, walker, ref) {
	const c = walker.current();

	if (
		c === SYMBOL_BLOCK_START ||
		c === SYMBOL_BLOCK_END ||
		c === SYMBOL_EXPRESSION_START ||
		c === SYMBOL_EXPRESSION_END ||
		isWhiteSpace(c)
	) {
		walker.previous();
		return true;
	} else if (c === SYMBOL_EXACT_STRING) {
		exactStringStart(tokens, walker);
		return true;
	} else if (isLetter(c)) {
		ref.value += c;
	} else if (c === SYMBOL_OPERATOR_COLON) { 
		tokens.push(mkToken(TOKEN_FIELD, ref.value));
		tokens.push(mkToken(TOKEN_OPERATOR_COLON, SYMBOL_OPERATOR_COLON));
		ref.value = "";
	} else {
		exec(tokens, walker);
	}
}

function numberStart(tokens, walker) {
	const ref = {value: ""}
	
	let closed = false;

	while (!walker.finished() && !closed) {
		if (number(tokens, walker, ref)) {
			closed = true;
		} else {
			walker.next();
		}
	}
	
	tokens.push(mkToken(TOKEN_VALUE, ref.value));
	
	return ref.value;
}

function number(tokens, walker, ref) {
	const c = walker.current();

	if (
		c === SYMBOL_BLOCK_START ||
		c === SYMBOL_BLOCK_END ||
		c === SYMBOL_EXPRESSION_START ||
		c === SYMBOL_EXPRESSION_END ||
		c === SYMBOL_OPERATOR_COLON ||
		isLetter(c) ||
		isWhiteSpace(c)
	) {
		walker.previous();
		return true;
	} else if (isNumber(c) || isPoint(c) || c === SYMBOL_KEYWORD_NOT) {
		ref.value += c;
	} else {
		exec(tokens, walker);
	}
}

function expressionStart(tokens, walker) {
	tokens.push(mkToken(TOKEN_EXPRESSION_START, SYMBOL_EXPRESSION_START));

	let closed = false;
	
	while (walker.next() && !closed) {
		if (expression(tokens, walker)) {
			closed = true;
			break;
		}
	}

	if (!closed) {
		throw new SyntaxError(walker, `Query error: expected '${SYMBOL_EXPRESSION_END}'`);
	}

	tokens.push(mkToken(TOKEN_EXPRESSION_END, SYMBOL_EXPRESSION_END));

	//walker.next();
}

function expression(tokens, walker) {
	const c = walker.current();

	if (
		c === SYMBOL_BLOCK_START ||
		c === SYMBOL_BLOCK_END ||
		c === SYMBOL_EXPRESSION_START ||
		c === SYMBOL_OPERATOR_COLON
	) {
		throw new SyntaxError(walker, `Syntax error: unexpected token '${c}'`);
	} else if (c === SYMBOL_EXPRESSION_END) {
		return true;
	} else {
		exec(tokens, walker)
	}
}

function not(tokens, walker) {
	tokens.push(mkToken(TOKEN_KEYWORD_NOT, SYMBOL_KEYWORD_NOT));
}


function exec(tokens, walker) {
	const c = walker.current();
	
	if (isWhiteSpace(c)) {
		return;
	} else if (c === SYMBOL_BLOCK_START) {
		blockStart(tokens, walker);
	} else if (c === SYMBOL_EXPRESSION_START) {
		expressionStart(tokens, walker);
	} else if (c === SYMBOL_OPERATOR_MINUS) {
		not(tokens, walker);
	} else if (isLetter(c)) {
		stringStart(tokens, walker);
	} else {
		throw new SyntaxError(walker, `Syntax error: Unrecognized symbol '${c}'`);
	}
}

export function tokenize(queryString) {
	if (typeof(queryString) !== "string") {
		return [];
	}

	if (!_.isEmpty(queryString)) {
		queryString = queryString.trim();
	}

	if (_.isEmpty(queryString)) {
		return [];
	}

	const tokens = [];
	const walker = new StringWalker(queryString);

	while (walker.next()) {
		exec(tokens, walker);
	}

	return tokens;
}
