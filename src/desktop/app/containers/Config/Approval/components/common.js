import * as Limit from 'app/constants/Limit.js'
import { toJS, fromJS } from 'immutable'

const formDiyList = [
    {
        "componentId":"TextField-ZJ7A8B4F",
        "componentType":"TextField",
        "label":"单行输入框",
        "placeHolder":"请输入",
        "required":false,
        "print":true,
        "orderValue":0,
        "canDelete":false,
        "canModify":false
    },
    {
        "componentId":"TextareaField-ZJ266CC0",
        "componentType":"TextareaField",
        "label":"多行输入框",
        "placeHolder":"请输入",
        "required":false,
        "print":true,
        "orderValue":1,
        "canDelete":false,
        "canModify":false
    },
    {
        "componentId":"MoneyField-ZJ8BB160",
        "componentType":"MoneyField",
        "label":"金额（元）",
        "placeHolder":"请输入金额",
        "required":false,
        "print":true,
        "orderValue":2,
        "canDelete":false,
        "canModify":false,
        "jrComponentType":"",
        "upper":true
    },
    {
        "componentId":"NumberField-ZJ00C292",
        "componentType":"NumberField",
        "label":"数字输入框",
        "placeHolder":"请输入数字",
        "required":false,
        "print":true,
        "orderValue":3,
        "canDelete":false,
        "canModify":false,
        "unit":""
    },
    {
        "componentId":"DDSelectField-ZJ8336F7",
        "componentType":"DDSelectField",
        "label":"单选框",
        "placeHolder":"请选择",
        "required":false,
        "print":true,
        "orderValue":5,
        "canDelete":false,
        "canModify":false,
        "jrComponentType":"",
        "options":true,
        "selectValueList":['', '', '']
    },
    {
        "componentId":"DDMultiSelectField-ZJFC8D72",
        "componentType":"DDMultiSelectField",
        "label":"多选框",
        "placeHolder":"请选择",
        "required":false,
        "print":true,
        "orderValue":6,
        "canDelete":false,
        "canModify":false,
        "options":true,
        "selectValueList":['', '', '']
    },
    {
        "componentId":"DDDateField-ZJ6A1E0B",
        "componentType":"DDDateField",
        "label":"日期",
        "placeHolder":"请选择",
        "required":false,
        "print":true,
        "orderValue":7,
        "canDelete":false,
        "canModify":false,
        "jrComponentType":"",
        "unit":"小时",
        "dateFormat":"yyyy-MM-dd hh:mm"
    },
    {
        "componentId":"DDDateRangeField-ZJC5DC4E",
        "componentType":"DDDateRangeField",
        "label":"",
        "placeHolder":"请选择",
        "required":false,
        "print":true,
        "orderValue":8,
        "canDelete":false,
        "canModify":false,
        "dateRangeLabelFirst":"开始时间",
        "dateRangeLabelLast":"结束时间",
        "unit":"小时",
        "dateFormat":"yyyy-MM-dd hh:mm"
    },
    {
        "componentId":"DDPhotoField-ZJFA1A3A",
        "componentType":"DDPhotoField",
        "label":"图片",
        "placeHolder":"",
        "required":false,
        "print":true,
        "orderValue":10,
        "canDelete":false,
        "canModify":false
    },
    {
        "componentId":"DDAttachment-ZJ1C8978",
        "componentType":"DDAttachment",
        "label":"附件",
        "placeHolder":"",
        "required":false,
        "print":true,
        "orderValue":11,
        "canDelete":false,
        "canModify":false
    },
    {
        "componentId":"InnerContactField-ZJ6A8FA0",
        "componentType":"InnerContactField",
        "label":"联系人",
        "placeHolder":"请选择",
        "required":false,
        "print":true,
        "orderValue":12,
        "canDelete":false,
        "canModify":false,
        "choice":false,
        "jrComponentType":""
    },
]

const componentName = {
    TextField: '单行输入框',
    TextareaField: '多行输入框',
    MoneyField: '金额',
    NumberField: '数字输入框',
    DDDateField: '日期',
    DDDateRangeField: '日期区间',
    TableField: '明细',
    DDSelectField: '单选框',
    NumberField: '数字输入框',
    DDMultiSelectField: '多选框',
    DDPhotoField: '图片',
    DDAttachment: '附件',
    InnerContactField: '联系人',
    RelateField: '关联审批单',
}

export const systemProJectCodeCommon = ['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL']

export const propertyCostNameJson = {
    'XZ_SALE':'销售费用',
    'XZ_MANAGE':'管理费用',
    'XZ_FINANCE':'财务费用',
    'XZ_SCCB':'生产成本',
    'XZ_FZSCCB':'辅助生产成本',
    'XZ_ZZFY':'制造费用',
    'XZ_HTCB':'合同成本',
    'XZ_JJFY':'间接费用',
    'XZ_JXZY':'机械作业'
}

