import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import fetchConstantApi from 'app/constants/fetch.constant'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { pushVouhcerToLrpzReducer } from 'app/redux/Search/Cxpz/cxpz.action'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

const dataType = {
    'LB_YYSR': 'acBusinessIncome',
    'LB_YYZC': 'acBusinessExpense',
    'LB_YYWSR': 'acBusinessOutIncome',
    'LB_YYWZC': 'acBusinessOutExpense',
    'LB_JK': 'acLoan',
    'LB_TZ': 'acInvest',
    'LB_ZB': 'acCapital',
    'LB_CQZC': 'acAssets',
    'LB_FYZC': 'acCost',
    'LB_ZSKX': 'acTemporaryReceipt',
    'LB_ZFKX': 'acTemporaryPay',
    'LB_XCZC': 'acPayment',
    'LB_SFZC': 'acTax'
}


const cxAccountState = fromJS({
    views: {
        accountUuid: "",
        accountName: '全部',
        currentPage: 1,
        pageCount: 1,//总页数
        year: '',
        month: '',
        issues: [{value: '2018-01', key: ''}],//所有账期
        isLoading: false,
        currentRouter: 'CXLS',//查询流水 流水收付管理 查询核算管理的总页面
        fromRouter: '',
        selectedIndex: 'CXLS',//查询流水 和查询核算管理的各个页面
        isAccount: false//是否按账户查询
    },
    period: {
        closedmonth:"",
        closedyear:"",
        firstmonth:"",
        firstyear:"",
        lastmonth:"",
        lastyear:""
    },
    dataList: [],
    ylDataList: [],//预览列表用
    accountList: [],//账户列表
    data: {//处理单笔流水的数据
        amount: '',
        runningAbstract: '',
        runningDate: '',
        cardUuid: '',
        accountUuid: ''
    },
    categoryList:{
        assTypeList: [],//当前有几个类别
        AC_AR:[],//应收
        AC_PP:[],//预收
        AC_ADV:[],//预付
        AC_AP:[],//应付
    },
    hsgl: {//查询核算管理数据
        activeTab: 0,//当前的页面idx
        categoryList: [{key: '收付管理'}],
        contactsCardList: [{key: '全部往来单位', value: `${Limit.TREE_JOIN_STR}${Limit.TREE_JOIN_STR}全部往来单位`}],
        stockCardList: [{key: '全部存货', value: `${Limit.TREE_JOIN_STR}${Limit.TREE_JOIN_STR}全部存货`}],
        contactsCard: {uuid: '', code: '', name: '全部往来单位'},
        stockCard: {uuid: '', code: '', name: '全部存货'},
        cardNameList: [],
        isCheck: false,
        billMakeOutType: '',//开具发票的类型 BILL_MAKE_OUT_TYPE_XS BILL_MAKE_OUT_TYPE_TS
        billAuthType: '',//BILL_AUTH_TYPE_CG，BILL_AUTH_TYPE_TG
        runningState: '',
        dataList: []
    },
    projectCardList: [],//结转损益--项目卡片列表
})

