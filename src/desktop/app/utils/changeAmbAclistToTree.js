import findParent from './findParent'

// 不需要asslist的aclist数据处理，处理成蚂蚁组件可以用的数据结构
export default function changeAmbAclistToTree (list, flag) {
	if (typeof list !== 'object')
		return []

	const data = [{key: '0000', value: '0000', label: '损益净额'}]
	list.forEach(v => {

		const acid = v.acId
		const item = {
			key: acid,
            label: v.name,
			value: acid + ' ' + v.name
		}
		if (acid.length == 4) {
			data.push(item)
		} else {
			const parent = findParent(acid, data.find(w => !acid.indexOf(w.key)))
			parent.children ? parent.children.push(item) : parent.children = [item]
		}
	})
	return data
}
