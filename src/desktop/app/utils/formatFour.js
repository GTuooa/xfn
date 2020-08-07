export default
function  formatFour(number) {
	if( number === undefined) {
        return  0
    }else
	if (number == '-') {
		return number
	}
    let negative = number < 0 ? "-" : ""
	number = number < 0 ?String(number).slice(1):String(number)
    let point = number.indexOf('.') > -1 && number.slice(number.indexOf('.')+1) > 0 ? '.':'',
        thousand = ',',
		smallNum = number.indexOf('.')>-1 &&  number.slice(number.indexOf('.')+1) > 0? number.slice(number.indexOf('.')-1) : '',
        i = number.slice(0,number.indexOf('.')>-1?number.indexOf('.'):number.length) + "",
        j = i.length > 3 ? i.length % 3 : 0;
		smallNum = smallNum > 0 ?String(parseFloat(Number(smallNum).toFixed(4))):''
		smallNum = smallNum?smallNum.slice(smallNum.indexOf('.')+1):''
        // if (smallNum.length > 2) {
        //     if (smallNum.slice(0,4).charAt(smallNum.length-1) === '0') {
        //         smallNum = smallNum.slice(0,3)
        //     } else {
        //         smallNum = smallNum.slice(0,4)
        //     }
        // }
        return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + point + smallNum;
}
