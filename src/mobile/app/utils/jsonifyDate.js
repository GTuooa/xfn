export default function jsonifyDate (issuedate) {
	const handledate = issuedate.replace(/[^\d]/g, '')
	const year = handledate.substr(0, 4)
	const month = handledate.substr(4, 2)
	return {
		year,
		month
	}
}
