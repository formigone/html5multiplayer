var gulp = require('gulp');
var closureDeps = require('gulp-closure-deps');
var closureCompiler = require('gulp-closure-compiler');

var paths = {
    scripts: [
        'node_modules/closure-library/closure/goog/**/*.js',
        'src/**/*.js'
    ]
};

gulp.task('deps', function () {
    gulp.src(paths.scripts)
        .pipe(closureDeps({
            fileName: 'deps.js',
            prefix: '../../../..',
            baseDir: '.'
        }))
        .pipe(gulp.dest('.'));
});


gulp.task('build', function () {
    gulp.src(['main.js', 'src/**/*.js', 'node_modules/closure-library/closure/goog/**/*.js'])
        .pipe(closureCompiler({
            compilerPath: '/usr/local/google-closure/compiler.jar',
            fileName: '../game.min.js',
            compilerFlags: {
                closure_entry_point: 'rokko.main',
                compilation_level: 'ADVANCED_OPTIMIZATIONS',
                define: [
                    "goog.DEBUG=false"
                ],
                only_closure_dependencies: true,
                warning_level: 'VERBOSE',
                create_source_map: 'app.comp.js.map'
            }
        }));
});
