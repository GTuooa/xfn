export const throttle = (fn, delay=500) => {//函数节流 时间戳实现
    let preTime = 0;
    return (...args) => {
        const nowTime = Date.now();
        if(nowTime - preTime > delay) {
            preTime = Date.now();
            fn.apply(this, args);
        }
    }
}

export const debounce = (fn, delay=500) => {//函数防抖
    let timer = null
    return (...args) => {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}



