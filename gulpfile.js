'use strict'

const browserify   = require('browserify')
const babelify     = require('babelify')
const buffer       = require('vinyl-buffer')
const del          = require('del')
const gulp         = require('gulp')
const gutil        = require('gulp-util')
const source       = require('vinyl-source-stream')
const stylus       = require('gulp-stylus')
const uglify       = require('gulp-uglify')
const browserSync  = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const htmlmin      = require('gulp-htmlmin')
const nib          = require('nib')

gulp.task('default', ['build'])

gulp.task('clean', () => del.sync([ 'dist/**/*' ]))

gulp.task('stylus', () => {
  gulp.src('src/style/main.styl')
    .pipe(stylus({
        use: nib(),
        compress: gutil.env.dist
      }))
    .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
})

gulp.task('browserify', () => {
  return browserify({
      entries: 'src/js/main.js',
      debug: !gutil.env.dist
    })
    .transform(babelify.configure({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-commonjs']
    }))
    .bundle()
    .on('error', function(err) {
      console.log('Error:', err)
      this.emit('end')
    })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gutil.env.dist ? uglify() : gutil.noop())
    .pipe(gulp.dest('./dist'))
})

gulp.task('copy-files', () => {
  return gulp.src([
      'src/*.{png,ico}',
      'src/assets/**/*'
    ], { base: 'src' })
    .pipe(gulp.dest('dist'))
})

gulp.task('copy-html', () => {
  return gulp.src('src/*.html')
    .pipe(gutil.env.dist ? htmlmin({collapseWhitespace: true}) : gutil.noop())
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', ['build'], () => {
  browserSync.init({
    open: false,
    server: {
      baseDir: './dist'
    }
  })

  gulp.watch([
    'src/*.{html,json}',
    'src/assets/**/*'
  ], ['copy-files', 'copy-html'])

  gulp.watch('dist/*.{js,html}', browserSync.reload)

  gulp.watch('src/js/**/*.js', ['browserify'])
  gulp.watch('src/style/**/*.styl', ['stylus'])
})

gulp.task('build', ['clean', 'copy-files', 'copy-html', 'browserify', 'stylus'])
