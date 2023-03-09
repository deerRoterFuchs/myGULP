import gulp from "gulp";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import {deleteAsync} from 'del';


const sass = gulpSass(dartSass);
//Пути к файлам
const paths ={
    styles:{
        src:'src/styles/**/*.scss',
        dest: "dist/css/"
    },
    scripts:{
        src:'src/scripts/**/*.js',
        dest: 'dist/js'
    }
        
}
// Очистка каталога
function clean(){
    return deleteAsync(['dist'])
}
// Обрабока стилей
function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))

}
function scripts(){
    return gulp.src(paths.scripts.src,{
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}
// Вотчер
function watch(){
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean,gulp.parallel(styles,scripts),watch)
export {clean}
export {styles}
export {scripts}
export {watch}
export {build}
export default build