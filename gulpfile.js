var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task("core", function () {
    return gulp.src("./src/core.js")
        .pipe(uglify())
        .pipe(rename("vbridge.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("providers", function () {
    return gulp.src([
            "./src/*.js",
            "!./src/core.js"
        ])
        .pipe(uglify())
        .pipe(rename(renameProvider))
        .pipe(gulp.dest("./dist"));
});

function renameProvider(path) {
    //Prepend vbridge to the provider filename
    path.basename = "vbridge-" + path.basename;
}

gulp.task("default", ["core", "providers"]);