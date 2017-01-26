var gulp = require('gulp');
var connect = require('gulp-connect');
var pug = require('gulp-pug');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var merge = require('gulp-merge');
var json = require('gulp-json-transform');
var intercept = require('gulp-intercept');

var opts = {
	compile: {
		transformUrl: function(url) {
			return url.replace(/\.json$/, '')
		},
		templateHeader: 

		'angular.module("<%= module %>"<%= standalone %>)\
		.service("$schemas", function() { this.schemas = {',
		
		templateBody: '<%= url %>:<%= contents %>,',
		
		templateFooter: '}});',
		
		standalone: true,
		module: 'alpacaSchemas'
	}
}

gulp.task('compile-schemas', function() {
	return gulp.src('editor/schemas/*.json')
				.pipe(intercept(function(file){
					file.contents = new Buffer(JSON.stringify(JSON.parse(file.contents)));
					return file;
				}))
				.pipe(templateCache('alpaca-schemas.js', opts.compile))
				.pipe(gulp.dest('dist/js'))
				.pipe(connect.reload());
});