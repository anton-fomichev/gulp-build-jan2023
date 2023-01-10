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
const gulpRigger = require('gulp-rigger');
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

const html = () =>
  src(PATH.src.html, { base: SRC_PATH })
    .pipe(plumber())
    .pipe(dest(PATH.build.html));

const styles = () =>
  src(PATH.src.styles, { base: SRC_PATH + 'assets/styles/' })
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoPrefixer())
    .pipe(cssBeautify())
    .pipe(dest(PATH.build.styles))
    .pipe(
      cssNano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: '.min',
        extname: '.css',
      })
    )
    .pipe(dest(PATH.build.styles));

const scripts = () =>
  src(PATH.src.scripts, { base: SRC_PATH + 'assets/scripts/' })
    .pipe(plumber())
    .pipe(gulpRigger())
    .pipe(dest(PATH.build.scripts))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min',
        extname: '.js',
      })
    )
    .pipe(dest(PATH.build.scripts));

const images = () =>
  src(PATH.src.images, { base: SRC_PATH + 'assets/images' })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(PATH.build.images));

const clean = () => del(PATH.clean);

const fonts = () => src(PATH.src.fonts, { base: SRC_PATH + 'assets/fonts/' });

const watchFiles = () => {
  gulp.watch([PATH.watch.html], html);
  gulp.watch([PATH.watch.styles], styles);
  gulp.watch([PATH.watch.scripts], scripts);
  gulp.watch([PATH.watch.images], images);
  gulp.watch([PATH.watch.fonts], fonts);
};

const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images, fonts)
);
const watch = gulp.parallel(build, watchFiles);

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.clean = clean;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
