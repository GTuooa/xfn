import { fromJS, toJS }	from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import {relativeHighTypeTemp,relativeTypeTemp,relativeCardTemp,relativeTypeBtnStatus} from '../common/originData.js'

//生产环境应当设置为空
const relativeConfState = fromJS({
    views: {//页面状态及标示
        'acName':'',//要更改的科目的名称
        'acId':'',//要更改的科目的编码
        'relation': '',//新增顶级类别 和 卡片共用往来关系
        'anotherTabName':'全部',
        'activeTapKey':'全部',
        'activeTapKeyUuid':'',//当前选中的顶级类别的uuid
        'sonUuid':'',//当前选中的子类别的uuid
        'sonName':'全部',
        'insertOrModify':'insert',
        'fromPage': 'relative',
        'otherPageName': '',
        'treeSelect': {//通过类别筛选卡片的信息
            'treeTwoList': [],
            'treeThreeList': [],
            'selectUuid': ['', '', ''],
            'selectName': '',//末级名称
            'selectEndUuid': '',//末级类别的uuid
        },
    },
    'tags':[],//顶级类别列表
    'originTags':[],
    'relativeHighTypeTemp':relativeHighTypeTemp,//顶级类别详情
    'relativeTypeTemp':relativeTypeTemp,
    'relativeCardTemp':relativeCardTemp,
    'relativeCardSelectList':[],
    'relativeCardList':[],
    'treeList':[],
    'relativeTreeSelectList':[],
    'typeTree':[],
    'typeSelect':'',
    'cardHighTypeSelectList':[],
})

