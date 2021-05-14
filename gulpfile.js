const gulp = require('gulp')

const del = require('del')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const autoprefixer = require('gulp-autoprefixer')
const hash_src = require('gulp-hash-src')

const browserSync = require('browser-sync').create()

const paths = {
    dist: './dist',
    src: './src',
};

const src = {
    html: paths.src + '/*.html',
    img: paths.src + '/assets/**/*.*',
    css: paths.src + '/css/',
    js: paths.src + '/js/',
};

const dist = {
    img: paths.dist + '/assets/',
    css: paths.dist + '/css/',
    js: paths.dist + '/js/',
};


/**
 * Очистка папки dist перед сборкой
 * @returns {Promise<string[]> | *}
 */
function clean() {
    return del([paths.dist]);
}

/**
 * Инициализация веб-сервера browserSync
 * @param done
 */
function browserSyncInit(done) {
    browserSync.init({
        server: {
            baseDir: paths.dist,
        },
        host: 'localhost',
        port: 9000,
        open: false,
        logPrefix: 'log',
    });
    done();
}


/**
 * Функция перезагрузки страницы при разработке
 * @param done
 */
function browserSyncReload(done) {
    browserSync.reload();
    done();
}


/**
 * Шаблонизация и склейка HTML
 * @returns {*}
 */
function htmlProcess() {
    return gulp
        .src([src.html])
        .pipe(gulp.dest(paths.dist));
}


/**
 * Добавление хеша скриптов и стилей в html для бустинга кеша
 * @returns {*}
 */
function hashProcess() {
    return gulp
        .src(paths.dist + '/*.html')
        .pipe(
            hash_src({
                build_dir: paths.dist,
                src_path: paths.dist + '/js',
                exts: ['.js'],
            }),
        )
        .pipe(
            hash_src({
                build_dir: './dist',
                src_path: paths.dist + '/css',
                exts: ['.css'],
            }),
        )
        .pipe(gulp.dest(paths.dist));
}


/**
 * Копирование картинок в dist или оптимизация при финишной сборке
 * @returns {*}
 */
function imgProcess() {
    return gulp
        .src(src.img)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 70, progressive: true}),
            imageminPngquant(),
        ]))
        .pipe(gulp.dest(dist.img));
}


/**
 * Склейка и обработка css файлов
 * @returns {*}
 */
function cssProcess() {
    return gulp
        .src([src.css + '/**/*.*'])
        // .pipe(autoprefixer())
        .pipe(gulp.dest(dist.css));
}


/**
 * Работа с пользовательским js
 * @returns {*}
 */
function jsProcess() {
    return gulp
        .src([src.js + '/*.js'])
        .pipe(gulp.dest(dist.js));
}

/**
 * Наблюдение за изменениями в файлах
 */
function watchFiles() {
    gulp.watch(src.html, gulp.series(htmlProcess, browserSyncReload));
    gulp.watch(src.css, gulp.series(cssProcess, browserSyncReload));
    gulp.watch(src.css, gulp.series(jsProcess, browserSyncReload));
    gulp.watch(src.img, gulp.series(imgProcess, browserSyncReload));
}

const build = gulp.series(
    clean,
    gulp.parallel(
        htmlProcess,
        cssProcess,
        jsProcess,
        imgProcess,
    ),
    hashProcess,
);

const watch = gulp.parallel(build, watchFiles, browserSyncInit);

exports.build = build;
exports.default = watch;
