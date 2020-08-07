import { fromJS, toJS }	from 'immutable'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import {iuManageCard,iuManageType,iuManageTypeCard,iuManageTypeBtnStatus} from '../originData.js'

//生产环境应当设置为空
const iuConfigState = fromJS({
    flags:{
        iframeload: false,
        showMessageMask: false,
        totalNumber: 0,
        curNumber: 0,
        importKey:''
    },
    importresponlist: {
        failJsonList:[],
        successJsonList:[],
        mediaId:''
    },
    message:'',
    'anotherTabName':'全部',
    'activeTapKey':'全部',
    'activeTapKeyUuid':'',
    'activeManageType':'客户',
    'activeManageTypeUuid':'',
    'sonUuid':'',
    'sonName':'',
    'tags':[],
    'originTags':[],
    'iuManageCard':{
        'isPayUnit':false,
        'isReceiveUnit':false,
        'isAppliedWater':false,
        'isAppliedInvoicing':false,
        'isAppliedLedger':false,
        'categoryName':'',
        'payableAcName':'',
        'payableAcId':'',
        'receivableAcName':'',
        'receivableAcId':'',
        'advanceAcName':'',
        'advanceAcId':'',
        'prepaidAcName':'',
        'prepaidAcId':'',
    },
    'undefineCard':{
        "uuid": "",
        "payableAcName": "应付账款",
        "prepaidAcName": "预付账款",
        "receivableAcName": "应收账款",
        "advanceAcName": "预收账款",
        "payableAcId": "2202",
        "prepaidAcId": "1123",
        "receivableAcId": "1122",
        "advanceAcId": "2203",
        "isDefinite": false
    },
    'iuManageList':[],
    'treeList':[],
    'iuManageType':{
        name:'',
        remark:'',
        parentUuid:'',
        parentName:'全部',
    },
    'iuManageTypeBtnStatus':{
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
    'iuManageSelectList':[],
    'iuTreeSelectList':[],
    'iuManageTypeCard':{
        "name":"客户A",
        "code":"kp001",
        "isPayUnit":"true",
        "isReceiveUnit":"false",
        "payableAcName":"银行存款",
        "receivableAcName":"银行存款",
        "advanceAcName":"银行存款",
        "prepaidAcName":"库存现金",
        "payableAcId":"1101",
        "receivableAcId":"1101",
        "advanceAcId":"1101",
        "prepaidAcId":"1102",
        "companyAddress":"梦想小镇",
        "companyTel":"0571-88888888",
        "financeName":"小A",
        "financeTel":"0571-88887777",
        "remark":"强无敌",
        "receivableOpened":"100",
        "advanceOpened":"200",
        "payableOpened":"300",
        "prepaidOpened":"400",
        "currentRelation":[
           {
             "categoryUuid":"12345668",
             "subordinateUuid":"98765432"
           },{
             "categoryUuid":"1234566812",
             "subordinateUuid":"9876543212"
           }
         ],
    },
})

const checkTreeNodeIsUpDown = (state,uuid) =>{
    const list = state.get('treeList').toJS()
    if(uuid != list[0].uuid){
        let name = ''
        let selectList = []
        let selectIndex = ''
        let parentUuid = ''

        //获取子级元素及父级uuid
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

        state = state.setIn(['iuManageTypeBtnStatus','treeUuid'],uuid)
                     .setIn(['iuManageTypeBtnStatus','treeName'],name)
                     .setIn(['iuManageTypeBtnStatus','parentUuid'],parentUuid ? parentUuid : '')

        //通过父级UUID选择子级所在的数组
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
             state = state.setIn(['iuManageTypeBtnStatus','isUp'],false)
                          .setIn(['iuManageTypeBtnStatus','upUuid'],'')
         }else{
              state = state.setIn(['iuManageTypeBtnStatus','isUp'],true)
                           .setIn(['iuManageTypeBtnStatus','upUuid'],selectList[upIndex].uuid)
         }

         if(selectIndex === selectList.length -1 || selectList[downIndex].name === '未分类'){
             state = state.setIn(['iuManageTypeBtnStatus','isDown'],false)
                          .setIn(['iuManageTypeBtnStatus','downUuid'],'')
         }else{
             state = state.setIn(['iuManageTypeBtnStatus','isDown'],true)
                          .setIn(['iuManageTypeBtnStatus','downUuid'],selectList[downIndex].uuid)
         }
     }
     return state
}


