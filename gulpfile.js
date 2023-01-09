'use strict';

const { src, dest } = require('gulp');
const gulp = require('gulp');
const autoPrefixer = require('gulp-autoprefixer');
const cssBeautify = require('gulp-cssbeautify');
const removeComments = require('gulp-strip-css-comments');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const cssNano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const panini = require('panini');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();

const SRC_PATH = 'src/';
const DIST_PATH = 'dist/';

const PATH = {
  build: {
    html: DIST_PATH,
    styles: `${DIST_PATH}assets/styles/`,
    scripts: `${DIST_PATH}assets/scripts/`,
    images: `${DIST_PATH}assets/images`,
    fonts: `${DIST_PATH}assets/fonts`,
  },
  src: {
    html: SRC_PATH + '*.html',
    styles: `${SRC_PATH}assets/styles/*.scss`,
    scripts: `${SRC_PATH}assets/scripts/*.js`,
    images: `${SRC_PATH}assets/images/**/*.{jpeg,jpg,png,svg,gif,webp,ico,webmanifest,xml,json}`,
    fonts: `${SRC_PATH}assets/fonts/**/*.{eot,woff,woff2,ttf,svg}`,
  },
  watch: {
    html: SRC_PATH + '**/*.html',
    styles: `${SRC_PATH}assets/styles/**/*.scss`,
    scripts: `${SRC_PATH}assets/scripts/**/*.js`,
    images: `${SRC_PATH}assets/images/**/*.{jpeg,jpg,png,svg,gif,webp,ico,webmanifest,xml,json}`,
    fonts: `${SRC_PATH}assets/fonts/**/*.{eot,woff,woff2,ttf,svg}`,
  },
  clean: `./${DIST_PATH}`,
};