export const receiptList = ['LB_YYSR', 'LB_YYWSR', 'LB_ZSKX']
export const hideCategoryCanSelect = ["LB_ZZ", 'LB_CHDB']

export const r = ["LB_ZZ", 'LB_CHDB']

// 调整 和 审批模版 筛选出可选的流水类别 payOrReceive, isStock, jrCategoryType, isDJ
function getSelectJrCategoryList(allCategoryList, hideCategoryList, parentDisabled, currentInfo) {

    if (allCategoryList && allCategoryList.getIn([0, 'childList']).size > 0) {
        let canSelectCategoryType = ['LB_YYSR', 'LB_YYZC', 'LB_FYZC', 'LB_XCZC', 'LB_YYWSR', 'LB_YYWZC', 'LB_ZSKX', 'LB_ZFKX']
        
        // 调整弹框的类别要根据情况选择能
        if (currentInfo.payOrReceive === 'RECEIPT') {
            canSelectCategoryType = ['LB_YYSR', 'LB_YYWSR']
            if (currentInfo.isStock) { // 带货物
                canSelectCategoryType = ['LB_YYSR']
            }
            if (currentInfo.jrCategoryType === 'LB_ZSKX') {
                canSelectCategoryType = ['LB_ZSKX']
            }
            if (currentInfo.isDJ) {
                canSelectCategoryType = ['LB_YYSR']
            }
        } else if (currentInfo.payOrReceive === 'PAYMENT') { 
            canSelectCategoryType = ['LB_YYZC', 'LB_FYZC', 'LB_XCZC', 'LB_YYWZC']
            if (currentInfo.isStock) { // 带货物
                canSelectCategoryType = ['LB_YYZC']
            }
            if (currentInfo.jrCategoryType === 'LB_ZFKX') {
                canSelectCategoryType = ['LB_ZFKX']
            }
            if (currentInfo.isDJ) {
                canSelectCategoryType = ['LB_YYZC', 'LB_FYZC']
            }
        }
        let selectCategoryList = allCategoryList.getIn([0, 'childList']).filter(v => canSelectCategoryType.indexOf(v.get('categoryType')) > -1)

        // 特殊处理 营业收入 服务 类别
        const indexYYSR = selectCategoryList.findIndex(v => v.get('categoryType')==='LB_YYSR')
        if (indexYYSR > -1) {
            if (currentInfo.payOrReceive) { // 有值说明是查询审批调整框来的
                if (currentInfo.isStock) {
                    selectCategoryList = selectCategoryList.updateIn([indexYYSR, 'childList'], v => v.filter(w => w.get('propertyCarryover') == 'SX_HW' || w.get('propertyCarryover') == 'SX_HW_FW'))
                } else if (currentInfo.isDJ) {
                    selectCategoryList = selectCategoryList.updateIn([indexYYSR, 'childList'], v => v.filter(w => w.get('propertyList').indexOf('GXZT_DJGL') > -1))
                } else { // 切换除了营业收入外的其他收入类别 或 营业收入服务属性
                    selectCategoryList = selectCategoryList.updateIn([indexYYSR, 'childList'], v => v.filter(w => w.get('propertyCarryover') == 'SX_FW' || w.get('propertyCarryover') == 'SX_HW_FW'))
                }
            }
        }
        // 特殊处理 营业支出 服务 类别
        const indexYYZC = selectCategoryList.findIndex(v => v.get('categoryType')==='LB_YYZC')
        if (indexYYZC > -1) {
            if (currentInfo.payOrReceive) { // 有值说明是查询审批调整框来的
                if (currentInfo.isStock) { 
                    selectCategoryList = selectCategoryList.updateIn([indexYYZC, 'childList'], v => v.filter(w => w.get('propertyCarryover') == 'SX_HW'))
                } else if (currentInfo.isDJ) {
                    selectCategoryList = selectCategoryList.updateIn([indexYYZC, 'childList'], v => v.filter(w => w.get('propertyList').indexOf('GXZT_DJGL') > -1))
                } else {
                    selectCategoryList = selectCategoryList.updateIn([indexYYZC, 'childList'], v => v.filter(w => w.get('propertyCarryover') == 'SX_FW'))
                }
            }
        }
        // 特殊处理 薪酬支出 福利费
        const indexXCZC = selectCategoryList.findIndex(v => v.get('categoryType')==='LB_XCZC')
        if (indexXCZC > -1) {
            selectCategoryList = selectCategoryList.updateIn([indexXCZC, 'childList'], v => v.filter(w => w.get('propertyPay') == 'SX_FLF' || w.get('propertyPay') == 'SX_QTXC'))
            if (!selectCategoryList.getIn([indexXCZC, 'childList']).size) {
                selectCategoryList = selectCategoryList.delete(indexXCZC)
            }
        }

        const indexFYZC = selectCategoryList.findIndex(v => v.get('categoryType')==='LB_FYZC')
        if (indexFYZC > -1) {
            if (currentInfo.payOrReceive) { // 有值说明是查询审批调整框来的
                if (currentInfo.isDJ) {
                    selectCategoryList = selectCategoryList.updateIn([indexFYZC, 'childList'], v => v.filter(w => w.get('propertyList').indexOf('GXZT_DJGL') > -1))
                }
            }
        }

        const loop = (data, leve) => data.map(item => {
            const childList = item.childList
            if (childList && childList.length) {
                return {
                    title: item.name,
                    value: item.uuid + Limit.TREE_JOIN_STR + item.categoryType + Limit.TREE_JOIN_STR + item.name,
                    key: item.uuid,
                    disabled: parentDisabled ? true : false,
                    children: loop(childList, leve+1)
                }
            } else {
                return {
                    title: item.name,
                    value: item.uuid + Limit.TREE_JOIN_STR + item.categoryType + Limit.TREE_JOIN_STR + item.name,
                    // 最外面的类别如果没有子类别不可选, 除了营业外收支、暂收暂付
                    disabled: (item.categoryType === 'LB_YYWSR' || item.categoryType === 'LB_YYWZC' || item.categoryType === 'LB_ZSKX' || item.categoryType === 'LB_ZFKX') ? false : leve === 1,
                    key: item.uuid,
                }
            }
        })

        let selectTreeList = loop(selectCategoryList.toJS(), 1)

        let newHideCategory = hideCategoryList ? hideCategoryList.filter(v => ["LB_ZZ", 'LB_CHHS'].indexOf(v.get('categoryType')) > -1) : fromJS([])
        
        // 特殊处理 薪酬支出 福利费
        const indexCHHS = newHideCategory.findIndex(v => v.get('categoryType')==='LB_CHHS')
        if (indexCHHS > -1) {
            newHideCategory = newHideCategory.updateIn([indexCHHS, 'childList'], v => v.filter(w => hideCategoryCanSelect.indexOf(w.get('categoryType')) > -1))
            if (!newHideCategory.getIn([indexCHHS, 'childList']).size) {
                newHideCategory = newHideCategory.delete(indexCHHS)
            }
        }

        const loopHideCategory = (data, leve) => data.map(item => {
            const childList = item.childList
            if (childList && childList.length) {
                return {
                    title: item.name,
                    value: item.uuid + Limit.TREE_JOIN_STR + item.categoryType + Limit.TREE_JOIN_STR + item.name,
                    key: item.uuid,
                    // disabled: (item.name === '营业支出' && item.level === 1) ? true : (parentDisabled ? true : false), // 顶级营业支出不可选
                    // disabled: parentDisabled ? true : false,
                    disabled: true,
                    children: loop(childList, leve+1)
                }
            } else {
                return {
                    title: item.name,
                    value: item.uuid + Limit.TREE_JOIN_STR + item.categoryType + Limit.TREE_JOIN_STR + item.name,
                    key: item.uuid,
                }
            }
        })
        selectTreeList = selectTreeList.concat(loopHideCategory(newHideCategory.toJS()))
        // console.log('hideCategoryList', newHideCategory);
        return selectTreeList
    } else {
        return []
    }
}

