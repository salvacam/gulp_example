/* File: gulpfile.js */
var gulp = require('gulp');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var gutil = require('gulp-util');

var minifyCSS = require('gulp-minify-css');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var htmlreplace = require('gulp-html-replace');

var babel = require("gulp-babel");

var ghPages = require('gulp-gh-pages');

gulp.task('copy', function() {
  gutil.log('Gulp is copy resources!');
  gulp.src([
    '*fonts/**/*',
    '*img/**/*',
  ])
  .pipe(gulp.dest('build/'));
});

gulp.task('copyFolder', function() {
  gutil.log('Gulp is copy resources!');
  gulp.src([
    './build/**/*'
  ])
  .pipe(gulp.dest('docs/'));
});

gulp.task('deploy', function() {
  gutil.log('Gulp is copy to gh-page!');
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});


gulp.task('minifyCSS', function () {
	gutil.log('Gulp is minify CSS!');

	gulp.src('./css/*.css')
		.pipe(minifyCSS({keepSpecialComments: 0}))
		.pipe(concat('styles.min.css'))
		.pipe(gulp.dest('./build/css/'));
});

gulp.task('minifyJS', function () {
	gutil.log('Gulp is minify JS!');

	gulp.src(['./js/lib/*.js', './js/main.es5.js'])
		.pipe(uglify({
			compress: {
				drop_console: true
			}
		}))
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest('./build/js/'));
});
 
gulp.task('replace', function() {
  gutil.log('Gulp is replace paths!');
  gulp.src('index.html')
    .pipe(htmlreplace({
        'css': './css/styles.min.css',
        'js': './js/main.min.js'
    }))
    .pipe(gulp.dest('build/'));
});


var inputSASS = './scss/*.scss';
var outputSASS = './css/';

gulp.task('sass', function () {
	gutil.log('Compile CSS!');
	return gulp
		// Find all `.scss` files from the `stylesheets/` folder
    .src(inputSASS)
		.pipe(sourcemaps.init())
    // Run Sass on those files
    .pipe(sass({outputStyle: 'expanded'}))
		.pipe(sourcemaps.write())
    // Write the resulting CSS in the output folder
    .pipe(gulp.dest(outputSASS));
});

gulp.task('babel', function () {
  gulp.src(['!./js/main.es5.js', './js/*.js'])
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify({
			compress: {
				drop_console: true
			}
		}))
    .pipe(concat('main.es5.js'))
    .pipe(gulp.dest('./js'));
});

// create a default task and just log a message
//gulp.task('default',['copy', 'minifyCSS', 'minifyJS', 'replace', 'copyFolder'], function() {
gulp.task('default',['copy', 'minifyCSS', 'minifyJS', 'replace', 'deploy'], function() {  
  gutil.log('Gulp is running!');
});

gulp.task('watch', ['sass', 'babel'], function () {
	gutil.log('Gulp is watching!');
	gulp.watch('./scss/*.scss', ['sass']);
	gulp.watch('./js/*.js', ['babel']);
});