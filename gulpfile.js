var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleancss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    composer = require('gulp-uglify/composer'),
    uglify_es = require('uglify-es'),
    watch = require('gulp-watch');

var minify = composer(uglify_es, console);

gulp.task('sass', function() {
  return gulp.src('./build/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('css-min', ['sass'], function() {
  return gulp.src('./dist/css/*.css')
    .pipe(cleancss())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('concat-js', function() {
  return gulp.src('./build/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('js-min', ['concat-js'], function() {
  return gulp.src('./dist/js/*.js')
    .pipe(minify({ mangle: true}))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('watch', function() {
  gulp.watch('./build/sass/**/*.scss', ['css-min']);
  gulp.watch('./build/js/*.js', ['js-min']);
});

gulp.task('default', ['css-min', 'js-min', 'watch']);