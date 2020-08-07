function findParent (acid, parent) {
	const len = acid.length - 2
	while (len != parent.label.length) {
		parent = parent.children.find(w => !acid.indexOf(w.label))
	}
	return parent
}

//“核算项目明细表”处理成蚂蚁组件（树）可以用的数据结构
function changeDataToAssTree (list, index,noLevel) {
	// if (typeof list !== 'object')
	// 	return []

	const data = []
	list.forEach((v, i) => {
		const acid = v.acid
		const assList = v.assList//另一个辅助核算
		let assListTree = []
		let item
		if(assList.length){//有双辅助
			assList.forEach((w, j)=>{
				assListTree.push({
					key: index + '-' + i + '-' + j,
					title: w.assid + '_' + w.assname
				})
			})

			item = {
				key: index + '-' + i,
				title: acid + ' ' + v.acname,
				label: acid,
				children: [{
					key: 'disable' + index + '-' + i,
					title: v.asscategoryTwo,
					children: assListTree
				}]
			}
		}else{//无双辅助
			item = {
				key: index + '-' + i,
				title: acid + ' ' + v.acname,
				label: acid
			}
		}
		if (acid.length == 4 || noLevel) {
			data.push(item)
		} else {
			const parent = findParent(acid, data.find(w => !acid.indexOf(w.label)))
			parent.children ? parent.children.push(item) : parent.children = [item]
		}
	})
	return data
}


export default function assMxbTree (list,noLevel){
	// if (typeof list !== 'object')
	// 	return []

	let treeData = []
	list.forEach((v, i) => {
		const asscategory = v.asscategory
		const assid = v.assid
		const assname = v.assname
		const acDtoList = v.acDtoList
		let treeItem
		if (acDtoList.length) {
			var treeItemChildren = changeDataToAssTree(acDtoList, i,noLevel)
			treeItem = {
				key: i,
				title: assid + ' ' + assname,
				label: assid,
				children: treeItemChildren,
				disableTime: v.disableTime
			}
		} else {
			treeItem = {
				key: i,
				title: assid + ' ' + assname,
				label: assid,
				disableTime: v.disableTime
			}
		}

		treeData.push(treeItem)
	})
	return treeData
}
