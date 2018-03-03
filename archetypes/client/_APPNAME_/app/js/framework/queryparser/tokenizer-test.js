
import * as tokenizer from "./tokenizer";

console.log(tokenizer.tokenize("(nome:bruno OR (nome daniela AND -nome:ma*ssi_mo)) AND (eta:[10 TO 20] OR altezza:1.97)"));