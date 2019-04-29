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

/* КОНВЕРТИРУЕМ SASS В CSS | В ФАЙЛЕ LIBS.SASS УКАЗЫВАЕМ ПУТИ К ФАЙЛАМ SASS И CSS БИБЛИОТЕК */
gulp.task('sassmain', async function() {
    gulp.src('src/sass/main.sass')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7', {cascade: true}]))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('sasslibs', async function() {
    return gulp.src('src/sass/libs.sass')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}));
});

/* СЖИМАЕМ CSS БИБЛИОТЕК | ДОБАВЛЯЕМ СУФФИКС */
gulp.task('csslibs', async function() {
    return gulp.src('dist/css/libs.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));
});

/* СЖИМАЕМ JS БИБЛИОТЕК */
gulp.task('jslibs', async function() {
    return gulp.src([
        'src/libs/jquery/dist/jquery.min.js',
        'src/libs/foundation-sites/dist/js/foundation.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

/* JS РАЗРАБОТЧИКА */
gulp.task('jsmain', async function() {
    return gulp.src('src/js/main.js')
    .pipe(gulp.dest('dist/js'));
});

/* СЖИМАЕМ ИЗОБРАЖЕНИЯ */
gulp.task('img', async function() {
    return(gulp.src('src/img/**/*.*'))
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

/* ОЧИЩАЕМ КЭШ */
gulp.task('clear', async function() {
    return cache.clearAll();
});

/* УДАЛЯЕМ ПАПКУ dist/IMG */
gulp.task('delimg', function() {
    return del('dist/img');
});

/* СЕРВЕР */
gulp.task('browser-sync', async function() {
    browserSync({
        /* В PROXY НУЖНО УКАЗАТЬ ПАПКУ, В КОТОРОЙ БУДЕТ СЕРВЕР (ОТНОСИТЕЛЬНО ПАПКИ С ВИРТУАЛЬНЫМ СЕРВЕРОМ) */
        /* НАПРИМЕР, ЕСЛИ ИСПОЛЬЗУЕТСЯ OPEN SERVER, ТО УКАЗЫВАЕМ ОТНОСИТЕЛЬОН ПАПКИ DOMAINS */
        proxy: 'mamadochka/',
        notify: false
    });
});

/* НАБЛЮДАЕМ ЗА ИЗМЕНЕНИЯМИ В ФАЙЛАХ */
gulp.task('watch', async function() {
    gulp.watch(['src/sass/**/*.sass', '!src/sass/libs.sass'], gulp.parallel('sassmain'));
    gulp.watch('src/sass/libs.sass', gulp.parallel('sasslibs', 'csslibs'));
    gulp.watch('src/sass/**/*.sass').on('change', browserSync.reload);
    gulp.watch('src/js/main.js', gulp.parallel('jsmain'));
    gulp.watch('src/js/libs.js', gulp.parallel('jslibs'));
    gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
    gulp.watch('src/img/**/*.*', gulp.parallel('delimg', 'img'));
    gulp.watch('src/img/**/*.*').on('change', browserSync.reload);
});



/* ТАСК РЕЖИМ РАЗРАБОТКИ И АВТОМАТИЧЕСКОЙ СБОРКИ ПРОЕКТА */
gulp.task('dev', gulp.parallel('delimg', 'browser-sync', 'sassmain', 'sasslibs', 'csslibs', 'jslibs', 'img', 'watch'));