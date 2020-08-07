import { fromJS, toJS }	from 'immutable'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import {projectHighTypeInfo,projectCardInfo,ProjectTypeBtnStatus,projectType} from '../originData.js'

//生产环境应当设置为空
const projectConfigState = fromJS({
    'anotherTabName':'全部',
    'tabTags':[],
    'activeTapKey':'全部',
    'activeTapKeyUuid':'',
    'projectConfigList':[],
    'activeHighType':'',
    'activeHighTypeUuid':'',
    'highTypeInfo':projectHighTypeInfo,
    'insertOrModify':'insert',
    'tree':[],
    'cardInfo':projectCardInfo,
    'treeSelectUuid':'',
    'treeSelectName':'',
    'cardSelectList':[],
    'ProjectTypeBtnStatus':ProjectTypeBtnStatus,
    'projectType':projectType,
    'projectTypeTreeSelectList':[]
})

const checkTreeNodeIsUpDown = (state,uuid) =>{
    const list = state.get('tree').toJS()
    if(uuid != list[0].uuid){
        let name = ''
        let selectList = []
        let selectIndex = ''
        let parentUuid = ''

        //确定父级元素id及新增name及新增id所处位置
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

        state = state.setIn(['ProjectTypeBtnStatus','treeUuid'],uuid)
                     .setIn(['ProjectTypeBtnStatus','treeName'],name)
                     .setIn(['ProjectTypeBtnStatus','parentUuid'],parentUuid ? parentUuid : '')

        //获取父级下的子级类别
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
             state = state.setIn(['ProjectTypeBtnStatus','isUp'],false)
                          .setIn(['ProjectTypeBtnStatus','upUuid'],'')
         }else{
              state = state.setIn(['ProjectTypeBtnStatus','isUp'],true)
                           .setIn(['ProjectTypeBtnStatus','upUuid'],selectList[upIndex].uuid)
         }

         if(selectIndex === selectList.length -1 || selectList[downIndex].name === '未分类'){
             state = state.setIn(['ProjectTypeBtnStatus','isDown'],false)
                          .setIn(['ProjectTypeBtnStatus','downUuid'],'')
         }else{
             state = state.setIn(['ProjectTypeBtnStatus','isDown'],true)
                          .setIn(['ProjectTypeBtnStatus','downUuid'],selectList[downIndex].uuid)
         }
     }
     return state
}

