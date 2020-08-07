import { fromJS, toJS }	from 'immutable'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { inventoryHighType, inventoryCardType, inventorySettingCard,inventorySettingBtnStatus} from '../originData.js'

//生产环境应当设置为空
const inventorySettingState = fromJS({
    flags:{
        iframeload: false,
        showMessageMask: false,
        totalNumber: 0,
        curNumber: 0,
        importKey:''
    },
    'anotherTabName':'全部',
    'activeTapKey':'全部',
    'activeTapKeyUuid':'',
    'activeInventoryType':'',
    'activeInventoryTypeUuid':'',
    'activeTreeKeyUuid':'',
    'tags':[],
    'originTags':[],
    'inventoryHighType':{
        "name":"",
        "isAppliedSale":false,
        "isAppliedPurchase":false,
        'isAppliedProduce':false,
        "isAppliedWater":false,
        "isAppliedInvoicing":false,
    },
    'inventoryCardType':{
        "parentUuid": "",
        "name":"",
        "remark":"",
        "ctgyUuid" : "",
        "parentName":'',
        "uuid":''
    },
    'undefineCard':{
        "uuid": "",
        "inventoryAcId": "1405",
        "inventoryAcName": "库存商品",
    },
    'inventorySettingCard':{
        "code": "",
        "name":"",
        "inventoryNature":"",
        "inventoryAcName" : "",
        "inventoryAcId":'',
        "opened":'',
        "remark":'',
        "isAppliedSale":false,
        "isAppliedPurchase":false,
        'isAppliedProduce':false,
        "categoryTypeList":[]
    },
    'inventorySettingBtnStatus':{
        'isAdd':false,
        'isDelete':false,
        'treeUuid':'',
        'treeName':'全部',
        'isUp':false,
        'isDown':false,
        'upUuid':'',
        'downUuid':'',
        'isEdit':false,
        'parentUuid':''
    },
    'typeTree':[],
    'typeTreeSelectList':[],
    'insertOrModify':'insert',
    'cardList':[],
    'cardSelectList':[],
    'selectTypeId':'',
    'selectTypeName':'',
    importresponlist: {
        failJsonList:[],
        successJsonList:[],
        mediaId:''
    },
    message:'',
})

const checkTreeNodeIsUpDown = (state,uuid) => {
    //获取选中节点名称，下标，父级uuid
    const list = state.get('typeTree').toJS()
    if(uuid != list[0].uuid){
        let name = ''
        let selectList = []
        let selectIndex = ''
        let parentUuid = ''

        const loop = (data) => data.map((item,index) =>{
            if(item.uuid === uuid){
                name = item.name
                selectIndex = index
                parentUuid = item.parentUuid
            }
            if(item.childList.length > 0){
                loop(item.childList)
            }
        })


        loop(list)

        state = state.setIn(['inventorySettingBtnStatus','treeUuid'],uuid)
                     .setIn(['inventorySettingBtnStatus','treeName'],name)
                     .setIn(['inventorySettingBtnStatus','parentUuid'],parentUuid ? parentUuid : '')

        //选中父级的子列表
         const loopParent = (data) => data.map((item,index) =>{
             if(item.uuid === parentUuid){
                 selectList = item.childList
             }
             if(item.childList.length > 0){
                 loopParent(item.childList)
             }
         })

         loopParent(list)

         let upIndex = Number(selectIndex) - 1
         let downIndex = Number(selectIndex) + 1
         if(selectIndex === 0 || name === '未分类'){
             state = state.setIn(['inventorySettingBtnStatus','isUp'],false)
                          .setIn(['inventorySettingBtnStatus','upUuid'],'')
         }else{
              state = state.setIn(['inventorySettingBtnStatus','isUp'],true)
                           .setIn(['inventorySettingBtnStatus','upUuid'],selectList[upIndex].uuid)
         }

         if(selectIndex === selectList.length -1 || selectList[downIndex].name === '未分类'){
             state = state.setIn(['inventorySettingBtnStatus','isDown'],false)
                          .setIn(['inventorySettingBtnStatus','downUuid'],'')
         }else{
             state = state.setIn(['inventorySettingBtnStatus','isDown'],true)
                          .setIn(['inventorySettingBtnStatus','downUuid'],selectList[downIndex].uuid)
         }
      }
      return state
}

