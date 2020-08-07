export default function cascadeData(list, flag) {
	// if (typeof list !== 'object')
	// 	return []
	//
	const findParent = (acid, parent) => {
		const len = acid.length - 2
		while (len != parent.key.length) {
			parent = parent.children.find(w => !acid.indexOf(w.key))
		}
		return parent
	}
	const data = []
	list.forEach(v => {
		const acid = v.acid
		const category = v.category

		const key = {
			'流动资产': '资产',
			'非流动资产': '资产',
			'流动负债': '负债',
			'非流动负债': '负债',
			'所有者权益': '权益',
			'成本': '成本'
		}[category] || '损益'

		const item = {
			key: acid,
			title: acid + '_' + v.acfullname,
			category: key
		}
		if (acid.length == 4) {
			data.push(item)
		} else {
			//console.log('parent--------', data, data.find(w => !acid.indexOf(w.key)))
			const parent = findParent(acid, data.find(w => acid.indexOf(w.key) === 0))
			//console.log('parent--------',parent)
			parent.children ? parent.children.push(item) : parent.children = [item]
		}
	})
	return data
}
