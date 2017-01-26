
//https://github.com/pure180/gulp-pug-inheritance
//^Use this if gulp is taking a long time to compile pug.

var gulp = require('gulp');
var connect = require('gulp-connect');
var pug = require('gulp-pug');

var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var merge = require('gulp-merge');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var markdownDocs = require('gulp-markdown-docs');

//Require tasks in Gulp directory
require('require-dir')('./gulp');

// Start dev server
gulp.task('server', function() {
  connect.server({
    port: 8000,
    root: 'dist',
    livereload: true
  });
});

gulp.task('compile-docs-images', function(){
	return gulp.src('docs/img/*.png')
				.pipe(gulp.dest('dist/docs/img'));
})

gulp.task('compile-docs', ['compile-docs-images'], function(){
	return gulp.src('docs/**/*.md')
		.pipe(markdownDocs('index.html', {
			yamlMeta: 'use-paths',
			categorySort: 'rank',
			documentSort: 'rank',
			LayoutStylesheetUrl: false,
			stylesheetUrl: '../css/materialize.css'
		}))
		.pipe(gulp.dest('dist/docs'))
		.pipe(connect.reload());
})

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('pug', function(){
	return gulp.src('./pug/**/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('templates/*.pug', ['compile-templates']);
  gulp.watch('editor/types/*.pug', ['compile-types']);
  gulp.watch('editor/schemas/*.json', ['compile-schemas']);
  gulp.watch('pug/**/*.pug', ['pug']);
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['build-viewer', 'build-editor']);
  gulp.watch('docs/**/*.md', ['compile-docs']);
});

gulp.task('default', [
	'compile-templates',
	'compile-types',
	'compile-schemas',
	'compile-docs',
	'pug',
	'sass',
	'build-viewer',
	'build-editor',
	'server',
	'watch'
]);