// /**
//  * @desc 函数防抖
//  * @param func 函数
//  * @param wait 延迟执行毫秒数
//  * @param immediate true 表立即执行，false 表非立即执行
//  */
// 一秒钟不让点第二下
let timeout;
export function debounce(func, wait=600, immediate=true) {

    return function () {
        let context = this;
        let args = arguments;
      
        if (timeout) {
            clearTimeout(timeout);
        }

        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)

            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
    }
}


// /**
//  * @desc 函数节流
//  * @param func 函数
//  * @param wait 延迟执行毫秒数
//  * @param type 1 表时间戳版，2 表定时器版
//  */
// export function throttle(func, wait=1000, type=2) {
//     if(type===1){
//         let previous = 0;
//     }else if(type===2){
//         let timeout;
//     }
//     return function() {
//         let context = this;
//         let args = arguments;
//         if(type===1){
//             let now = Date.now();

//             if (now - previous > wait) {
//                 func.apply(context, args);
//                 previous = now;
//             }
//         }else if(type===2){
//             if (!timeout) {
//                 timeout = setTimeout(() => {
//                     timeout = null;
//                     func.apply(context, args)
//                 }, wait)
//             }
//         }
//     }
// }