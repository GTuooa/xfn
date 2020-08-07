import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal, DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { abstractFun } from 'app/containers/Edit/Lrls/components'


const sfzcAccountState = fromJS({
    views: {
        insertOrModify: 'insert',//流水是保存还是新增
        fromYl: false
    },
    data: {
        categoryType: '',//十四大类的一种
        categoryUuid: '',//选中类别的uuid
        categoryName: '请选择类别',//选中类别的name
        runningDate: '',//日期
        flowNumber: '',//流水号
        uuid: '',
        runningAbstract: '',//摘要
        amount: '',//金额
        runningState: '',//
        propertyTax: '',//属性
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        paymentList:[],//计提列表
        jtAmount: '',//所购选的计提流水的总额
        handleAmount: '',
        deductedAmount: '',//代抵扣金额
        offsetAmount: '',// 预交抵扣金额
        reduceAmount: '',//减免金额
        "acTax": {
            "accruedAc": [],  // 计提 科目列表
            "accruedList": [],  // 计提 科目辅助核算
            "payAc": [],  // 缴纳 科目列表
            "payList": [],  // 缴纳 科目辅助核算
            "turnOutAc": [],  // 转出 科目列表
            "turnOutList": [],  // 转出 科目辅助核算
            "inAdvanceAc": [],  // 预交 科目列表
            "inAdvanceList": [],  // 预交 科目辅助核算
            "beAccrued": false,  // 是否计提税费
            "beTurnOut": false,  // 是否转出未交税费
            "beInAdvance": false  // 是否预交增值税
        }
    }
})

