import * as Limit from 'app/constants/Limit.js'

function findParent (acid, parent) {
	const len = acid.length - 2
	while (len != parent.label.length) {
		parent = parent.children.find(w => !acid.indexOf(w.label))
	}
	return parent
}

//“”处理成蚂蚁组件（树）可以用的数据结构
function changeDataToFCTree (list, index) {

	const data = []
	list.forEach((v, i) => {
		const acid = v.acid
		const assDtoList = v.assDtoList

		let item = {
			// key: index + '-' + acid,
			key: index + Limit.TREE_JOIN_STR + acid,
			title: acid + ' ' + v.acname,
			label: acid
		}
		if (acid.length == 4) {

			if (assDtoList.length) {
				const itemasslist = []
				assDtoList.map(w => {
					const asslist = w.asslist

					const children = asslist.map(u => {
						return {
								// key: index + '-' +acid + '-' + u.assid + '-' + w.asscategory,
								key: index + Limit.TREE_JOIN_STR + acid + Limit.TREE_JOIN_STR + u.assid + Limit.TREE_JOIN_STR + w.asscategory,

								title: u.assid + '_' + u.assname,
								label: acid,
								disableTime: u.disableTime
								}
					})

					itemasslist.push({
						key: 'disable' + w.asscategory,
						title: w.asscategory,
						label: w.asscategory,
						children: children
					})
				})
				item = {
					// key: index + '-' + acid,
					key: index + Limit.TREE_JOIN_STR + acid,
					title: acid + ' ' + v.acname,
					label: acid,
					children: itemasslist
				}

				data.push(item)
			} else {
				item= {
					// key: index + '-' + acid,
					key: index + Limit.TREE_JOIN_STR + acid,
					title: acid + ' ' + v.acname,
					label: acid
				}
				data.push(item)
			}

		} else {
			const parent = findParent(acid, data.find(w => !acid.indexOf(w.label)))

			if (assDtoList.length) {
				const itemasslist = []
				assDtoList.map(w => {
					const asslist = w.asslist
					const children = asslist.map(u => {
						return {
								// key: index + '-' +acid + '-' + u.assid + '-' + w.asscategory,
								key: index + Limit.TREE_JOIN_STR +acid + Limit.TREE_JOIN_STR + u.assid + Limit.TREE_JOIN_STR + w.asscategory,
								title: u.assid + '_' + u.assname,
								label: acid,
								disableTime: u.disableTime
								}
					})

					itemasslist.push({
						key: 'disable' + w.asscategory,
						title: w.asscategory,
						label: w.asscategory,
						children: children
					})
				})
				item = {
					// key: index + '-' +v.acid,
					key: index + Limit.TREE_JOIN_STR +v.acid,
					title: v.acid + ' ' + v.acname,
					label: v.acid,
					children: itemasslist
				}
			} else {
				item= {
					// key: index + '-' + acid,
					key: index + Limit.TREE_JOIN_STR + acid,
					title: acid + ' ' + v.acname,
					label: acid
				}
			}

			parent.children ? parent.children.push(item) : parent.children = [item]
		}
	})
	return data
}


export default function changeFCMxbTree (list){

	let treeData = []

	list.forEach((v, i) => {
		const name = v.name
		const fcNumber = v.fcNumber
		const acList = v.acList
		let treeItem
		if (acList.length) {
			var treeItemChildren = changeDataToFCTree(acList, fcNumber)

			treeItem = {
				key: fcNumber,
				title: fcNumber,
				label: fcNumber,
				children: treeItemChildren
			}
		} else {
			treeItem = {
				key: fcNumber,
				title: fcNumber,
				label: fcNumber,
			}
		}

		treeData.push(treeItem)
	})
	return treeData
}
