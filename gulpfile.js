const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    pump = require('pump'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    del = require('del');    
    
gulp.task('sass', (cb) => { 
  pump([
    gulp.src('public/sass/**/*.+(sass|scss)'),
    sass(), 
    autoprefixer(),
    gulp.dest('public/stylesheets'), 
    browserSync.stream()
    ],
    cb
  );
});

gulp.task('browser-sync', () => 
    browserSync.init({
        proxy: 'localhost:8888',
        notify: false
    })
);

gulp.task('watch', ['browser-sync', 'sass'], () => {
  gulp.watch(['public/sass/**/*.+(sass|scss)'], ['sass']); 
  gulp.watch(['views/**/*.*', 'public/javascripts/**/*.js']).on('change', browserSync.reload);
});

gulp.task('scripts', (cb) => {
  pump([
        gulp.src('public/javascripts/*.js'),
        concat('all.min.js'),
        babel({
            presets: ['env']
        }),
        uglify(),
        gulp.dest('public/dist/')
    ],
    cb
  );
});

gulp.task('del', () => del.sync(['public/dist/**/*']));

gulp.task('build', ['del', 'scripts'], (cb) => { 
  pump([
    gulp.src('public/sass/**/*.+(sass|scss)'),
    sass({outputStyle: 'compressed'}), 
    autoprefixer(),
    gulp.dest('public/dist')
    ],
    cb
  );
});

gulp.task('default', ['watch'], () => {
  nodemon({
        script: 'bin/www',
        watch: ['bin/www', 'app.js', 'routes/'],
        ext: 'js'
    });
});
