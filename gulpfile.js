// Require
var     gulp = require('gulp'),
        sass = require('gulp-sass'),
        jade = require('gulp-jade'),
      uglify = require('gulp-uglify'),
 browserSync = require('browser-sync'),
      reload = browserSync.reload,
      rename = require('gulp-rename');

// Scripts
gulp.task('scripts', function() {
  gulp.src(['src/*.js'])
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify().on('error', function() {console.log("---------------------------------------------ERROR")}))
    .pipe(gulp.dest('app/'))
    .pipe(reload({stream: true}));
});

// Styles
gulp.task('styles', function() {
  gulp.src(['src/*.sass'])
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('app/'))
    .pipe(reload({stream: true}));
});

// Markup
gulp.task('markup', function() {
  gulp.src(['src/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('app/'))
    .pipe(reload({stream: true}));
});

// Preview server
gulp.task('preview', function () {
  browserSync.init({
    server: { baseDir: "app/"},
    notify: false
  });
});

// Watching
gulp.task('watch', function() {
  gulp.watch('src/*.js', ['scripts']);
  gulp.watch('src/*.sass', ['styles']);
  gulp.watch('src/*.jade', ['markup']);
});

// Default tasks
gulp.task('default', ['scripts', 'styles', 'markup', 'preview', 'watch']);