import * as Limit from 'app/constants/Limit.js'

// 需要asscategorylist的aclist数据处理，处理成蚂蚁组件可以用的数据结构，此处acname未改
export default function changeAmmxbDataToTree (list, flag) {
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
					// key: acid + ' ' + 'asscategory' + ' ' + w.asscategory,
					key: acid + Limit.TREE_JOIN_STR + 'asscategory' + Limit.TREE_JOIN_STR + w.asscategory,
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
		data.push(item)
	})
	return data
}

// list.forEach(v => {
//
// 	const acid = v.acid
// 	const acname = v.acname
// 	const assDtoList = v.assDtoList
//
// 	if (assDtoList.length) {
// 		const itemasslist = []
// 		assDtoList.map(w => {
// 			const asslist = w.asslist
//
// 			const children = asslist.map(u => {return {
// 				key: acid + ' ' + u.assid + ' ' + w.asscategory,
// 				title: u.assid + '_' + u.assname}
// 			})
//
// 			itemasslist.push({
// 				key: 'disable' + w.asscategory,
// 				title: w.asscategory,
// 				children: children
// 			})
// 		})
//
// 		var item = {
// 			key: v.acid,
// 			title: v.acid + ' ' + v.acname,
// 			children: itemasslist
// 		}
// 	} else {
// 		item = {
// 			key: acid,
// 			title: acid + ' ' + acname
// 		}
// 	}
// 	data.push(item)
// })
