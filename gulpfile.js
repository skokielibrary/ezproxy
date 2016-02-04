var gulp = require('gulp'), 
  sass = require('gulp-sass') ,
  cssnano = require('gulp-cssnano'),
  browserSync = require('browser-sync'),
  cp = require('child_process');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
      jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
  };

var config = {
    sass_path: 'src/_scss',
    css_path: 'src/public',
    js_src_path: 'src/public/assets/js/src',
    js_path: 'dist/public/assets/js',
    bower_dir: 'bower_components',
    node_dir: 'node_modules'
}

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });
});

/*gulp.task('sass', function () {
    return gulp.src(config.sass_path + '/styles.scss')
      .pipe(sass({ includePaths : [config.node_dir + '/normalize-scss/sass', config.sass_path] }).on('error', sass.logError))
      .pipe(cssnano())
      .pipe(gulp.dest(config.css_path))
      .pipe(browserSync.reload({stream:true}));
})*/

gulp.task('sass', function () {
  gulp.src(config.sass_path + '/styles.scss')
    .pipe(sass({
      includePaths: require('node-normalize-scss').with(config.sass_path)
    }))

    .pipe(gulp.dest('dist/public'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest(config.css_path));
});

//watch sass for changes
gulp.task('watch', function() {
  gulp.watch('src/_scss/*.scss', ['sass']);
  gulp.watch(['src/*.htm', 'src/*.html'], ['jekyll-rebuild']);
});

gulp.task('default', ['browser-sync', 'watch']);