// Reducer
export default function reducer(state = cxAccountState, action = {}) {
    return ({
        [ActionTypes.INIT_CXLS]                                 : () => {
            return cxAccountState
        },
        [ActionTypes.GETPERIOD_AND_BUSINESSLIST]				: () => {
            const period = action.receivedData.periodDtoJson
            const firstyear = Number(period.firstyear)
            const lastyear = Number(period.lastyear)
            const firstmonth = Number(period.firstmonth)
            const lastmonth = Number(period.lastmonth)
            const openedyear = Number(period.openedyear)
            const openedmonth = Number(period.openedmonth)

            const viewMonth = openedmonth < 10 ? '0' + openedmonth : openedmonth

            let ylDataList = []
            action.receivedData.result.childList.forEach((v, i)=> {
                ylDataList.push({idx: i, uuid: v['uuid']})
            })

            return state.set('period',fromJS(action.period))
                        .setIn(['views', 'year'], openedyear)
                        .setIn(['views', 'month'], viewMonth)
                        .setIn(['views', 'issues'], fromJS(action.issues))
                        .setIn(['views', 'pageCount'], action.receivedData.pageCount)
                        .setIn(['views', 'currentRouter'], 'CXLS')
                        .set('dataList', fromJS(action.receivedData.result.childList))
                        .set('ylDataList', fromJS(ylDataList))

        },
        [ActionTypes.GET_BUSINESSLIST]						    : () => {
            if (action.shouldConcat) {
                let oldList = state.get('dataList').toJS()
                let newList = oldList.concat(action.receivedData.result.childList)
                let ylDataList = []
                newList.forEach((v, i)=> {
                    ylDataList.push({idx: i, uuid: v['uuid']})
                })
                state = state.set('dataList', fromJS(newList)).set('ylDataList', fromJS(ylDataList))
            } else {
                let ylDataList = []
                action.receivedData.result.childList.forEach((v, i)=> {
                    ylDataList.push({idx: i, uuid: v['uuid']})
                })
                state = state.set('dataList', fromJS(action.receivedData.result.childList)).set('ylDataList', fromJS(ylDataList))
            }

            return state.setIn(['views', 'currentPage'], action.currentPage)
                        .setIn(['views', 'pageCount'], action.receivedData.pageCount)

        },
        [ActionTypes.CXACCOUNT_SELECT_LSALL]                    : () => {
            switch (action.selectedIndex) {
                case 'CXLS': {
                    state = state.update('dataList', v => v.map(w => w.set('selected', action.value)))
                    break
                }
                case 'CX_HSGL': {
                    state = state.updateIn(['hsgl', 'dataList'], v => v.map(w => w.set('selected', action.value)))
                    break
                }
            }

            return state
        },
        [ActionTypes.CXACCOUNT_SELECT_LS]                       : () => {
            return state.updateIn(['dataList', action.idx, 'selected'], v => !v)
        },
        [ActionTypes.GET_CXLS_RUNNING_ACCOUNT]                  : () => {
            let accountList = []
            action.receivedData.resultList[0] && action.receivedData.resultList[0].childList.forEach(v => {
                accountList.push({
                    key: v.name,
                    value: `${v.uuid}${Limit.TREE_JOIN_STR}${v.name}`
                })
            })

            return state.set('accountList', fromJS(accountList))
        },
        [ActionTypes.CHANGE_CXLS_DATA]                          : () => {
            return state.setIn(action.dataType, action.value)
        },
        [ActionTypes.GET_CXLS_SINGLE]                           : () => {
            const categoryType = action.receivedData.categoryType
            const type = dataType[categoryType]

            switch (action.toRouter) {
                case 'SFGL': {
                    // const contactsCardRange = action.receivedData[type]['contactsCardRange']
                    const contactsCardRange = action.receivedData.usedCard
                    const runningDate = action.receivedData.runningDate ? action.receivedData.runningDate : ''//期初时无日期
                    const amount = Math.abs(action.receivedData.notHandleAmount)
                    const runningAbstract = action.receivedData.runningAbstract ? action.receivedData.runningAbstract : ''
                    state = state.setIn(['data', 'amount'], amount)
                                .setIn(['data', 'notHandleAmount'], amount)
                                .setIn(['data', 'runningAbstract'], runningAbstract)
                                .setIn(['data', 'uuidList'], fromJS([{'uuid': action.uuid, assType: action.receivedData.assType}]))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data', 'contactsCardRange'], fromJS(contactsCardRange))
                                .setIn(['data', 'cardUuid'], contactsCardRange['uuid'])
                                .setIn(['data', 'amountTitle'], action.amountTitle)
                    break
                }
                case 'JZCB': {//存货需要修改（有多存货）
                    let stockCardList = [], cardList = [], uuidList = []
                    const childList = action.receivedData['childList']

                    if (childList.length > 1) {//母子流水-多条单存货流水
                        childList.forEach(v => {
                            let stockCard = v['acBusinessIncome']['stockCardList'][0]
                            if (v['canBeCarryover'] && (!v['beCarryover'])) {//可以结转但未结转
                                uuidList.push(v['uuid'])
                                stockCardList.push(stockCard)
                                cardList.push({
                                    uuid: stockCard['uuid'],
                                    amount: ''
                                })
                                stockCard.amount = v['amount']
                            }
                        })
                    } else {//单存货
                        uuidList.push(action.receivedData['uuid'])
                        stockCardList = action.receivedData[type]['stockCardList']
                        cardList.push({
                            uuid: stockCardList[0]['uuid'],
                            amount: ''
                        })
                    }

                    state = state.setIn(['data', 'runningAbstract'], action.receivedData.runningAbstract)
                                .setIn(['data', 'categoryUuid'], action.receivedData.categoryUuid)
                                .setIn(['data', 'uuidList'], fromJS(uuidList))
                                .setIn(['data', 'runningDate'], action.receivedData.runningDate)
                                .setIn(['data', 'runningState'], action.receivedData.runningState)
                                .setIn(['data', 'stockCardList'], fromJS(stockCardList))
                                .setIn(['data', 'cardList'], fromJS(cardList))
                    break
                }
                case 'KJFP': {
                    const runningState = action.receivedData.runningState
                    let billMakeOutType = 'BILL_MAKE_OUT_TYPE_XS'
                    if (runningState == 'STATE_YYSR_TS') {
                        billMakeOutType = 'BILL_MAKE_OUT_TYPE_TS'
                    }

                    state = state.setIn(['data', 'runningAbstract'], action.receivedData.runningAbstract)
                                .setIn(['data', 'categoryUuid'], action.receivedData.categoryUuid)
                                .setIn(['data', 'uuidList'], fromJS([action.receivedData.uuid]))
                                .setIn(['data', 'runningDate'], action.receivedData.runningDate)
                                .setIn(['data', 'billMakeOutType'], billMakeOutType)
                    break
                }
                case 'FPRZ': {
                    const runningState = action.receivedData.runningState
                    let billAuthType = 'BILL_AUTH_TYPE_CG'
                    if (runningState == 'STATE_YYZC_TG') {
                        billAuthType = 'BILL_AUTH_TYPE_TG'
                    }

                    state = state.setIn(['data', 'runningAbstract'], action.receivedData.runningAbstract)
                                .setIn(['data', 'categoryUuid'], action.receivedData.categoryUuid)
                                .setIn(['data', 'uuidList'], fromJS([action.receivedData.uuid]))
                                .setIn(['data', 'runningDate'], action.receivedData.runningDate)
                                .setIn(['data', 'billAuthType'], billAuthType)
                                .setIn(['data', 'authBusinessUuid'], '')
                    break
                }
                case 'JZSY': {
                    let amount = Number(action.receivedData.amount)-Number(action.receivedData.tax)
                    state = state.setIn(['data', 'runningAbstract'], '处置损益')
                                .setIn(['data', 'categoryUuid'], action.receivedData.categoryUuid)
                                .setIn(['data', 'categoryName'], action.receivedData.categoryName)
                                .setIn(['data', 'businessList'], fromJS([action.receivedData]))
                                .setIn(['data', 'businessList', 0, 'beSelect'], true)
                                .setIn(['data', 'runningDate'], action.receivedData.runningDate)
                                .setIn(['data', 'amount'], amount)
                                .setIn(['data', 'acAssets', 'originalAssetsAmount'], '')
                                .setIn(['data', 'acAssets', 'depreciationAmount'], '')
                                .setIn(['data', 'beProject'], action.receivedData.beProject)
                                .setIn(['data', 'usedProject'], action.receivedData.beProject)
                                .setIn(['data', 'projectRange'], action.receivedData.projectRange)
                                .setIn(['data', 'projectCard'], fromJS([{amount: ''}]))
                    break
                }
                default: console.log('获取单条数据失败');
            }

            return state.setIn(['views', 'currentRouter'], action.toRouter)
                        .setIn(['views', 'fromRouter'], action.fromRouter)
        },
        [ActionTypes.CXLS_CXHSGL_ALLBATCH]                      : () => {
            const dataList = state.getIn(['hsgl', 'dataList'])

            switch (action.fromRouter) {
                case 'CX_SFGL': {
                    const contactsCardRange = state.getIn(['hsgl', 'contactsCard'])
                    const runningDate = new DateLib(new Date()).valueOf()
                    let uuidList = [], amount = 0, amountTitle = '收款金额'

                    dataList.forEach(v => {
                        if (v.get('selected')) {
                            uuidList.push({uuid: v.get('uuid'), assType: v.get('assType')})
                            // amount += Number(v.get('notHandleAmount'))
                            const flowType = v.get('flowType')
                            const direction = v.get('direction')
                            let notHandleAmount = Number(v.get('notHandleAmount'))
                            const runningState = v.get('runningState')
                            if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') {
                                notHandleAmount = -Math.abs(notHandleAmount)
                            }
                            if (flowType == 'FLOW_INADVANCE') {
                                if (direction=='credit') {
                                    amount += notHandleAmount
                                } else {
                                    amount -= notHandleAmount
                                }
                            } else {
                                if (direction=='credit') {
                                    amount -= notHandleAmount
                                } else {
                                    amount += notHandleAmount
                                }
                            }
                        }
                    })

                    if (amount < 0) {
                        amountTitle = '付款金额'
                    }

                    state = state.setIn(['data', 'amount'], Math.abs(amount))
                                .setIn(['data', 'runningAbstract'], '')
                                .setIn(['data', 'uuidList'], fromJS(uuidList))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data', 'contactsCardRange'], contactsCardRange)
                                .setIn(['data', 'cardUuid'], contactsCardRange.get('uuid'))
                                .setIn(['data', 'amountTitle'], amountTitle)
                                .setIn(['views', 'currentRouter'], 'SFGL')
                                .setIn(['views', 'selectedIndex'], 'CX_SFGL')

                    break
                }
                case 'CX_JZCB': {
                    let uuidList = [], amount = 0

                    dataList.forEach(v => {
                        if (v.get('selected')) {
                            uuidList.push(v.get('uuid'))
                            amount += Number(v.get('amount'))
                        }
                    })

                    const stockCard = state.getIn(['hsgl', 'stockCard']).set('amount', amount)
                    const cardList = [{uuid: stockCard.get('uuid'), amount: ''}]

                    state = state.setIn(['data', 'runningAbstract'], '')
                                .setIn(['data', 'categoryUuid'], '')
                                .setIn(['data', 'uuidList'], fromJS(uuidList))
                                .setIn(['data', 'runningState'], state.getIn(['hsgl', 'runningState']))
                                .setIn(['data', 'stockCardList'], fromJS([stockCard]))
                                .setIn(['data', 'cardList'], fromJS(cardList))
                                .setIn(['views', 'currentRouter'], 'JZCB')
                                .setIn(['views', 'selectedIndex'], 'CX_JZCB')
                    break
                }
                case 'CX_KJFP': {
                    let uuidList = []
                    dataList.forEach(v => {
                        if (v.get('selected')) {
                            uuidList.push(v.get('uuid'))
                        }
                    })

                    state = state.setIn(['data', 'runningAbstract'], '')
                                .setIn(['data', 'categoryUuid'], '')
                                .setIn(['data', 'uuidList'], fromJS(uuidList))
                                .setIn(['data', 'billMakeOutType'], state.getIn(['hsgl', 'billMakeOutType']))
                                .setIn(['views', 'currentRouter'], 'KJFP')
                                .setIn(['views', 'selectedIndex'], 'CX_KJFP')
                    break
                }
                case 'CX_FPRZ': {
                    let uuidList = []
                    dataList.forEach(v => {
                        if (v.get('selected')) {
                            uuidList.push(v.get('uuid'))
                        }
                    })

                    state = state.setIn(['data', 'runningAbstract'], '')
                                .setIn(['data', 'categoryUuid'], '')
                                .setIn(['data', 'uuidList'], fromJS(uuidList))
                                .setIn(['data', 'billAuthType'], state.getIn(['hsgl', 'billAuthType']))
                                .setIn(['data', 'authBusinessUuid'], '')
                                .setIn(['views', 'currentRouter'], 'FPRZ')
                                .setIn(['views', 'selectedIndex'], 'CX_FPRZ')
                    break
                }
                default: console.log('一键数据失败');
            }

            return state.setIn(['views', 'fromRouter'], 'CX_HSGL')
        },
        [ActionTypes.GET_CXLS_HSGL_CARDLIST]					: () => {
            let cardList = [], cardNameList = []
            const cardName = action.cardType == 'stockCardList' ? '全部存货' : '全部往来单位'
            action.data.forEach(v => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
                cardNameList.push(`${v['code']} ${v['name']}`)
            })

            cardList.unshift({
                key: cardName,
                value: `${Limit.TREE_JOIN_STR}${Limit.TREE_JOIN_STR}${cardName}`
            })
            cardNameList.unshift(cardName)

            return state.setIn(['hsgl', action.cardType], fromJS(cardList))
                        .setIn(['hsgl', 'cardNameList'], fromJS(cardNameList))

        },
        [ActionTypes.CHANGE_CXLS_CARD]					        : () => {
            //const arr = state.getIn(['hsgl', `${action.dataType}List`, action.value, 'value']).split(Limit.TREE_JOIN_STR)
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.uuid = arr[0]
            item.code = arr[1]
            item.name = arr[2]

            return state.setIn(['hsgl', action.dataType], fromJS(item))
        },
        [ActionTypes.CXHSGL_TO_YLDATA]						    : () => {
            let ylDataList = []
            const dataList = state.getIn(['hsgl', 'dataList'])

            dataList.forEach((v, i) => {
                switch (action.fromRouter) {
                    case 'CX_SFGL': {
                        if (!v.get('beOpened')) {
                            ylDataList.push({idx: i, uuid: v.get('uuid')})
                        }
                        break
                    }
                    case 'CX_JZCB': {
                        ylDataList.push({idx: i, uuid: v.get('parentUuid') ? v.get('parentUuid') : v.get('uuid')})
                        break
                    }
                    case 'CX_KJFP': {
                        ylDataList.push({idx: i, uuid: v.get('parentUuid')})
                        break
                    }
                    case 'CX_FPRZ': {
                        ylDataList.push({idx: i, uuid: v.get('parentUuid')})
                        break
                    }
                    default: console.log('生成预览流水数据失败');
                }

            })

            return state.set('ylDataList', fromJS(ylDataList))

        },
        [ActionTypes.CXLS_SFGL_CATEGORYLIST]					: () => {
            let assTypeList = state.getIn(['categoryList', 'assTypeList']).toJS()
            let categoryList = []

            assTypeList.push({assType: action.assType, uuid: action.uuid})
            action.data.forEach(v => {
                categoryList.push({
                    key: `${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })
            return state.setIn(['categoryList', action.assType], fromJS(categoryList))
                        .setIn(['categoryList', 'assTypeList'], fromJS(assTypeList))
        },
        [ActionTypes.CHANGE_CXLS_SFGL_CATEGORY]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let uuidList = state.getIn(['data', 'uuidList'])
            const uuid = state.getIn(['categoryList', 'assTypeList', action.idx, 'uuid'])

            return state.setIn(['categoryList', 'assTypeList', action.idx, 'name'], arr[1])
                        .setIn(['categoryList', 'assTypeList', action.idx, 'categoryUuid'], arr[0])
                        .updateIn(['data', 'uuidList'], item => item.map(v => {
                            if (v.get('uuid') == uuid) {
                                v = v.set('categoryUuid', arr[0])
                                    .set('beOpened', true)
                            }
                            return v
                        }))
        },
        [ActionTypes.CXLS_GET_PROJECT_CARDLIST]					: () => {
            let cardList = []
            action.receivedData.forEach((v, i) => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })

            return state.set('projectCardList', fromJS(cardList))
        },

    }[action.type] || (() => state))()
}



const cxAccountActions = {
    getPeriodAndBusinessList: () => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningBusinessList', 'POST', JSON.stringify({
            accountUuid: '',
            currentPage: 1,
            getPeriod: 'true',
            month: '',
            pageSize: 20,
            year: ''
        }), json => {
            if (showMessage(json)) {
                thirdParty.toast.hide()
                const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
                dispatch({
                    type: ActionTypes.GETPERIOD_AND_BUSINESSLIST,
                    receivedData: json.data,
                    issues,
                })
            }
        })

    },
    getBusinessList: (currentPage, shouldConcat, _self) => (dispatch, getState) => {
        //页数 currentPage  //shouldConcat 需要连接接数据 是否因为滚动触发
        const views = getState().cxAccountState.get('views')
        const year = views.get('year')
        const month = views.get('month')
        const isAccount = views.get('isAccount')
        const accountUuid = views.get('accountUuid')


        !shouldConcat && thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningBusinessList', 'POST', JSON.stringify({
            isAccount,
            accountUuid,
            currentPage: currentPage,
            getPeriod: 'true',
            month,
            pageSize: 20,
            year
        }), json => {
            !shouldConcat && thirdParty.toast.hide()
            if (showMessage(json)) {
                if(shouldConcat) {
                    _self.setState({
                        isLoading: false
                    })
                }
                if (isAccount && json.data.result.msg.length) {
                    thirdParty.toast.info(json.data.result.msg)
                }
                dispatch({
                    type: ActionTypes.GET_BUSINESSLIST,
                    receivedData: json.data,
                    currentPage,
                    shouldConcat
                })
            }
        })

    },
    selectLsAll: (selectedIndex, value) => ({
        type: ActionTypes.CXACCOUNT_SELECT_LSALL,
        selectedIndex,
        value
    }),
    selectLs: (selectedIndex, idx) => ({
        type: ActionTypes.CXACCOUNT_SELECT_LS,
        selectedIndex,
        idx
    }),
    deleteLs: (dataList, selectedIndex) => (dispatch) => {
        thirdParty.Confirm({
            message: '确定删除吗',
            title: "提示",
            buttonLabels: ['取消', '确定'],
            onSuccess : (result) => {
                if (result.buttonIndex === 1) {
                    const deleteList = dataList.filter(v => v.get('selected')).map(v => v.get('uuid'))
                    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                    fetchApi('deleteRunningbusiness', 'POST', JSON.stringify({
                        deleteList
                    }), json => {
                        if (showMessage(json)) {
                            if (json.data.errorList.length) {
                                let info = json.data.errorList.reduce((v, pre) => v + ',' + pre)
                                thirdParty.Alert(info)
                            }
                            dispatch(cxAccountActions.recapture(selectedIndex))
                        }
                    })
                }
            },
            onFail : (err) => alert(err)
        })
    },
    recapture: (selectedIndex) => (dispatch) => {//从新获取数据
        switch (selectedIndex) {
            case 'CXLS':
                dispatch(cxAccountActions.getBusinessList(1, false))
                break
            case 'CX_SFGL':
                dispatch(cxAccountActions.getManageList())
                break
            case 'CX_KJFP':
                dispatch(cxAccountActions.getKjfpList())
                break
            case 'CX_FPRZ':
                dispatch(cxAccountActions.getFprzList())
                break
            case 'CX_JZCB':
                dispatch(cxAccountActions.getFirstStockCardList())
                dispatch(cxAccountActions.getJzcbList())
                break

            default: console.log('重新获取数据失败');
        }
    },
    getRunningAccount: () => dispatch => {
        fetchApi('getRunningAccount', 'GET', '', json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_CXLS_RUNNING_ACCOUNT,
                    receivedData: json.data
                })
            }
        })
    },
    getCxlsSingle: (uuid, fromRouter, toRouter, amountTitle) => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_CXLS_SINGLE,
                    receivedData: json.data.result,
                    fromRouter,
                    toRouter,
                    amountTitle,
                    uuid
                })
            }
        })

    },
    changeCxlsData: (dataType, value) => ({
        type: ActionTypes.CHANGE_CXLS_DATA,
        dataType,
        value
    }),
    saveSfgl: () => (dispatch, getState) => {
        const state = getState().cxAccountState

        let data = state.get('data').toJS()
        let amount = data['amount']
        let notHandleAmount = data['notHandleAmount']
        const assTypeList = state.getIn(['categoryList', 'assTypeList'])

        //校验
        if (data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (amount <=0) {
            return thirdParty.toast.info('请填写金额')
        }
        if (amount > notHandleAmount) {
            return thirdParty.toast.info('收付款金额大于实际发生金额')
        }
        if (assTypeList.size && assTypeList.some(v => !v.get('categoryUuid'))) {
            return thirdParty.toast.info('请选择所有的期初类别')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('insertRunningpayment', 'POST', JSON.stringify({
            ...data
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                thirdParty.toast.success('保存成功', 2)
                const fromRouter = state.getIn(['views', 'fromRouter'])
                dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
                dispatch(cxAccountActions.changeCxlsData(['categoryList', 'assTypeList'], fromJS([])))
                if (fromRouter == 'CXLS') {
                    dispatch(cxAccountActions.getBusinessList(1, false))
                }
            }
        })
    },
    saveJzcb: () => (dispatch, getState) => {
        const state = getState().cxAccountState
        const data = state.get('data').toJS()

        const allCardList = data['cardList']
        const alluuidList = data['uuidList']
        let cardList = [], uuidList = []

        allCardList.forEach((v, i) => {
            if (v['amount'] > 0) {
                cardList.push(v)
                uuidList.push(alluuidList[i])
            }
        })

        //校验
        // if (data['categoryUuid'] == '') {
        //     return thirdParty.toast.info('请选择流水类别')
        // }
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (uuidList.length == 0) {
            return thirdParty.toast.info('请填写成本金额')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('insertCarryoverItem', 'POST', JSON.stringify({
            ...data,
            cardList,
            uuidList
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                const fromRouter = state.getIn(['views', 'fromRouter'])
                dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
                if (fromRouter == 'CXLS') {
                    dispatch(cxAccountActions.getBusinessList(1, false))
                }
            }
        })
    },
    saveKjfp: () => (dispatch, getState) => {
        const state = getState().cxAccountState
        const data = state.get('data').toJS()

        //校验
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('insertBusinessMakeoutItem', 'POST', JSON.stringify({
            ...data
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                const fromRouter = state.getIn(['views', 'fromRouter'])
                dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
                if (fromRouter == 'CXLS') {
                    dispatch(cxAccountActions.getBusinessList(1, false))
                }
            }
        })
    },
    saveFprz: () => (dispatch, getState) => {
        const state = getState().cxAccountState
        const data = state.get('data').toJS()

        //校验
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('insertBusinessAuthItem', 'POST', JSON.stringify({
            ...data
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                const fromRouter = state.getIn(['views', 'fromRouter'])
                dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
                if (fromRouter == 'CXLS') {
                    dispatch(cxAccountActions.getBusinessList(1, false))
                }
            }
        })
    },
    saveJzsy: () => (dispatch, getState) => {
        const state = getState().cxAccountState
        const data = state.get('data').toJS()
        // const oldEnclosureList = homeState.get('enclosureList').toJS()
        // const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        // const enclosureList = oldEnclosureList.concat(needDeleteUrl)

        const usedProject = data['usedProject']
        const projectCard = data['projectCard']
        if (usedProject) {
            const hasEmpty = projectCard.every(v => {
                return v['uuid']
            })
            if (!hasEmpty) {
                return thirdParty.toast.info('有未选择的项目卡片')
            }
        }

        //校验
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        const originalAssetsAmount = data['acAssets']['originalAssetsAmount']
        const depreciationAmount = data['acAssets']['depreciationAmount']
        if ( originalAssetsAmount <= 0) {
            return thirdParty.toast.info('请填写资产原值')
        }
        if (depreciationAmount <= 0) {
            return thirdParty.toast.info('请填写累计折旧')
        }
        if (Number(depreciationAmount) > Number(originalAssetsAmount)) {
            return thirdParty.toast.info('折旧额不能大于原值')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('insertJzsy', 'POST', JSON.stringify({
            ...data,
            enclosureList: []
        }), json => {
            thirdParty.toast.hide()
            if (json.code !== 0) {
                thirdParty.toast.fail(`${json.code} ${json.message}`)
            } else {
                const fromRouter = state.getIn(['views', 'fromRouter'])
                dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
                if (fromRouter == 'CXLS') {
                    dispatch(cxAccountActions.getBusinessList(1, false))
                }
            }

        })
    },
    insertRunningBusinessVc: (uuid) => (dispatch, getState) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('insertRunningBusinessVc', 'POST', JSON.stringify({
            uuidList: [uuid]
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                if (json.data.result.length) {
                    let info = json.data.result.reduce((v, pre) => v + ',' + pre)
                    thirdParty.Alert(info)
                    return
                }
                const state = getState().cxAccountState
                const selectedIndex = state.getIn(['views', 'selectedIndex'])
                dispatch(cxAccountActions.recapture(selectedIndex))
            }
        })
    },
    deleteRunningBusinessVc: (year, month, vcindexlist) => (dispatch, getState) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('deletevc', 'POST', JSON.stringify({
            year,
            month,
            vcindexlist
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                const state = getState().cxAccountState
                const selectedIndex = state.getIn(['views', 'selectedIndex'])
                dispatch(cxAccountActions.recapture(selectedIndex))
            }
        })
    },
    getBusinessManagerCardList: () => (dispatch) => {
        fetchApi('getBusinessManagerCardList', 'POST', JSON.stringify({
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_CXLS_HSGL_CARDLIST,
                    data: json.data.cardList,
                    cardType: 'contactsCardList'
                })
                dispatch(cxAccountActions.changeCxlsData(['hsgl', 'categoryList'], fromJS(json.data.categoryList)))
            }
        })
    },
    changeCxlsCard: (dataType, value) => ({
        type: ActionTypes.CHANGE_CXLS_CARD,
        dataType,
        value
    }),
    getManageList: () => (dispatch, getState) => {
        const hsgl = getState().cxAccountState.get('hsgl')
        const cardUuid = hsgl.getIn(['contactsCard', 'uuid'])
        const isCheck = hsgl.get('isCheck')

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getManageList', 'POST', JSON.stringify({
            cardUuid,
            isCheck: cardUuid == '' ? false : isCheck
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch(cxAccountActions.changeCxlsData(['hsgl', 'dataList'], fromJS(json.data.result.childList)))
            }
        })
    },
    getKjfpList: () => (dispatch, getState) => {
        const hsgl = getState().cxAccountState.get('hsgl')
        const billMakeOutType = hsgl.get('billMakeOutType')
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getBusinessMakeoutList', 'POST', JSON.stringify({
            billMakeOutType,
            categoryUuid: "",
            runningDate: "",
            searchContent: "",
            searchType: ""
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch(cxAccountActions.changeCxlsData(['hsgl', 'dataList'], fromJS(json.data.result)))
            }
        })

    },
    getFprzList: () => (dispatch, getState) => {
        const hsgl = getState().cxAccountState.get('hsgl')
        const billAuthType = hsgl.get('billAuthType')

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getBusinessAuthList', 'POST', JSON.stringify({
            billAuthType,
            categoryUuid: "",
            runningDate: "",
            searchContent: "",
            searchType: ""
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch(cxAccountActions.changeCxlsData(['hsgl', 'dataList'], fromJS(json.data.result)))
            }
        })

    },
    getFirstStockCardList:() => (dispatch, getState) => {
        const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
        fetchApi('getRunningStockMemberList','POST', JSON.stringify({
            sobId,
            property:'',
            listByCategory:'true',
            categoryUuid:'',
            subordinateUuid:''
        }),json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_CXLS_HSGL_CARDLIST,
                    data: json.data.resultList,
                    cardType: 'stockCardList'
                })
            }
        })
    },
    getJzcbList: () => (dispatch, getState) => {
        const hsgl = getState().cxAccountState.get('hsgl')
        const cardUuid = hsgl.getIn(['stockCard', 'uuid'])
        const runningState = hsgl.get('runningState')

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getCarryoverList', 'POST', JSON.stringify({
            runningDate: '',
            runningState,
            cardUuid,
            categoryUuid: '',
            searchContent: '',
            searchType: ''
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch(cxAccountActions.changeCxlsData(['hsgl', 'dataList'], fromJS(json.data.result)))
            }
        })

    },
    getVcFetch: (data, history) => dispatch => {//预览凭证
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchConstantApi('getvc', 'POST', JSON.stringify({
            vcindex: data.get('vcIndex'),
            year: data.get('year'),
            month: data.get('month')
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                history.push('/lrpz')
                dispatch(pushVouhcerToLrpzReducer(json.data))
                sessionStorage.setItem('from-cxls', true)
                dispatch(lrpzExportActions.setCkpzIsShow(true))
            }
        })
    },
    cxhsglAllBatch: (fromRouter) => ({//一键收付
        type: ActionTypes.CXLS_CXHSGL_ALLBATCH,
        fromRouter
    }),
    hsglToYlData: (fromRouter) => ({
        type: ActionTypes.CXHSGL_TO_YLDATA,
        fromRouter
    }),
    getSfglCategoryList: (assType, uuid) => (dispatch) => {//收付管理期初类别
        fetchApi('getManagerCategoryList', 'POST', JSON.stringify({
            assType
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.CXLS_SFGL_CATEGORYLIST,
                    data: json.data,
                    assType,
                    uuid
                })
            }
        })
    },
    changeSfglCategory: (value, idx) => ({
        type: ActionTypes.CHANGE_CXLS_SFGL_CATEGORY,
        idx,
        value
    }),
    getProjectCardList : (categoryList) => (dispatch, getState) => {//获取项目卡片列表
        const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getProjectCardList', 'POST', JSON.stringify({
            sobId,
            categoryList,
            needCommonCard: false

        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.CXLS_GET_PROJECT_CARDLIST,
                    receivedData: json.data.result
                })
            }
        })
    },

}

export const ActionTypes = {
    GETPERIOD_AND_BUSINESSLIST      : 'GETPERIOD_AND_BUSINESSLIST',
    CXACCOUNT_SELECT_LSALL          : 'CXACCOUNT_SELECT_LSALL',
    CXACCOUNT_SELECT_LS             : 'CXACCOUNT_SELECT_LS',
    GET_BUSINESSLIST                : 'GET_BUSINESSLIST',
    GET_CXLS_RUNNING_ACCOUNT        : 'GET_CXLS_RUNNING_ACCOUNT',
    CHANGE_CXLS_DATA                : 'CHANGE_CXLS_DATA',
    GET_CXLS_SINGLE                 : 'GET_CXLS_SINGLE',
    GET_CXLS_HSGL_CARDLIST          : 'GET_CXLS_HSGL_CARDLIST',
    CHANGE_CXLS_CARD                : 'CHANGE_CXLS_CARD',
    CXLS_CXHSGL_ALLBATCH            : 'CXLS_CXHSGL_ALLBATCH',
    CXHSGL_TO_YLDATA                : 'CXHSGL_TO_YLDATA',
    INIT_CXLS                       : 'INIT_CXLS',
    CXLS_SFGL_CATEGORYLIST          : 'CXLS_SFGL_CATEGORYLIST',
    CHANGE_CXLS_SFGL_CATEGORY       : 'CHANGE_CXLS_SFGL_CATEGORY',
    CXLS_GET_PROJECT_CARDLIST       : 'CXLS_GET_PROJECT_CARDLIST'
}

export { cxAccountActions }
