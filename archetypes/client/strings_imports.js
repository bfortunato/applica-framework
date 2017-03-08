"use strict"

var glob = require("glob");
var fs = require("fs");

glob("**/*.js", function (er, files) {
  
	files.forEach(function(f) {
		var source = fs.readFileSync(f).toString();
		var expr = /import strings from (.+)/g
		var replaced = source.replace(expr, "import M from $1")
		if (replaced != source) {
			fs.writeFileSync(f, replaced);
			//console.log(replaced)
		}
	})

})