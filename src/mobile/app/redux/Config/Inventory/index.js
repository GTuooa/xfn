import { fromJS, mergeDeep } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import { decimal } from 'app/utils'
import { inventoryHighTypeTemp , inventoryTypeTemp, inventoryCardTemp, inventoryBtnStatus } from '../common/originData.js'

const inventoryConfState = fromJS({
    views:{
        anotherName:'全部',
        activeTabKey:'全部',
        activeTabKeyUuid:'',
        insertOrModify:'insert',
        activeInventoryType:'',
        activeInventoryTypeUuid:'',
        selectTypeId:'',//当前选中的类别的id
        selectTypeName:'',
        cardSelectList:[],//卡片删除调整选中
        typeSelect:{},//卡片类别当前选中
        treeSelect: {//通过类别筛选卡片的信息
            treeTwoList: [],
            treeThreeList: [],
            selectUuid: ['', '', ''],
            selectName: '',//末级名称
            selectEndUuid: '',//末级类别的uuid
        },

        fromPage: 'inventory', // 录入流水的新增
        usedQuantity: false, // 修改时原卡片是否开启数量管理
        otherPageName: '',
        usedOpened: '', // 修改时原卡片是否有期初值
        usedOpenSerial: '', // 修改时原卡片是否开启序列号
        usedOpenBatch: '', // 修改时原卡片是否开启批次
    },
    typeList:[],//当前顶级类别下的子类别
    cardList:[],
    highTypeList:[],//所有顶级类别列表
    originHighTypeList:[],
    inventoryCardTemp:inventoryCardTemp,
    inventoryHighTypeTemp:inventoryHighTypeTemp,//顶级类别详细信息
    highTypeSelectList:[],
    inventoryTypeTemp:inventoryTypeTemp,//子级类别详情
    typeSelectList:[],
    warehouseTree: [],//仓库树
    showChildList: [],//期初页面展开的uuid
    standardList: [],
    unitList: [],
    purchasePriceList: [],//采购价列表
    salePriceList: [],//销售价列表
    stockCategoryTree: [],//类别树列表
    stockList: [],
    assistClassificationList: [],//所有的辅助属性列表
    assist: {//属性新增修改时用
        classificationUuid: '',//属性分类uuid
        classificationName: '',//属性分类uuid
        uuid: '',//属性uuid
        name: '',//属性name
        propertyList: [],//属性列表
    },
    batch: {//新增修改时用(设置和录入流水公用)
        batchType: '',//批次新增修改类型 新增(修改)卡片时新增修改 'INSERT-INSERT INSERT-MODIFY MODIFY-INSERT MODIFY-MODIFY'
        inventoryUuid: '',
        batchUuid: '',
        batch: '',
        productionDate: '',
        openShelfLife: false,
        editPage: 'inventory',//inventory 卡片设置  editRunning 是流水的新增或修改
        allBatchList: [],//批次管理页面所有的列表
    },
    serial: {//新增修改时用
        serialList: [],//当前的序列号列表
        type: '',//OPENTREE OPENLIST
        idx: '',//OPENList的idx
    }
})

