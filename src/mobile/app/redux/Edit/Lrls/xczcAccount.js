import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { abstractFun } from 'app/containers/Edit/Lrls/components'


const xczcAccountState = fromJS({
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
        amount: 0.00,//金额
        runningState: '',//
        propertyList: [],
        propertyCost: '',//薪资性质  XZ_SALE XZ_MANAGE  销售 管理
        propertyCostList: [],
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        accumulationAmount: 0,//个人公积金未处理金额-需要单独获取
        socialSecurityAmount: 0,//个人社保未处理金额-需要单独获取
        paymentList:[],//计提列表
        jtAmount: 0,//所购选的计提流水的总额
        "acPayment": {
            "saleAc": [],  // 销售 科目列表
            "saleList": [],  // 销售 科目辅助核算
            "manageAc": [],  // 管理 科目列表
            "manageList": [],  // 管理 科目辅助核算
            "accruedAc": [],  // 计提 科目列表
            "accruedList": [],  // 计提 科目辅助核算
            "fundAc": [],  // 公积金 科目列表
            "fundList": [],  // 公积金 科目辅助核算
            "socialSecurityAc": [],  // 社保 科目列表
            "socialSecurityList": [],  // 社保 科目辅助核算
            "incomeTaxAc": [],  // 个人所得税 科目列表
            "incomeTaxList": [],  // 个人所得税 科目辅助核算
            "welfareAc": [],  // 福利 科目列表
            "welfareList": [],  // 福利 科目辅助核算
            "beAccrued": false,  // 是否计提
            "beWithholding": false,  // 是否代扣代缴
            "beWelfare": false, // 是否过渡福利费
            "actualAmount": 0,//支付金额
            'companyAccumulationAmount': 0,// 公积金(公司部分)
            'personAccumulationAmount': 0,// 公积金(个人部分)
            'companySocialSecurityAmount': 0,//社保(公司部分)
            'personSocialSecurityAmount': 0,// 社保(个人部分)
            'incomeTaxAmount': 0 // 个人所得税
        }
    }
})

