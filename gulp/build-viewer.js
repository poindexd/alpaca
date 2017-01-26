var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build-viewer', function(){
	return gulp.src([
		'js/swiperRepeat.js',
		'js/viewer.js',
	])
	.pipe(sourcemaps.init())
	.pipe(concat('alpaca-viewer.js'))
	.pipe(gulp.dest('dist/js'))
	.pipe(rename('alpaca-viewer.min.js'))
	.pipe(uglify().on('error', console.error.bind(console)))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('dist/js'))
	.pipe(connect.reload());
});