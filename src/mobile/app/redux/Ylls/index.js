import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'


const yllsState = fromJS({
    data: {
        categoryType: ''
    },
    preData: {//预收款金额状态
        preAmount: 0.00,//预收款
        receiveAmount: 0.00//应收款
    },
    cxlsData: {//查询流水的状态
        selectedIndex: '0',
        idx: 0
    },
    lsmxbData: {//流水明细的状态
        selectedIndex: '0',
        idx: 0
    },
    zhmxbData: {//账户明细的状态
        selectedIndex: '0',
        idx: 0
    },
    wlmxbData: {//往来明细的状态
        selectedIndex: '0',
        idx: 0
    }

})

// Reducer
export default function reducer(state = yllsState, action = {}) {
    return ({
        [ActionTypes.GET_YLLS_SINGLE_ACCOUNT]						: () => {
            const fromPage = sessionStorage.getItem('ylPage')
            return state.set('data', fromJS(action.receivedData))
                        .setIn([`${fromPage}Data`, 'selectedIndex'], action.selectedIndex)
                        .setIn([`${fromPage}Data`, 'idx'], action.idx)
        },
        [ActionTypes.GET_YLLS_PREAMOUNT]					         : () => {
            return state.setIn(['preData', 'preAmount'], action.data.preAmount)
                        .setIn(['preData', 'receiveAmount'], action.data.amount)
        },
        [ActionTypes.GET_YLLS_UNTREATEDAMOUNT]                   : () => {
            let accumulationAmount = 0//个人公积金未处理金额-需要单独获取
            let socialSecurityAmount = 0//个人社保未处理金额-需要单独获取

            ;({
                'accumulationAmount': () => {
                    accumulationAmount = action.receivedData[action.amountType] + state.getIn(['data', 'acPayment', 'personAccumulationAmount'])
                    state = state.setIn(['data', 'accumulationAmount'], accumulationAmount)
                },
                'socialSecurityAmount': () => {
                    socialSecurityAmount = action.receivedData[action.amountType] + state.getIn(['data', 'acPayment', 'personSocialSecurityAmount'])
                    state = state.setIn(['data', 'socialSecurityAmount'], socialSecurityAmount)
                }
            }[action.amountType] || (() => null))()


            return state
        },

    }[action.type] || (() => state))()
}



const yllsActions = {
    getYllsSingleAccount: (history, selectedIndex, uuid, idx, shouldJump) => (dispatch) => {
        //history, selectedIndex 顶部的大类, uuid, idx 下标 shouldJump 需不需要跳转
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YLLS_SINGLE_ACCOUNT,
                    receivedData: json.data.result,
                    selectedIndex,
                    idx
                })
                if (shouldJump) {
                    history.push('/ylls')
                }
            }
        })

    },
    getXczcAccumulationAmount: () => (dispatch, getState) => {
        //获取公积金金额
        const state = getState().yllsState
        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getPaymentInfo', 'POST', JSON.stringify({
            categoryUuid,
            runningDate,
            acType: 'AC_GJJ',
            accumulationAcId: '',
            accumulationAssId1: '',
            accumulationCategory1: '',
            accumulationAssId2: '',
            accumulationCategory2: ''
          }) , json => {
              thirdParty.toast.hide()
              if (showMessage(json)) {
                  dispatch({
                      type: ActionTypes.GET_YLLS_UNTREATEDAMOUNT,
                      receivedData: json.data.result,
                      amountType: 'accumulationAmount'
                  })
              }
          })
    },
    getXczcSocialSecurityAmount: () => (dispatch, getState) => {
        const state = getState().yllsState
        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])

        // thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getPaymentInfo', 'POST', JSON.stringify({
            categoryUuid,
            runningDate,
            acType: 'AC_SB',
            socialSecurityAcId: '',
            socialSecurityAssId1: '',
            socialSecurityCategory1: '',
            socialSecurityAssId2: '',
            socialSecurityCategory2: ''
          }) , json => {
              // thirdParty.toast.hide()
              if (showMessage(json)) {
                  dispatch({
                      type: ActionTypes.GET_YLLS_UNTREATEDAMOUNT,
                      receivedData: json.data.result,
                      amountType: 'socialSecurityAmount'
                  })
              }
          })
    },

}

export const ActionTypes = {
    GET_YLLS_SINGLE_ACCOUNT : 'GET_YLLS_SINGLE_ACCOUNT',
    GET_YLLS_PREAMOUNT : 'GET_YLLS_PREAMOUNT',
    GET_YLLS_UNTREATEDAMOUNT: 'GET_YLLS_UNTREATEDAMOUNT'
}

export { yllsActions }
