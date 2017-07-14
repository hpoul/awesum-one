var gulp = require("gulp");
var ts = require("gulp-typescript");
var shell  = require('gulp-shell');
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('buildrun', ['build', 'run']);

gulp.task('default', ['buildrun']);


gulp.task('run', ['build'], shell.task([
    'node dist/main.js'
]));

