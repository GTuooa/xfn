export default function createArray(start, length) {
	var arr = [], i
	for (i = 0; i < length; i++) {
		arr[i] = i + start
	}
	return arr
}
//Array.apply(null, Array(length)).map((v, i) => i + start)
//Array.from(Array(length), (v, i) => i + start)
