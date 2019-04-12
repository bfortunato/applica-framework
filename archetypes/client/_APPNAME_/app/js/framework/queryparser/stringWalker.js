import * as _ from "underscore";

export default class StringWalker {

	constructor(string) {
		this.string = string;
		this.index = -1;
	}

	hasMore() {
		if (_.isEmpty(this.string)) {
			return false;
		}

		if (this.index >= this.string.length - 1) {
			return false;
		}

		return true;
	}

	finished() {
		if (_.isEmpty(this.string)) {
			return true;
		}

		if (this.index >= this.string.length) {
			return true;
		}

		return false;
	}

	next() {
		if (this.finished()) {
			return false;
		}

		this.index++;

		return this.string.charAt(this.index);
	}

	previous() {
		if (!this.index === 0) {
			return false;
		}

		this.index--;

		return this.string.charAt(this.index);
	}

	current() {
		if (_.isEmpty(this.string)) {
			throw new Error("index out of bounds");
		}

		if (this.index >= this.string.length) {
			throw new Error("index out of bounds");
		}

		return this.string.charAt(this.index);
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