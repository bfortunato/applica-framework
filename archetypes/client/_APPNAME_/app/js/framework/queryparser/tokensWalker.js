import * as _ from "underscore";

export default class TokensWalker {

	constructor(tokens) {
		this.tokens = tokens;
		this.index = -1;
	}

	hasMore() {
		if (_.isEmpty(this.tokens)) {
			return false;
		}

		if (this.index >= this.tokens.length - 1) {
			return false;
		}

		return true;
	}

	finished() {
		if (_.isEmpty(this.tokens)) {
			return true;
		}

		if (this.index >= this.tokens.length) {
			return true;
		}

		return false;
	}

	next() {
		if (this.finished()) {
			return false;
		}

		this.index++;

		return this.tokens[this.index];
	}

	previous() {
		if (!this.index === 0) {
			return false;
		}

		this.index--;

		return this.tokens[this.index];
	}

	current() {
		if (_.isEmpty(this.tokens)) {
			throw new Error("index out of bounds");
		}

		if (this.index >= this.tokens.length) {
			throw new Error("index out of bounds");
		}

		return this.tokens[this.index];
	}

	until(delimiter) {
		let str = "";

		let c = this.next();
		while (c && c !== delimiter) {
			str += c;
		}

		return str;
	}

}