export default function handleLrb(state = projectConfigState, action) {
	return ({
        // 改变往来关系管理内容
        [ActionTypes.INIT_PROJECTCONFIG]     : () => projectConfigState,
        [ActionTypes.GET_HTIGH_TYPE]         : () => {
            action.list.unshift({'uuid':'','name':'全部'})
            state = state.set('tabTags',fromJS(action.list))
            return state
        },
        [ActionTypes.SWITCH_HIGH_TYPE]         : () => {
            state = state.set('projectConfigList',fromJS(action.cardlist))
                         .set('tree',fromJS(action.treelist))
                         .set('activeTapKey',action.name)
                         .set('activeTapKeyUuid',action.uuid)
                         .set('treeSelectUuid','')
                         .set('treeSelectName','')
                         .set('cardSelectList',fromJS([]))
            return state
        },
        [ActionTypes.GET_HTIGH_TYPE_ONE]         : () => {
            state = state.set('highTypeInfo',fromJS(action.data))
                         .set('activeHighType',action.name)
                         .set('activeHighTypeUuid',action.uuid)
            return state
        },
        [ActionTypes.CHANGE_CONTENT]         : () => {
            state = state.setIn([action.parentName,action.name],action.value)
            return state
        },
        [ActionTypes.BEFORE_ADD_PROJECT_CARD]         : () => {
            state = state.set('cardInfo',fromJS(projectCardInfo))
                         .set('tree',fromJS(action.data))
                         .set('insertOrModify','insert')
            if(action.data[0].childList.length <= 0){
                state = state.setIn(['cardInfo','selectUuid'],action.data[0].uuid)
                             .setIn(['cardInfo','selectName'],action.data[0].name)
            }
            return state
        },
        [ActionTypes.CHANGE_PROJECT_CARD_CATEGORY]         : () => {
            state = state.setIn(['cardInfo','selectUuid'],action.uuid)
                         .setIn(['cardInfo','selectName'],action.name)
            return state
        },
        [ActionTypes.SAVE_PROJECT_CARD]         : () => {
            state = state.set('projectConfigList',fromJS(action.cardlist))
                         .set('tree',fromJS(action.treeList))
            if(action.flag === 'insertAndNew'){
                state = state.setIn(['cardInfo','code'],action.code)
                             .setIn(['cardInfo','name'],'')
            }
            return state
        },
        [ActionTypes.GET_PROJECT_LIST_AND_TREE]         : () => {
            state = state.set('projectConfigList',fromJS(action.cardlist))
                         .set('tree',fromJS(action.treelist))
            return state
        },
        [ActionTypes.CHANGE_PROJECT_CARD_USED]         : () => {
            state.get('projectConfigList').map((item,index) =>{
                if(item.get('uuid') === action.uuid){
                    state = state.setIn(['projectConfigList',index,'used'],action.used)
                }
            })
            return state
        },
        [ActionTypes.BEFORE_PROJECT_CARD_EDIT]         : () => {
            state = state.set('cardInfo',fromJS(action.data))
                         .set('insertOrModify','modify')
                         .setIn(['cardInfo','selectUuid'],action.data.categoryTypeList[0].subordinateUuid)
                         .setIn(['cardInfo','selectName'],action.data.categoryTypeList[0].subordinateName)
                         .set('tree',fromJS(action.data.categoryTypeList[0].options))
            return state
        },
        [ActionTypes.PROJECT_CARD_CHECKBOX_STATUS]         : () => {
            const projectConfigList = state.get('projectConfigList')
            const cardSelectList = state.get('cardSelectList')
            projectConfigList.find((item,index) =>{
                if(item.get('uuid') === action.uuid){
                    state = state.setIn(['projectConfigList',index,'checked'],action.status)
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
        [ActionTypes.SELECT_PROJECT_CARD_ALL]         : () => {
            if(action.value){
                state = state.set('cardSelectList',fromJS([]))
                state.get('projectConfigList').map((item,index) =>{
                    state = state.setIn(['projectConfigList',index,'checked'],false)
                })
            }else{
                state.get('projectConfigList').map((item,index) =>{
                    state = state.set('cardSelectList',state.get('cardSelectList').push(fromJS({'uuid':item.get('uuid')})))
                    state = state.setIn(['projectConfigList',index,'checked'],true)
                })
            }
            return state
        },
        [ActionTypes.BEFORE_ADD_PROJECT_CARD_TYPE]         : () => {
            let treeList = state.get('tree').toJS()

            const loop = (data) => data.map((item) =>{
                item.checked = false
    			if (item.childList.length) {
    				loop(item.childList)
    			}
            })

            loop(treeList)

            state = state.set('tree',fromJS(treeList))
                         .set('projectType',fromJS(projectType))
                         .set('ProjectTypeBtnStatus',fromJS(ProjectTypeBtnStatus))
                         .set('projectTypeTreeSelectList',fromJS([]))
                         .setIn(['ProjectTypeBtnStatus','treeUuid'],state.getIn(['tree','0','uuid']))
                         .setIn(['projectType','parentUuid'],state.getIn(['tree','0','uuid']))
            return state
        },
        [ActionTypes.INSERT_PROJECT_CARD_TYPE_BTN]         : () => {
            state = state.setIn(['projectType','name'],'')
                         .setIn(['projectType','uuid'],'')
                         .setIn(['projectType','parentUuid'],state.getIn(['ProjectTypeBtnStatus','treeUuid']))
                         .setIn(['projectType','parentName'],state.getIn(['ProjectTypeBtnStatus','treeName']))
                         .setIn(['ProjectTypeBtnStatus','isAdd'],true)
            return state
        },
        [ActionTypes.CHANGE_PROJECT_CARD_TYPE_CATEGORY]         : () => {
            state = state.setIn(['projectType','parentUuid'],action.uuid)
                         .setIn(['projectType','parentName'],action.name)
            return state
        },
        [ActionTypes.CANCLE_PROJECT_TYPE_BTN]         : () => {
            state = state.setIn(['ProjectTypeBtnStatus','isAdd'],false)
                         .setIn(['ProjectTypeBtnStatus','isDelete'],false)
                         .set('projectType',fromJS(action.data))
                         .set('projectTypeTreeSelectList',fromJS([]))
            return state
        },
        [ActionTypes.SAVE_PROJECT_TREE_ONE]         : () => {
            state = state.set('projectConfigList',fromJS(action.cardlist))
                         .set('activeTapKey',action.name)
                         .set('activeTapKeyUuid',action.activeTapKeyUuid)
                         .set('tree',fromJS(action.treelist))
            if(action.btnFlag != 'new'){
                state = state.setIn(['ProjectTypeBtnStatus','treeName'],state.getIn(['projectType','name']))
                state = checkTreeNodeIsUpDown(state,action.uuid)
            }else{
                state = state.setIn(['ProjectTypeBtnStatus','treeUuid'],action.typeInfo.uuid)
                state = checkTreeNodeIsUpDown(state,action.typeInfo.uuid)
                state = state.set('projectType',fromJS(action.typeInfo))
                             .setIn(['ProjectTypeBtnStatus','isAdd'],false)
                             .setIn(['ProjectTypeBtnStatus','isEdit'],true)
            }
            return state
        },
        [ActionTypes.CHANGE_PROJECT_TYPE_POSITION]         : () => {
            state = state.set('tree',fromJS(action.list))
            const parentUuid = state.getIn(['ProjectTypeBtnStatus','parentUuid'])
            const uuid = state.getIn(['ProjectTypeBtnStatus','treeUuid'])
            state = checkTreeNodeIsUpDown(state,uuid)
            return state
        },
        [ActionTypes.SWITCH_PROJECT_TYPE]         : () => {
            state = state.set('projectType',fromJS(action.data))
            if(action.isAll){
                state = state.setIn(['ProjectTypeBtnStatus','isAdd'],false)
                             .setIn(['ProjectTypeBtnStatus','isEdit'],false)
                             .setIn(['ProjectTypeBtnStatus','treeUuid'],action.uuid)
                             .setIn(['ProjectTypeBtnStatus','treeName'],'全部')
                             .setIn(['ProjectTypeBtnStatus','isUp'],false)
                             .setIn(['ProjectTypeBtnStatus','isDown'],false)
            }
            else{
                state = state.setIn(['ProjectTypeBtnStatus','isAdd'],false)
                             .setIn(['ProjectTypeBtnStatus','isEdit'],true)
                state = checkTreeNodeIsUpDown(state,action.uuid)
            }
            return state
        },
        [ActionTypes.DELETE_PROJECT_CARD]         : () => {
            state = state.set('projectConfigList',fromJS(action.data))
                         .set('cardSelectList',fromJS([]))
                         .set('tree',fromJS(action.treeList))
            return state
        },
        [ActionTypes.BEFORE_DELETE_PROJECT_TYPE]         : () => {
            state = state.setIn(['ProjectTypeBtnStatus','isDelete'],true)
            return state
        },
        [ActionTypes.PROJECT_TYPE_CHECKBOX_STATUS]         : () => {
            state = state.set('projectTypeTreeSelectList',fromJS(action.list))
            return state
        },
        [ActionTypes.DELETE_PROJECT_TYPE]         : () => {
            const treeUuid = state.getIn(['ProjectTypeBtnStatus','treeUuid'])
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

            state = state.set('tree',fromJS(action.data))
            if(!treeNodeExit){
                state = state.set('ProjectTypeBtnStatus',fromJS(ProjectTypeBtnStatus))
                             .setIn(['ProjectTypeBtnStatus','treeUuid'],action.data[0].uuid)
            }else{
                state = checkTreeNodeIsUpDown(state,treeUuid)
            }
            state = state.setIn(['ProjectTypeBtnStatus','isDelete'],false)
                         .set('projectTypeTreeSelectList',fromJS([]))
            return state
        },
        [ActionTypes.GET_PROJECT_CARD_BY_TYPE]         : () => {
            state = state.set('projectConfigList',fromJS(action.data))
                         .set('cardSelectList',fromJS([]))
                         .set('treeSelectUuid',action.sonUuid)
                         .set('treeSelectName',action.sonName)
            return state
        },
        [ActionTypes.ADJUST_PROJECT_CARD_TYPE]         : () => {
            state = state.set('projectConfigList',fromJS(action.list))
                         .set('cardSelectList',fromJS([]))
            return state
        },
	}[action.type] || (() => state))()
}