// Reducer
export default function reducer(state = sfzcAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_SFZC_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')

            const propertyTax = action.receivedData.propertyTax
            const beAccrued = action.receivedData.acTax.beAccrued// 是否计提
            const beInAdvance = action.receivedData.acTax.beInAdvance// 是否预交增值税

            let runningState = '', runningAbstract = ''
            if (propertyTax == 'SX_GRSF' || propertyTax == 'SX_ZZS') {
                runningState = 'STATE_SF_JN'
                runningAbstract = abstractFun(runningState, fromJS(action.receivedData))
            }
            if (!beAccrued && (propertyTax == 'SX_QTSF' || propertyTax == 'SX_QYSDS')) {
                runningState = 'STATE_SF_JN'
                runningAbstract = abstractFun(runningState, fromJS(action.receivedData))
            }

            return sfzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data', 'categoryUuid'], arr[0])
                        .setIn(['data', 'categoryName'], arr[1])
                        .setIn(['data', 'name'], arr[1])
                        .setIn(['data', 'runningDate'], action.data.get('runningDate'))
                        .setIn(['data' ,'runningAbstract'], runningAbstract)
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['data', 'runningState'], runningState)
                        .setIn(['views' ,'insertOrModify'], 'insert')

        },
        [ActionTypes.GET_LB_SFZC_FROM_YLLS]					    : () => {
            // const beAccrued = action.state.getIn(['data', 'acTax', 'beAccrued'])// 是否计提
            const propertyTax = action.state.getIn(['data', 'propertyTax'])
            const runningState = action.state.getIn(['data', 'runningState'])
            let jtAmount = 0, paymentList = fromJS([])
            // if (beAccrued && propertyTax != 'SX_GRSF' && runningState == 'STATE_SF_JN') {
            if (propertyTax != 'SX_GRSF' && runningState == 'STATE_SF_JN') {
                paymentList = action.state.getIn(['data', 'paymentList']).update(item => item.map(v => {
                    let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
                    jtAmount += notHandleAmount
                    return v.set('notHandleAmount', notHandleAmount)
                }))
            } else {
                paymentList = action.state.getIn(['data', 'paymentList'])
            }

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .setIn(['data', 'paymentList'], paymentList)
                        .setIn(['data', 'jtAmount'], jtAmount)
        },
        [ActionTypes.CHANGE_SFZC_DATA]					         : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_SFZC_RUNNING_STATE]					 : () => {
            return state.setIn(['data' ,'runningState'], action.key)
        },
        [ActionTypes.CHANGE_SFZC_ASSLIST]					      : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.assId = arr[0]
            item.assName = arr[1]
            item.assCategory = arr[2]
            return state.setIn(['data' ,'acTax', action.acType, action.idx], fromJS(item))
        },
        [ActionTypes.CHANGE_SFZC_ACCOUNT]			     : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.AFTER_SFZC_SAVE]                           : () => {
            if (action.saveAndNew) {
                state = sfzcAccountState
            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)

            }

            return state
        },
        [ActionTypes.GET_SFZC_PAYMENTLIST]                   : () => {
            if (action.isQtsf) {
                state = state.setIn(['data', 'amount'], '')
            } else {
                state = state.setIn(['data', 'jtAmount'], '')
            }
            return state.setIn(['data', 'paymentList'], fromJS(action.receivedData))
        },
        [ActionTypes.PAYMENTLIST_BESELECT]                   : () => {
            return state.setIn(['data', 'paymentList', action.idx, 'beSelect'], action.value)
        },
        [ActionTypes.PAYMENTLIST_BEALLCHECK]                : () => {
            if (action.value) {
                state = state.updateIn(['data', 'paymentList'], v => v.map(w => w.set('beSelect', true)))
            } else {
                state = state.updateIn(['data', 'paymentList'], v => v.map(w => w.set('beSelect', false)))
            }
            return state
        },
        [ActionTypes.GET_YL_SFZCSTATE]                           : () => {
            let jtAmount = 0
            let paymentList = fromJS(action.receivedData.paymentList).update(item => item.map(v => {
                let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
				jtAmount += notHandleAmount
                return v.set('notHandleAmount', notHandleAmount)
            }))

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .set('data', fromJS(action.receivedData))
                        .setIn(['data', 'paymentList'], paymentList)
                        .setIn(['data', 'jtAmount'], jtAmount)

        },
        [ActionTypes.SFZC_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])

            const propertyTax = action.receivedData.propertyTax
            const beAccrued = action.receivedData.acTax.beAccrued// 是否计提
            const beInAdvance = action.receivedData.acTax.beInAdvance// 是否预交增值税

            let runningState = '', runningAbstract = ''
            if (propertyTax == 'SX_GRSF' || propertyTax == 'SX_ZZS') {
                runningState = 'STATE_SF_JN'
                runningAbstract = abstractFun(runningState, fromJS(action.receivedData))
            }
            if (!beAccrued && (propertyTax == 'SX_QTSF' || propertyTax == 'SX_QYSDS')) {
                runningState = 'STATE_SF_JN'
                runningAbstract = abstractFun(runningState, fromJS(action.receivedData))
            }


            return sfzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data' ,'runningState'], runningState)
                                .setIn(['data' ,'runningAbstract'], runningAbstract)
        }

    }[action.type] || (() => state))()
}



