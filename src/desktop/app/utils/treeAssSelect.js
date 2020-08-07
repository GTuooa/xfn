import findParent from './findParent'

// 不需要asslist的aclist数据处理，处理成蚂蚁组件可以用的数据结构
export default function treeAssSelect (list, asscategory) {
	if (typeof list !== 'object')
		return []
	const data = []
	list.forEach(v => {
		const acid = v.acid
        const asscategorylist = v.asscategorylist

        const checkedable = asscategorylist.some(v => v === asscategory) || asscategorylist.length < 2

		const item = {
            checkedable: checkedable,
			key: acid,
			title: acid + ' ' + v.acfullname
		}
		if (acid.length == 4) {
			data.push(item)
		} else {
			const upperid = v.upperid
			const parent = findParent(acid, data.find(w => !acid.indexOf(w.key)))
			// const parent = data.find(w => upperid === w.key)
			parent.children ? parent.children.push(item) : parent.children = [item]
		}
	})
	return data
}