// Reducer
export default function reducer(state = xczcAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_XCZC_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')

            let propertyCost = ''
            const propertyCostList = action.receivedData.propertyCostList
            if (propertyCostList.length == 1) {
                propertyCost = propertyCostList[0]
            }

            let runningState = '', runningAbstract = ''
            const propertyPay = action.receivedData.propertyPay
            const beAccrued = action.receivedData.acPayment.beAccrued// 是否计提

            if (propertyPay === 'SX_FLF') {
                runningState = 'STATE_XC_YF'
                runningAbstract = '福利费支出'
            }
            if (!beAccrued && (propertyPay === 'SX_GZXJ' || propertyPay === 'SX_QTXC')) {
                runningState = 'STATE_XC_FF'
                runningAbstract = abstractFun(runningState, fromJS(action.receivedData))
            }
            if (!beAccrued && (propertyPay === 'SX_SHBX' || propertyPay === 'SX_ZFGJJ')) {
                runningState = 'STATE_XC_JN'
                runningAbstract = abstractFun(runningState, fromJS(action.receivedData))
            }

            return xczcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data', 'categoryUuid'], arr[0])
                        .setIn(['data', 'categoryName'], arr[1])
                        .setIn(['data', 'runningDate'], action.data.get('runningDate'))
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'runningState'], runningState)
                        .setIn(['data', 'amount'], amount)
                        .setIn(['data', 'propertyCost'], propertyCost)
                        .setIn(['data', 'runningAbstract'], runningAbstract)
                        .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_XCZC_FROM_YLLS]					    : () => {
            let jtAmount = 0
            let paymentList = action.state.getIn(['data', 'paymentList']).update(item => item.map(v => {
                let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
				jtAmount += notHandleAmount
                return v.set('notHandleAmount', notHandleAmount)
            }))

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .setIn(['data', 'paymentList'], paymentList)
                        .setIn(['data', 'jtAmount'], jtAmount)
        },
        [ActionTypes.CHANGE_XCZC_DATA]					         : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_XCZC_RUNNING_STATE]					 : () => {
            return state.setIn(['data' ,'runningState'], action.key)
        },
        [ActionTypes.CHANGE_XCZC_ASSLIST]					     : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.assId = arr[0]
            item.assName = arr[1]
            item.assCategory = arr[2]
            return state.setIn(['data' ,'acPayment', action.acType, action.idx], fromJS(item))
        },
        [ActionTypes.CHANGE_XCZC_ACCOUNT]			             : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.XCZC_PERSON_AMOUNT]					     : () => {
            return state.setIn(['data' ,'acPayment', action.personType], action.value)
        },
        [ActionTypes.XCZC_CALCULATE_AMOUNT]				         : () => {
            const companyAccumulationAmount = state.getIn(['data', 'acPayment','companyAccumulationAmount'])// 公积金(公司部分)
            const personAccumulationAmount = state.getIn(['data', 'acPayment','personAccumulationAmount'])// 公积金(个人部分)
            const companySocialSecurityAmount = state.getIn(['data', 'acPayment','companySocialSecurityAmount'])//社保(公司部分)
            const personSocialSecurityAmount = state.getIn(['data', 'acPayment','personSocialSecurityAmount']) // 社保(个人部分)
            const incomeTaxAmount = state.getIn(['data', 'acPayment','incomeTaxAmount']) // 个人所得税
            const amount = state.getIn(['data','amount'])

            let actualAmount
            switch (action.propertyPay) {
                case 'SX_GZXJ':
                    actualAmount = decimal(Number(amount) - Number(personAccumulationAmount) - Number(personSocialSecurityAmount) - Number(incomeTaxAmount))
                    break
                case 'SX_ZFGJJ':
                    actualAmount = decimal(Number(personAccumulationAmount) + Number(companyAccumulationAmount))
                    break
                case 'SX_SHBX':
                    actualAmount = decimal(Number(companySocialSecurityAmount) + Number(personSocialSecurityAmount))
                    break
                default:
                    actualAmount = 0
            }
            return state.setIn(['data','acPayment','actualAmount'], actualAmount)
        },
        [ActionTypes.XCZC_CLEAR_ACLIST]				             : () => {
            switch (action.acType) {
                case 'fundList': {
                    state = state.setIn(['data', 'acPayment', 'fundList'], fromJS([]))
                                .setIn(['data', 'acPayment', 'personAccumulationAmount'], 0)
                    break
                }
                case 'socialSecurityList': {
                    state = state.setIn(['data', 'acPayment', 'socialSecurityList'], fromJS([]))
                                .setIn(['data', 'acPayment', 'personSocialSecurityAmount'], 0)

                    break
                }
                case 'incomeTaxList': {
                    state = state.setIn(['data', 'acPayment', 'incomeTaxList'], fromJS([]))
                                .setIn(['data', 'acPayment', 'incomeTaxAmount'], 0)
                    break
                }
                default: {
                    console.log(`清空${action.acTyp}失败`);
                }
            }
            return state
        },
        [ActionTypes.AFTER_XCZC_SAVE]                            : () => {
            if (action.saveAndNew) {
                state = xczcAccountState
            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_XCZC_UNTREATEDAMOUNT]                   : () => {
            return state.setIn(['data', action.amountType], action.receivedData[action.amountType])
        },
        [ActionTypes.GET_XCZC_PAYMENTLIST]                       : () => {
            return state.setIn(['data', 'paymentList'], fromJS(action.receivedData))
                        .setIn(['data', 'jtAmount'], 0)
        },
        [ActionTypes.PAYMENTLIST_BESELECT]                       : () => {
            return state.setIn(['data', 'paymentList', action.idx, 'beSelect'], action.value)
        },
        [ActionTypes.PAYMENTLIST_BEALLCHECK]                     : () => {
            if (action.value) {
                state = state.updateIn(['data', 'paymentList'], v => v.map(w => w.set('beSelect', true)))
            } else {
                state = state.updateIn(['data', 'paymentList'], v => v.map(w => w.set('beSelect', false)))
            }
            return state
        },
        [ActionTypes.GET_YL_XCZCSTATE]                           : () => {
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
        [ActionTypes.XCZC_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])

            let propertyCost = ''
            const propertyCostList = action.receivedData.propertyCostList
            if (propertyCostList.length == 1) {
                propertyCost = propertyCostList[0]
            }

            let runningState = '', runningAbstract = ''
            const propertyPay = action.receivedData.propertyPay
            const beAccrued = action.receivedData.acPayment.beAccrued// 是否计提

            if (propertyPay === 'SX_FLF') {
                runningState = 'STATE_XC_YF'
                runningAbstract = '福利费支出'
            }
            if (!beAccrued && (propertyPay === 'SX_GZXJ' || propertyPay === 'SX_QTXC')) {
                runningState = 'STATE_XC_FF'
                runningAbstract = abstractFun(runningState, fromJS(action.receivedData))
            }
            if (!beAccrued && (propertyPay === 'SX_SHBX' || propertyPay === 'SX_ZFGJJ')) {
                runningState = 'STATE_XC_JN'
                runningAbstract = abstractFun(runningState, fromJS(action.receivedData))
            }

            return xczcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data', 'runningState'], runningState)
                                .setIn(['data', 'propertyCost'], propertyCost)
                                .setIn(['data', 'runningAbstract'], runningAbstract)
        }
    }[action.type] || (() => state))()
}

