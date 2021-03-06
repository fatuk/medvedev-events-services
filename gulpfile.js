var gulp = require('gulp');
var server = require('gulp-server-livereload');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var minifyCSS = require('gulp-minify-css');
var mainBowerFiles = require('main-bower-files');
var bowerFiles = mainBowerFiles();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

var buildPath = 'build';


/******************************
 * Default task
 ******************************/
gulp.task('default', [
	'browser-sync',
	'pluginsConcat',
	'jsConcat',
	'less',
	'watch'
]);

/******************************
 * Build task
 ******************************/
gulp.task('build', [
	'browser-sync',
	'pluginsConcat',
	'jsConcat',
	'less-min',
	'watch'
]);

/******************************
 * JS plugins
 ******************************/
gulp.task('pluginsConcat', function () {
	gulp.src(bowerFiles)
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js/'))
		.pipe(gulp.dest('build/js'));
});

/******************************
 * JS concat
 ******************************/
gulp.task('jsConcat', function () {
	gulp.src(['app/js/src/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('../js'))
		.pipe(gulp.dest('app/js/'))
		.pipe(gulp.dest('build/js'));
});

/******************************
 * Browser sync
 ******************************/
gulp.task('browser-sync', function () {
	var files = [
		'app/**/*.html',
		'app/js/**/*.js',
		'app/css/**/*.css'
	];

	browserSync.init(files, {
		server: {
			baseDir: './app'
		},
		open: false
	});
});

/******************************
 * Watch
 ******************************/
gulp.task('watch', function () {
	gulp.watch('app/less/*.less', ['less']);
	gulp.watch('app/js/src/**/*.js', ['jsConcat']);
});

/******************************
 * Less
 ******************************/
gulp.task('less', function () {
	gulp.src('app/less/services-styles.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('../css'))
		.pipe(gulp.dest('app/css'));
});

/******************************
 * Less min
 ******************************/
gulp.task('less-min', function () {
	gulp.src('app/less/app.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(minifyCSS({
			keepBreaks: false,
			keepSpecialComments: true,
			benchmark: false,
			debug: true
		}))
		.pipe(gulp.dest(buildPath + '/css'));
});