export default function handleLrb(state = inventorySettingState, action) {
	return ({
        // 改变存货设置内容
        [ActionTypes.INIT_INVENTORYSETTING]                              : () => inventorySettingState,
        [ActionTypes.CHANGE_INVENTORY_SETTING_HIGH_TYPE_CONTENT]         : () => {
            state = state.setIn(['inventoryHighType',action.name],action.value)
            return state
        },
        [ActionTypes.GET_INVENTORY_SETTING_HIGH_TYPE_LIST]         : () => {
            action.title.unshift({'name':state.get('anotherTabName'),'uuid':''})
            state = state.set('tags',fromJS(action.title))
                         .set('originTags',fromJS(action.title))
            return state
        },
        [ActionTypes.EDIT_INVENETORY_HIGH_TYPE]         : () => {
            let activeName = state.get('activeTapKey') === '全部' ? state.getIn(['tags',1,'name']) : state.get('activeTapKey')
            let activeUuid = state.get('activeTapKey') === '全部' ? state.getIn(['tags',1,'uuid']) : state.get('activeTapKeyUuid')

            state = state.set('inventoryHighType',fromJS(action.info))
                         .set('activeInventoryType',activeName)
                         .set('activeInventoryTypeUuid',activeUuid)
            return state
        },
        [ActionTypes.CHANGE_ACTIVE_INVENTORY_SETTING_HIGH_TYPE]         : () => {
            state = state.set('activeInventoryType',action.name)
                         .set('activeInventoryTypeUuid',action.uuid)
                         .set('activeTapKey',action.name)
                         .set('activeTapKeyUuid',action.uuid)
                         .set('selectTypeId','')
                         .set('selectTypeName','')
                         .set('cardList',fromJS(action.cardList))
                         .set('cardSelectList',fromJS([]))
            if(action.name != state.get('anotherTabName')){
                state = state.set('typeTree',fromJS(action.treelist))
            }
            return state
        },
        [ActionTypes.CHANGE_MODAL_ACTIVE_HIGH_TYPE]         : () => {
            state = state.set('activeInventoryType',action.name)
                         .set('activeInventoryTypeUuid',action.uuid)
                         .set('inventoryHighType',fromJS(action.info))
            return state
        },
        [ActionTypes.INSERT_INVENTORY_SETTING_HGIH_TYPE]         : () => {
            state = state.set('activeInventoryType','')
                         .set('activeInventoryTypeUuid','')
                         .set('inventoryHighType',fromJS(inventoryHighType))
            return state
        },
        [ActionTypes.DELETE_INVENTORY_SETTING_HGIH_TYPE]         : () => {
            action.title.unshift({'name':state.get('anotherTabName'),'uuid':''})
            state = state.set('tags',fromJS(action.title))
                         .set('originTags',fromJS(action.title))
                         .set('activeInventoryType','')
                         .set('activeInventoryTypeUuid','')
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_TYPE_CONTENT]         : () => {
            state = state.setIn(['inventoryCardType',action.name],action.value)
            return state
        },
        [ActionTypes.GET_INVENTORY_SETTING_UNDEFINE_CARD]         : () => {
            state = state.set('undefineCard',fromJS(action.data))
            return state
        },

        [ActionTypes.SELECT_INVENTORY_SETTING_CARD_TYPE]         : () => {
            state = state.setIn(['inventoryCardType','parentName'],action.parentName)
                         .setIn(['inventoryCardType','parentUuid'],action.parentUuid)
            return state
        },
        [ActionTypes.ADJUST_INVENTORY_SETTING_CARD_TYPE_LIST]         : () => {
            state = state.set('cardList',fromJS(action.list))
                         .set('cardSelectList',fromJS([]))
            return state
        },
        [ActionTypes.SAVE_INVENTORY_SETTING_CARD_TYPE]         : () => {
            state = state.set('typeTree',fromJS(action.typeTree))
            if(action.btnFlag != 'new'){
                state = checkTreeNodeIsUpDown(state,action.uuid)
                state = state.setIn(['inventorySettingBtnStatus','treeName'],state.getIn(['iuManageType','name']))
            }else{
                state = state.set('inventoryCardType',fromJS(action.typeInfo))
                             .setIn(['inventorySettingBtnStatus','treeUuid'],action.typeInfo.uuid)
                             .setIn(['inventorySettingBtnStatus','isAdd'],false)
                             .setIn(['inventorySettingBtnStatus','isEdit'],true)
                state = checkTreeNodeIsUpDown(state,action.typeInfo.uuid)
            }
            return state
        },
        [ActionTypes.INSERT_INVENTORY_SETTING_CARD_TYPE]         : () => {
            state = state.set('inventoryCardType',fromJS(inventoryCardType))
                         .setIn(['inventoryCardType','parentUuid'],state.getIn(['inventorySettingBtnStatus','treeUuid']))
                         .setIn(['inventoryCardType','parentName'],state.getIn(['inventorySettingBtnStatus','treeName']))
                         .setIn(['inventorySettingBtnStatus','isAdd'],true)
            return state
        },
        [ActionTypes.CANCLE_INVENTORY_SETTING_TYPE_BTN]         : () => {
            console.log(action.data);
            state = state.setIn(['inventorySettingBtnStatus','isAdd'],false)
                         .setIn(['inventorySettingBtnStatus','isDelete'],false)
                         .set('inventoryCardType',fromJS(action.data))
                         .set('typeTreeSelectList',fromJS([]))
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_TYPE_POSITION]         : () => {
            state = state.set('typeTree',fromJS(action.list))
            const uuid = state.getIn(['inventorySettingBtnStatus','treeUuid'])
            state = checkTreeNodeIsUpDown(state,uuid)
            return state
        },
        [ActionTypes.BEFORE_ADD_INVENTORY_SETTING_CARD_TYPE]         : () => {
            let typeTree = state.get('typeTree').toJS()

            const loop = (data) => data.map((item) =>{
                item.checked = false
    			if (item.childList.length) {
    				loop(item.childList)
    			}
            })

            loop(typeTree)

            state = state.set('typeTree',fromJS(typeTree))
                         .set('inventoryCardType',fromJS(inventoryCardType))
                         .set('inventorySettingBtnStatus',fromJS(inventorySettingBtnStatus))
                         .set('typeTreeSelectList',fromJS([]))
                         .setIn(['inventorySettingBtnStatus','treeUuid'],state.getIn(['typeTree',0,'uuid']))
                         .setIn(['inventorySettingBtnStatus','parentUuid'],state.getIn(['typeTree',0,'uuid']))
            return state
        },
        [ActionTypes.INVENTORY_SETTING_TYPE_DELETE_BTN_SHOW]         : () => {
            state = state.setIn(['inventorySettingBtnStatus','isDelete'],true)
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_TYPE_BOX_STATUS]         : () => {
            state = state.set('typeTreeSelectList',fromJS(action.list))
            return state
        },
        [ActionTypes.GET_INVENTORY_SETTING_TYPE_CONTENT]         : () => {
                state = state.set('inventoryCardType',fromJS(action.data))
                             .setIn(['inventorySettingBtnStatus','isAdd'],false)
                if(action.isAll){
                    state = state.setIn(['inventorySettingBtnStatus','isEdit'],false)
                                 .setIn(['inventorySettingBtnStatus','treeUuid'],action.uuid)
                                 .setIn(['inventorySettingBtnStatus','isUp'],false)
                                 .setIn(['inventorySettingBtnStatus','isDown'],false)
                }
                else{
                    state = state.setIn(['inventorySettingBtnStatus','isEdit'],true)

                    state = checkTreeNodeIsUpDown(state,action.uuid)
                }
            return state
        },
        [ActionTypes.CONFIRM_DELETE_INVENTORY_SETTING_TYPE]         : () => {
            state = state.set('typeTree',fromJS(action.data))
            const treeUuid = state.getIn(['inventorySettingBtnStatus','treeUuid'])
            let treeNodeExit = false
            const loop = data => data.map((item) => {
                if(item.uuid === treeUuid){
                    treeNodeExit = true
                }
                if (item.childList.length > 0) {
                    loop(item.childList)
                }
            })

            loop(action.data)

            if(!treeNodeExit){
                state = state.setIn(['inventorySettingBtnStatus','treeUuid'],action.data[0].uuid)
            }else{
                state = checkTreeNodeIsUpDown(state,treeUuid)
            }
            state = state.setIn(['inventorySettingBtnStatus','isDelete'],false)
                         .set('typeTreeSelectList',fromJS([]))
            return state
        },
        [ActionTypes.BEFORE_ADD_INVENTORY_SETTING_CARD]         : () => {
            state = state.set('inventorySettingCard',fromJS(inventorySettingCard))
                         .set('tags',state.get('originTags'))
                         .set('insertOrModify','insert')
                         .setIn(['inventorySettingCard','isCheckOut'],action.data.isCheckOut)
                         .setIn(['inventorySettingCard','inventoryAcId'],action.data.defaultAc.inventoryAcId)
                         .setIn(['inventorySettingCard','inventoryAcName'],action.data.defaultAc.inventoryAcName)
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_CONTENT]         : () => {
            state = state.setIn(['inventorySettingCard',action.name],action.value)

            if(!action.value){
                if(action.name === 'isAppliedPurchase' || action.name === 'isAppliedSale'){
                    const clearAllStatus = () =>{
                        state.get('tags').map((item,index) =>{
                            state = state.setIn(['tags',index,'checked'],false)
                        })
                        state = state.setIn(['inventorySettingCard','categoryTypeList'],fromJS([]))
                    }

                    const clearAotherStatus = (item,index) =>{
                        state = state.setIn(['tags',index,'checked'],false)
                        let curIndex = state.getIn(['inventorySettingCard','categoryTypeList']).findIndex((v,i) =>{
                            return v.get('ctgyUuid') === item.get('uuid')
                        })
                        if(curIndex > -1){
                            state = state.setIn(['inventorySettingCard','categoryTypeList'],state.getIn(['inventorySettingCard','categoryTypeList']).delete(curIndex))
                        }
                    }

                    if(action.name === 'isAppliedPurchase'){
                        let isAppliedSale = state.getIn(['inventorySettingCard','isAppliedSale'])
                        if(isAppliedSale){
                            state.get('tags').map((item,index) =>{
                                if(!item.get('isAppliedSale')){
                                    clearAotherStatus(item,index)
                                }
                            })
                        }else{
                            clearAllStatus()
                        }
                    }

                    if(action.name === 'isAppliedSale'){
                        let isAppliedPurchase = state.getIn(['inventorySettingCard','isAppliedPurchase'])
                        if(isAppliedPurchase){
                            state.get('tags').map((item,index) =>{
                                if(!item.get('isAppliedPurchase')){
                                    clearAotherStatus(item,index)
                                }
                            })
                        }else{
                            clearAllStatus()
                        }
                    }
                }
            }

            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_AC]         : () => {
            state = state.setIn(['inventorySettingCard',action.acId],action.uuid)
                         .setIn(['inventorySettingCard',action.acName],action.name)
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_UNDEFINE_CARD_AC]         : () => {
            state = state.setIn(['undefineCard',action.acId],action.uuid)
                         .setIn(['undefineCard',action.acName],action.name)
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_CATEGORY_STATUS]         : () => {
            let subordinateUuid = '';
            state.get('tags').find((v,i)=>{
                if(v.get('uuid') === action.item.get('uuid')){
                    state = state.setIn(['tags',i,'checked'],action.value)
                                 .setIn(['tags',i,'tree'],fromJS(action.list))
                    if(v.get('selectUuid')){
                        subordinateUuid = v.get('selectUuid')
                    }
                    if(action.value){
                        if(action.list[0].childList.length === 0){
                            state = state.setIn(['tags',i,'selectUuid'],action.list[0].uuid)
                                         .setIn(['tags',i,'selectName'],action.list[0].name)
                            subordinateUuid = action.list[0].uuid
                        }
                    }
                    return
                }
            })

            if(action.value){
                let info = fromJS({'ctgyUuid':action.item.get('uuid'),'subordinateUuid':subordinateUuid})
                let list = state.getIn(['inventorySettingCard','categoryTypeList']).push(info)
                state = state.setIn(['inventorySettingCard','categoryTypeList'],list)
            }else{
                let curIndex = state.getIn(['inventorySettingCard','categoryTypeList']).findIndex((v,i) =>{
                    return v.get('ctgyUuid') === action.item.get('uuid')
                })
                let list = state.getIn(['inventorySettingCard','categoryTypeList']).delete(curIndex)
                state = state.setIn(['inventorySettingCard','categoryTypeList'],list)
            }
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_CATEGORY_TYPE]         : () => {
            state.get('tags').map((v,i) =>{
                if(v.get('uuid') === action.item.get('uuid')){
                    state = state.setIn(['tags',i,'selectUuid'],action.uuid)
                                 .setIn(['tags',i,'selectName'],action.name)
                    return ;
                }
            })
            state.getIn(['inventorySettingCard','categoryTypeList']).map((v,i) =>{
                if(v.get('ctgyUuid') === action.item.get('uuid')){
                    state = state.setIn(['inventorySettingCard','categoryTypeList',i,'subordinateUuid'],action.uuid)
                }
            })
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_NATURE]         : () => {
            state = state.setIn(['inventorySettingCard',action.name],action.value)
            const clearAllStatus = () =>{
                state.get('tags').map((item,index) =>{
                    state = state.setIn(['tags',index,'checked'],false)
                })
                state = state.setIn(['inventorySettingCard','categoryTypeList'],fromJS([]))
            }

            const clearAotherStatus = (item,index) =>{
                state = state.setIn(['tags',index,'checked'],false)
                let curIndex = state.getIn(['inventorySettingCard','categoryTypeList']).findIndex((v,i) =>{
                    return v.get('ctgyUuid') === item.get('uuid')
                })
                if(curIndex > -1){
                    state = state.setIn(['inventorySettingCard','categoryTypeList'],state.getIn(['inventorySettingCard','categoryTypeList']).delete(curIndex))
                }
            }

            if(action.value === 1){
                state = state.setIn(['inventorySettingCard','isAppliedPurchase'],true)
                             .setIn(['inventorySettingCard','isAppliedSale'],false)
                 state.get('tags').map((item,index) =>{
                     if(!item.get('isAppliedPurchase')){
                         clearAotherStatus(item,index)
                     }
                 })

                 state = state.setIn(['inventorySettingCard','inventoryAcId'],'1405')
                              .setIn(['inventorySettingCard','inventoryAcName'],'库存商品')

            }else if(action.value === 3){
                state = state.setIn(['inventorySettingCard','isAppliedSale'],true)
                             .setIn(['inventorySettingCard','isAppliedPurchase'],false)
                 state.get('tags').map((item,index) =>{
                     if(!item.get('isAppliedSale')){
                         clearAotherStatus(item,index)
                     }
                 })
                 state = state.setIn(['inventorySettingCard','inventoryAcId'],'1405')
                              .setIn(['inventorySettingCard','inventoryAcName'],'库存商品')

            }else if(action.value === 2){
                state = state.setIn(['inventorySettingCard','isAppliedSale'],false)
                             .setIn(['inventorySettingCard','isAppliedPurchase'],false)
                             .setIn(['inventorySettingCard','inventoryAcId'],'1405')
                             .setIn(['inventorySettingCard','inventoryAcName'],'库存商品')
                clearAllStatus()
            }
            return state
        },
        [ActionTypes.SAVE_INVENTORY_SETTING_CARD]         : () => {
            state = state.set('cardList',fromJS(action.list))

            if(action.flag === 'insertAndNew'){
                state = state.setIn(['inventorySettingCard','name'],'')
                             .setIn(['inventorySettingCard','code'],action.autoIncrementCode)
            }else{
                state = state.set('tags',state.get('originTags'))
            }
            return state
        },
        [ActionTypes.INVENTORY_SETTING_INIT]         : () => {
            action.title.unshift({'name':state.get('anotherTabName'),'uuid':''})
            state = state.set('tags',fromJS(action.title))
                         .set('originTags',fromJS(action.title))
                         .set('cardList',fromJS(action.cardList))
            return state
        },
        [ActionTypes.BEFORE_EDIT_INVENTORY_SETTING_CARD]         : () => {
            state = state.set('inventorySettingCard',fromJS(action.data))
                         .set('insertOrModify','modify')
            action.data.categoryTypeList.map((item,index) =>{
                state.get('tags').map((v,i) =>{
                    if(item.ctgyUuid === v.get('uuid')){
                        state = state.setIn(['tags',i,'checked'],true)
                                     .setIn(['tags',i,'selectUuid'],item.subordinateUuid)
                                     .setIn(['tags',i,'selectName'],item.subordinateName)
                                     .setIn(['tags',i,'tree'],fromJS(item.options))
                        return ;
                    }
                })
            })
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_BOX_STATUS]         : () => {
            const cardList = state.get('cardList')
            const cardSelectList = state.get('cardSelectList')
            cardList.find((item,index) =>{
                if(item.get('uuid') === action.uuid){
                    state = state.setIn(['cardList',index,'checked'],action.status)
                }
            })
            if(action.status){
                state = state.set('cardSelectList',state.get('cardSelectList').push(fromJS({'uuid':action.uuid})))

            }else{
                cardSelectList.find((item,index) =>{
                    if(item.get('uuid') === action.uuid){
                        state = state.set('cardSelectList',state.get('cardSelectList').delete(index))
                    }
                })
            }
            return state
        },
        [ActionTypes.DELETE_INVENTORY_SETTING_CARD_LIST]         : () => {
            state = state.set('cardList',fromJS(action.list))
                         .set('cardSelectList',fromJS([]))
                         .set('typeTree',fromJS(action.treeList))
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_SETTING_CARD_USED_STATUS]         : () => {
            state.get('cardList').map((item,index) =>{
                if(item.get('uuid') === action.uuid){
                    state = state.setIn(['cardList',index,'used'],action.used)
                }
            })
            return state
        },
        [ActionTypes.SELECT_INVENTORY_SETTING_CARD_BY_TYPE]         : () => {
            state = state.set('selectTypeId',action.uuid)
                         .set('selectTypeName',action.name)
                         .set('cardList',fromJS(action.list))
            return state
        },
        [ActionTypes.SELECT_INVENTORY_SETTING_CARD_ALL]         : () => {
            if(action.value){
                state = state.set('cardSelectList',fromJS([]))
                state.get('cardList').map((item,index) =>{
                    state = state.setIn(['cardList',index,'checked'],false)
                })
            }else{
                state.get('cardList').map((item,index) =>{
                    state = state.set('cardSelectList',state.get('cardSelectList').push(fromJS({'uuid':item.get('uuid')})))
                    state = state.setIn(['cardList',index,'checked'],true)
                })
            }
            return state
        },
        [ActionTypes.BEFORE_CH_IMPORT]						 : () => state.setIn(['flags', 'showMessageMask'], true),
        [ActionTypes.CLOSE_CH_IMPORT_CONTENT]				 : () => state.setIn(['flags', 'showMessageMask'], false)
                                                                            .setIn(['flags', 'iframeload'], false)
                                                                            .setIn(['importresponlist','failJsonList'], [])
                                                                            .setIn(['importresponlist','successJsonList'], [])
                                                                            .setIn(['importresponlist','successSize'], 0)
                                                                            .setIn(['importresponlist','errorSize'], 0)
                                                                            .setIn(['importresponlist','allSize'], 0)
                                                                            .set('message', ''),
        [ActionTypes.AFTER_CH_IMPORT]						 : () => {
			state = !action.receivedData.code ?
				state.set('importresponlist', fromJS(action.receivedData.data)).setIn(['flags', 'iframeload'], true).set('message', fromJS(action.receivedData.message)) :
				state.setIn(['flags', 'iframeload'], true).set('message', fromJS(action.receivedData.message))

			return state
		},
        [ActionTypes.CHANGE_CH_IMPORT_NUM]					: () =>  state.setIn(['flags',action.name], action.value),
        [ActionTypes.CHANGE_CH_IMPORT_STATUS]					: () =>  state.setIn(['flags','chImportantStatus'], action.value),
	}[action.type] || (() => state))()
}
