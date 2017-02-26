var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build-editor', function(){
	return gulp.src([
		'editor/js/ng/angular-drag-and-drop-lists.js',
		'editor/js/ng/ng-flow-standalone.js',
		'editor/js/ng/angular-resizable.js',
		'editor/js/ng/ng-tags-input.js',
		'editor/js/ng/rzslider.js',
		'editor/js/editor.js',
		'editor/js/device-preview.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('alpaca-editor.js'))
	.pipe(gulp.dest('dist/js'))
	.pipe(rename('alpaca-editor.min.js'))
	.pipe(uglify().on('error', console.error.bind(console)))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('dist/js'))
	.pipe(connect.reload());
});