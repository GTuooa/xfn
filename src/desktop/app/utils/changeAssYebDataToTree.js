import findParent from './findParent'

// 需要asscategorylist的aclist数据处理，处理成蚂蚁组件可以用的数据结构，此处acname未改
export default function changeAssYebDataToTree (list, flag) {
	if (typeof list !== 'object')
		return []

	const data = []
		list.forEach(v => {
			const acid = v.acid
			const acname = v.acname
			const itemasslist = []
			var item = {
				key: v.acid,
				value: v.acid,
				title: v.acid + ' ' + v.acname,
				children: itemasslist
			}
			if(item.key=='0000'){
				item = {
					key: v.acid,
					value: v.acid,
					title: v.acname,
					children: itemasslist
				}
			}
			if (item.children.length == 0) {
					delete item.children
				}
			if (acid.length == 4 || acid=='0000') {
				data.push(item)
			} else {
				const parent = findParent(acid, data.find(w => !acid.indexOf(w.key)))
				parent.children ? parent.children.push(item) : parent.children = [item]
			}
		}
	)
	return data
}
