export default function dateFormat(date) {
    //date是时间戳
	const year = (date.getFullYear()).toString();
	const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString();
	const day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString();
	const newDate = `${year}-${month}-${day}`
	return newDate

}
