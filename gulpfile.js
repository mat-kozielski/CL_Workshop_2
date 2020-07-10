const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
sass.compiler = require("sass");
const entryPath = ".";
function compileSass(done) {
    gulp
        .src("./" + entryPath + "/scss/main.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./" + entryPath + "/css"));
    done();
}
function reload(done) {
    browserSync.reload();
    done();
}
function watcher(done) {
    browserSync.init({
        server: "./" + entryPath + "/"
    });
    gulp.watch(
        "./" + entryPath + "/scss/**/*.scss",
        gulp.series(compileSass, reload)
    );
    gulp.watch("./" + entryPath + "/*.html", gulp.series(reload));
}
exports.default = gulp.parallel(compileSass, watcher);