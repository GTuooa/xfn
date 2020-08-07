import * as Limit from 'app/constants/Limit.js'

// 流水账 账户树结构
export default function accountTreeData (list) {

    const loop = (data) => data.map(v => {

        if (v.childList && v.childList.length) {
            return {
                label: v.name,
                value: v.uuid,
                key: v.uuid,
                children: loop(v.childList)
            }
        } else {
            return {
                label: v.name,
                value: v.uuid,
                key: v.uuid
            }
        }
    })

    const data = [{
        label: list[0]['name'],
        value: "全部",
        key: list[0]['uuid'],
        children: loop(list[0]['childList'])
    }]

	return data
}
