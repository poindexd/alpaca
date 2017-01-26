var gulp = require('gulp');
var connect = require('gulp-connect');
var pug = require('gulp-pug');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var merge = require('gulp-merge');

gulp.task('compile-types', function(){
	return gulp.src('editor/types/*.pug')
		.pipe(pug())
		.pipe(templateCache(
			'alpaca-types.js',
			{
				transformUrl: function(url) {
	    		return 'alpaca-type-' + url.replace(/\.html$/, '')
				},
				standalone: true,
				module: 'alpacaTypes'
			}))
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload());
});