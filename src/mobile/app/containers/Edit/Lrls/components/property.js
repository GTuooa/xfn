import { fromJS, toJS } from 'immutable'

//费用性质列表
export default function costList (propertyCostList) {
    let propertyList = []
    propertyCostList.forEach(v => {
        if (v == 'XZ_SALE') {
            propertyList.push({key: '销售费用', value: 'XZ_SALE'})
        } else if (v == 'XZ_MANAGE') {
            propertyList.push({key: '管理费用', value: 'XZ_MANAGE'})
        } else if (v == 'XZ_FINANCE') {
            propertyList.push({key: '财务费用', value: 'XZ_FINANCE'})
        }
    })

    return propertyList
}


//费用的属性列表
export function propertyCostObj (categoryType, propertyCost) {

    let assAc = ''//性质的科目
    let assCategoryList = []//科目的辅助核算类别
    let assList = []//科目的辅助核算列表
    let acType = ''//对应修改的科目
    let propertyCostName = '请选择费用性质'

    ;({
        'XZ_SALE': () => {
            assAc = categoryType.get('saleAc')
            assCategoryList = assAc.size ? assAc.getIn([0, 'assCategoryList']) : []
            assList = categoryType.get('saleList')
            acType = 'saleList'
            propertyCostName = '销售费用'
        },
        'XZ_MANAGE': () => {
            assAc = categoryType.get('manageAc')
            assCategoryList = assAc.size ? assAc.getIn([0, 'assCategoryList']) : []
            assList = categoryType.get('manageList')
            acType = 'manageList'
            propertyCostName = '管理费用'
        },
        'XZ_FINANCE': () => {
            assAc = categoryType.get('financeAc')
            assCategoryList = assAc.size ? assAc.getIn([0, 'assCategoryList']) : []
            assList = categoryType.get('financeList')
            acType = 'financeList'
            propertyCostName = '财务费用'
        }
    }[propertyCost] || (() => null))()

    return fromJS({assCategoryList, assList, acType, propertyCostName})
}
