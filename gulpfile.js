'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
// var rimraf = require('rimraf');
var KarmaServer = require('karma').Server;
var eslint = require('gulp-eslint');
const build = require('./build/build');

const srcScriptsFolder = 'src';
const distScriptsFolder = 'dist';

gulp.task('lint', function () {
  gulp.src(
    [
      distScriptsFolder + '/link.js',
    ])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('reload', function () {
  gulp.src('src/**/*')
    .pipe($.connect.reload());
});

gulp.task('start:server', function () {
  $.connect.server({
    root: '.',
    livereload: true,
    port: 9009
  });
});

gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('default', ['dev', 'start:server'], function () {
  gulp.watch([srcScriptsFolder + '/**/*.js'],
    [
      'dev',
      'reload'
    ]);
});

gulp.task('dev', function () {
  build('dev');
});

gulp.task('lib', function () {
  build('prod');
});
