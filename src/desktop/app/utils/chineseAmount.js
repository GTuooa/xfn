export default function chineseAmount (num) {

    if (isNaN(num) || num > Math.pow(10, 12) || Number(num) == 0)
       return ""

    const isMinus = num.indexOf('-') === 0
    if (isMinus)
        num = num.substr(1)

    const cn = "零壹贰叁肆伍陆柒捌玖"
    const unit = ["拾佰仟", "分角"]
    const unit1 = ["万亿", ""]
    const numArray = num.toString().split(".")
    let start = new Array(numArray[0].length - 1, 2)

    function toChinese(num, index) {
        num = num.replace(/\d/g, function($1) {
            return cn.charAt($1) + unit[index].charAt(start-- % 4 ? start % 4 : -1)
        })
        return num
    }

    for (var i = 0; i < numArray.length; i++) {
        let tmp = ""
        for (var j = 0; j * 4 < numArray[i].length; j++) {
            const strIndex = numArray[i].length - (j + 1) * 4
            const str = numArray[i].substring(strIndex, strIndex + 4)
            start = i ? 2 : str.length - 1
            let tmp1 = toChinese(str, i)
            tmp1 = tmp1.replace(/(零.)+/g, "零").replace(/零+$/, "")
            tmp1 = tmp1.replace(/^壹拾/, "拾")
            tmp = (tmp1 + unit1[i].charAt(j - 1)) + tmp
        }
        numArray[i] = tmp
    }

    numArray[1] = numArray[1] ? numArray[1] : ""
    numArray[0] = numArray[0] ? numArray[0] + "元" : numArray[0], numArray[1] = numArray[1].replace(/^零+/, "")
    numArray[1] = (numArray[1].match(/角/) || numArray[1].match(/分/)) ? numArray[1] : numArray[1] + "整"

    return isMinus ? '-' + numArray[0] + numArray[1] : numArray[0] + numArray[1]
}
