var gulp = require('gulp')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')

gulp.task('bundle', function () {
	var b = browserify('./src/index.js', { debug: true })
	return b.bundle()
		.pipe(source('iwmn.js'))
		.pipe(gulp.dest('dist'))
})

gulp.task('compress', ['bundle'], function () {
	return gulp.src(['dist/*.js', '!dist/*.min.js'])
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
})

gulp.task('default', ['compress'])
