var gulp = require('gulp');
var forreach = require('gulp-foreach');
var inject = require('gulp-inject');
var localScreenshots = require('gulp-local-screenshots');
var webshot = require('gulp-webshot');

gulp.task('template-thumbnails-helper', function(){
		return gulp.src('viewer/templates/*.pug')
	//For each template
	.pipe(forreach(function(stream, template){
		return gulp.src('gulp/_include/thumbnail.html')
			.pipe(inject(
				gulp.src([
					'dist/css/index.css'
				], {read: false})
			))
			.pipe(inject(
				gulp.src([
					'dist/js/alpaca-templates.js',
					'dist/js/alpaca-schemas.js',
					'dist/js/alpaca-viewer.min.js',
					], {read: false})
			))
			.pipe(inject(
				gulp.src([
					'gulp/_include/thumbnail.js'
					], {
						transform: function(path, file){
							console.log(template.name);
							return 'var THUMBNAIL_TEMPLATE=' + template.name;
						}
				})
			))
			.pipe(gulp.dest('gulp/temp/' + template.name + '.html'))

	}));

});


gulp.task('template-thumbnails', ['template-thumbnails-helper'], function(){
	return gulp.src('gulp/temp/*.html')
	.pipe(webshot({
				dest: 'thumbnails',
				filename: template.name,
				root: 'dist/thumbnails',
				siteType: 'html'
	}))
			/*
			.pipe(localScreenshots({
				suffix: template.name,
				folder: 'dist/thumbnails',
				protocol: 'html'
			}));
*/

});