function getSelectJrCategoryChildList(parentUuid, allCategoryList) {

    if (allCategoryList && allCategoryList.getIn([0, 'childList']).size > 0 && parentUuid) {

        const canSelectCategoryType = ['LB_YYSR', 'LB_YYZC', 'LB_FYZC', 'LB_XCZC', 'LB_YYWSR', 'LB_YYWZC', 'LB_ZSKX', 'LB_ZFKX'] // 所有可选类别
        let selectCategoryList = allCategoryList.getIn([0, 'childList']).filter(v => canSelectCategoryType.indexOf(v.get('categoryType')) > -1)

        // 特殊处理 费用支出 财务费用 类别
        const indexFYZC = selectCategoryList.findIndex(v => v.get('categoryType')==='LB_FYZC')
        if (indexFYZC > -1) {
            const cwCatefory = selectCategoryList.getIn([indexFYZC, 'childList']).find(v => v.getIn(['propertyCostList', 0]) === 'XZ_FINANCE')
            if (cwCatefory) { // 如果有 财务费用 ，单独拎到外面
                selectCategoryList = selectCategoryList.update(v => v.set(v.size, cwCatefory))
                    .updateIn([indexFYZC, 'childList'], v => v.filter(w => w.getIn(['propertyCostList', 0]) !== 'XZ_FINANCE'))
            }
        }
        
        // 特殊处理 薪酬支出 福利费
        const indexXCZC = selectCategoryList.findIndex(v => v.get('categoryType')==='LB_XCZC')
        if (indexXCZC > -1) {
            selectCategoryList = selectCategoryList.updateIn([indexXCZC, 'childList'], v => v.filter(w => w.get('propertyPay') == 'SX_FLF' || w.get('propertyPay') == 'SX_QTXC'))
            if (!selectCategoryList.getIn([indexXCZC, 'childList']).size) {
                selectCategoryList = selectCategoryList.delete(indexXCZC)
            }
        }

        let childTreeList = [] // 所选类别的childList
        const loop = (data) => {
            for (let i = 0; i<data.length; i++) {
                const childList = data[i].childList
                if (data[i].uuid === parentUuid) {
                    childTreeList = data[i].childList
                    break;
                } else if (childList && childList.length) {
                    loop(data[i].childList)
                }
            }
        }
        loop(selectCategoryList.toJS()) // 找到所选类别的childList

        let childAllList = [] // 所选类别的childList的所有末级
        const loopChild = (data, parentName) => data.forEach(item => {
            const childList = item.childList
            if (childList && childList.length) {
                loopChild(childList, parentName ? `${parentName}_${item.name}` : item.name)
            } else {
                childAllList.push(item.uuid+Limit.APPROVAL_JOIN_STR+`${parentName ? `${parentName}_${item.name}` : item.name}`)
            }
        })
        loopChild(childTreeList, '')
        return childAllList
    } else {
        return []
    }
}

