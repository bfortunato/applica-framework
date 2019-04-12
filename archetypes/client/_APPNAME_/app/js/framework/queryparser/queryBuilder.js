import * as _ from "underscore";
import * as tokenizer from "./tokenizer";
import TokensWalker from "./tokensWalker";
import {
	TOKEN_BLOCK_START,
	TOKEN_BLOCK_END,
	TOKEN_EXPRESSION_START,
	TOKEN_EXPRESSION_END,
	TOKEN_FIELD,
	TOKEN_VALUE,
	TOKEN_KEYWORD_AND,
	TOKEN_KEYWORD_OR,
	TOKEN_KEYWORD_TO,
	TOKEN_KEYWORD_NOT,
	TOKEN_OPERATOR_COLON,
	SYMBOL_BLOCK_START,
	SYMBOL_BLOCK_END,
	SYMBOL_KEYWORD_AND,
	SYMBOL_KEYWORD_OR,
	SYMBOL_KEYWORD_TO,
	SYMBOL_OPERATOR_COLON,
	SYMBOL_OPERATOR_NOT,
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

function writeAnd(ref, filter, first) {
	writeBoolean(ref, filter, "AND", first);
}

function writeOr(ref, filter) {
	writeBoolean(ref, filter, "OR");
}

function writeBoolean(ref, filter, token, first = false) {
	if (_.isEmpty(filter.value)) {
		return;
	}

	if (!_.isArray(filter.value)) {
		return;
	}

	if (!first) {
		ref.query += "(";
	}
	let i = 0;
	for (let f of filter.value) {
		write(ref, f);

		if (i < filter.value.length - 1) {
			ref.query += " " + token + " ";
		}

		i++;
	}

	if (!first) {
		ref.query += ")";
	}

}

function writeNe(ref, filter) {
	if (_.isEmpty(filter.value)) {
		return;
	}

	ref.query += `NOT ${filter.property}:${filter.value}`;
}

function writeRange(ref, filter) {
	if (_.isEmpty(filter.value)) {
		return;
	}

	if (!_.isArray(filter.value)) {
		return;
	}

	const left = filter.value[0] ? filter.value[0] : "*";
	const right = filter.value[1] ? filter.value[1] : "*";

	ref.query += `${filter.property}:[${left} TO ${right}]`;
}

function writeSimple(ref, filter) {
	if (_.isEmpty(filter.value)) {
		return;
	}

	ref.query += `${filter.property}:${filter.value}`;
}

function write(ref, filter) {
	switch (filter.type) {
	case AND:
		writeAnd(ref, filter);
		break;
	case OR:
		writeOr(ref, filter);
		break;
	case NE:
		writeNe(ref, filter);
		break;
	case RANGE:
		writeRange(ref, filter);
		break;
	default:
		writeSimple(ref, filter);
	}
	
}

export function build(filters) {
	if (!_.isArray(filters)) {
		throw new Error("Filters must be an array of filters");
	}

	const ref = {query: ""};

	writeAnd(ref, {value: filters}, true);

	return ref.query;
}