// Action Creators
const xczcAccountActions = {
    changeXczcData: (dataType, value) => ({
        type: ActionTypes.CHANGE_XCZC_DATA,
        dataType,
        value
    }),
    changeXczcRunningState: (propertyPay, key) => ({
        type: ActionTypes.CHANGE_XCZC_RUNNING_STATE,
        propertyPay,
        key
    }),
    changeXczcAssList: (idx, value, acType) => ({
        type: ActionTypes.CHANGE_XCZC_ASSLIST,
        value,
        idx,
        acType
    }),
    changeXczcAccount: (value) => ({
        type: ActionTypes.CHANGE_XCZC_ACCOUNT,
        value
    }),
    xczcPersonAmount: (personType, value) => ({
        type: ActionTypes.XCZC_PERSON_AMOUNT,
        personType,
        value
    }),
    autoCalculateAmount: (propertyPay) => ({
        type: ActionTypes.XCZC_CALCULATE_AMOUNT,
        propertyPay
    }),
    xczcClearAcList: (acType) => ({
        type: ActionTypes.XCZC_CLEAR_ACLIST,
        acType
    }),
    getXczcAccumulationAmount: () => (dispatch, getState) => {
        //获取公积金金额
        const state = getState().xczcAccountState
        const acPayment = state.getIn(['data', 'acPayment'])
        const fundAc = acPayment.get('fundAc')//公积金科目
        const fundCategoryList = fundAc.size ? fundAc.getIn([0, 'assCategoryList']) : []
        const fundList = acPayment.get('fundList')

        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])
        let accumulationAcId = fundAc.getIn([0, 'acId'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getPaymentInfo', 'POST', JSON.stringify({
            categoryUuid,
            runningDate,
            acType: 'AC_GJJ',
            accumulationAcId,
            accumulationAssId1: '',
            accumulationCategory1: '',
            accumulationAssId2: '',
            accumulationCategory2: ''
          }) , json => {
              thirdParty.toast.hide()
              if (showMessage(json)) {
                  dispatch({
                      type: ActionTypes.GET_XCZC_UNTREATEDAMOUNT,
                      receivedData: json.data.result,
                      amountType: 'accumulationAmount'
                  })
              }
          })
    },
    getXczcSocialSecurityAmount: () => (dispatch, getState) => {
        const state = getState().xczcAccountState
        const acPayment = state.getIn(['data', 'acPayment'])
        const socialSecurityAc = acPayment.get('socialSecurityAc')//公积金科目
        const socialSecurityCategoryList = socialSecurityAc.size ? socialSecurityAc.getIn([0, 'assCategoryList']) : []
        const socialSecurityList = acPayment.get('socialSecurityList')

        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])
        let socialSecurityAcId = socialSecurityAc.getIn([0, 'acId'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getPaymentInfo', 'POST', JSON.stringify({
            categoryUuid,
            runningDate,
            acType: 'AC_SB',
            socialSecurityAcId,
            socialSecurityAssId1: '',
            socialSecurityCategory1: '',
            socialSecurityAssId2: '',
            socialSecurityCategory2: ''
          }) , json => {
              thirdParty.toast.hide()
              if (showMessage(json)) {
                  dispatch({
                      type: ActionTypes.GET_XCZC_UNTREATEDAMOUNT,
                      receivedData: json.data.result,
                      amountType: 'socialSecurityAmount'
                  })
              }
          })
    },
    getXczcPaymentList: () => (dispatch, getState) => {
        const state = getState().xczcAccountState
        const acPayment = state.getIn(['data', 'acPayment'])
        const accruedAc = acPayment.get('accruedAc')//计提科目
        const accruedCategoryList = accruedAc.size ? accruedAc.getIn([0, 'assCategoryList']) : []
        const accruedList = acPayment.get('accruedList')

        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])
        let acId = accruedAc.getIn([0, 'acId'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getPaymentTaxInfo', 'POST', JSON.stringify({
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
                      type: ActionTypes.GET_XCZC_PAYMENTLIST,
                      receivedData: json.data.resultList,
                  })
              }
          })
    },
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().xczcAccountState
        const data = state.get('data').toJS()
        const beAccrued = data['acPayment']['beAccrued']// 是否计提
        const runningState = data['runningState']
        const propertyCost = data['propertyCost']

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

        const propertyPay = data['propertyPay']//薪酬属性
        const beWithholding = data['acPayment']['beWithholding']// 是否代扣代缴
        const amount = data['amount']
        const accountUuid = data['accountUuid']

        switch (propertyPay) {
            case 'SX_GZXJ': {
                if (runningState == 'STATE_XC_JT' && propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (runningState == 'STATE_XC_FF' && !beAccrued && propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (amount <= 0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (runningState == 'STATE_XC_FF' && accountUuid == '') {
                    return thirdParty.toast.info('请选择账户')
                }
                break
            }
            case 'SX_SHBX': {
                if (runningState == 'STATE_XC_JT' && propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (runningState == 'STATE_XC_JN' && !beAccrued && propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (runningState == 'STATE_XC_JT' && amount <= 0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (runningState == 'STATE_XC_JN' && accountUuid == '') {
                    return thirdParty.toast.info('请选择账户')
                }
                break
            }
            case 'SX_ZFGJJ': {
                if (runningState == 'STATE_XC_JT' && propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (runningState == 'STATE_XC_JN' && !beAccrued && propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (!beAccrued && amount <= 0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (runningState == 'STATE_XC_JN' && accountUuid == '') {
                    return thirdParty.toast.info('请选择账户')
                }
                break
            }
            case 'SX_FLF': {
                if (propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (amount <= 0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (accountUuid == '') {
                    return thirdParty.toast.info('请选择账户')
                }
                break
            }
            case 'SX_QTXC': {
                if (runningState == 'STATE_XC_JT' && propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (runningState == 'STATE_XC_FF' && !beAccrued && propertyCost == '') {
                    return thirdParty.toast.info('请选择费用性质')
                }
                if (amount <= 0) {
                    return thirdParty.toast.info('请填写金额')
                }
                if (runningState == 'STATE_XC_FF' && accountUuid == '') {
                    return thirdParty.toast.info('请选择账户')
                }
                break
            }
            default: {
                console.log('校验薪酬支出出错');
            }
        }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        let shouldCheck = false
        if (runningState == 'STATE_XC_JT' || ( !beAccrued && runningState == 'STATE_XC_JN') || runningState == 'STATE_XC_YF') {
            shouldCheck = true
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
        if (beAccrued && (runningState == 'STATE_XC_JN' || runningState == 'STATE_XC_FF')) {
            isGetYlls = true
            // const beSelect = data['paymentList'].some(v => v['beSelect'])
            // if (!beSelect) {
            //     return thirdParty.toast.info('请选择计提流水')
            // }
        }

        let url = 'modifyRunningbusiness'
        const isInsert = state.getIn(['views', 'insertOrModify']) === 'insert' ? true : false
        if (isInsert) {//insert时不传uuid
            delete data['uuid']
            delete data['parentUuid']
            url = 'insertPayment'
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
                    dispatch(xczcAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    if (isGetYlls) {//重新获取流水
                        const uuid = isInsert ? json.data.uuid : data['uuid']
                        dispatch(xczcAccountActions.getYlXczcState(uuid))
                    }
                    dispatch(xczcAccountActions.afterXczcSave(json.data, saveAndNew, isInsert))
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
    afterXczcSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_XCZC_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYlXczcState: (uuid) => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YL_XCZCSTATE,
                    receivedData: json.data.result
                })
                const beWithholding = json.data.result.acPayment.beWithholding// 是否代扣代缴住房公积金
                const beWithholdSocial = json.data.result.acPayment.beWithholdSocial// 是否代扣代缴社保
                if (beWithholding) {
                    dispatch(xczcAccountActions.getXczcAccumulationAmount())
                }
                if (beWithholdSocial) {
                    dispatch(xczcAccountActions.getXczcSocialSecurityAmount())
                }
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
                    type: ActionTypes.XCZC_SAVE_AND_NEW,
                    receivedData: jsonData
                })
            }
        })
    }

}

export const ActionTypes = {
    GET_LB_XCZC_CARD_DETAIL: 'GET_LB_XCZC_CARD_DETAIL',
    GET_LB_XCZC_FROM_YLLS: 'GET_LB_XCZC_FROM_YLLS',
    CHANGE_XCZC_DATA: 'CHANGE_XCZC_DATA',
    CHANGE_XCZC_RUNNING_STATE: 'CHANGE_XCZC_RUNNING_STATE',
    CHANGE_XCZC_ASSLIST: 'CHANGE_XCZC_ASSLIST',
    CHANGE_XCZC_ACCOUNT: 'CHANGE_XCZC_ACCOUNT',
    XCZC_PERSON_AMOUNT: 'XCZC_PERSON_AMOUNT',
    XCZC_CALCULATE_AMOUNT: 'XCZC_CALCULATE_AMOUNT',
    AFTER_XCZC_SAVE: 'AFTER_XCZC_SAVE',
    XCZC_CLEAR_ACLIST: 'XCZC_CLEAR_ACLIST',
    GET_XCZC_UNTREATEDAMOUNT: 'GET_XCZC_UNTREATEDAMOUNT',
    GET_XCZC_PAYMENTLIST: 'GET_XCZC_PAYMENTLIST',
    PAYMENTLIST_BESELECT: 'PAYMENTLIST_BESELECT',
    PAYMENTLIST_BEALLCHECK: 'PAYMENTLIST_BEALLCHECK',
    GET_YL_XCZCSTATE: 'GET_YL_XCZCSTATE',
    XCZC_SAVE_AND_NEW: 'XCZC_SAVE_AND_NEW'
}

export { xczcAccountActions }
