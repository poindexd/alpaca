var gulp = require('gulp');
var connect = require('gulp-connect');
var pug = require('gulp-pug');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var merge = require('gulp-merge');
var filter = require('gulp-filter');

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
		
		templateFooter: 'this.templates.splice(this.templates.indexOf("index"),1);});',
		
		standalone: false,
		module: 'alpacaTemplates'
	}
}

//For each set, compile all templates
gulp.task('compile-templates', function() {
	return merge(
					gulp.src('viewer/templates/*.pug')
						.pipe(pug().on('error', console.error.bind(console)))
						.pipe(templateCache('alpaca-templates.js', opts.compile).on('error', console.error.bind(console))),
					gulp.src('viewer/templates/*.pug')
						.pipe(templateCache('alpaca-templates-list.js', opts.list).on('error', console.error.bind(console)))
				)
				.pipe(concat('alpaca-templates.js').on('error', console.error.bind(console)))
				.pipe(gulp.dest('dist/js').on('error', console.error.bind(console)))
				.pipe(connect.reload());
});