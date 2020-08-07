import findParent from './findParent'

// 需要assetsList数据处理，处理成蚂蚁组件可以用的数据结构，此处acname未改
export default function changeAssetsListDataToTree (list, flag) {
	if (typeof list !== 'object')
		return []

	const data = []
		list.forEach(v => {

			const acid = v.serialNumber
			const acname = v.serialName
			const upperid = v.upperAssetsNumber

			if (upperid == '') {
				const itemAssList = []

				const children = list.forEach(w => {
					if (acid == w.upperAssetsNumber && w.serialNumber.length === 3) {
						itemAssList.push({
							key: w.serialNumber,
							title: w.serialNumber + '_' + w.serialName
						})
					}
				})
				var item = {
					key: acid,
					title: acid + '_' + acname,
					children: itemAssList
				}
				if (item.children.length == 0) {
					delete item.children
				}
				data.push(item)
			}
		}
	)
	return data
}
