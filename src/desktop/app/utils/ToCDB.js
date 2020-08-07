
//JS把全角转为半角的函数
export default function ToCDB(str) {
	var tmp = ""
	for (var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
			tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
		} else {
			tmp += String.fromCharCode(str.charCodeAt(i));
		}
	}
	return tmp
}
