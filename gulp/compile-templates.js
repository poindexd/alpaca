var gulp = require('gulp');
var connect = require('gulp-connect');
var pug = require('gulp-pug');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var merge = require('gulp-merge');

var opts = {
	compile: {
		transformUrl: function(url) {
			return 'alpaca-template-' + url.replace(/\.html$/, '')
		},
		standalone: true,
		module: 'alpacaTemplates'
	},
	list: {
		transformUrl: function(url) {
			return url.replace(/\.pug$/, '')
		},
		templateHeader: 

		'angular.module("<%= module %>"<%= standalone %>)\
			.service("$templateList", function() { this.templates = [];',
		
		templateBody: 'this.templates.push("<%= url %>");',
		
		templateFooter: '});',
		
		standalone: false,
		module: 'alpacaTemplates'
	}
}

//For each set, compile all templates
gulp.task('compile-templates', function() {
	return merge(
					gulp.src('templates/*.pug')
						.pipe(pug())
						.pipe(templateCache('alpaca-templates.js', opts.compile)),
					gulp.src('templates/*.pug')
						.pipe(templateCache('alpaca-templates-list.js', opts.list))
				)
				.pipe(concat('alpaca-templates.js'))
				.pipe(gulp.dest('dist/js'))
				.pipe(connect.reload());
});