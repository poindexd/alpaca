var gulp = require('gulp');
var forreach = require('gulp-foreach');
var inject = require('gulp-inject');
var webshot = require('gulp-webshot');


gulp.task('template-thumbnails', function(){
	return gulp.src('templates/*.pug')
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
			.pipe(webshot({
				dest: 'dist/thumbnails/' + template.name + '.jpg',
				root: 'gulp/_include/'
			}));

	}));

});