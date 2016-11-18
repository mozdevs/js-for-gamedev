var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var eslint = require('gulp-eslint');

gulp.task('watch', ['test'], function () {
  gulp.watch('./src/**/*', ['test']);
  gulp.watch('./spec/**/*', ['test']);
});

gulp.task('lint', function () {
  gulp.src('./src/**/*')
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('test', ['lint'], function () {
  gulp.src('./spec/**/*')
    .pipe(jasmine({ includeStackTrace: true }));
});


gulp.task('default', ['test']);
