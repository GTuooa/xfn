import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import fetchGlApi from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal, configCheck,upfile } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { yysrAccountActions } from './yysrAccount'
import { yyzcAccountActions } from './yyzcAccount'
import { fyzcAccountActions } from './fyzcAccount'
import { sfglAccountActions } from './Hsgl/sfglAccount'
import { zcwjzzsAccountActions } from './Hsgl/zcwjzzsAccount'
import { jzcbAccountActions } from './Hsgl/jzcbAccount'
import { ggfyftAccountActions } from './Hsgl/ggfyftAccount'
import { yywsrAccountActions } from './Qtls/yywsrAccount'
import { yywzcAccountActions } from './Qtls/yywzcAccount'
import { cqzcAccountActions } from './cqzcAccount'
import { fprzAccountActions } from './Hsgl/fprzAccount'
import { kjfpAccountActions } from './Hsgl/kjfpAccount'
import { jzsyAccountActions } from './Hsgl/jzsyAccount'
import { zjtxAccountActions } from './Hsgl/zjtxAccount'
import { sfzcAccountActions } from './sfzcAccount'



const homeAccountState = fromJS({
    data: {
        menuLeftIdx: 0,
        amount: '',
        categoryType: '',//十四大类的一种
        categoryName: '请选择类别',//选中类别的name
        categoryUuid: '',
        runningDate: '',//日期
        accountUuid: '',
        accountName: '',
        runningAbstract: '',//摘要
        onOk: '',//新增存货卡片后的回调函数
        stockIdx: 0,//回调函数中的参数
    },
    runningCategory: [{childList:[]}],//所有的类别列表
    lastCategory: [],//所有末级类别
    accountList: [],//账户列表
    rate: {//税费设置
        scale: '',//小规模 small 一般 general
    },
    project: {//项目管理数据
        projectCardList: [],//项目卡片列表
        projectCard: [{amount: ''}],
        usedProject: false//流水中是否开启项目管理
    },

    iuManage: {//新增往来单位
        insertFrom: '',
        needAutoIncrementCode: false,
        treeFrom: '',
        psiData: {
            code: '',
            isPayUnit: false,//付款单位
            isReceiveUnit: false,//收款单位
            categoryTypeList: [],//{categoryUuid: 所属分类uuid, categoryName: 所属分类名称，subordinateUuid：所属分类类别的uuid, subordinateName：所属分类类别名称,}

            insertOrModify:'insert',
            "receivableOpened":"0",
            "advanceOpened":"0",
            "payableOpened":"0",
            "prepaidOpened":"0",
            "name":"",

            "companyAddress":"",
            "companyTel":"",
            "financeName":"",
            "financeTel":"",
            "remark":"",
            "contacterInfo":false,
            enableAdvanceAc: false,//启用预收
            enablePrepaidAc: false//启用预付
        },
        treeIdx: 0//被点中去选类别的下标
    },
    iuManageTitleList: [],//顶级类别 客户 供应商等
    iuManageTreeList: [],//所属分类类别树

    accountData: {//新增账户
        "beginAmount": "",
        "openingName": "",
        "name": "",
        "openingBank": "",
        "accountNumber": "",
        "openInfo": false,
        "type": "general",
        "uuid": "",
        "acFullName": "",
        "acId": "",
        "assCategoryList": []
    },

    inventoryTitleList: [],//顶级类别 采购 销售等
    inventoryTreeList: [],
    inventory: {//新增存货卡片
        insertFrom: '',
        needAutoIncrementCode: false,
        treeFrom: '',
        treeIdx: 0,
        psiData: {
            code: '',
            name: '',
            categoryTypeList: [],
            "inventoryNature": '',
            "isAppliedPurchase": false,//采购
            "isAppliedSale": false,//销售

            "remark": "",
            "financeTel": "",
            "enableAdvanceAc": false,
            "financeName": "",
            "receivableOpened": "0",
            "inventoryAcName": "",
            "payableOpened": "0",
            "advanceOpened": "0",
            "isAppliedProduce": false,
            "enablePrepaidAc": false,
            "categoryTypeList":[],
            "insertOrModify": "insert",
            "companyAddress": "",
            "prepaidOpened": "0",
            "inventoryAcId": "",
            "contacterInfo": false,
            "companyTel": ""
        }
    },
    // 附件
    enclosureList:[],
    needDeleteUrl:[],
    flags:{
        showlsfj: false,
    },
    previewImageList: [],
    label:[],
    enclosureCountUser: 0

})

