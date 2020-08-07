// 需要labelTree数据处理，处理成蚂蚁组件可以用的数据结构，此处acname未改
export default function changeLabelDataToTree (list, flag) {
	let data = []

	list.forEach((v,i) => {
		data.push({
			key: v,
			title: v
		})
	})

	return data
}