// Action Creators
const sfzcAccountActions = {
    changeSfzcData: (dataType, value) => ({
        type: ActionTypes.CHANGE_SFZC_DATA,
        dataType,
        value
    }),
    changeSfzcRunningState: (propertyTax, key) => ({
        type: ActionTypes.CHANGE_SFZC_RUNNING_STATE,
        propertyTax,
        key
    }),
    changeSfzcAssList: (idx, value, acType) => ({
        type: ActionTypes.CHANGE_SFZC_ASSLIST,
        value,
        idx,
        acType
    }),
    changeSfzcAccount: (value) => ({
        type: ActionTypes.CHANGE_SFZC_ACCOUNT,
        value
    }),
    getSfzcPaymentList: (isQtsf) => (dispatch, getState) => {
        //isQtsf 是否是其他税费 默认是增值税 科目需要再处理一下
        const state = getState().sfzcAccountState
        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])
        const acTax = state.getIn(['data', 'acTax'])

        const accruedAc = acTax.get('accruedAc')//计提科目 isQtsf
        const accruedCategoryList = accruedAc.size ? accruedAc.getIn([0, 'assCategoryList']) : []
        const accruedList = acTax.get('accruedList')

        const payAc = acTax.get('payAc')//缴纳科目 增值税
        const payCategoryList = payAc.size ? payAc.getIn([0, 'assCategoryList']) : []
        const payList = acTax.get('payList')

        let acId = isQtsf ? accruedAc.getIn([0, 'acId']) : payAc.getIn([0, 'acId'])
        let categoryList = isQtsf ? accruedCategoryList : payCategoryList
        let acList = isQtsf ? accruedList : payList
        let url = isQtsf ? 'getPaymentTaxInfo' : 'getBusinessVATInfo'

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            categoryUuid,
            runningDate,
            acId,
            assId1: '',
            assCategory1: '',
            assId2: '',
            assCategory2: ''
          }) , json => {
              thirdParty.toast.hide()
              if (showMessage(json)) {
                  dispatch({
                      type: ActionTypes.GET_SFZC_PAYMENTLIST,
                      receivedData: json.data.resultList,
                      isQtsf
                  })
              }
          })

        if (!isQtsf) {//增值税获取待抵扣金额
            fetchApi('getPaymentTaxInfo', 'POST', JSON.stringify({
                categoryUuid,
                runningDate,
                acId,
                assId1: '',
                assCategory1: '',
                assId2: '',
                assCategory2: ''
              }) , json => {
                  if (showMessage(json)) {
                      dispatch(sfzcAccountActions.changeSfzcData('deductedAmount', json.data.result.amount))
                  }
              })
        }

    },
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().sfzcAccountState
        const data = state.get('data').toJS()
        const propertyTax = data['propertyTax'] //税费属性
        const runningState = data['runningState']
        const accountUuid = data['accountUuid']
        const amount = data['amount']
        const beAccrued = data['acTax']['beAccrued']// 是否计提

        const jtAmount = data['jtAmount']//所勾选的计提流水的总额
        const handleAmount = data['handleAmount']//支付金额
		const offsetAmount = data['offsetAmount']// 预交抵扣金额
		const reduceAmount = data['reduceAmount']//减免金额
		const totalPay = Number(offsetAmount) + Number(handleAmount) + Number(reduceAmount)//税费总额

        //校验
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (runningState == '') {
            return thirdParty.toast.info('请选择流水状态')
        }

        switch (propertyTax) {
            case 'SX_ZZS': {
                if (runningState == 'STATE_SF_JN' && totalPay <=0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (runningState == 'STATE_SF_YJZZS' && amount <=0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (handleAmount > 0 && accountUuid == '') {
                    return thirdParty.toast.info('请选择账户')
                }
                if (runningState == 'STATE_SF_JN' && totalPay > jtAmount) {
                    return thirdParty.toast.info('处理税费不能大于待处理税费')
                }

                break
            }
            case 'SX_QTSF':
            case 'SX_QYSDS': {
                if (runningState == 'STATE_SF_JT' && amount <= 0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (runningState == 'STATE_SF_JN') {
                    let totalAmount = Number(amount) + Number(reduceAmount)
                    if (totalAmount <= 0) {
                        return thirdParty.toast.info('请填写金额')
                    }
                    if (amount > 0 && accountUuid == '') {
                        return thirdParty.toast.info('请选择账户')
                    }
                }
                break
            }
            case 'SX_GRSF': {
                if (amount <= 0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (accountUuid == '') {
                    return thirdParty.toast.info('请选择账户')
                }
                break
            }
            default: {
                console.log('校验税费支出出错');
            }
        }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        let shouldCheck = false
        if (propertyTax=='SX_QYSDS' || propertyTax=='SX_QTSF') {
            if (runningState == 'STATE_SF_JT' || ( !beAccrued && runningState == 'STATE_SF_JN')) {
                shouldCheck = true
            }
        }
        if (usedProject && shouldCheck) {
            let uuidArr = [], hasEmptyAmount = false
            const hasEmpty = projectCard.every(v => {
                uuidArr.push(v['uuid'])
                if (v['amount'] <= 0) {
                    hasEmptyAmount = true
                }
                return v['uuid']
            })
            if (!hasEmpty) {
                return thirdParty.toast.info('有未选择的项目卡片')
            }
            if (hasEmptyAmount) {
                return thirdParty.toast.info('项目卡片有未填写的金额')
            }
            let newArr = [...new Set(uuidArr)]
            if (newArr.length < uuidArr.length) {
                return thirdParty.toast.info('有重复的项目卡片')
            }
        }

        let isGetYlls = false
        if (beAccrued && propertyTax != 'SX_GRSF' && runningState == 'STATE_SF_JN') {
            isGetYlls = true
            const beSelect = data['paymentList'].some(v => v['beSelect'])
            if (!beSelect) {
                return thirdParty.toast.info('请选择需要处理的流水')
            }
        }

        let url = 'modifyRunningbusiness'
        const isInsert = state.getIn(['views', 'insertOrModify']) === 'insert' ? true : false
        if (isInsert) {//insert时不传uuid
            delete data['uuid']
            delete data['parentUuid']
            url = 'insertTax'
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            usedProject,
            projectCard,
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                thirdParty.toast.success('保存成功', 2)
                if (saveAndNew) { //保存并新增
                    const categoryUuid = data['categoryUuid']
                    dispatch(sfzcAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    if (isGetYlls) {//重新获取流水
                        const uuid = isInsert ? json.data.uuid : data['uuid']
                        dispatch(sfzcAccountActions.getYlSfzcState(uuid))
                    }
                    dispatch(sfzcAccountActions.afterSfzcSave(json.data, saveAndNew, isInsert))
                }
            }


        })
    },
    paymentListBeSelect: (idx, value) => ({
        type: ActionTypes.PAYMENTLIST_BESELECT,
        value,
        idx
    }),
    paymentListBeAllCheck: (value) => ({
        type: ActionTypes.PAYMENTLIST_BEALLCHECK,
        value
    }),
    afterSfzcSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_SFZC_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYlSfzcState: (uuid, isQtsf) => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YL_SFZCSTATE,
                    receivedData: json.data.result
                })
            }
        })
    },
    getCardDetail: (uuid) => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningDetail', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                let jsonData = json.data.result
                delete jsonData['parentUuid']

                dispatch({
                    type: ActionTypes.SFZC_SAVE_AND_NEW,
                    receivedData: jsonData
                })
                if (jsonData.propertyTax == 'SX_ZZS') {
                    dispatch(sfzcAccountActions.getSfzcPaymentList())
                }
            }
        })
    }

}

export const ActionTypes = {
    GET_LB_SFZC_CARD_DETAIL: 'GET_LB_SFZC_CARD_DETAIL',
    GET_LB_SFZC_FROM_YLLS: 'GET_LB_SFZC_FROM_YLLS',
    CHANGE_SFZC_DATA: 'CHANGE_SFZC_DATA',
    CHANGE_SFZC_RUNNING_STATE: 'CHANGE_SFZC_RUNNING_STATE',
    CHANGE_SFZC_ASSLIST: 'CHANGE_SFZC_ASSLIST',
    CHANGE_SFZC_ACCOUNT: 'CHANGE_SFZC_ACCOUNT',
    AFTER_SFZC_SAVE: 'AFTER_SFZC_SAVE',
    GET_SFZC_PAYMENTLIST: 'GET_SFZC_PAYMENTLIST',
    PAYMENTLIST_BESELECT: 'PAYMENTLIST_BESELECT',
    PAYMENTLIST_BEALLCHECK: 'PAYMENTLIST_BEALLCHECK',
    GET_YL_SFZCSTATE: 'GET_YL_SFZCSTATE',
    SFZC_SAVE_AND_NEW: 'SFZC_SAVE_AND_NEW'
}

export { sfzcAccountActions }