export default function handleLrb(state = iuConfigState, action) {
	return ({
        [ActionTypes.INIT_IUCONFIG]                   : () => iuConfigState, // 改变往来关系管理内容
        [ActionTypes.CHANGE_IUMANAGE_CONTENT]         : () => {
            state = state.setIn(['iuManageCard',action.name],action.value)
            return state
        },
        [ActionTypes.CHANGE_IUMANAGE_CONTENT_AC]         : () => {
            state = state.setIn(['iuManageCard',action.typeId],action.acid)
                         .setIn(['iuManageCard',action.typeName],action.acName)
            return state
        },
        //获取卡片内容
        [ActionTypes.GET_IUMANAGE_CARD]         : () => {
            state = state.set('iuManageCard',fromJS(action.data))
                         .set('activeManageType',action.value.get('categoryName'))
                         .set('activeManageTypeUuid',action.value.get('uuid'))
            return state
        },
        //新增往来关系类别
        [ActionTypes.BEFORE_ADD_NEW_MANAGE_TYPE]         : () => {
            state = state.set('activeManageType','')
                         .set('iuManageCard',fromJS(iuManageCard))
            return state
        },
        [ActionTypes.BEFORE_ADD_NEW_MANAGE_TYPE_TYPE]         : () => {
            let treeList = state.get('treeList').toJS()

            const loop = (data) => data.map((item) =>{
                item.checked = false
    			if (item.childList.length) {
    				loop(item.childList)
    			}
            })

            loop(treeList)

            state = state.set('treeList',fromJS(treeList))
                         .set('iuManageType',fromJS(iuManageType))
                         .set('iuManageTypeBtnStatus',fromJS(iuManageTypeBtnStatus))
                         .set('iuTreeSelectList',fromJS([]))
                         .setIn(['iuManageTypeBtnStatus','treeUuid'],state.getIn(['treeList','0','uuid']))
                         .setIn(['iuManageType','parentUuid'],state.getIn(['treeList','0','uuid']))
            return state
        },
        //获取往来单位标题
        [ActionTypes.GET_IUMANAGE_LIST_TITLE]         : () => {
            action.title.unshift({'categoryName':state.get('anotherTabName'),'uuid':''})

            state = state.set('tags',fromJS(action.title))
                         .set('originTags',fromJS(action.title))

            let activeManageType = state.get('activeManageType')
            if(activeManageType === '' || action.deleteBtn){
                state = state.set('iuManageCard',fromJS(iuManageCard))
            }
            if(action.deleteBtn){
                state = state.set('activeManageType','')
                             .set('activeManageTypeUuid','')
            }
            return state
        },
        [ActionTypes.GET_IUMANAGE_LIST_BY_TYPE]         : () => {
            state = state.set('iuManageList',fromJS(action.list))
                         .set('activeTapKey',action.name)
                         .set('activeTapKeyUuid',action.uuid)
                         .set('treeList',fromJS(action.tree))
                         .set('iuManageSelectList',fromJS([]))
                         .set('sonUuid','')
                         .set('sonName','')
            return state
        },
        [ActionTypes.CHANGE_IUMANAGE_TYPE_BOX_CHECKED]         : () => {
            state = state.set('iuTreeSelectList',fromJS(action.list))
            return state
        },
        [ActionTypes.GET_IUMANAGE_TYPE_CONTENT]         : () => {
            state = state.set('iuManageType',fromJS(action.data))

            if(action.isAll){
                state = state.setIn(['iuManageTypeBtnStatus','isAdd'],false)
                             .setIn(['iuManageTypeBtnStatus','isEdit'],false)
                             .setIn(['iuManageTypeBtnStatus','treeUuid'],action.uuid)
                             .setIn(['iuManageTypeBtnStatus','treeName'],'全部')
                             .setIn(['iuManageTypeBtnStatus','isUp'],false)
                             .setIn(['iuManageTypeBtnStatus','isDown'],false)
            }
            else{
                state = state.setIn(['iuManageTypeBtnStatus','isAdd'],false)
                             .setIn(['iuManageTypeBtnStatus','isEdit'],true)

                state = checkTreeNodeIsUpDown(state,action.uuid)

            }
            return state
        },
        [ActionTypes.CHANGE_IUMANAGE_TYPE_CONTENT]         : () => {
            state = state.setIn(['iuManageType',action.name],action.value)
            return state
        },
        [ActionTypes.GET_IUMANAGE_UNDEFINE_CARD]         : () => {
            state = state.set('undefineCard',fromJS(action.data))
            return state
        },

        [ActionTypes.CHANGE_IUMANAGE_TYPE_SELECT]         : () => {
            state = state.setIn(['iuManageType','parentUuid'],action.parentUuid)
                         .setIn(['iuManageType','parentName'],action.parentName)
            return state
        },
        [ActionTypes.SAVE_IUMANAGE_TYPE]         : () => {
            state = state.set('iuManageList',fromJS(action.list))
                         .set('activeTapKey',action.name)
                         .set('activeTapKeyUuid',action.activeTapKeyUuid)
                         .set('treeList',fromJS(action.tree))
            if(action.btnFlag != 'new'){
                state = state.setIn(['iuManageTypeBtnStatus','treeName'],state.getIn(['iuManageType','name']))
                state = checkTreeNodeIsUpDown(state,action.uuid)
            }else{
                state = state.setIn(['iuManageTypeBtnStatus','treeUuid'],action.typeInfo.uuid)
                state = checkTreeNodeIsUpDown(state,action.typeInfo.uuid)
                state = state.set('iuManageType',fromJS(action.typeInfo))
                             .setIn(['iuManageTypeBtnStatus','isAdd'],false)
                             .setIn(['iuManageTypeBtnStatus','isEdit'],true)
            }
            return state
        },
        [ActionTypes.IUMANGE_TYPE_DELETE_BTN_SHOW]         : () => {
            state = state.setIn(['iuManageTypeBtnStatus','isDelete'],true)
            return state
        },
        [ActionTypes.INSERT_IUMANAGE_TYPE]         : () => {
            state = state.setIn(['iuManageType','name'],'')
                         .setIn(['iuManageType','uuid'],'')
                         .setIn(['iuManageType','remark'],'')
                         .setIn(['iuManageType','parentUuid'],state.getIn(['iuManageTypeBtnStatus','treeUuid']))
                         .setIn(['iuManageType','parentName'],state.getIn(['iuManageTypeBtnStatus','treeName']))
                         .setIn(['iuManageTypeBtnStatus','isAdd'],true)
            return state
        },
        [ActionTypes.EDIT_IUMANAGE_TYPE]         : () => {
            state = state.setIn(['iuManageType','name'],'')
                         .setIn(['iuManageType','remark'],'')
            return state
        },
        [ActionTypes.CONFIRM_DELETE_IUMANAGE_TYPE]         : () => {
            const treeUuid = state.getIn(['iuManageTypeBtnStatus','treeUuid'])
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

            state = state.set('treeList',fromJS(action.data))
            if(!treeNodeExit){
                state = state.set('iuManageTypeBtnStatus',fromJS(iuManageTypeBtnStatus))
                             .setIn(['iuManageTypeBtnStatus','treeUuid'],action.data[0].uuid)
            }else{
                state = checkTreeNodeIsUpDown(state,treeUuid)
            }
            state = state.setIn(['iuManageTypeBtnStatus','isDelete'],false)
                         .set('iuTreeSelectList',fromJS([]))
            return state
        },
        [ActionTypes.CANCLE_IUMANAGE_TYPE_BTN]         : () => {
            state = state.setIn(['iuManageTypeBtnStatus','isAdd'],false)
                         .setIn(['iuManageTypeBtnStatus','isDelete'],false)
                         .set('iuManageType',fromJS(action.data))
                         .set('iuTreeSelectList',fromJS([]))
            return state
        },
        [ActionTypes.CHANGE_IUMANAGE_TYPE_POSITION]         : () => {
            state = state.set('treeList',fromJS(action.list))
            const parentUuid = state.getIn(['iuManageTypeBtnStatus','parentUuid'])
            const uuid = state.getIn(['iuManageTypeBtnStatus','treeUuid'])
            state = checkTreeNodeIsUpDown(state,uuid)
            return state
        },
        [ActionTypes.ADJUST_IUMANAGE_CARD_TYPE_LIST]         : () => {
            state = state.set('iuManageList',fromJS(action.list))
                         .set('iuManageSelectList',fromJS([]))
            return state
        },
        [ActionTypes.CHANGE_IUMANAGE_CARD_CONTENT]         : () => {
            state = state.setIn(['iuManageTypeCard',action.name],action.value)

            if(action.name === 'isPayUnit' && !action.value){
                state = state.setIn(['iuManageTypeCard','enablePrepaidAc'],false)
                let isReceiveUnit = state.getIn(['iuManageTypeCard','isReceiveUnit'])
                if(isReceiveUnit){
                    state.get('tags').map((item,index) =>{
                        if(!item.get('isReceiveUnit')){
                            state = state.setIn(['tags',index,'checked'],false)
                            let curIndex = state.getIn(['iuManageTypeCard','currentRelation']).findIndex((v,i) =>{
                                return v.get('categoryUuid') === item.get('uuid')
                            })
                            if(curIndex > -1){
                                state = state.setIn(['iuManageTypeCard','currentRelation'],state.getIn(['iuManageTypeCard','currentRelation']).delete(curIndex))
                            }
                        }
                    })
                }else{
                    state.get('tags').map((item,index) =>{
                        state = state.setIn(['tags',index,'checked'],false)
                    })
                    state = state.setIn(['iuManageTypeCard','currentRelation'],fromJS([]))
                }
            }
            if(action.name === 'isReceiveUnit' && !action.value){
                state = state.setIn(['iuManageTypeCard','enableAdvanceAc'],false)
                let isPayUnit = state.getIn(['iuManageTypeCard','isPayUnit'])
                if(isPayUnit){
                    state.get('tags').map((item,index) =>{
                        if(!item.get('isPayUnit')){
                            state = state.setIn(['tags',index,'checked'],false)
                            let curIndex = state.getIn(['iuManageTypeCard','currentRelation']).findIndex((v,i) =>{
                                return v.get('categoryUuid') === item.get('uuid')
                            })
                            if(curIndex > -1){
                                state = state.setIn(['iuManageTypeCard','currentRelation'],state.getIn(['iuManageTypeCard','currentRelation']).delete(curIndex))
                            }
                        }
                    })
                }else{
                    state.get('tags').map((item,index) =>{
                        state = state.setIn(['tags',index,'checked'],false)
                    })
                    state = state.setIn(['iuManageTypeCard','currentRelation'],fromJS([]))
                }
            }
            return state
        },
        [ActionTypes.BEFORE_ADD_MANAGE_TYPE_CARD]         : () => {
            state = state.set('tags',state.get('originTags'))
            if(action.insertOrModify === 'modify'){
                let tags = state.get('tags').toJS()
                let currentRelation = action.data.currentRelation

                for(let y=0;y<currentRelation.length;y++){
                    for(let i=0;i<tags.length;i++){
                        if(currentRelation[y].categoryUuid === tags[i].uuid){
                            tags[i].checked = true;
                            tags[i].selectUuid = currentRelation[y].subordinateUuid;
                            tags[i].selectName = currentRelation[y].subordinateName;
                            tags[i].tree = currentRelation[y].options;
                            break ;
                        }
                    }
                }
                state = state.set('tags',fromJS(tags))
                state = state.set('iuManageTypeCard',fromJS(action.data))
                state = state.setIn(['iuManageTypeCard','insertOrModify'],'modify')
            }else{
                state = state.set('iuManageTypeCard',fromJS(iuManageTypeCard))
                             .setIn(['iuManageTypeCard','insertOrModify'],'insert')
                             .setIn(['iuManageTypeCard','isCheckOut'],action.data.isCheckOut)
                             .setIn(['iuManageTypeCard','advanceAcId'],action.data.defaultAc.advanceAcId)
                             .setIn(['iuManageTypeCard','advanceAcName'],action.data.defaultAc.advanceAcName)
                             .setIn(['iuManageTypeCard','receivableAcId'],action.data.defaultAc.receivableAcId)
                             .setIn(['iuManageTypeCard','receivableAcName'],action.data.defaultAc.receivableAcName)
                             .setIn(['iuManageTypeCard','payableAcId'],action.data.defaultAc.payableAcId)
                             .setIn(['iuManageTypeCard','payableAcName'],action.data.defaultAc.payableAcName)
                             .setIn(['iuManageTypeCard','prepaidAcId'],action.data.defaultAc.prepaidAcId)
                             .setIn(['iuManageTypeCard','prepaidAcName'],action.data.defaultAc.prepaidAcName)
            }
            return state
        },
        [ActionTypes.CHANGE_MANAGE_CARD_RELATION]         : () => {
            let subordinateUuid = '';
            state.get('tags').map((value,index) =>{
                if(value.get('uuid') === action.tag.get('uuid')){
                    state = state.setIn(['tags',index,'checked'],action.checked)
                                 .setIn(['tags',index,'tree'],fromJS(action.tree))
                    if(value.get('selectUuid') && value.get('selectUuid') != ''){
                        subordinateUuid = value.get('selectUuid')
                    }
                    if(action.checked){
                        if(action.tree[0].childList.length === 0){
                            state = state.setIn(['tags',index,'selectUuid'],action.tree[0].uuid)
                                         .setIn(['tags',index,'selectName'],action.tree[0].name)
                            subordinateUuid = action.tree[0].uuid
                        }
                    }
                }
            })
            if(action.checked){
                let info = fromJS({'categoryUuid':action.tag.get('uuid'),'subordinateUuid':subordinateUuid})
                let list =state.getIn(['iuManageTypeCard','currentRelation']).push(info)
                state = state.setIn(['iuManageTypeCard','currentRelation'],list)
            }else{
                let index = state.getIn(['iuManageTypeCard','currentRelation']).findIndex((value,index) =>{
                    return value.get('categoryUuid') === action.tag.get('uuid')
                })
                let list = state.getIn(['iuManageTypeCard','currentRelation']).delete(index)
                state = state.setIn(['iuManageTypeCard','currentRelation'],list)
            }

            return state
        },
        [ActionTypes.CHANGE_MANAGE_CARD_RELATION_TYPE]         : () => {
            state.getIn(['iuManageTypeCard','currentRelation']).map((value,index) =>{
                if(value.get('categoryUuid') === action.tag.get('uuid')){
                    state = state.setIn(['iuManageTypeCard','currentRelation',index,'subordinateUuid'],action.uuid)
                }
            })

            state.get('tags').map((value,index) =>{
                if(value.get('uuid') === action.tag.get('uuid')){
                    state = state.setIn(['tags',index,'selectUuid'],action.uuid)
                                 .setIn(['tags',index,'selectName'],action.name)
                }
            })
            return state
        },
        [ActionTypes.CHANGE_IUMANAGE_CARD_AC]         : () => {
            state = state.setIn(['iuManageTypeCard',action.acId],action.uuid)
                         .setIn(['iuManageTypeCard',action.acName],action.name)
            return state
        },
        [ActionTypes.CHANGE_IUMANAGE_UNDEFINE_CARD_AC]         : () => {
            state = state.setIn(['undefineCard',action.acId],action.uuid)
                         .setIn(['undefineCard',action.acName],action.name)
            return state
        },
        [ActionTypes.SAVE_IUMANAGE_TYPE_CARD]         : () => {
            state = state.set('iuManageList',fromJS(action.list))
                         .set('treeList',fromJS(action.treeList))
            if(action.flag === 'insertAndNew'){
                state = state.setIn(['iuManageTypeCard','code'],action.code)
                             .setIn(['iuManageTypeCard','name'],'')
            }
            return state
        },
        [ActionTypes.DELETE_IUMANAGE_TYPE]         : () => {
            state = state.set('treeList',fromJS(action.data))
                         .set('iuManageType',fromJS(iuManageType))
            return state
        },
        [ActionTypes.CHECK_IUMANAGE_LIST_CARD_BOX]  : () => {
            const iuManageList = state.get('iuManageList')
            const iuManageSelectList = state.get('iuManageSelectList')
            iuManageList.find((item,index) =>{
                if(item.get('uuid') === action.uuid){
                    state = state.setIn(['iuManageList',index,'checked'],action.checked)
                }
            })
            if(action.checked){
                state = state.set('iuManageSelectList',state.get('iuManageSelectList').push(fromJS({'uuid':action.uuid})))

            }else{
                iuManageSelectList.find((item,index) =>{
                    if(item.get('uuid') === action.uuid){
                        state = state.set('iuManageSelectList',state.get('iuManageSelectList').delete(index))
                    }
                })
            }

            return state
        },
        [ActionTypes.SELECT_IUMANAGE_CARD_ALL]         : () => {
            if(action.selectAll){
                state = state.set('iuManageSelectList',fromJS([]))
                state.get('iuManageList').map((item,index) =>{
                    state = state.setIn(['iuManageList',index,'checked'],false)
                })
            }else{
                state.get('iuManageList').map((item,index) =>{
                    state = state.set('iuManageSelectList',state.get('iuManageSelectList').push(fromJS({'uuid':item.get('uuid')})))
                    state = state.setIn(['iuManageList',index,'checked'],true)
                })
            }

            return state
        },
        [ActionTypes.DELETE_IUMANAGE_LIST_CARD]         : () => {
            state = state.set('iuManageList',fromJS(action.data))
                         .set('iuManageSelectList',fromJS([]))
                         .set('treeList',fromJS(action.treeList))
            return state
        },
        [ActionTypes.GET_IUMANAGE_LIST_BY_SON_TYPE]         : () => {
            state = state.set('iuManageList',fromJS(action.data))
                         .set('iuManageSelectList',fromJS([]))
                         .set('sonUuid',action.sonUuid)
                         .set('sonName',action.sonName)
            return state
        },
        [ActionTypes.SWITCH_CARD_STATUS]         : () => {
            state.get('iuManageList').map((item,index) =>{
                if(item.get('uuid') === action.uuid){
                    state = state.setIn(['iuManageList',index,'used'],action.used)
                }
            })
            return state
        },
        [ActionTypes.BEFORE_WL_IMPORT]						 : () => state.setIn(['flags', 'showMessageMask'], true),
        [ActionTypes.CLOSE_WL_IMPORT_CONTENT]				 : () => state.setIn(['flags', 'showMessageMask'], false)
                                                                            .setIn(['flags', 'iframeload'], false)
                                                                            .setIn(['importresponlist','failJsonList'], [])
                                                                            .setIn(['importresponlist','successJsonList'], [])
                                                                            .setIn(['importresponlist','successSize'], 0)
                                                                            .setIn(['importresponlist','errorSize'], 0)
                                                                            .setIn(['importresponlist','allSize'], 0)
                                                                            .set('message', ''),
        [ActionTypes.AFTER_WL_IMPORT]						 : () => {
			state = !action.receivedData.code ?
				state.set('importresponlist', fromJS(action.receivedData.data)).setIn(['flags', 'iframeload'], true).set('message', fromJS(action.receivedData.message)) :
				state.setIn(['flags', 'iframeload'], true).set('message', fromJS(action.receivedData.message))

			return state
		},
        [ActionTypes.CHANGE_WL_IMPORT_NUM]					: () =>  state.setIn(['flags',action.name], action.value),
        [ActionTypes.CHANGE_WL_IMPORT_STATUS]					: () =>  state.setIn(['flags','wlImportantStatus'], action.value),
	}[action.type] || (() => state))()
}
