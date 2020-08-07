import findParent from './findParent'
import * as Limit from 'app/constants/Limit.js'

// 需要asscategorylist的aclist数据处理，处理成蚂蚁组件可以用的数据结构，此处acname未改
export default function changeDataToTree (list, flag) {
	if (typeof list !== 'object')
		return []

	const data = []
		list.forEach(v => {

			const acid = v.acid
			const acname = v.acname
			const assDtoList = v.assDtoList

			if (assDtoList.length) {
				const itemasslist = []

				assDtoList.map(w => {
					const asslist = w.asslist

					const children = asslist.map(u => {
						return {
							// key: acid + ' ' + u.assid + ' ' + w.asscategory,
							key: acid + Limit.TREE_JOIN_STR + u.assid + Limit.TREE_JOIN_STR + w.asscategory,
							title: u.assid + '_' + u.assname,
							disableTime: u.disableTime
						}
					})

					itemasslist.push({
						key: 'disable' + w.asscategory + acid,
						title: w.asscategory,
						children: children
					})
				})

				var item = {
					key: v.acid,
					title: v.acid + ' ' + v.acname,
					children: itemasslist
				}
			} else {
				item = {
					key: acid,
					title: acid + ' ' + acname
				}
			}
			if (acid.length == 4) {
				data.push(item)
			} else {
				const parent = findParent(acid, data.find(w => !acid.indexOf(w.key)))
				parent.children ? parent.children.push(item) : parent.children = [item]
			}
		}
	)
	return data

	// const data = []
	// 	list.forEach(v => {
	//
	// 		const acid = v.acid
	// 		const acname = v.acname
	// 		const itemasslist = []
	// 		var item = {
	// 				key: v.acid,
	// 				title: v.acid + ' ' + v.acname,
	// 				children: itemasslist
	// 		}
	// 		if (item.children.length == 0) {
	// 				delete item.children
	// 			}
	// 		if (acid.length == 4) {
	// 			data.push(item)
	// 		} else {
	// 			const parent = findParent(acid, data.find(w => !acid.indexOf(w.key)))
	// 			parent.children ? parent.children.push(item) : parent.children = [item]
	// 		}
	// 	}
	// )
	// return data
}

export const getTreeData = (list) => {
	if (typeof list !== 'object')
		return []

	const loop = data => data.map((v)=> {

		const acId = v.acId
		const acName = v.acName
		const assCategoryList = v.assCategoryList
		let item

		if (assCategoryList.length) {
			const itemasslist = []

			assCategoryList.map((w)=> {

				const children = w.assList.map(u => {
					return {
						// key: acid + ' ' + u.assid + ' ' + w.asscategory,
						key: acId + Limit.TREE_JOIN_STR + u.assId + Limit.TREE_JOIN_STR + w.assCategory,
						title: u.assId + '_' + u.assName,
						disableTime: u.disableTime
					}
				})

				itemasslist.push({
					key: 'disable' + w.assCategory + acId,
					title: w.assCategory,
					children: children
				})
			})

			item = {
				key: acId,
				title: acId + ' ' + acName,
				children: itemasslist
			}
		} else {
			item = {
				key: acId,
				title: acId + ' ' + acName
			}
		}

		if (v.childList && v.childList.length) {
			item.children = loop(v.childList)
		}

		return item
	})	

	return loop(list)
}