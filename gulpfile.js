var gulp = require('gulp');

var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var htmlhint = require("gulp-htmlhint");
var csslint = require('gulp-csslint');
var browserSync = require('browser-sync').create();

var bases = {
 app: 'app/',
 dist: 'dist/',
};

var paths = {
 scripts: ['js/**/*.js'],
 libs: ['components/jquery/dist/jquery.min.js', 
	'components/angular/angular.min.js', 
	'components/angular-animate/angular-animate.min.js',
	'components/angular-aria/angular-aria.min.js',
	'components/angular-material/angular-material.min.css',
	'components/angular-material/angular-material.min.js',
	'components/angular-messages/angular-messages.min.js',
 ],
 styles: ['css/**/*.css'],
 html: ['index.html', '404.html'],
 images: ['images/**/*.png'],
 extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// Delete the dist directory
gulp.task('clean', function() {
 return gulp.src(bases.dist)
 .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
 gulp.src(paths.scripts, {cwd: bases.app})
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(uglify())
 .pipe(concat('app.min.js'))
 .pipe(gulp.dest(bases.dist + 'js/'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
 gulp.src(paths.images, {cwd: bases.app})
 .pipe(imagemin())
 .pipe(gulp.dest(bases.dist + 'images/'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
 // Copy html
 gulp.src(paths.html, {cwd: bases.app})
 	.pipe(htmlhint())
 	.pipe(htmlhint.reporter())
 	.pipe(gulp.dest(bases.dist));

 // Copy styles
 gulp.src(paths.styles, {cwd: bases.app})
	.pipe(csslint())
    .pipe(csslint.reporter())
 	.pipe(gulp.dest(bases.dist + 'css'));

 // Copy lib scripts, maintaining the original directory structure
 gulp.src(paths.libs, {cwd: 'app/**'})
 .pipe(gulp.dest(bases.dist));

 // Copy extra html5bp files
 gulp.src(paths.extras, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));
});


gulp.task('copy-watch', ['clean', 'copy', 'scripts'], browserSync.reload);

// A development task to run anytime a file changes
gulp.task('browserfy-reload', ['clean', 'copy', 'scripts'], function() {
	browserSync.reload();
});

// Static server
gulp.task('serve', ['clean', 'scripts', 'imagemin', 'copy'], function() {
    browserSync.init({
        server: {
            baseDir: bases.dist
        }
    });
	gulp.watch('app/**/*', ['browserfy-reload']);
});

// Define the default task as a sequence of the above tasks
gulp.task('default', ['clean', 'scripts', 'imagemin', 'copy']);