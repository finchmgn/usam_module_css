var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    browserSync     = require('browser-sync'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglifyjs'),
    cssmin          = require('gulp-cssmin'),
    rename          = require('gulp-rename'),
    del             = require('del'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    cache           = require('gulp-cache'),
    autoprefixer    = require('gulp-autoprefixer');

/* КОНВЕРТИРУЕМ SASS В CSS */
gulp.task('sass', async function() {
    return gulp.src('src/sass/usam_module_css.sass')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7', {cascade: true}]))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}));
});

/* СЖИМАЕМ CSS | ДОБАВЛЯЕМ СУФФИКС */
gulp.task('cssmin', async function() {
    return gulp.src('src/css/usam_module_css.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));
});

/* КОПИРУЕМ НЕСЖАТЫЙ CSS В DIST */
gulp.task('csscopy', async function() {
    return gulp.src('src/css/usam_module_css.css')
    .pipe(gulp.dest('dist/css'))
});

/* СЖИМАЕМ JS И ДОБАВЛЯЕМ СУФФУКС */
gulp.task('jsmin', async function() {
    return gulp.src('src/js/usam_module_css.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/js'))
});

/* КОПИРУЕМ НЕСЖАТЫЙ JS В DIST */
gulp.task('jscopy', async function() {
    return gulp.src('src/js/usam_module_css.js')
    .pipe(gulp.dest('dist/js'))
});

/* КОПИРУЕМ СЖАТЫЙ JS В DIST */
gulp.task('jsmincopy', async function() {
    return gulp.src('src/js/usam_module_css.min.js')
    .pipe(gulp.dest('dist/js'))
});

/* ОЧИЩАЕМ КЭШ */
gulp.task('clear', async function() {
    return cache.clearAll();
});

/* УДАЛЯЕМ ПАПКУ DIST */
gulp.task('del', function() {
    return del('dist')
});

/* СЕРВЕР */
gulp.task('browser-sync', async function() {
    browserSync({
        /* В PROXY НУЖНО УКАЗАТЬ ПАПКУ, В КОТОРОЙ БУДЕТ СЕРВЕР (ОТНОСИТЕЛЬНО ПАПКИ С ВИРТУАЛЬНЫМ СЕРВЕРОМ) */
        /* НАПРИМЕР, ЕСЛИ ВЫ ИСПОЛЬЗУЕТЕ OPEN SERVER, ТО УКАЗЫВАЕМ ОТНОСИТЕЛЬНО ПАПКИ DOMAINS */
        proxy: 'usam_module_css/',
        notify: false
    });
});

/* НАБЛЮДАЕМ ЗА ИЗМЕНЕНИЯМИ В ФАЙЛАХ */
gulp.task('watch', async function() {
    gulp.watch('src/sass/**/*.sass', gulp.parallel('sass', 'cssmin'));
    gulp.watch('src/sass/**/*.sass').on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', gulp.parallel('jsmin'));
    gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
    gulp.watch('index.html').on('change', browserSync.reload);
});



/* ТАСК РЕЖИМ РАЗРАБОТКИ ПРОЕКТА */
gulp.task('dev', gulp.parallel('browser-sync', 'sass', 'jsmin', 'watch'));

/* ТАСК РЕЖИМ СБОРКИ ПРОЕКТА */
gulp.task('build', gulp.parallel('del', 'clear', 'csscopy', 'jscopy', 'jsmincopy'));
