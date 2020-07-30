const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
sass.compiler = require("sass");
const entryPath = "./scss/main.scss";
function compileSass(done) {
    gulp
        .src("./scss/main.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./css"));
    done();
}
function reload(done) {
    browserSync.reload();
    done();
}
function watcher(done) {
    browserSync.init({
        server: "./"
    });
    gulp.watch(
        "./scss/**/*.scss",
        gulp.series(compileSass, reload)
    );
    gulp.watch("./*.html", gulp.series(reload));
    gulp.watch(entryPath + "/js/*.js", gulp.series(reload));
}
exports.default = gulp.parallel(compileSass, watcher);