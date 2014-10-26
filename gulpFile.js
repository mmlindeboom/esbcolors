var gulp = require('gulp'),
	sass = require('gulp-ruby-sass');

gulp.task('sass', function() {
	gulp.src('./sass/*.sass')
		.pipe(sass({style:'compressed'}))
		.pipe(gulp.dest('./public/css'));
});
