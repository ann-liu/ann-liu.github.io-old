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
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./css'));
});

gulp.task('css-min', ['sass'], function() {
  return gulp.src('css/*.css')
    .pipe(cleancss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css'));
});

gulp.task('concat-js', function() {
  return gulp.src('./js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./js-min'));
});

gulp.task('js-min', ['concat-js'], function() {
  return gulp.src('./js-min/*.js')
    .pipe(minify({ mangle: true}))
    .pipe(gulp.dest('./js-min'))
});

gulp.task('watch', function() {
  gulp.watch('./sass/**/*.scss', ['css-min']);
  gulp.watch('./js/*.js', ['js-min']);
});

gulp.task('default', ['watch']);