function formatWarehouseCardList (warehouseCardList) {

    if (warehouseCardList.size) {

        let selectList
        if (warehouseCardList.getIn([0, 'childList']) && warehouseCardList.getIn([0, 'childList']).size > 0) {
            selectList  = warehouseCardList.getIn([0, 'childList'])
        } else {
            selectList = warehouseCardList
        }

        const loop = (data, parentName) => data.map(item => {
            const childList = item.childList
            if (childList && childList.length) {
                return {
                    title: item.code + Limit.APPROVAL_JOIN_STR + item.name,
                    value: item.uuid + Limit.TREE_JOIN_STR + item.code + Limit.TREE_JOIN_STR + `${parentName ? `${parentName}_${item.name}` : item.name}`,
                    key: item.uuid,
                    // disabled: true, 
                    children: loop(childList, parentName ? `${parentName}_${item.name}` : item.name)
                }
            } else {
                return {
                    title: item.code + Limit.APPROVAL_JOIN_STR + item.name,
                    value: item.uuid + Limit.TREE_JOIN_STR + item.code + Limit.TREE_JOIN_STR + `${parentName ? `${parentName}_${item.name}` : item.name}`,
                    disabled: false,
                    key: item.uuid,
                }
            }
        })

        const selectTreeList = loop(selectList.toJS(), '')
        return selectTreeList
    } else {
        return []
    }
}

function formatAccountCardList (accountCardList) {

    if (accountCardList.size && accountCardList.getIn([0, 'childList']).size > 0) {

        const selectList = accountCardList.getIn([0, 'childList'])

        const loop = (data) => data.map(item => {
            const childList = item.childList
            if (childList && childList.length) {
                return {
                    title: item.name,
                    value: item.uuid + Limit.TREE_JOIN_STR + item.name,
                    key: item.uuid,
                    // disabled: true, 
                    children: loop(childList)
                }
            } else {
                return {
                    title: item.name,
                    value: item.uuid + Limit.TREE_JOIN_STR + item.name,
                    disabled: false,
                    key: item.uuid,
                }
            }
        })

        const selectTreeList = loop(selectList.toJS(), '')
        return selectTreeList
    } else {
        return []
    }
}

function formatCommonCardList (cardList) {

    const loop = (data) => data.map(item => {
        return {
            title: item.code + Limit.APPROVAL_JOIN_STR + item.name,
            value: item.uuid + Limit.TREE_JOIN_STR + item.code + Limit.TREE_JOIN_STR + item.name,
            disabled: false,
            key: item.uuid,
        }
    })

    const selectTreeList = loop(cardList.toJS())
    return selectTreeList
}

export { formDiyList, getSelectJrCategoryList, componentName, getSelectJrCategoryChildList, formatWarehouseCardList, formatAccountCardList, formatCommonCardList }