import * as tokenizer from "./tokenizer";
import * as parser from "./queryParser";

//console.log(parser.parse("(nome:bruno OR (nome daniela AND -nome:ma*ssi_mo)) AND (eta:[10 TO 20] OR altezza:1.97)"));
//console.log(parser.parse("(nome:bruno)"));
const query = "(nome:bruno OR cognome:fortunato AND (bruno:fortunato AND massimo:galangte)) AND eta:[7 TO 40] OR -fidanzata:daniela AND (azienda:applica OR NOT azienda:digimat)";
console.log(JSON.stringify(tokenizer.tokenize(query), null, 4));
console.log(JSON.stringify(parser.parse(query), null, 4));