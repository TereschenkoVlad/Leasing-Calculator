'use strict';

var gulp = require('gulp'),
    scss = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber');

var SASS_INCLUDE_PATHS = [
    './node_modules/normalize-scss/sass/',
    './node_modules/bootstrap-sass/assets/stylesheets/'
];
var LIB_JS_INCLUDE_PATHS = [
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
];

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('styles', function () {
    return gulp.src('./sass/main.scss')
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(sourcemaps.init())
        .pipe(scss({outputStyle: 'compressed', includePaths: SASS_INCLUDE_PATHS}))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest('./css'));
});

gulp.task('lib-js', function() {
    return gulp.src(LIB_JS_INCLUDE_PATHS)
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(sourcemaps.init())
        .pipe(babel({compact: true}))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js'));
});
gulp.task('js', function() {
    return gulp.src('./source-js/**/*.js')
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(sourcemaps.init())
        .pipe(babel({compact: true}))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js'));
});

gulp.task('watch', ['styles', 'js'], function () {
    gulp.watch('./sass/**/*.scss', ['styles']);
    gulp.watch('./source-js/**/*.js', ['js']);
});

gulp.task('default', ['lib-js', 'styles', 'js'], function () {

});