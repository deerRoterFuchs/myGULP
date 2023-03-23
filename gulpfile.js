import gulp from "gulp";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import htmlmin from "gulp-htmlmin";
import size from "gulp-size";
import newer from "gulp-newer";
import browsersync from "browser-sync";
import {deleteAsync} from 'del';
import webpackStream from "webpack-stream";
import gulpIf from "gulp-if";



const sass = gulpSass(dartSass),
    browserSync = browsersync.create(),
    webConfig = {
        output:{
            filename: 'main.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: '/node_modules/'
                }
            ]
        },
        mode: isDev ? 'development' : 'production',
        devtool: isDev ? 'eval-source-map' : 'none'
    },
    isDev = true,
    isProd = !isDev;

//Пути к файлам
const paths ={
    styles:{
        src:'src/styles/**/*.scss',
        dest: "dist/css/"
    },
    scripts:{
        src:'src/scripts/**/*.js',
        dest: 'dist/js'
    },
    images:{
        src: 'src/img/*',
        dest: "dist/img"
    },
    html:{
        src: 'src/*html',
        dest: 'dist'
    },
    fonts:{
        src: 'src/fonts/*',
        dest: 'dist/fonts'
    }
        
}
// Очистка каталога
function clean(){
    return deleteAsync(['dist/*', '!dist/img', '!dist/fonts'])
}

function html() {
    return gulp.src(paths.html.src)
    .pipe(htmlmin({
        collapseWhitespace:true
    }))
    .pipe(size())
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream())
}
// Обрабока стилей
function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        cascade:false
    }))
    .pipe(gulpIf(isProd,cleanCSS({
        level:2
    })))
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(size())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())

}
function scripts(){
    return gulp.src(paths.scripts.src)
    .pipe(webpackStream(webConfig))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}
function fonts(){
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
}
function img(){
    return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(size())
    .pipe(gulp.dest(paths.images.dest))
}
// Вотчер
function watch(){
    browserSync.init({
        server:{
            baseDir: './dist/'
        }
    })
    gulp.watch(paths.html.dest).on('change',browserSync.reload)
    gulp.watch(paths.img.src,img)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean,html,gulp.parallel(styles,scripts, img),watch)
export {fonts}
export {html}
export {img}
export {clean}
export {styles}
export {scripts}
export {watch}
export {build}
export default build