export default function logGetformatDate(date = new Date()) {

	let objDate = {}
	const year    = `${date.getFullYear()}`
	const month   = `${date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}`
	const day     = `${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()}`
	const hours   = `${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}`
	const minutes = `${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`
	const seconds = `${date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()}`
	objDate.year = year
	objDate.month = month
	objDate.day = day
	objDate.hours = hours
	objDate.minutes = minutes
	objDate.seconds = seconds
	objDate.format = `${year}${month}${day}${hours}${minutes}${seconds}`
	objDate.formatDayBegin = `${year}${month}${day}000000`
	objDate.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
	return objDate
}
