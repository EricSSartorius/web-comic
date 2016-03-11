var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

//Dev tasks

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('default', function () {
	return gulp.src('app/css/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist'));
})

gulp.task('stylus', function() {
  return gulp.src('app/styl/**/*.styl')
	.pipe(stylus())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}));  
})

gulp.task('watch', function (){
  gulp.watch('app/styl/**/*.styl', ['stylus']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/scripts/**/*.js', browserSync.reload);
})

//Optimization

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
  	interlaced: true
  })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
   return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

//Build Sequences

gulp.task('default', function(callback) {
  runSequence(['stylus', 'browserSync', 'watch'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    ['stylus', 'useref', 'images', 'fonts'],
    callback
  )
})
