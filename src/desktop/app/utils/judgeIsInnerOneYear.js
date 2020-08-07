import DateLib from './DateLib.js'
import moment from 'moment'

// 传入的日期是否是一年之内
// 传入参数： 要判断的日期，如‘2018-09-30’
export default function judgeIsInnerOneYear (date) {

    const today = new DateLib()
    const year = today.getYear()
    const month = today.getMonth()
    const day = today.getDay()

    const tomorrow = new DateLib(new Date(moment().add(1, 'days')._d))
    const tomorrowYear = tomorrow.getYear()
    const tomorrowMonth = tomorrow.getMonth()
    const tomorrowDay = tomorrow.getDay()

    // 获取一年前到现在的时间区间
    const fromDay = `${Number(year)-1}-${month}-${day}`
    const endDay = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`

    // 用moment的 isBetween
    return moment(date).isBetween(fromDay, endDay)
}
