//确保保留小数位精度准确
export default function decimal(value, digits = 2, decimalZero = false) {
    //1.335.toFixed(2)--"1.33"
    //digits 保留的位数
    //decimalZero是否显示小数点后无意义的0 true显示 false的话.3030 表示为.303
    let number = Number(value)
    // 改变小数点的位数

    number = Math.floor(Math.round(number * Math.pow(10, digits))) / Math.pow(10, digits)
    number = number.toFixed(digits)

    return decimalZero ? number : Number(number)
}
