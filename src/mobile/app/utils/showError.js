import * as thirdParty from 'app/thirdParty'

// 提取错误全局显示的方法
export default function showError (json, deletitem) {
	const errorlist = json.data

	if (errorlist === null)
		return
	const undeleteable = errorlist.map(v => v[deletitem])

	if (errorlist.length) {
		if (errorlist.length > 1) {
			const error = errorlist.map(v => v.message).reduce((prev, v) => prev + ',' + v)

			thirdParty.Alert(error)
		} else {
			thirdParty.Alert(json.data[0].message)
		}
	}
	return undeleteable
}
