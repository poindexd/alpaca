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
		'editor/js/ng/ui-router.js',
		'editor/js/ng/jsonata.js',
		'editor/js/ng/codemirror.js',
		'editor/js/ng/ui-codemirror.js',
		'editor/js/ng/cm-jsonata.js',
		'editor/js/ng/dirPagination.js',
		'editor/js/ng/ng-content-editable.js',
		'editor/js/alpaca-editor.js',
		'editor/js/config.js',
		'editor/js/directives/alpaca-field.js',
		'editor/js/controllers/collections-controller.js',
		'editor/js/controllers/settings-controller.js',
		'editor/js/controllers/demo-controller.js',
		'editor/js/controllers/auth-controller.js',
		'editor/js/device-preview.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('alpaca-editor.js'))
	.pipe(gulp.dest('dist/js'))
	.pipe(rename('alpaca-editor.min.js'))
	.pipe(uglify({
		showStack: true
	}).on('error', console.error.bind(console)))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('dist/js'))
	.pipe(connect.reload());
});
