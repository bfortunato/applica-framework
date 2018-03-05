import * as tokenizer from "./tokenizer";
import * as parser from "./queryParser";
import * as builder from "./queryBuilder";

//console.log(parser.parse("(nome:bruno OR (nome daniela AND -nome:ma*ssi_mo)) AND (eta:[10 TO 20] OR altezza:1.97)"));
//console.log(parser.parse("(nome:bruno)"));
let query = "(nome:bruno OR cognome:fortunato AND (bruno:fortunato AND massimo:galangte)) AND eta:[7 TO 40] OR -fidanzata:daniela AND (azienda:applica OR NOT azienda:digimat)";
let filters = parser.parse(query);
let built = builder.build(filters);
console.log(built);

filters = parser.parse(built)
built = builder.build(filters)
console.log(built);

query = "nome:bruno";
filters = parser.parse(query)
built = builder.build(filters)
console.log(built);

filters = parser.parse(built)
built = builder.build(filters)
console.log(built);

query = "eta:[1 TO 20]";
filters = parser.parse(query)
built = builder.build(filters)
console.log(built);

filters = parser.parse(built)
built = builder.build(filters)
console.log(built);

query = "(nome:bruno OR cognome:fortunato) AND eta:[* TO 20]";
filters = parser.parse(query)
console.log(JSON.stringify(filters, null, 4));
built = builder.build(filters)
console.log(built);

filters = parser.parse(built)
built = builder.build(filters)
console.log(built);


query = 'modello:berg2.*';
console.log(JSON.stringify(tokenizer.tokenize(query), null, 4));
filters = parser.parse(query)
console.log(filters)
console.log(JSON.stringify(filters, null, 4));
built = builder.build(filters)
console.log(built);

filters = parser.parse(built)
built = builder.build(filters)
console.log(built);