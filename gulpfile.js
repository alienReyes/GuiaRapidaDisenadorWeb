var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var compass = require('gulp-compass');
var mainBowerFiles=require('main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('Hello Zell!');
})

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('js', function() {
	return gulp.src(mainBowerFiles(/* options */), { base: '/bower_components' })
		.pipe(filter('*.js'))
		.pipe(concat('components.js'))
		.pipe(gulp.dest('app/js'));
});





gulp.task('compass', function () {
    gulp.src('app/scss/style.scss')
        .pipe(compass({
                sass: 'app/scss/',
                css:  'app/css/',
                image: '../images',
                style: 'expanded',
                require: ['susy', 'breakpoint']
            }))
        //.pipe(gulp.dest( outputDir + 'css'))
        .pipe(browserSync.reload({ // Reloading with Browser Sync
          stream: true
        }))
      })





// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['compass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'))
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// Cleaning
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['compass','browserSync','watch'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    ['compass', 'useref', 'images', 'fonts'],
    callback
  )
})
