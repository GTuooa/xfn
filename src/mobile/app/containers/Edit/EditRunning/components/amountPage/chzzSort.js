import { decimal } from 'app/utils'

export default function chzzSort(stockCardList) {
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
                    const quantity = decimal(Number(item['quantity'])+Number(v['quantity']))
                    const amount = decimal(Number(item['amount'])+Number(v['amount']))
                    item['quantity'] = quantity
                    item['amount'] = amount
                    if (quantity) {
                        item['price'] = decimal(Number(amount)/Number(quantity))
                    }
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
        v.sort((a, b) => {
            if (a['warehouseCardCode'] > b['warehouseCardCode']) {
                return -1
            } else if (a['warehouseCardCode'] == b['warehouseCardCode']) {//按单位排序
                return 1
            } else {
                return 1
            }
        }).map(item => {
            sortAssemblyList.push(item)
        })
    })
    sortAssemblyList.sort((a,b) => {
        if (a['code'] > b['code']) { return 1 }
        return -1
    })

    return sortAssemblyList
}
