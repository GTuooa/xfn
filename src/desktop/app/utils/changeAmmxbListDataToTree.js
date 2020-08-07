// 需要assetsList数据处理，处理成蚂蚁组件可以用的数据结构，此处acname未改
export default function changeAmmxbListDataToTree (list, flag) {
	if (typeof list !== 'object')
		return []

	const data = []
		list.forEach(v => {
			const acid = v.acid
			const acname = v.acname
			var item = {
				key: acid,
				title: acid + '_' + acname
			}
			data.push(item)
		}
	)
	return data
}
