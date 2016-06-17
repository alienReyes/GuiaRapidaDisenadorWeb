var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    bower = require('gulp-bower'),
    filter = require('gulp-filter'),
    order = require('gulp-order'),
    mainBowerFiles = require('main-bower-files'),
    bowerOverrides = require('gulp-bower-overrides'),
minifyCSS = require('gulp-minify-css'),
jsonminify = require('gulp-jsonminify'),
    path = require('path');

var env,
    jsSources,
    jsonSources,
    sassSources,
    htmlSources,
    outputDir,
    cssFiles,
    sassStyle;

var config = { 
    bowerDir: './src/_lib/' 
}

env = 'production';
if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
gulp.task('bower', function () { 
    return bower() .pipe(gulp.dest(config.bowerDir)) 
});



gulp.task('js', function () {
    jsSources = ['components/scripts/scripts.js'];
    gulp.src(mainBowerFiles().concat(jsSources))
        .pipe(filter('*.js'))
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload());
});



gulp.task('css', function () {
    cssFiles = ['src/css/*'];
    gulp.src(mainBowerFiles())
        .pipe(filter('*.css'))
        .pipe(order([
            'normalize.css',
            '*'
        ]))
        .pipe(concat('components.css'))
        .pipe(minifyCSS()) //this one is just for css
        .pipe(gulp.dest(outputDir + 'css'));
});







gulp.task('icons', function () { 
    return gulp.src(config.bowerDir + 'fontawesome/fonts/**.*') 
        .pipe(gulp.dest(outputDir + 'fonts')); 
});


gulp.task('materialFonts', function () { 
    return gulp.src(config.bowerDir + 'materialize/font/*/*.*') 
        .pipe(gulp.dest(outputDir + 'font')); 
});



gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
                sass: 'components/sass',
                css: outputDir + 'css',
                image: outputDir + 'images',
                style: sassStyle,
                require: ['susy', 'breakpoint']
            })
            .on('error', gutil.log))
        //.pipe(gulp.dest( outputDir + 'css'))
        .pipe(connect.reload())
}); +

gulp.task('watch', function () {
    gulp.watch(jsSources, ['js']);
    gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['compass']);
    gulp.watch(jsonSources, ['json'])
    gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    });
});



gulp.task('json', function () {
  jsonSources = ['components/scripts/data.json'];
        gulp.src(jsonSources)
      .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});







gulp.task('html', function () {
    gulp.src('builds/development/*.html')
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

// Copy images to production
gulp.task('move', function () {
    gulp.src('builds/development/images/**/*.*')
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
});
// Copy images to production
gulp.task('audioMove', function () {
    gulp.src('builds/development/audio/**/*.*')
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'audio')))
});

gulp.task('default', ['html', 'icons', 'materialFonts', 'css', 'js', 'compass','json', 'move','audioMove', 'connect', 'watch']);
