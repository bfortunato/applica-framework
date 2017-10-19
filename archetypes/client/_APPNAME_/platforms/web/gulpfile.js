"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var express = require("express");

gulp.task("styles", function() {
    gulp.src("resources/sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("resources/css/"))
    ;
});

// gulp.task("scripts", function() {
//     try {
//         var debug = argv.debug ? true : false;
//
//         gulp.src(["assets/jsx/**/*.jsx", "!assets/jsx/main.jsx"])
//             .pipe(babel({presets: "es2015,react"}).on("error", function (e) {console.log(e.stack); }))
//             .pipe(concat("combined.min.js"))
//             .pipe(gulpIf(!argv.debug, uglify()))
//             .pipe(gulp.dest("assets/js/"));
//
//         gulp.src("assets/jsx/main.jsx")
//             .pipe(babel({presets: "es2015,react"}).on("error", function (e) {console.log(e.stack); }))
//             .pipe(gulpIf(!argv.debug, uglify()))
//             .pipe(gulp.dest("assets/js/"));
//
//     } catch (e) {
//         console.error(e);
//     }
// });
//
gulp.task("server", function () {
    var app = express();

    app.use(express.static("."));

    var server = app.listen(8000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log("commodo web server listening at http://%s:%s", host, port)

    })
});


gulp.task("run", ["build", "watch", "server"])
gulp.task("build", ["styles"]);

gulp.task("watch", ["build"], function() {
	//gulp.watch(["assets/jsx/**/*.jsx"], ["scripts"]);
	gulp.watch("resources/sass/**/*.scss", ["styles"]);
});


