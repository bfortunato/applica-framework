"use strict";

var argv = require('yargs').argv;
var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require('gulp-concat');
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var express = require("express");
var through2 = require("through2");
var path = require("path");
var fs = require("fs");

gulp.task("styles", function() {
    gulp.src("resources/sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("css/"))
    ;
});

gulp.task("scripts", function() {
    try {
        if (argv.debug) {
            gulp.src(["assets/jsx/**/*.jsx", "jsx/**/main.jsx"])
                .pipe(babel({presets: "es2015,react"}).on("error", function (e) {console.log(e.stack); }))
                .pipe(gulp.dest("assets/js/"));
        } else {
            gulp.src(["assets/jsx/**/*.jsx", "jsx/**/main.jsx"])
                .pipe(babel({presets: "es2015,react"}).on("error", function (e) {console.log(e.stack); }))
                .pipe(concat("combined.min.js"))
                .pipe(uglify())
                .pipe(gulp.dest("assets/js/"));
        }

    } catch (e) {
        console.error(e);
    }
});

gulp.task("server", function () {
    var app = express();

    app.use(express.static("."));

    var server = app.listen(8000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log("_APPNAME_ web server listening at http://%s:%s", host, port)

    })
});

gulp.task("run", ["build", "watch", "server"], function () {

});

gulp.task("build", ["styles", "scripts"]);

gulp.task("watch", ["build"], function() {
	gulp.watch(["assets/jsx/**/*.jsx", "assets/jsx/**/main.jsx"], ["scripts"]);
	gulp.watch("sass/**/*.scss", ["styles"]);
});


