export default function findValue (value, treeList) {
    //gt 存货 往来 项目根据末级类别的uuid查找到他的所有父级的信息
    let itemArr = []
    let isFind = false

    const loop = (data) => {
        data.map((item) => {
            if (isFind) { return }
            if (item['uuid'] == value) {
                isFind = true
                itemArr.push(item)
                return
            }
            if (item['childList'].length) {
                itemArr.push(item)
                loop(item['childList'])
            }
        })

        if (!isFind) { itemArr.pop() }
    }

    loop(treeList)
    return itemArr
}