export default function handleLrb(state = relativeConfState, action) {
	return ({
        [ActionTypes.INIT_RELATIVE_CONF]                          : () => relativeConfState,
        // 改变往来关系管理内容
        [ActionTypes.CHANGE_RELATIVE_CONTENT]         : () => {
            state = state.setIn(['relativeHighTypeTemp',action.name],action.value)
            return state
        },
        [ActionTypes.CHANGE_RELATIVE_DATA]              : () => {
            if (action.short) {
                return state.set(action.dataType, action.value)
            } else {
                return state.setIn(action.dataType, action.value)
            }
        },
        [ActionTypes.GET_RELATIVE_LIST_TITLE]         : () => {
            action.title.unshift({'name':'全部', 'uuid':''})

            state = state.set('tags',fromJS(action.title))
                         .set('originTags',fromJS(action.title))
            return state
        },
        [ActionTypes.GET_RELATIVE_LIST_BY_TYPE]         : () => {
            state = state.set('relativeCardList',fromJS(action.list))
                         .set('treeList',fromJS(action.tree))
                         .set('relativeSelectList',fromJS([]))
                         .mergeIn(['views'], fromJS({
                            activeTapKey: action.name,
                            activeTapKeyUuid: action.uuid,
                            sonUuid: '',
                            sonName: '全部',
                            treeSelect: relativeConfState.getIn(['views', 'treeSelect'])
                         }))
            return state
        },
        [ActionTypes.BEFORE_ADD_MANAGE_TYPE_CARD]         : () => {
            state = state.set('tags',state.get('originTags'))
            if(action.insertOrModify === 'modify'){
                let tags = state.get('tags').toJS()
                let categoryTypeList = action.data.categoryTypeList

                for(let y=0;y<categoryTypeList.length;y++){
                    for(let i=0;i<tags.length;i++){
                        if(categoryTypeList[y].ctgyUuid === tags[i].uuid){
                            tags[i].checked = true;
                            tags[i].selectUuid = categoryTypeList[y].subordinateUuid;
                            tags[i].selectName = categoryTypeList[y].subordinateName;
                            tags[i].tree = categoryTypeList[y].options;
                            break ;
                        }
                    }
                }
                state = state.set('tags',fromJS(tags))
                state = state.set('relativeCardTemp',fromJS(action.data))
                state = state.setIn(['relativeCardTemp','insertOrModify'],'modify')
                if(action.data.payableOpened === 0){
                    state = state.setIn(['relativeCardTemp','payableOpened'],'')
                }
                if(action.data.receivableOpened === 0){
                    state = state.setIn(['relativeCardTemp','receivableOpened'],'')
                }
                if(action.data.prepaidOpened === 0){
                    state = state.setIn(['relativeCardTemp','prepaidOpened'],'')
                }
                if(action.data.advanceOpened === 0){
                    state = state.setIn(['relativeCardTemp','advanceOpened'],'')
                }
            }else{
                state = state.set('relativeCardTemp',fromJS(relativeCardTemp))
                             .setIn(['relativeCardTemp','insertOrModify'],'insert')
                             .setIn(['relativeCardTemp','isCheckOut'],action.data.isCheckOut)
                             .setIn(['relativeCardTemp','advanceAcId'],action.data.defaultAc.advanceAcId)
                             .setIn(['relativeCardTemp','advanceAcName'],action.data.defaultAc.advanceAcName)
                             .setIn(['relativeCardTemp','receivableAcId'],action.data.defaultAc.receivableAcId)
                             .setIn(['relativeCardTemp','receivableAcName'],action.data.defaultAc.receivableAcName)
                             .setIn(['relativeCardTemp','payableAcId'],action.data.defaultAc.payableAcId)
                             .setIn(['relativeCardTemp','payableAcName'],action.data.defaultAc.payableAcName)
                             .setIn(['relativeCardTemp','prepaidAcId'],action.data.defaultAc.prepaidAcId)
                             .setIn(['relativeCardTemp','prepaidAcName'],action.data.defaultAc.prepaidAcName)
            }
            state = state.setIn(['views', 'fromPage'],action.fromPage || 'relative')
            return state
        },
        // 录入流水的新增卡片
        [ActionTypes.BEFORE_ADD_MANAGE_TYPE_CARD_FROM_EDIT_RUNNING]        : () => {

            state = state.set('relativeCardTemp', fromJS(relativeCardTemp))
                        .setIn(['relativeCardTemp','insertOrModify'], 'insert')
                        .setIn(['relativeCardTemp','isCheckOut'], action.receivedData.isCheckOut)
                        .set('tags', action.originTags)
                        .setIn(['views', 'fromPage'], action.otherPageName)
                        .setIn(['views', 'otherPageName'], action.otherPageName)
                        .setIn(['relativeCardTemp', 'code'], action.receivedData.code)

            return state
        },
        [ActionTypes.CHANGE_RELATIVE_CARD_CONTENT]         : () => {
            state = state.setIn(['relativeCardTemp',action.name],action.value)

            if(action.name === 'isPayUnit' && !action.value){
                state = state.setIn(['relativeCardTemp','enablePrepaidAc'],false)
                let isReceiveUnit = state.getIn(['relativeCardTemp','isReceiveUnit'])
                if(isReceiveUnit){
                    state.get('tags').map((item,index) =>{
                        if(!item.get('isReceiveUnit')){
                            state = state.setIn(['tags',index,'checked'],false)
                            let curIndex = state.getIn(['relativeCardTemp','categoryTypeList']).findIndex((v,i) =>{
                                return v.get('ctgyUuid') === item.get('uuid')
                            })
                            if(curIndex > -1){
                                state = state.setIn(['relativeCardTemp','categoryTypeList'],state.getIn(['relativeCardTemp','categoryTypeList']).delete(curIndex))
                            }
                        }
                    })
                }else{
                    state.get('tags').map((item,index) =>{
                        state = state.setIn(['tags',index,'checked'],false)
                    })
                    state = state.setIn(['relativeCardTemp','categoryTypeList'],fromJS([]))
                }
            }
            if(action.name === 'isReceiveUnit' && !action.value){
                state = state.setIn(['relativeCardTemp','enableAdvanceAc'],false)
                let isPayUnit = state.getIn(['relativeCardTemp','isPayUnit'])
                if(isPayUnit){
                    state.get('tags').map((item,index) =>{
                        if(!item.get('isPayUnit')){
                            state = state.setIn(['tags',index,'checked'],false)
                            let curIndex = state.getIn(['relativeCardTemp','categoryTypeList']).findIndex((v,i) =>{
                                return v.get('ctgyUuid') === item.get('uuid')
                            })
                            if(curIndex > -1){
                                state = state.setIn(['relativeCardTemp','categoryTypeList'],state.getIn(['relativeCardTemp','categoryTypeList']).delete(curIndex))
                            }
                        }
                    })
                }else{
                    state.get('tags').map((item,index) =>{
                        state = state.setIn(['tags',index,'checked'],false)
                    })
                    state = state.setIn(['relativeCardTemp','categoryTypeList'],fromJS([]))
                }
            }
            return state
        },
        [ActionTypes.CHANGE_MANAGE_CARD_RELATION]         : () => {
            let reserveTags = state.get('tags');
            let subordinateUuid = '';
            reserveTags.find((value,index) =>{
                if(value.get('uuid') === action.tag.get('uuid')){
                    reserveTags = reserveTags.setIn([index,'checked'],action.checked)
                    if(value.get('selectUuid')){
                        subordinateUuid = value.get('selectUuid')
                    }
                    if(action.checked){
                        reserveTags = reserveTags.setIn([index,'tree'],fromJS(action.tree))
                        if(action.tree[0].childList.length === 0){
                            reserveTags = reserveTags.setIn([index,'selectUuid'],action.tree[0].uuid)
                                                     .setIn([index,'selectName'],action.tree[0].name)
                            subordinateUuid = action.tree[0].uuid
                        }
                    }
                }
            })
            if (action.checked) {
                let categoryTypeList = state.getIn(['relativeCardTemp','categoryTypeList']).toJS()
                categoryTypeList.push({'ctgyUuid': action.tag.get('uuid'), 'subordinateUuid': subordinateUuid})
                state = state.setIn(['relativeCardTemp','categoryTypeList'], fromJS(categoryTypeList))
            } else {
                let index = state.getIn(['relativeCardTemp','categoryTypeList']).findIndex((value,index) =>{
                    return value.get('ctgyUuid') === action.tag.get('uuid')
                })
                state = state.setIn(['relativeCardTemp','categoryTypeList'],state.getIn(['relativeCardTemp','categoryTypeList']).delete(index))
            }

            state = state.set('tags',reserveTags)
            return state
        },
        [ActionTypes.RELATIVE_CONFIG_ADD_CARD_SHOW_MODAL]         : () => {
            state.get('tags').map((item,index) =>{
                if(item.get('uuid') === action.uuid){
                    state = state.set('typeTree',state.getIn(['tags',index,'tree']))
                                 .set('typeSelect',state.getIn(['tags',index]))
                }
            })
            return state
        },
        [ActionTypes.CHANGE_MANAGE_CARD_RELATION_TYPE]         : () => {
            const typeSelect = state.get('typeSelect')

            state.getIn(['relativeCardTemp','categoryTypeList']).map((value,index) =>{
                if(value.get('ctgyUuid') === typeSelect.get('uuid')){
                    state = state.setIn(['relativeCardTemp','categoryTypeList',index,'subordinateUuid'],action.uuid)
                }
            })

            state.get('tags').map((value,index) =>{
                if(value.get('uuid') === typeSelect.get('uuid')){
                    state = state.setIn(['tags',index,'selectUuid'],action.uuid)
                                 .setIn(['tags',index,'selectName'],action.name)
                }
            })
            return state
        },
        [ActionTypes.CHANGE_RELATIVE_CARD_AC]         : () => {
            const acId = state.getIn(['views', 'acId'])
            const acName = state.getIn(['views', 'acName'])

            state = state.setIn(['relativeCardTemp', acId], action.uuid)
                         .setIn(['relativeCardTemp', acName], action.name)
            return state
        },
        [ActionTypes.SAVE_RELATIVE_TYPE_CARD]         : () => {
            state = state.set('relativeCardList',fromJS(action.list))
                         .set('treeList',fromJS(action.treeList))
            if(action.flag === 'insertAndNew'){
                state = state.setIn(['relativeCardTemp','code'],action.code)
                            .setIn(['relativeCardTemp','name'],'')
                            .setIn(['relativeCardTemp', 'companyAddress'], '')
                            .setIn(['relativeCardTemp', 'companyTel'], '')
                            .setIn(['relativeCardTemp', 'financeName'], '')
                            .setIn(['relativeCardTemp', 'financeTel'], '')
                            .setIn(['relativeCardTemp', 'receivableOpened'], '')
                            .setIn(['relativeCardTemp', 'advanceOpened'], '')
                            .setIn(['relativeCardTemp', 'payableOpened'], '')
                            .setIn(['relativeCardTemp', 'prepaidOpened'], '')
            }
            return state
        },
        [ActionTypes.CHANGE_RELATIVE_CONF_CARD_SELECT_LIST]         : () => {
            if (action.clearType=='relativeCard') {
                state = state.set('relativeCardSelectList',fromJS([]))
                .update('relativeCardList', v => v.map(w => w.set('checked', false)))
            }

            if (action.clearType=='relativeHighType') {
                state = state.set('cardHighTypeSelectList',fromJS([]))
                .update('tags', v => v.map(w => w.set('checked', false)))
            }

            if (action.clearType=='relativeTree') {
                let treeList = state.getIn(['relativeHighTypeTemp', 'treeList']).toJS()
                const loop = (data) => data.map((item,index) => {
                    item.checked = false
                    if(item.childList.length > 0){
                        loop(item.childList)
                    }
                })
                loop(treeList)
                state = state.set('treeList',fromJS(treeList)).set('relativeTreeSelectList',fromJS([]))
            }

            return state
        },
        [ActionTypes.CHECK_RELATIVE_LIST_CARD_BOX]  : () => {
            const relativeCardList = state.get('relativeCardList')
            let relativeCardSelectList = state.get('relativeCardSelectList').toJS()
            relativeCardList.find((item,index) => {
                if (item.get('uuid') === action.uuid) {
                    state = state.setIn(['relativeCardList', index, 'checked'], action.checked)
                }
            })
            if (action.checked) {
                relativeCardSelectList.push({'uuid': action.uuid})
                state = state.set('relativeCardSelectList', fromJS(relativeCardSelectList))

            } else {
                relativeCardSelectList.find((item,index) => {
                    if (item['uuid'] === action.uuid) {
                        state = state.deleteIn(['relativeCardSelectList', index])
                    }
                })
            }
            return state
        },
        [ActionTypes.DELETE_RELATIVE_LIST_CARD]         : () => {
            state = state.set('relativeCardList',fromJS(action.data))
                         .set('relativeCardSelectList',fromJS([]))
                         .set('treeList',fromJS(action.treeList))
            return state
        },
        [ActionTypes.GET_RELATIVE_LIST_BY_SON_TYPE]         : () => {
            state = state.set('relativeCardList',fromJS(action.data))
                         .set('relativeCardSelectList',fromJS([]))
                         .setIn(['views','sonUuid'],action.sonUuid)
                         .setIn(['views','sonName'],action.sonName)
            return state
        },
        [ActionTypes.BEFORE_ADD_NEW_MANAGE_TYPE]         : () => {
            state = state.set('relativeHighTypeTemp',fromJS(relativeHighTypeTemp))
            return state
        },
        [ActionTypes.CHANGE_RELATIVE_CONTENT]         : () => {
            state = state.setIn(['relativeHighTypeTemp',action.name],action.value)
            return state
        },
        [ActionTypes.GET_RELATIVE_CARD]         : () => {
            state = state.set('relativeHighTypeTemp',fromJS(action.data))
            return state
        },
        [ActionTypes.CHANGE_RELATIVE_CONF_HIGHT_TYPE_BOX_STATUS]         : () => {
            const tags = state.get('tags')
            let cardHighTypeSelectList = state.get('cardHighTypeSelectList').toJS()

            tags.map((item,index) => {
                if (item.get('uuid') === action.uuid) {
                    state = state.setIn(['tags', index, 'checked'], action.status)
                }
            })

            if (action.status) {
                cardHighTypeSelectList.push({'uuid': action.uuid})
                state = state.set('cardHighTypeSelectList', fromJS(cardHighTypeSelectList))
            } else {
                cardHighTypeSelectList.find((item,index) => {
                    if (item['uuid'] === action.uuid) {
                        state = state.deleteIn(['cardHighTypeSelectList', index])
                    }
                })
            }

            return state
        },
        [ActionTypes.DELETE_RELATIVE_CONF_HGIH_TYPE]         : () => {
            action.title.unshift({'name': '全部', 'uuid':''})

            const activeTapKeyUuid = state.getIn(['views', 'activeTapKeyUuid'])
            const tagsUuidList = action.title.map(v => v['uuid'])
            if (!tagsUuidList.includes(activeTapKeyUuid)) {
                state = state.setIn(['views', 'activeTapKeyUuid'], '')
                .setIn(['views', 'activeTapKey'], '全部')
                .setIn(['views', 'treeSelect'], relativeConfState.getIn(['views', 'treeSelect']))
            }

            state = state.set('tags',fromJS(action.title))
                         .set('originTags',fromJS(action.title))
            return state
        },
        [ActionTypes.INSERT_RELATIVE_TYPE]         : () => {
            state = state.setIn(['relativeTypeTemp','name'],'')
                         .setIn(['relativeTypeTemp','uuid'],'')
                         .setIn(['relativeTypeTemp','parentUuid'],action.uuid)
                         .setIn(['relativeTypeTemp','parentName'],action.name)
            return state
        },
        [ActionTypes.CHANGE_RELATIVE_TYPE_CONTENT]         : () => {
            state = state.setIn(['relativeTypeTemp',action.name],action.value)
            return state
        },
        [ActionTypes.CHANGE_RELATIVE_TYPE_SELECT]         : () => {
            state = state.setIn(['relativeTypeTemp','parentUuid'],action.parentUuid)
                         .setIn(['relativeTypeTemp','parentName'],action.parentName)
            return state
        },
        [ActionTypes.SAVE_RELATIVE_TYPE]         : () => {
            state = state.set('relativeCardList',fromJS(action.list))
                         .setIn(['views','activeTapKey'],action.name)
                         .setIn(['views','activeTapKeyUuid'],action.activeTapKeyUuid)
                         .set('treeList',fromJS(action.tree))
            return state
        },
        [ActionTypes.GET_RELATIVE_TYPE_CONTENT]         : () => {
            state = state.set('relativeTypeTemp',fromJS(action.data))
            return state
        },
        [ActionTypes.CHANGE_RELATIVE_TYPE_BOX_CHECKED]         : () => {
            let treeList = state.getIn(['relativeHighTypeTemp', 'treeList']).toJS()

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

            return state.setIn(['relativeHighTypeTemp', 'treeList'],fromJS(treeList))
        },
        [ActionTypes.SWITCH_CARD_STATUS]         : () => {
            state = state.setIn(['relativeCardTemp','used'],action.used)
            return state
        },
	}[action.type] || (() => state))()
}
