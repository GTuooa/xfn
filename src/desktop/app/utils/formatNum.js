export default function formatNum (str) {
    let newStr = ""
    let count = 0
    for ( let i = str.indexOf(".") - 1; i >= 0; i --){
        if (count % 3 == 0 && count != 0) {
            newStr = str.charAt(i) + "," + newStr
        } else {
            newStr = str.charAt(i) + newStr; //逐个字符相接起来
        }
        count ++
    }
    str = newStr + (str + "00").substr((str + "00").indexOf("."),3)
    return str
}
