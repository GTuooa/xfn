export default function jsonifyDate (issuedate) {
    const year = issuedate.substr(0, 4)
	const month = issuedate.substr(6, 2)
	return {
		year,
		month
	}
}
