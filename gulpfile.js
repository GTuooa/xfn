
const gulp = require('gulp')
// const del = require('del')
const path = require('path')
const gutil = require('gulp-util')
const replace = require('gulp-replace')


// 测试服务器上传正式服务器 TODO

// FTP_PATH = '/opt/ftp/build/mobile'
// FTP_PATH = '/opt/ftp/build/desktop'

// const ftpfiles = ftp.create({
//         host: '112.124.116.198',
//         user: 'ftpuser',
//         password: 'Xfn123.',
//         log: gutil.log
//     })

 /************************************************************************************/
// 原来的
// let FTP_PATH
// let BUILD_PATH
// switch (process.env.NODE_DEVICE) {
//    case 'mobile':
//        // 测式服务器
//        FTP_PATH = '/opt/ftp/html/build/mobile'
//        // 正式服务器
//     //    FTP_PATH = '/opt/ftp/build/mobile'
//        BUILD_PATH = path.resolve(__dirname, 'build/mobile')
//        break
//    case 'desktop':
//        // 测式服务器
//        FTP_PATH = '/opt/ftp/html/build/desktop'
//        // 正式服务器
//     //    FTP_PATH = '/opt/ftp/build/desktop'
//        BUILD_PATH = path.resolve(__dirname, 'build/desktop')
//        break
//    default:
//        throw new Error('设置面向的设备类型')
// }


let BUILD_PATH
switch (process.env.NODE_DEVICE) {
   case 'mobile':
       BUILD_PATH = path.resolve(__dirname, 'build/mobile')
       break
   case 'desktop':
       BUILD_PATH = path.resolve(__dirname, 'build/desktop')
       break
   default:
       throw new Error('设置面向的设备类型')
}


const APP_PATH = path.resolve(BUILD_PATH, 'app')
const CSS_PATH = path.resolve(BUILD_PATH, 'css')
const JS_PATH = path.resolve(BUILD_PATH, 'js')

// 测式服务器
// let ftpfiles
// switch (process.env.NODE_SERVER.substr(0,4)) {
//    case 'test':
//         ftpfiles = ftp.create({
//             host: '114.215.168.50',
//             user: 'ftpuser',
//             password: 'Bi97531.',
//             log: gutil.log
//         })
//         break
//    case 'form':
//         ftpfiles = ftp.create({
//             // host: '112.124.116.198',
//             // user: 'ftpuser',
//             // password: 'Xfn123.',
//             // log: gutil.log
//             host: '114.215.168.50',
//             user: 'ftpuser',
//             password: 'Bi97531.',
//             log: gutil.log
//         })
//         break
//    default:
//        throw new Error('设置发布的服务器')
// }
// const ftpfiles = ftp.create({
//         host: '114.215.168.50',
//         user: 'ftpuser',
//         password: 'Bi97531.',
//         log: gutil.log
//     })

// 正式服务器
// const ftpfiles = ftp.create({
//         host: '112.124.116.198',
//         user: 'ftpuser',
//         password: 'Xfn123.',
//         log: gutil.log
//     })


// gulp.task('clean', () => {
//    return del(path.resolve(BUILD_PATH, '**'))
// })

gulp.task('replace:html', () => {
   return gulp.src(path.resolve(APP_PATH, '*.html'))
        // .pipe(replace(/xfnpkg\.js\?[0-9A-z]*/g, 'xfnpkg.js'))

       .pipe(gulp.dest(APP_PATH))
 })



gulp.task('replace:js', () => {

    switch (process.env.NODE_SERVER.substr(0, 4)) {
       case 'test':
            return gulp.src(path.resolve(JS_PATH, '*.js'))
            .pipe( gulp.dest(JS_PATH))

       case 'form':
            return gulp.src(path.resolve(JS_PATH, '*.js'))
            .pipe(replace('https://fannixddfe1.hz.taeapp.com/XFN-MF', 'https://fannixddfe.hz.taeapp.com/XFN-MF'))
            .pipe(replace('https://fannixddfe1.hz.taeapp.com', 'https://fannixddfe.hz.taeapp.com'))
            .pipe(replace(/test\//g, 'annex/'))
            .pipe(gulp.dest(JS_PATH))


        case 'pref':
            return gulp.src(path.resolve(JS_PATH, '*.js'))
            .pipe(replace('https://fannixddfe1.hz.taeapp.com/XFN-MF', 'https://fannixddfe0.hz.taeapp.com/XFN-MF'))
            .pipe(replace('https://fannixddfe1.hz.taeapp.com', 'https://fannixddfe0.hz.taeapp.com'))
            .pipe(replace(/test\//g, 'annex/'))
            .pipe(gulp.dest(JS_PATH))

       default:
           throw new Error('设置发布的服务器')
    }

   // return gulp.src(path.resolve(JS_PATH, '*.js'))
   //      .pipe(replace('xfn-versions', new DateLib(new Date()).getFullDate()))
   //      // 正式服务器
   //      // .pipe(replace('http://www.t-houses.com/XFN-MF', 'http://www.xfare.cn/XFN-MF'))
   //
   //     .pipe(
   //         gulp.dest(JS_PATH))

 })



// gulp.task('ftp:rmdir', (cb) => {
//    ftpfiles.rmdir(FTP_PATH, cb)
//  })


// gulp.task('ftp:upload', () => {
//    return gulp.src(path.resolve(BUILD_PATH, '**'))
//        .pipe(ftpfiles.dest(FTP_PATH))
//  })



 /************************************************************************************/
// 传ftp是执行
// gulp.task('publish',
//     gulp.series(
//        gulp.parallel('replace:html', 'replace:js'),
//        'ftp:rmdir',
//        'ftp:upload'
//     )
//  )

 gulp.task('publish',
     gulp.series(
        gulp.parallel('replace:html', 'replace:js')
     )
  )
