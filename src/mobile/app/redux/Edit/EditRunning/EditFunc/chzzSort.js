export default function chzzSort(stockCardList) {
    /*返回合并后的物料明细的总个数
    app/containers/Edit/EditRunning/components/amountPage/chzzSort.js的简化版
    */
    let allAssemblyList = []
    let cardUuidList = []//存货卡片列表-只出现一次
    let cardList = []//与cardUuidList一一对应

    stockCardList.map(v => {
        v['childCardList'].map(w => {
            allAssemblyList.push(w)
        })
    })

    allAssemblyList.map((v, i) => {
        const cardUuid = v['cardUuid']
        const warehouseCardUuid = v['warehouseCardUuid'] ? v['warehouseCardUuid'] : ''
        const unitUuid = v['unitUuid'] ? v['unitUuid'] : ''
        const batch = v['batch'] ? v['batch'] : ''

        //设默认值
        const warehouseCardCode = v['warehouseCardCode']
        v['unitUuid'] = unitUuid
        v['warehouseCardUuid'] = warehouseCardUuid
        v['warehouseCardCode'] = warehouseCardCode ? warehouseCardCode : ''

        const propertyList = v['assistList'] ? v['assistList'].map(v => v['propertyUuid']).sort() : []
        const allPropertyStr = `${cardUuid}_${warehouseCardUuid}_${unitUuid}_${batch}_${propertyList.join('_')}`
        v['allPropertyStr'] = allPropertyStr

        if (!cardUuid) { return }

        if (!cardUuidList.includes(cardUuid)) {//全新的卡片
            cardList.push([v])
            cardUuidList.push(cardUuid)
        } else {//重复的卡片
            const cardIndex = cardUuidList.findIndex(value => value==cardUuid)//对应的cardUuid的索引
            let findCard = false
            cardList[cardIndex].forEach(item => {
                if (item['allPropertyStr']==allPropertyStr) {//属性完全相同
                    findCard = true
                }
            })

            if (!findCard) {
                cardList[cardIndex].push(v)
            }
        }
    })

    let sortAssemblyList = []
    cardList.map((v,i) => {
        v.map(item => {
            sortAssemblyList.push(item)
        })
    })

    return sortAssemblyList.length
}