// Reducer
export default function reducer(state = homeAccountState, action = {}) {
    return ({
        [ActionTypes.GET_RUNNING_CATEGORY]                         : () => {
            let accountList = []
            let runningCategory = fromJS(action.receivedData.categoryList)
            let categoryList = []

            // const loop = (data, children) => data.forEach((item) => {
            //     if (item.get('childList') && item.get('childList').size) {//有子集
            //         children.push({
            //             value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}`,
            //             label: item.get('name'),
            //             children: getChild(item.get('childList')),
            //             item
            //         })
            //     } else {//无子集
            //         children.push({
            //             value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}${Limit.TREE_JOIN_STR}${item.get('categoryType')}`,
            //             label: item.get('name'),
            //             children: [],
            //             item
            //         })
            //     }
            // })

            // const getChild = (dataList) => {
            //     let child = []
            //     loop(dataList, child)
            //     return child
            // }
            runningCategory.getIn([0, 'childList']).forEach(v => {
                if (v.get('childList').size) {//一级类别有子集
                    categoryList.push(v)
                } else {//一级类别无子集
                    if (v.get('beSpecial') && v.get('disableList').size == 0) {
                        categoryList.push({
                            uuid: v.get('uuid'),
                            name: v.get('name'),
                            childList: [v]
                        })
                    }
                }
            })

            categoryList.push({
                uuid: '核算管理',
                name: '核算管理',
                childList: action.receivedData.hideCategoryList
            })

            action.receivedData.accountList[0].childList.forEach(v => {
                accountList.push({
                    key: v.name,
                    value: `${v.uuid}${Limit.TREE_JOIN_STR}${v.name}`
                })
            })

            const runningDate = state.getIn(['data', 'runningDate'])

            return state.set('runningCategory', runningCategory)
                        .set('lastCategory', fromJS(categoryList))
                        .set('accountList', fromJS(accountList))
                        .set('rate', fromJS(action.receivedData.rate))
                        .set('data', homeAccountState.get('data'))
                        .setIn(['data', 'runningDate'], runningDate)
                        .set('project', fromJS({
                            projectCardList: [],
                            projectCard: [{amount: ''}],
                            usedProject: false
                        }))
        },
        [ActionTypes.CHANGE_HOMEACCOUNT_CATEGORYTYPE]              : () => {
            return state.setIn(['data','categoryType'], action.categoryType)
        },
        [ActionTypes.CHANGE_HOMEACCOUNT_DATA]					   : () => {
            if (action.value == undefined) {//账户专用
                const arr = action.dataType.split(Limit.TREE_JOIN_STR)
                state = state.setIn(['data', 'accountName'], arr[1])
                            .setIn(['data', 'accountUuid'], arr[0])
            } else if (action.dataType == 'project') {//项目管理
                state = state.setIn(['project', 'usedProject'], action.value)
            } else {
                state = state.setIn(['data', action.dataType], action.value)
            }
            return state
        },
        [ActionTypes.ACCOUNT_SAVE_AND_NEW]                         : () => {
            const date = new DateLib(new Date()).valueOf()
            const menuLeftIdx = state.getIn(['data', 'menuLeftIdx'])
            return state.set('data', homeAccountState.get('data'))
                        .setIn(['data', 'runningDate'], date)
                        .setIn(['data', 'menuLeftIdx'], menuLeftIdx)
        },
        [ActionTypes.GET_PROJECT_CARDLIST]					       : () => {
            let cardList = [], commonCard, idx = null
            action.receivedData.forEach((v, i) => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
                if (v['name']=='项目公共费用') {
                    commonCard = {
                        key: v['name'],
                        value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                    }
                    idx = i
                }
            })

            if (idx != null) {
                cardList.unshift(commonCard)
                cardList.splice(idx+1, 1)
            }

            if (!action.fromYl) {//不是从查询预览获取
                state = state.setIn(['project', 'usedProject'], true)
            }

            return state.setIn(['project', 'projectCardList'], fromJS(cardList))

        },
        [ActionTypes.CHANGE_PROJECT_CARD]					       : () => {
            switch (action.dataType) {
                case 'card' : {
                    const arr = action.value.split(Limit.TREE_JOIN_STR)
                    const amount = state.getIn(['project', 'projectCard', action.idx, 'amount'])
                    state = state.setIn(['project', 'projectCard', action.idx], fromJS({uuid: arr[0], code: arr[1], name: arr[2], amount}))
                    break
                }
                case 'amount' : {
                    state = state.setIn(['project', 'projectCard', action.idx, 'amount'], action.value)
                    break
                }
                case 'add' : {
                    state = state.setIn(['project', 'projectCard', action.idx], fromJS({amount: ''}))
                    break
                }
                case 'delete' : {
                    state = state.deleteIn(['project', 'projectCard', action.idx])
                    break
                }
            }
            return state

        },
        [ActionTypes.CHANGE_LRLS_DATA]					           : () => {
            return state.setIn(action.dataType, action.value)
        },
        [ActionTypes.COPY_PROJECT_DATA]					           : () => {
            let projectCard = action.projectCard.toJS()
            if (projectCard.length == 0) {
                projectCard.push({amount: ''})
            }
            return state.setIn(['project', 'usedProject'], action.usedProject)
                        .setIn(['project', 'projectCard'], fromJS(projectCard))
        },
        [ActionTypes.LRLS_INIT_RELA_CARD]                          : () => {
            const contactsRange = action.contactsRange
            const iuManageTitleList = state.get('iuManageTitleList')
            let categoryTypeList = []
            iuManageTitleList.map((v, i) => {
                contactsRange.map((w, j) => {
                    if (v.get('uuid') == w) {
                        categoryTypeList.push({
                            checked: false,
                            ctgyUuid: w,
                            name: v.get('name')
                        })
                    }
                })
            })

            return state.mergeIn(['iuManage', 'psiData'], fromJS(action.data.defaultAc))
                        .setIn(['iuManage', 'psiData', 'code'], action.data.code)
                        .setIn(['iuManage', 'psiData', 'isPayUnit'], action.isPayUnit)
                        .setIn(['iuManage', 'psiData', 'isReceiveUnit'], !action.isPayUnit)
                        .setIn(['iuManage', 'psiData', 'categoryTypeList'], fromJS(categoryTypeList))
                        .setIn(['iuManage', 'psiData', 'name'], '')
                        .setIn(['iuManage', 'psiData', 'enableAdvanceAc'], !action.isPayUnit)
                        .setIn(['iuManage', 'psiData', 'enablePrepaidAc'], action.isPayUnit)
        },
        [ActionTypes.LRLS_GET_IUMANAGE_LIST_TITLE]                 : () => {
            return state.set('iuManageTitleList', fromJS(action.title))
        },
        [ActionTypes.LRLS_ACCOUNT_LIST]                            : () => {
            let accountList = []
            action.receivedData.forEach(v => {
                accountList.push({
                    key: v.name,
                    value: `${v.uuid}${Limit.TREE_JOIN_STR}${v.name}`
                })
            })

            return state.set('accountList', fromJS(accountList))
                        .set('accountData', homeAccountState.get('accountData'))
        },
        [ActionTypes.INIT_LRLS_DATA]                               : () => {
            return state.set(action.dataType, homeAccountState.get(action.dataType))
        },
        [ActionTypes.LRLS_GET_INVENTORY_LIST_TITLE]                : () => {
            return state.set('inventoryTitleList', fromJS(action.title))
        },
        [ActionTypes.LRLS_INIT_STOCK_CARD]                         : () => {
            const stockRange = action.stockRange
            const inventoryTitleList = state.get('inventoryTitleList')
            const categoryType = state.getIn(['data', 'categoryType'])
            let isAppliedPurchase = false//采购
            let isAppliedSale = false//销售

            if (categoryType == 'LB_YYSR') {//营业收入
                isAppliedSale = true
            } else {//营业支出
                isAppliedPurchase = true
            }

            let categoryTypeList = []
            inventoryTitleList.map((v, i) => {
                stockRange.map((w, j) => {
                    if (v.get('uuid') == w) {
                        categoryTypeList.push({
                            checked: false,
                            ctgyUuid: w,
                            categoryName: v.get('name')
                        })
                    }
                })
            })

            return state.mergeIn(['inventory', 'psiData'], fromJS(action.data.defaultAc))
                        .setIn(['inventory', 'psiData', 'code'], action.data.code)
                        .setIn(['inventory', 'psiData', 'categoryTypeList'], fromJS(categoryTypeList))
                        .setIn(['inventory', 'psiData', 'name'], '')
                        .setIn(['inventory', 'psiData', 'isAppliedPurchase'], isAppliedPurchase)
                        .setIn(['inventory', 'psiData', 'isAppliedSale'], isAppliedSale)
                        .setIn(['data', 'onOk'], action.onOk)
                        .setIn(['data', 'stockIdx'], action.idx)
        },
        [ActionTypes.CHANGE_RUNNING_ENCLOSURE_LIST]			: () => { //改变附件列表的信息
            let enclosureList = [];
            state.get('enclosureList').map(v=>{
                enclosureList.push(v)
            })
            action.imgArr.forEach(v=>{
                enclosureList.push(v)
            })
            state = state.set('enclosureList', fromJS(enclosureList))
                        .set('enclosureCountUser', enclosureList.length)
            // if(action.length === state.get('enclosureCountUser') || state.get('enclosureCountUser') === 9){
            //     thirdParty.toast.hide()
            // }
            return state;
        },
        [ActionTypes.DELETE_UPLOAD_FJ_URL]			: () => { //删除上传的附件
            let needDeleteUrl = [];
            state.get('needDeleteUrl').map(v=>{
                needDeleteUrl.push(v)
            })
            state.get('enclosureList').map((v,i)=>{
                if (i == action.index) {
                    needDeleteUrl.push(state.getIn(['enclosureList',i]).set('beDelete',true))
                    state = state.deleteIn(['enclosureList',i])
                }
            })
            state = state.set('needDeleteUrl', fromJS(needDeleteUrl))
                        .set('enclosureCountUser', state.get('enclosureList').size)

            return state;
        },
        [ActionTypes.INIT_FJ_LIST]			: () => {
            state = state.set('needDeleteUrl', fromJS([]))
                        .set('enclosureList', fromJS([]))
                        .set('enclosureCountUser', 0)
                        .set('previewImageList',fromJS([]))

            return state;
        },
        [ActionTypes.GET_LS_LABEL_FETCH]		: () => { //获取附件的标签
            let label = []
            action.receivedData.data.map((item) => {
                label.push({
                    key: item,
                    value: item
                })
            })
            state=state.set('label',fromJS(label))
            .set('tagModal',true)
            return state;
        },
        [ActionTypes.CHANGE_LS_TAG_NAME]				: () => { //编辑标签名称
            state.get('enclosureList').map((v,i)=>{
                if(i == action.index){
                    state = state.setIn(['enclosureList',i,'label'],action.value)
                }
            })
            state=state.set('tagModal',false)
            return state;
        },


    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_RUNNING_CATEGORY   : 'GET_RUNNING_CATEGORY',
    CHANGE_HOMEACCOUNT_CATEGORYTYPE: 'CHANGE_HOMEACCOUNT_CATEGORYTYPE',
    CHANGE_HOMEACCOUNT_DATA: 'CHANGE_HOMEACCOUNT_DATA',
    ACCOUNT_SAVE_AND_NEW: 'ACCOUNT_SAVE_AND_NEW',
    GET_PROJECT_CARDLIST: 'GET_PROJECT_CARDLIST',
    CHANGE_PROJECT_CARD: 'CHANGE_PROJECT_CARD',
    CHANGE_LRLS_DATA: 'CHANGE_LRLS_DATA',
    COPY_PROJECT_DATA: 'COPY_PROJECT_DATA',

    GET_LB_YYSR_CARD_DETAIL: 'GET_LB_YYSR_CARD_DETAIL',
    GET_LB_YYZC_CARD_DETAIL: 'GET_LB_YYZC_CARD_DETAIL',
    GET_LB_FYZC_CARD_DETAIL: 'GET_LB_FYZC_CARD_DETAIL',
    GET_LB_XCZC_CARD_DETAIL: 'GET_LB_XCZC_CARD_DETAIL',
    GET_LB_SFZC_CARD_DETAIL: 'GET_LB_SFZC_CARD_DETAIL',
    GET_LB_YYWSR_CARD_DETAIL: 'GET_LB_YYWSR_CARD_DETAIL',
    GET_LB_YYWZC_CARD_DETAIL: 'GET_LB_YYWZC_CARD_DETAIL',
    GET_LB_ZSKX_CARD_DETAIL: 'GET_LB_ZSKX_CARD_DETAIL',
    GET_LB_ZFKX_CARD_DETAIL: 'GET_LB_ZFKX_CARD_DETAIL',
    GET_LB_CQZC_CARD_DETAIL: 'GET_LB_CQZC_CARD_DETAIL',
    GET_LB_JK_CARD_DETAIL: 'GET_LB_JK_CARD_DETAIL',
    GET_LB_TZ_CARD_DETAIL: 'GET_LB_TZ_CARD_DETAIL',
    GET_LB_ZB_CARD_DETAIL: 'GET_LB_ZB_CARD_DETAIL',

    GET_LB_ZZ_CARD_DETAIL: 'GET_LB_ZZ_CARD_DETAIL',
    GET_LB_SFGL_CARD_DETAIL: 'GET_LB_SFGL_CARD_DETAIL',
    GET_LB_JZCB_CARD_DETAIL: 'GET_LB_JZCB_CARD_DETAIL',
    GET_LB_FPRZ_CARD_DETAIL: 'GET_LB_FPRZ_CARD_DETAIL',
    GET_LB_KJFP_CARD_DETAIL: 'GET_LB_KJFP_CARD_DETAIL',
    GET_LB_ZCWJZZS_CARD_DETAIL: 'GET_LB_ZCWJZZS_CARD_DETAIL',
    GET_LB_GGFYFT_CARD_DETAIL: 'GET_LB_GGFYFT_CARD_DETAIL',
    GET_LB_JZSY_CARD_DETAIL: 'GET_LB_JZSY_CARD_DETAIL',
    GET_LB_ZJTX_CARD_DETAIL: 'GET_LB_ZJTX_CARD_DETAIL',

    GET_LB_YYSR_FROM_YLLS: 'GET_LB_YYSR_FROM_YLLS',
    GET_LB_YYZC_FROM_YLLS: 'GET_LB_YYZC_FROM_YLLS',
    GET_LB_FYZC_FROM_YLLS: 'GET_LB_FYZC_FROM_YLLS',
    GET_LB_XCZC_FROM_YLLS: 'GET_LB_XCZC_FROM_YLLS',
    GET_LB_SFZC_FROM_YLLS: 'GET_LB_SFZC_FROM_YLLS',
    GET_LB_YYWSR_FROM_YLLS: 'GET_LB_YYWSR_FROM_YLLS',
    GET_LB_YYWZC_FROM_YLLS: 'GET_LB_YYWZC_FROM_YLLS',
    GET_LB_ZSKX_FROM_YLLS: 'GET_LB_ZSKX_FROM_YLLS',
    GET_LB_ZFKX_FROM_YLLS: 'GET_LB_ZFKX_FROM_YLLS',
    GET_LB_CQZC_FROM_YLLS: 'GET_LB_CQZC_FROM_YLLS',
    GET_LB_JK_FROM_YLLS: 'GET_LB_JK_FROM_YLLS',
    GET_LB_TZ_FROM_YLLS: 'GET_LB_TZ_FROM_YLLS',
    GET_LB_ZB_FROM_YLLS: 'GET_LB_ZB_FROM_YLLS',

    GET_LB_ZZ_FROM_YLLS: 'GET_LB_ZZ_FROM_YLLS',
    GET_LB_SFGL_FROM_YLLS: 'GET_LB_SFGL_FROM_YLLS',
    GET_LB_JZCB_FROM_YLLS: 'GET_LB_JZCB_FROM_YLLS',
    GET_LB_FPRZ_FROM_YLLS: 'GET_LB_FPRZ_FROM_YLLS',
    GET_LB_KJFP_FROM_YLLS: 'GET_LB_KJFP_FROM_YLLS',
    GET_LB_ZCWJZZS_FROM_YLLS: 'GET_LB_ZCWJZZS_FROM_YLLS',
    GET_LB_GGFYFT_FROM_YLLS: 'GET_LB_GGFYFT_FROM_YLLS',
    GET_LB_JZSY_FROM_YLLS: 'GET_LB_JZSY_FROM_YLLS',
    GET_LB_ZJTX_FROM_YLLS: 'GET_LB_ZJTX_FROM_YLLS',

    LRLS_INIT_RELA_CARD: 'LRLS_INIT_RELA_CARD',
    LRLS_GET_IUMANAGE_LIST_TITLE: 'LRLS_GET_IUMANAGE_LIST_TITLE',
    LRLS_ACCOUNT_LIST: 'LRLS_ACCOUNT_LIST',
    INIT_LRLS_DATA: 'INIT_LRLS_DATA',
    LRLS_GET_INVENTORY_LIST_TITLE: 'LRLS_GET_INVENTORY_LIST_TITLE',
    LRLS_INIT_STOCK_CARD: 'LRLS_INIT_STOCK_CARD',

    CHANGE_RUNNING_ENCLOSURE_LIST: 'CHANGE_RUNNING_ENCLOSURE_LIST',
    DELETE_UPLOAD_FJ_URL: 'DELETE_UPLOAD_FJ_URL',
    INIT_FJ_LIST: 'INIT_FJ_LIST',
    GET_LS_LABEL_FETCH: 'GET_LS_LABEL_FETCH',
    CHANGE_LS_TAG_NAME: 'CHANGE_LS_TAG_NAME',
    AFTER_GET_UPLOAD_SIGNATURE: 'AFTER_GET_UPLOAD_SIGNATURE',


}

// Action
const homeAccountActions = {
    getRunningCategory: (fromYlls) => dispatch => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningSettingInfo', 'GET', '', json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_RUNNING_CATEGORY,
                    receivedData: json.data
                })
                if (fromYlls) {
                    dispatch(homeAccountActions.fromYlToLr())
                }
                dispatch(homeAccountActions.getIUManageListTitle())
            }
        })
    },
    getCardDetail: (value) => (dispatch, getState) => {
        const state = getState().homeAccountState
        const data = state.get('data')
        const arr = value.split(Limit.TREE_JOIN_STR)

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningDetail', 'GET', `uuid=${arr[0]}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                let jsonData = json.data.result
                delete jsonData['parentUuid']

                dispatch({
                    type: ActionTypes.CHANGE_HOMEACCOUNT_CATEGORYTYPE,
                    categoryType: jsonData.categoryType
                })

                dispatch({
                    type: ActionTypes[`GET_${jsonData.categoryType}_CARD_DETAIL`],
                    value,
                    data,
                    receivedData: jsonData
                })

                getCard(fromJS(jsonData), dispatch)

            }
        })
    },
    changeHomeAccountData: (dataType, value) => ({
        type: ActionTypes.CHANGE_HOMEACCOUNT_DATA,
        dataType,
        value
    }),
    accountSaveAndNew: () => ({
        type: ActionTypes.ACCOUNT_SAVE_AND_NEW
    }),
    fromYlToLr: () => (dispatch, getState) => {
        dispatch(homeAccountActions.changeLrlsEnclosureList())
        //从预览跳到录入
        const state = getState().yllsState
        const beBusiness = state.getIn(['data', 'beBusiness'])//业务流水或收付管理
		const runningState = state.getIn(['data', 'runningState'])//流水状态
		let categoryType = state.getIn(['data', 'categoryType'])
        const usedProject = state.getIn(['data', 'usedProject'])
        const projectCard = state.getIn(['data', 'projectCard'])
        const enclosureList = state.getIn(['data', 'enclosureList'])

		if (!beBusiness) {
			categoryType = 'LB_SFGL'
		}
		if (runningState === 'STATE_YYSR_JZCB') {
			categoryType = 'LB_JZCB'
		}
        dispatch({
            type: ActionTypes.CHANGE_HOMEACCOUNT_CATEGORYTYPE,
            categoryType
        })
        dispatch({
            type: ActionTypes[`GET_${categoryType}_FROM_YLLS`],
            state
        })
        dispatch({
            type: ActionTypes.CHANGE_RUNNING_ENCLOSURE_LIST,
            imgArr:enclosureList
        })
        getCard(state.get('data'), dispatch, true)
        dispatch(homeAccountActions.copyProjectData(usedProject, projectCard))
    },
    toManageType: (value, allData) => (dispatch, getState) => {
        //录入核算管理
        const state = getState().homeAccountState
        const data = state.get('data')
        const arr = value.split(Limit.TREE_JOIN_STR)
        const categoryType = arr[2]

        dispatch({
            type: ActionTypes.CHANGE_HOMEACCOUNT_CATEGORYTYPE,
            categoryType
        })
        dispatch({
            type: ActionTypes[`GET_${categoryType}_CARD_DETAIL`],
            value,
            data,
            allData
        })
        switch (categoryType) {
            case 'LB_SFGL': {
                const runningDate = data.get('runningDate')
                dispatch(sfglAccountActions.getSfglCardList(runningDate))
                break
            }
            case 'LB_ZCWJZZS': {
                let month = new DateLib().valueOf().slice(0,7)
                dispatch(zcwjzzsAccountActions.changeWjzzsData('handleMonth', month))
                dispatch(zcwjzzsAccountActions.getWjzzsList(month))
                break
            }
            case 'LB_JZCB': {
                dispatch(jzcbAccountActions.getJzcbCardList())
                break
            }
            case 'LB_GGFYFT': {
                dispatch(ggfyftAccountActions.getGgfyftProjectList())
                dispatch(ggfyftAccountActions.getGgfyftList())
                break
            }
            case 'LB_FPRZ': {
                dispatch(fprzAccountActions.getFprzList())
                break
            }
            case 'LB_KJFP': {
                dispatch(kjfpAccountActions.getKjfpList())
                break
            }
            case 'LB_JZSY': {
                dispatch(jzsyAccountActions.getCategoryList())
                break
            }
            case 'LB_ZJTX': {
                dispatch(zjtxAccountActions.getCategoryList())
                break
            }
            default: console.log('无请求');
        }
    },
    getProjectCardList : (categoryList, categoryType, fromYl) => (dispatch, getState) => {//获取项目卡片列表
        const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getProjectCardList', 'POST', JSON.stringify({
            sobId,
            categoryList,
            // needCommonCard: categoryType === 'LB_FYZC' ? true : false,
            needCommonCard: true

        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_PROJECT_CARDLIST,
                    receivedData: json.data.result,
                    fromYl
                })
            }
        })
    },
    changeProjectCard: (dataType, value, idx) => ({
        type: ActionTypes.CHANGE_PROJECT_CARD,
        dataType,
        value,
        idx
    }),
    changeLrlsData: (dataType, value) => ({
        type: ActionTypes.CHANGE_LRLS_DATA,
        dataType,
        value
    }),
    copyProjectData: (usedProject, projectCard) => ({
        type: ActionTypes.COPY_PROJECT_DATA,
        projectCard,
        usedProject
    }),
    getInitRelaCard: (isPayUnit, contactsRange) => dispatch => {//新增往来单位卡片
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`getInitRelaCard`, 'GET', '', json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.LRLS_INIT_RELA_CARD,
                    data: json.data,
                    isPayUnit,
                    contactsRange
                })
            }
        })
    },
    getIUManageListTitle: () => dispatch => {
        fetchApi(`getIUManageListTitle`, 'GET', '', json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.LRLS_GET_IUMANAGE_LIST_TITLE,
                    title: json.data
                })
            }
        })
    },
    changeManageCardRelation : (uuid, idx) => dispatch => {//获取类别树
        fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${uuid}`, json => {
            if (showMessage(json)) {
                const item = json.data.resultList
                dispatch(homeAccountActions.changeLrlsData(['iuManageTreeList', idx], fromJS({
                    uuid: uuid,
                    value: item
                })))

                if (item[0].childList == 0) {
                    dispatch(homeAccountActions.changeLrlsData(['iuManage', 'psiData', 'categoryTypeList', idx, 'subordinateUuid'], item[0]['uuid']))
                    dispatch(homeAccountActions.changeLrlsData(['iuManage', 'psiData', 'categoryTypeList', idx, 'subordinateName'], item[0]['name']))
                }
            }
        })
    },
    saveIUManage: (history) => (dispatch, getState) => {//新增往来保存
        const state = getState().homeAccountState
        const psiData = state.getIn(['iuManage', 'psiData'])
        const name = psiData.get('name')

        if (psiData.get('code') == '') {
            return thirdParty.toast.info('请填写编码')
        }
        if (psiData.get('code').length > 10) {
            return thirdParty.toast.info('编码长度不能超过10位')
        }
        if (name == '') {
            return thirdParty.toast.info('请填写名称')
        }
        if (name.length > 20) {
            return thirdParty.toast.info('名称长度不能超过20位')
        }

        const categoryTypeList = psiData.get('categoryTypeList')
        let selectRelation = false, selectCategory = false
        categoryTypeList.map(v => {
            if (v.get('checked')){
                selectRelation = true
                if (!v.get('subordinateUuid')) {
                    selectCategory = true
                }
            }
        })
        if (!selectRelation) {
            return thirdParty.toast.info('请选择所属分类')
        }
        if (selectCategory) {
            return thirdParty.toast.info('请选择类别')
        }


        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('adjustIUmanageCardTitleSame', 'POST', JSON.stringify({
            psiData:{'name': name}
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                if (json.data.repeat) {
                    thirdParty.Confirm({
                        message: '卡片名称与已有卡片名称重复，确定保存吗？',
                        title: "名称重复",
                        buttonLabels: ['取消', '确定'],
                        onSuccess : (result) => {
                            if (result.buttonIndex === 1) {
                                dispatch(homeAccountActions.insertIUManage(history))
                            }
                        },
                        onFail : (err) => alert(err)
                    })
                } else {
                    dispatch(homeAccountActions.insertIUManage(history))
                }


            }
        })

    },
    insertIUManage: (history) => (dispatch, getState) => {//新增往来保存
        const state = getState().homeAccountState
        const iuManage = state.get('iuManage').toJS()

        const categoryTypeList = iuManage['psiData']['categoryTypeList'].filter(v => v['checked'])
        iuManage['psiData']['categoryTypeList'] = categoryTypeList

        fetchApi('saveIUManageCard', 'POST', JSON.stringify({
            ...iuManage,
        }), json => {
            if (showMessage(json, 'show')) {
                const categoryType = state.getIn(['data', 'categoryType'])
                getContactsOrStockCard(categoryType, dispatch, 'contactsRange')
                history.goBack()
            }
        })

    },
    saveAccountSetting: (history) => (dispatch, getState) => {//新增账户
        const state = getState().homeAccountState
        //校验
        const data = state.get('accountData').toJS()
        if (data['name'] == '') {
            return thirdParty.toast.info('请填写账户名称')
        }
        if (data['name'].length > Limit.ACCOUNT_NAME_LENGTH) {
            return thirdParty.toast.info(`账户名称不能超过${Limit.ACCOUNT_NAME_LENGTH}个字符`)
        }
        // if (simplifyStatus && data['acId'] == '') {
        //     return thirdParty.toast.info('请选择关联科目')
        // }
        if (data['accountNumber'].length > Limit.ACCOUNT_STRING_LENGTH) {
            return thirdParty.toast.info(`账号不能超过${Limit.ACCOUNT_STRING_LENGTH}个字符`)
        }
        if (data['openingName'].length > Limit.ACCOUNT_STRING_LENGTH) {
            return thirdParty.toast.info(`开户名不能超过${Limit.ACCOUNT_STRING_LENGTH}个字符`)
        }
        if (data['openingBank'].length > Limit.ACCOUNT_STRING_LENGTH) {
            return thirdParty.toast.info(`开户行/机构不能超过${Limit.ACCOUNT_STRING_LENGTH}个字符`)
        }
        if (data['beginAmount'].length > 12) {
            return thirdParty.toast.info('期初值长度最长为12位')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('insertRunningAccount', 'POST', JSON.stringify({
            ...data
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json, 'show')) {
                history.goBack()
                dispatch({
                    type: ActionTypes.LRLS_ACCOUNT_LIST,
                    receivedData: json.data.resultList[0].childList
                })
            }

        })
    },
    initLrlsData: (dataType) => ({
        type: ActionTypes.INIT_LRLS_DATA,
        dataType
    }),
    getInventoryHighTypeList: () => dispatch => {//获取存货顶级类别
        fetchApi(`getInventoryHighTypeList`, 'GET', '', json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.LRLS_GET_INVENTORY_LIST_TITLE,
                    title: json.data
                })
            }
        })
    },
    getInitStockCard: (stockRange, onOk, idx) => dispatch => {//新增存货卡片
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`getInitStockCard`, 'GET', '', json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.LRLS_INIT_STOCK_CARD,
                    data: json.data,
                    stockRange,
                    onOk,
                    idx
                })
            }
        })
    },
    getInventorySettingCardTypeList : (uuid, idx) => dispatch => {//获取类别树
        fetchApi('getInventorySettingCardTypeList', 'GET', `ctgyUuid=${uuid}`, json => {
            if (showMessage(json)) {
                const item = json.data.resultList
                dispatch(homeAccountActions.changeLrlsData(['inventoryTreeList', idx], fromJS({
                    uuid: uuid,
                    value: item
                })))

                if (item[0].childList == 0) {
                    dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData', 'categoryTypeList', idx, 'subordinateUuid'], item[0]['uuid']))
                    dispatch(homeAccountActions.changeLrlsData(['inventory', 'psiData', 'categoryTypeList', idx, 'subordinateName'], item[0]['name']))
                }
            }
        })
    },
    saveInventory: (history) => (dispatch, getState) => {//新增存货保存
        const state = getState().homeAccountState
        const psiData = state.getIn(['inventory', 'psiData'])
        const name = psiData.get('name')

        if (psiData.get('code') == '') {
            return thirdParty.toast.info('请填写编码')
        }
        if (psiData.get('code').length > 10) {
            return thirdParty.toast.info('编码长度不能超过10位')
        }
        if (name == '') {
            return thirdParty.toast.info('请填写名称')
        }
        if (name.length > 20) {
            return thirdParty.toast.info('名称长度不能超过20位')
        }
        if (psiData.get('inventoryNature') == '') {
            return thirdParty.toast.info('请选择存货性质')
        }

        const categoryTypeList = psiData.get('categoryTypeList')
        let selectRelation = false, selectCategory = false
        categoryTypeList.map(v => {
            if (v.get('checked')){
                selectRelation = true
                if (!v.get('subordinateUuid')) {
                    selectCategory = true
                }
            }
        })
        if (!selectRelation) {
            return thirdParty.toast.info('请选择所属分类')
        }
        if (selectCategory) {
            return thirdParty.toast.info('请选择类别')
        }


        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('adjustInventorySettingCardTitleSame', 'POST', JSON.stringify({
            psiData:{'name': name}
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                if (json.data.repeat) {
                    thirdParty.Confirm({
                        message: '卡片名称与已有卡片名称重复，确定保存吗？',
                        title: "名称重复",
                        buttonLabels: ['取消', '确定'],
                        onSuccess : (result) => {
                            if (result.buttonIndex === 1) {
                                dispatch(homeAccountActions.insertInventory(history))
                            }
                        },
                        onFail : (err) => alert(err)
                    })
                } else {
                    dispatch(homeAccountActions.insertInventory(history))
                }


            }
        })

    },
    insertInventory: (history) => (dispatch, getState) => {//新增存货保存
        const state = getState().homeAccountState
        const inventory = state.get('inventory').toJS()
        const onOk = state.getIn(['data', 'onOk'])
        const idx = state.getIn(['data', 'stockIdx'])
        const code = inventory['psiData']['code']

        const categoryTypeList = inventory['psiData']['categoryTypeList'].filter(v => v['checked'])
        inventory['psiData']['categoryTypeList'] = categoryTypeList

        fetchApi('addInventorySettingCard', 'POST', JSON.stringify({
            ...inventory,
        }), json => {
            if (showMessage(json, 'show')) {
                const categoryType = state.getIn(['data', 'categoryType'])
                getContactsOrStockCard(categoryType, dispatch, 'stockRange')
                json.data.resultList.forEach(v => {
                    if (v['code'] == code) {
                        onOk('card', `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`, idx)
                    }
                })
                history.goBack()
            }
        })

    },
    initLabel : () => dispatch => {
        fetchApi('initLsLabel', 'POST', '',json => {showMessage(json)})
    },
    getUploadGetTokenFetch : () => (dispatch, getState) => {
        // thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        // fetchGlApi('uploadgettoken', 'GET', '', json => {
        //     // thirdParty.toast.hide()
        //     showMessage(json) &&
        //     sessionStorage.setItem('uploadToken' ,json.data.token)
        // })
        const expire = getState().allState.get('expire')
        const now = Date.parse(new Date()) / 1000

        console.log(expire, now, expire < now + 300);
        if (expire < now + 300) {
            fetchGlApi('aliyunOssPolicy', 'GET', '', json => {
                // if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.AFTER_GET_UPLOAD_SIGNATURE,
                        receivedData: json.data,
                        code: json.code
                    })
                // }
            })
        }
    },
    // uploadFiles : (file, index, filesLength, Orientation) => (dispatch, getState )=> {
    uploadFiles : (callbackJson, file, filesName, isLast) => (dispatch, getState )=> {

        let fileArr = []

        fileArr.push({
            fileName: filesName,
            // thumbnail: callbackJson.data.enclosurePath,
            enclosurePath: callbackJson.data.enclosurePath,
            size: (callbackJson.data.size/1024).toFixed(2),
            imageOrFile: callbackJson.data.mimeType.toString().toUpperCase().indexOf('IMAGE') > -1 ? 'TRUE' : 'FALSE',
            label: "无标签",
            beDelete: false,
            mimeType: callbackJson.data.mimeType
        })
        fetchApi('insertEnclosure', 'POST', JSON.stringify({
            enclosureList: fileArr
        }), json => {
            if (json.code === 0) {
                dispatch({
                    type: ActionTypes.CHANGE_RUNNING_ENCLOSURE_LIST,
                    imgArr: json.data.enclosureList,
                })
            }
            if (isLast) {
                thirdParty.toast.hide()
            }
        })
        // const homeState = getState().homeState
        // const sobid = homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
		// const useruuid = homeState.getIn(['data', 'userInfo', 'useruuid'])
		// //begin：本url影响编译环境，不可做任何修改
		// // const dirUrl = `test/${sobid}/${year}-${month}/${vcIndex}`;
		// const timestamp = new Date().getTime()
		// const dirUrl = `test/${sobid}/${useruuid}/${timestamp}`
        //
        //
        // // const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
        // // // thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        // // let fileName = isIPhone ? (new Date()).valueOf()+ '.jpg' : ''
        // // if (files['name'].indexOf('@') > -1) {
        // //     fileName = (new Date()).valueOf()+ '.jpg'
        // // }
        // let fileName = file['name']
        // const fileExtend = fileName.substring(fileName.lastIndexOf('.')).toUpperCase()
        //
        // if (fileExtend === '.JPG' || fileExtend === '.JPEG' || fileExtend === '.PNG' || fileExtend === '.GIF') {
        //     fileName = (new Date()).valueOf()+ '.jpg'
        // }
        //
        // let orientationNum = Orientation ? Orientation : 1
        //
        // upfile({
        //     file: file,   //文件，必填,html5 file类型，不需要读数据流，files[0]
        //     name: fileName, //文件名称，选填，默认为文件名称
        //     token: sessionStorage.getItem('uploadToken'),  //token，必填
        //     dir: dirUrl,  //目录，选填，默认根目录''
        //     retries: 0,  //重试次数，选填，默认0不重试
        //     maxSize: 10*1024*1024,  //上传大小限制，选填，默认0没有限制 10M
        //     mimeLimit: 'image/*', //image/jpeg
        //     insertOnly: 1,//0可覆盖  1 不可覆盖
        //     callback: function (percent, result) {
        //         // percent（上传百分比）：-1失败；0-100上传的百分比；100即完成上传
        //         // result(服务端返回的responseText，json格式)
        //         // result = JSON.stringify(result);
        //         // thirdParty.toast.hide()
        //
        //         if (result.code == 'OK') {
        //             let fileArr=[];
        //             fileArr.push({
        //                 fileName:result.name,
        //                 thumbnail:result.url+'@50w_50h_90Q',
        //                 enclosurepath:result.url,
        //                 size:(result.fileSize/1024).toFixed(2),
        //                 imageOrFile:result.isImage.toString().toUpperCase(),
        //                 label:"无标签",
        //                 beDelete: false,
        //                 mimeType:result.mimeType,
        //                 orientation: orientationNum
        //             })
        //             fetchApi('insertEnclosure','POST',JSON.stringify({
        //                 enclosureList: fileArr
        //             }), json => {
        //
        //                 if (showMessage(json,'','','',true)) {
        //                     dispatch({
        //                         type: ActionTypes.CHANGE_RUNNING_ENCLOSURE_LIST,
        //                         imgArr:json.data.enclosureList,
        //                         // length: enclosureCountNumber
        //                     })
        //                 }
        //                 if (index + 1 === filesLength) {
        //                     thirdParty.toast.hide()
        //                 }
        //             })
        //
        //         } else if (result.code == 'InvalidArgument') {
        //             if(index + 1 === filesLength){
        //                 thirdParty.toast.hide()
        //             }
        //             return thirdParty.toast.info('上传失败，文件名中不能包含 \ : * ? " < > | ; ／等字符')
        //         } else {
        //             if(index + 1 === filesLength){
        //                 thirdParty.toast.hide()
        //             }
        //         }
        //
        //         if (percent === -1) {
        //             return thirdParty.toast.info(result)
        //         }
        //
        //     }
        // })
    },
    deleteUploadFJUrl : (index,PageTab,paymentType) => (dispatch) => {
        dispatch({
            type: ActionTypes.DELETE_UPLOAD_FJ_URL,
            index
        })

    },
    changeLrlsEnclosureList: () => ({
        type: ActionTypes.INIT_FJ_LIST,
    }),
    getLabelFetch : () => dispatch => {
        // thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getLsLabel', 'POST', '',json => {
            // thirdParty.toast.hide()
            if(showMessage(json)){
                dispatch({
                    type: ActionTypes.GET_LS_LABEL_FETCH,
                    receivedData: json
                })
            }

            })
    },
    changeTagName : (index,value) => (dispatch) => {
        dispatch({
            type: ActionTypes.CHANGE_LS_TAG_NAME,
            index,
            value
        })
    }


}

export { homeAccountActions }

//获取卡片数据
function getCard(data, dispatch, fromYl) {
    const categoryType = data.get('categoryType')
    const propertyCarryover = data.get('propertyCarryover') === 'SX_HW' ? true : false

    const beProject = data.get('beProject')
    //获取项目卡片
    if (beProject) {
        const projectRange = data.get('projectRange')
        dispatch(homeAccountActions.getProjectCardList(projectRange, categoryType, fromYl))
    } else {
        dispatch(homeAccountActions.changeHomeAccountData('project', false))
    }

    switch (categoryType) {
		case 'LB_YYSR': {
            const beManagemented = data.getIn(['acBusinessIncome', 'beManagemented'])//收付管理
            if (beManagemented) {
                dispatch(yysrAccountActions.getYysrCardList('contactsRange'))
            }
            if (propertyCarryover) {
                dispatch(yysrAccountActions.getYysrCardList('stockRange'))
            }
            dispatch(homeAccountActions.getInventoryHighTypeList())
			break
		}
        case 'LB_YYZC': {
            const beManagemented = data.getIn(['acBusinessExpense', 'beManagemented'])//收付管理
            if (beManagemented) {
                dispatch(yyzcAccountActions.getYyzcCardList('contactsRange'))
            }
            if (propertyCarryover) {
                dispatch(yyzcAccountActions.getYyzcCardList('stockRange'))
            }
            dispatch(homeAccountActions.getInventoryHighTypeList())
			break
		}
        case 'LB_FYZC': {
            const beManagemented = data.getIn(['acCost', 'beManagemented'])//收付管理
            if (beManagemented) {
                dispatch(fyzcAccountActions.getFyzcCardList('contactsRange'))
            }
			break
		}
        case 'LB_YYWSR': {
            const beManagemented = data.getIn(['acBusinessOutIncome', 'beManagemented'])//收付管理
            if (beManagemented) {
                dispatch(yywsrAccountActions.getYywsrCardList('contactsRange'))
            }
			break
		}
        case 'LB_YYWZC': {
            const beManagemented = data.getIn(['acBusinessOutExpense', 'beManagemented'])//收付管理
            if (beManagemented) {
                dispatch(yywzcAccountActions.getYywzcCardList('contactsRange'))
            }
			break
		}
        case 'LB_CQZC': {
            const beManagemented = data.getIn(['acAssets', 'beManagemented'])//收付管理
            if (beManagemented) {
                dispatch(cqzcAccountActions.getCqzcCardList('contactsRange'))
            }
			break
		}
        case 'LB_GGFYFT': {
            dispatch(ggfyftAccountActions.getGgfyftProjectList())
            break
        }
        case 'LB_SFZC': {
            const propertyTax = data.get('propertyTax')
            if (!fromYl && propertyTax == 'SX_ZZS') {//新增
                dispatch(sfzcAccountActions.getSfzcPaymentList())
            }
            break
        }
		default: console.log('无需获取卡片')
	}
}

//新增往来卡片后重新获取数据
function getContactsOrStockCard(categoryType, dispatch, cardType) {
    switch (categoryType) {
		case 'LB_YYSR': {
            dispatch(yysrAccountActions.getYysrCardList(cardType))
			break
		}
        case 'LB_YYZC': {
            dispatch(yyzcAccountActions.getYyzcCardList(cardType))
			break
		}
        case 'LB_FYZC': {
            dispatch(fyzcAccountActions.getFyzcCardList(cardType))
			break
		}
        case 'LB_YYWSR': {
            dispatch(yywsrAccountActions.getYywsrCardList(cardType))
			break
		}
        case 'LB_YYWZC': {
            dispatch(yywzcAccountActions.getYywzcCardList(cardType))
			break
		}
        case 'LB_CQZC': {
            dispatch(cqzcAccountActions.getCqzcCardList(cardType))
			break
		}
		default: console.log('无需重新获取卡片')
	}
}