// Reducer
export default function reducer(state = inventoryConfState, action = {}) {
    return ({
        [ActionTypes.INIT_INVENCONFIG]                                : () => inventoryConfState,
        [ActionTypes.INVENTORY_CONFIG_INIT]					          : () => {
            action.title.unshift({'name': '全部','uuid':''})
            state = state.set('cardList',fromJS(action.cardList))
                         .set('highTypeList',fromJS(action.title))
                         .set('originHighTypeList',fromJS(action.title))
                         .mergeIn(['views'], fromJS({
                            activeTabKeyUuid: '',
                            activeTabKey: '全部',
                            treeSelect: inventoryConfState.getIn(['views', 'treeSelect'])
                        }))

            return state
        },
        [ActionTypes.CHANGE_ACTIVE_INVENTORY_CONFIG_HIGH_TYPE]        : () => {
            state = state.set('cardList',fromJS(action.cardList))
                         .mergeIn(['views'], fromJS({
                            activeTabKey: action.name,
                            activeTabKeyUuid: action.uuid,
                            selectTypeId: '',
                            selectTypeName: '',
                            cardSelectList: [],
                            treeSelect: inventoryConfState.getIn(['views', 'treeSelect'])
                         }))
            if(action.name != state.getIn(['views','anotherName'])){
                state = state.set('typeList',fromJS(action.treelist))
                             .setIn(['views','selectTypeId'],action.treelist[0].uuid)
                             .setIn(['views','selectTypeName'],action.treelist[0].name)
            }
            return state
        },
        [ActionTypes.SELECT_INVENTORY_CONFIG_CARD_BY_TYPE]            : () => {
            state = state.setIn(['views','selectTypeId'],action.uuid)
                         .setIn(['views','selectTypeName'],action.name)
                         .set('cardList',fromJS(action.list))
            return state
        },
        [ActionTypes.BEFORE_ADD_INVENTORY_CONFIG_CARD]                : () => {
            state = state.set('inventoryCardTemp',fromJS(inventoryCardTemp))
                         .set('highTypeList',state.get('originHighTypeList'))
                         .setIn(['views','insertOrModify'],'insert')
                         .setIn(['inventoryCardTemp','isCheckOut'],action.data.isCheckOut)
                         .setIn(['views', 'fromPage'], action.fromPage || 'inventory')
                         .set('purchasePriceList', fromJS([]))
                         .set('salePriceList', fromJS([]))
                         .setIn(['views', 'usedOpened'], '')
                         .setIn(['views', 'usedOpenSerial'], false)
                         .setIn(['views', 'usedOpenBatch'], false)
                         .set('batch', inventoryConfState.get('batch'))

            return state
        },
        [ActionTypes.BEFORE_ADD_INVENTORY_CARD_FROM_EDIT_RUNNING]     : () => {// 录入流水新增卡片之前
            state = state.set('inventoryCardTemp',fromJS(inventoryCardTemp))
                        .set('highTypeList', action.originTags)
                        .set('purchasePriceList', fromJS([]))
                        .set('salePriceList', fromJS([]))
                        .setIn(['views','insertOrModify'],'insert')
                        .setIn(['inventoryCardTemp', 'code'], action.receivedData.code)
                        .setIn(['views', 'fromPage'], action.otherPageName)
                        .setIn(['views', 'otherPageName'], action.otherPageName)
                        .setIn(['views', 'usedOpened'], '')
                        .setIn(['views', 'usedOpenSerial'], false)
                        .setIn(['views', 'usedOpenBatch'], false)
                        .setIn(['inventoryCardTemp', 'code'], action.receivedData.code)

            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_CONTENT]            : () => {
            state = state.setIn(['inventoryCardTemp',action.name],action.value)

            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_NATURE]             : () => {
            let inventoryAcId = '1405', inventoryAcName = '库存商品'
            if (action.value.value == 6) {
                inventoryAcId = '1403'
                inventoryAcName = '原材料'
            }
            state = state.setIn(['inventoryCardTemp','inventoryNature'],action.value.value)
                         .setIn(['inventoryCardTemp','inventoryNatureName'],action.value.label)
                         .setIn(['inventoryCardTemp','inventoryAcId'], inventoryAcId)
                         .setIn(['inventoryCardTemp','inventoryAcName'], inventoryAcName)

            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_CATEGORY_STATUS]    : () => {
            let subordinateUuid = '';
            state.get('highTypeList').find((v,i)=>{
                if(v.get('uuid') === action.item.get('uuid')){
                    state = state.setIn(['highTypeList',i,'checked'],action.value)
                                 .setIn(['highTypeList',i,'tree'],fromJS(action.list))
                    if(v.get('selectUuid')){
                        subordinateUuid = v.get('selectUuid')
                    }
                    if(action.value){
                        if(action.list[0].childList.length === 0){
                            state = state.setIn(['highTypeList',i,'selectUuid'],action.list[0].uuid)
                                         .setIn(['highTypeList',i,'selectName'],action.list[0].name)
                            subordinateUuid = action.list[0].uuid
                        }
                    }
                    return
                }
            })

            if (action.value) {
                let categoryTypeList = state.getIn(['inventoryCardTemp','categoryTypeList']).toJS()
                categoryTypeList.push({'ctgyUuid':action.item.get('uuid'),'subordinateUuid':subordinateUuid})
                state = state.setIn(['inventoryCardTemp','categoryTypeList'], fromJS(categoryTypeList))
            } else {
                let curIndex = state.getIn(['inventoryCardTemp','categoryTypeList']).findIndex((v,i) => {
                    return v.get('ctgyUuid') === action.item.get('uuid')
                })
                state = state.deleteIn(['inventoryCardTemp','categoryTypeList', curIndex])
            }

            return state
        },
        [ActionTypes.INVENTORY_CONFIG_ADD_CARD_SHOW_MODAL]            : () => {
            state.get('highTypeList').map((item,index) =>{
                if(item.get('uuid') === action.item.get('uuid')){
                    state = state.set('typeList',state.getIn(['highTypeList',index,'tree']))
                                 .setIn(['views','typeSelect'],state.getIn(['highTypeList',index]))
                }
            })
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_CATEGORY_TYPE]      : () => {
            const typeSelect = state.getIn(['views','typeSelect'])
            state.get('highTypeList').map((v,i) =>{
                if(v.get('uuid') === typeSelect.get('uuid')){
                    state = state.setIn(['highTypeList',i,'selectUuid'],action.uuid)
                                 .setIn(['highTypeList',i,'selectName'],action.name)
                    return ;
                }
            })
            state.getIn(['inventoryCardTemp','categoryTypeList']).map((v,i) =>{
                if(v.get('ctgyUuid') === typeSelect.get('uuid')){
                    state = state.setIn(['inventoryCardTemp','categoryTypeList',i,'subordinateUuid'],action.uuid)
                }
            })
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_AC]                 : () => {
            state = state.setIn(['inventoryCardTemp',action.acId],action.uuid)
                         .setIn(['inventoryCardTemp',action.acName],action.name)
            return state
        },
        [ActionTypes.SAVE_INVENTORY_CONFIG_CARD]                      : () => {
            state = state.set('cardList',fromJS(action.list))

            if (action.flag === 'insertAndNew') {
                state = state.set('purchasePriceList', fromJS([]))
                            .set('salePriceList', fromJS([]))
                            .mergeIn(['inventoryCardTemp'], fromJS({
                                name: '',
                                code: action.autoIncrementCode,
                                opened: '',
                                openedQuantity: '',
                                openList: [],
                                isOpenedQuantity: false,
                                unit: inventoryCardTemp['unit'],
                                financialInfo: inventoryCardTemp['financialInfo'],
                                assemblyState: 'CLOSE',
                                assemblySheet: inventoryCardTemp['assemblySheet'],
                            }))
            } else {
                state = state.set('highTypeList',state.get('originHighTypeList'))
            }
            return state
        },
        [ActionTypes.BEFORE_EDIT_INVENTORY_CONFIG_CARD]               : () => {
            const usedOpenSerial = action.data.financialInfo ? action.data.financialInfo.openSerial : false
            const usedOpenBatch = action.data.financialInfo ? action.data.financialInfo.openBatch : false
            state = state.set('inventoryCardTemp', fromJS(inventoryCardTemp).mergeDeep(fromJS(action.data)))
                         .setIn(['views','insertOrModify'],'modify')
                         .setIn(['views', 'fromPage'], 'inventory')
                         .setIn(['views', 'usedQuantity'], action.data.isOpenedQuantity)
                         .setIn(['views', 'usedOpened'], action.data.opened)
                         .setIn(['views', 'usedOpenSerial'], usedOpenSerial)
                         .setIn(['views', 'usedOpenBatch'], usedOpenBatch)

            action.data.categoryTypeList.map((item,index) =>{
                state.get('highTypeList').map((v,i) =>{
                    if(item.ctgyUuid === v.get('uuid')){
                        state = state.setIn(['highTypeList',i,'checked'],true)
                                     .setIn(['highTypeList',i,'selectUuid'],item.subordinateUuid)
                                     .setIn(['highTypeList',i,'selectName'],item.subordinateName)
                                     .setIn(['highTypeList',i,'tree'],fromJS(item.options))
                        return ;
                    }
                })
            })
            if(action.data.inventoryNature == 5){
                state = state.setIn(['inventoryCardTemp','inventoryNatureName'],'库存商品')
            } else if(action.data.inventoryNature == 6){
                state = state.setIn(['inventoryCardTemp','inventoryNatureName'],'原材料')
            }
            if(action.data.opened == 0){
                state = state.setIn(['inventoryCardTemp','opened'],'')
            }
            //仓库卡片筛掉全部的
            let openList = action.data.openList
            if (action.isOpenedWarehouse && openList.length) {
                openList = action.data.openList[0]['childList']
                state = state.setIn(['inventoryCardTemp', 'openList'], fromJS(openList))
            }

            let purchasePriceList = [], salePriceList = []
            if (action.data.unitPriceList.length) {
                action.data.unitPriceList.forEach(v => {
                    if (v['type'] == 1) {
                        purchasePriceList.push(v)
                    }
                    if (v['type'] == 2) {
                        salePriceList.push(v)
                    }
                })
            }
            if (action.data.isOpenedQuantity) {
                if (purchasePriceList.length==0) {
                    purchasePriceList.push({
                        unitUuid: action.data.unit.uuid,
                        name: action.data.unit.name,
                        defaultPrice: '',
                         "type": 1
                    })
                }
                if (salePriceList.length==0) {
                    salePriceList.push({
                        unitUuid: action.data.unit.uuid,
                        name: action.data.unit.name,
                        defaultPrice: '',
                         "type": 2
                    })
                }
            }


            return state.set('purchasePriceList', fromJS(purchasePriceList)).set('salePriceList', fromJS(salePriceList))
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_USED_STATUS]        : () => {
            state = state.setIn(['inventoryCardTemp','used'],action.used)
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_BOX_STATUS]         : () => {
            const cardList = state.get('cardList')
            let cardSelectList = state.getIn(['views','cardSelectList']).toJS()
            cardList.find((item,index) => {
                if(item.get('uuid') === action.uuid){
                    state = state.setIn(['cardList',index,'checked'],action.status)
                }
            })
            if (action.status) {
                cardSelectList.push({'uuid':action.uuid})
                state = state.setIn(['views','cardSelectList'], fromJS(cardSelectList))

            } else {
                cardSelectList.find((item,index) => {
                    if (item['uuid'] === action.uuid) {
                        state = state.deleteIn(['views','cardSelectList', index])
                    }
                })
            }
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_HIGHT_TYPE_BOX_STATUS]   : () => {
            const highTypeList = state.get('highTypeList')

            highTypeList.find((item,index) => {
                if(item.get('uuid') === action.uuid){
                    state = state.setIn(['highTypeList',index,'checked'],action.status)
                }
            })

            let highTypeSelectList = []
            state.get('highTypeList').map(v => {
                if (v.get('checked')) {
                    highTypeSelectList.push({uuid: v.get('uuid')})
                }
            })

            return state.set('highTypeSelectList', fromJS(highTypeSelectList))
        },
        [ActionTypes.DELETE_INVENTORY_CONFIG_CARD_LIST]               : () => {
            state = state.set('cardList',fromJS(action.list))
                         .setIn(['views','cardSelectList'],fromJS([]))
                         .set('typeList',fromJS(action.treeList))
            return state
        },
        [ActionTypes.CHANGE_MODAL_ACTIVE_HIGH_TYPE]                   : () => {
            state = state.setIn(['views','activeInventoryType'],action.name)
                         .setIn(['views','activeInventoryTypeUuid'],action.uuid)
                         .set('inventoryHighTypeTemp',fromJS(action.info))
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_HIGH_TYPE_CONTENT]       : () => {
            state = state.setIn(['inventoryHighTypeTemp',action.name],action.value)
            return state
        },
        [ActionTypes.GET_INVENTORY_CONFIG_HIGH_TYPE_LIST]             : () => {
            action.title.unshift({'name':state.getIn(['views','anotherName']),'uuid':''})
            state = state.set('highTypeList',fromJS(action.title))
                         .set('originHighTypeList',fromJS(action.title))
            return state
        },
        [ActionTypes.INSERT_INVENTORY_CONFIG_HGIH_TYPE]               : () => {
            state = state.setIn(['views','activeInventoryType'],'')
                         .setIn(['views','activeInventoryTypeUuid'],'')
                         .set('inventoryHighTypeTemp',fromJS(inventoryHighTypeTemp))
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_SELECT_LIST]        : () => {
            if (action.clearType=='cardList') {
                state = state.setIn(['views','cardSelectList'],fromJS([]))
                .update('cardList', v => v.map(w => w.set('checked', false)))
            }
            if (action.clearType=='highTypeList') {
                state = state.setIn(['views','highTypeSelectList'],fromJS([]))
                .update('highTypeList', v => v.map(w => w.set('checked', false)))
            }
            if (action.clearType=='treeList') {
                let treeList = state.getIn(['inventoryHighTypeTemp', 'treeList']).toJS()
                const loop = (data) => data.map((item,index) => {
                    item.checked = false
                    if(item.childList.length > 0){
                        loop(item.childList)
                    }
                })
                loop(treeList)
                state = state.setIn(['inventoryHighTypeTemp', 'treeList'], fromJS(treeList))
            }

            return state
        },
        [ActionTypes.DELETE_INVENTORY_CONFIG_HGIH_TYPE]               : () => {
            action.title.unshift({'name':state.getIn(['views','anotherName']),'uuid':''})
            state = state.set('highTypeList',fromJS(action.title))
                         .set('originHighTypeList',fromJS(action.title))
                         .setIn(['views','activeInventoryType'],'')
                         .setIn(['views','activeInventoryTypeUuid'],'')
            return state
        },
        [ActionTypes.INSERT_INVENTORY_CONFIG_CARD_TYPE]               : () => {
            state = state.set('inventoryTypeTemp',fromJS(inventoryTypeTemp))
                         .setIn(['inventoryTypeTemp','parentUuid'],action.uuid)
                         .setIn(['inventoryTypeTemp','parentName'],action.name)
                         .set('inventoryTypeAddOrEdit','add')
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_TYPE_CONTENT]       : () => {
            state = state.setIn(['inventoryTypeTemp',action.name],action.value)
            return state
        },
        [ActionTypes.SELECT_INVENTORY_CONFIG_CARD_TYPE]               : () => {
            state = state.setIn(['inventoryTypeTemp','parentName'],action.parentName)
                         .setIn(['inventoryTypeTemp','parentUuid'],action.parentUuid)
            return state
        },
        [ActionTypes.GET_INVENTORY_CONFIG_TYPE_CONTENT]               : () => {
            state = state.set('inventoryTypeTemp',fromJS(action.data))
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_TYPE_SELECT_LIST]        : () => {
            let treeList = state.getIn(['inventoryHighTypeTemp', 'treeList']).toJS()
            const loop = (data, isChild) => data.map((item, index) => {
                    let isTreeChild = isChild
                    if (item['uuid'] == action.uuid || isChild) {
                        item['checked'] = action.value
                        isTreeChild = true
                    }
                    if (item['childList'].length > 0) {
                        loop(item['childList'], isTreeChild)
                    }
                })

            loop(treeList, false)

            return state.setIn(['inventoryHighTypeTemp', 'treeList'], fromJS(treeList))
        },
        [ActionTypes.CONFIRM_DELETE_INVENTORY_CONFIG_TYPE]            : () => {
            state = state.setIn(['inventoryHighTypeTemp', 'treeList'],fromJS(action.data))
                         .set('typeSelectList',fromJS([]))
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_CONFIG_TYPE_POSITION]           : () => {
            state = state.setIn(['inventoryHighTypeTemp', 'treeList'], fromJS(action.list))
            return state
        },
        [ActionTypes.GET_INVENTORY_WAREHOUSE_TREE]                    : () => {
            const loop = (data) => data.map((item, index) => {
                            item['key'] = item['uuid']
                            item['label'] = item['name']

                            if (item['childList'].length > 0) {
                                loop(item['childList'])
                            }
                        })

            let warehouseTree = action.data.length ? action.data[0]['childList'] : []
            loop(warehouseTree)

            return state.set('warehouseTree', fromJS(warehouseTree))
        },
        [ActionTypes.GET_INVENTORY_OPEN_TREE]                         : () => {
            const loop = (data) => data.map((item, index) => {
                            item['key'] = item['warehouseUuid']
                            item['label'] = item['warehouseName']

                            item['openedAmount'] = item['openedAmount'] ? item['openedAmount'] : ''
                            item['openedQuantity'] = item['openedQuantity'] ? item['openedQuantity'] : ''

                            if (item['childList'].length > 0) {
                                loop(item['childList'])
                            }
                        })

            let warehouseTree = action.data.length ? action.data[0]['childList'] : []
            loop(warehouseTree)

            let openedQuantity = 0, opened = 0
            warehouseTree.map(v => {
                openedQuantity += Number(v['openedQuantity'])
                opened += Number(v['openedAmount'])
            })

            return state.setIn(['inventoryCardTemp', 'opened'], decimal(opened))
            .setIn(['inventoryCardTemp', 'openedQuantity'], decimal(openedQuantity, 4))
            .setIn(['inventoryCardTemp', 'openList'], fromJS(warehouseTree))
        },
        [ActionTypes.CHANGE_INVENTORY_OPENED]                         : () => {
            const selfUuid = action.uuidList.pop()
            const number = action.value ? action.value : 0

            const loop = (data) => data.map((item) => {
                const uuid = item['warehouseUuid']
                const openedAmount = item['openedAmount']
                const openedQuantity = item['openedQuantity']
                const isEnd = item['isEnd']

                if (action.uuidList.includes(uuid)) {
                    if (action.dataType == 'openedQuantity') {
                        const value = Number(openedQuantity) + Number(number)
                        item['openedQuantity'] = decimal(value, 4)
                    }
                    if (action.dataType == 'openedAmount') {
                        const value = Number(openedAmount) + Number(number)
                        item['openedAmount'] = decimal(value)
                    }
                    if (action.dataType == 'openedDelete') {
                        const value = Number(openedQuantity) - Number(number)
                        item['openedQuantity'] = decimal(value, 4)
                        item['openedAmount'] = decimal( Number(openedAmount) - Number(action.selfValue), 4)
                    }
                }
                if (selfUuid==uuid) {
                    const isOpenItem = selfUuid==action.uuidList.slice(-1)[0]//修改期初属性列表
                    if (action.dataType == 'openedQuantity') {
                        if (isOpenItem) {
                            item['childList'][action.idx]['openedQuantity'] = action.selfValue
                        } else {
                            item['openedQuantity'] = action.selfValue
                        }
                    }
                    if (action.dataType == 'openedAmount') {
                        if (isOpenItem) {
                            item['childList'][action.idx]['openedAmount'] = action.selfValue
                        } else {
                            item['openedAmount'] = action.selfValue
                        }
                    }
                    if (action.dataType == 'openedAssist') {
                        if (isOpenItem) {
                            item['childList'][action.idx] = Object.assign(item['childList'][action.idx], action.value)
                        } else {
                            item = Object.assign(item, action.value)
                        }
                    }
                    if (action.dataType == 'openedDelete') {
                        item['childList'].splice(action.idx, 1)
                    }
                    if (action.dataType == 'openedAdd') {
                        item['childList'].push({
                            "openUuid": "",
                            "batchUuid": "",
                            "batch": "",
                            "warehouseUuid": item['warehouseUuid'],
                            "warehouseCode": item['warehouseCode'],
                            "warehouseName": item['warehouseName'],
                            "openedAmount": '',
                            "openedQuantity": '',
                            "assistList": [],
                            "serialList": [],
                            "childList": []
                        })
                    }
                }

                if (!isEnd && item['childList'].length > 0) {
                    loop(item['childList'])
                }
            })

            let openTree = state.getIn(['inventoryCardTemp', 'openList']).toJS()
            loop(openTree)

            let openedQuantity = 0, opened = 0
            openTree.map(v => {
                openedQuantity += Number(v['openedQuantity'])
                opened += Number(v['openedAmount'])
            })

            if (action.dataType == 'openedQuantity') {
                state = state.setIn(['inventoryCardTemp', 'openedQuantity'], decimal(openedQuantity, 4))
            }
            if (action.dataType == 'openedAmount') {
                state = state.setIn(['inventoryCardTemp', 'opened'], decimal(opened))
            }

            return state.setIn(['inventoryCardTemp', 'openList'], fromJS(openTree))
        },
        [ActionTypes.INVENTORY_TOGGLELOWER_ITEM]				      : () => {
			const showChildList = state.get('showChildList')

            if (showChildList.includes(action.uuid)) {
                return state.update('showChildList', v => v.map(w => w.indexOf(action.uuid) > -1 ? '' : w).filter(w => !!w))
            } else {
                return state.update('showChildList', v => v.push(action.uuid))
            }
		},
        [ActionTypes.GET_INVENTORY_UNIT_LIST]				          : () => {
            let unitList = []
            action.data.customList.map(v => {
                v['key'] = v['fullName']
                v['value'] = v['uuid']
                unitList.push(v)
            })
            action.data.standardList.map(v => {
                v['key'] = v['fullName']
                v['value'] = v['uuid']
                v['unitList'] = []
                unitList.push(v)
            })
            return state.set('standardList', fromJS(action.data.standardList))
                        .set('unitList', fromJS(unitList))
		},
        [ActionTypes.CHANGE_INVENTORY_DATA]				              : () => {
            if (action.short) {
                return state.set(action.dataType, action.value)
            } else {
                return state.setIn(action.dataType, action.value)
            }
		},
        [ActionTypes.INVENTORY_CLEAR_OPENED_QUANTITY]                 : () => {
            let openTree = state.getIn(['inventoryCardTemp', 'openList']).toJS()
            const openSerial = state.getIn(['inventoryCardTemp', 'financialInfo', 'openSerial'])
            const openAssist = state.getIn(['inventoryCardTemp', 'financialInfo', 'openAssist'])
            const openBatch = state.getIn(['inventoryCardTemp', 'financialInfo', 'openBatch'])
            const hasProperty = openSerial || openAssist || openBatch

            if (action.openType == 'OPENTREE') {
                const loop = (data) => data.map((item) => {
                    item['openedQuantity'] = ''
                    item['openedAmount'] = ''

                    if (item['childList'].length > 0) {
                        if (!hasProperty && item['warehouseUuid']==item['childList'][0]['warehouseUuid']) {
                            item['childList'] = []
                        }
                        loop(item['childList'])
                    }
                })
                loop(openTree)
            }

            if (action.openType == 'OPENLIST') {
                openTree.forEach(v => {
                    v['openedQuantity']=''
                    v['openedAmount']=''
                })
            }

            return state.setIn(['inventoryCardTemp', 'openList'], fromJS(openTree))
                        .setIn(['inventoryCardTemp', 'openedQuantity'], '')
                        .setIn(['inventoryCardTemp', 'opened'], '')
        },



    }[action.type] || (() => state))()
}
