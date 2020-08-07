import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { formatDate } from 'app/utils'

const approalCalculateState = fromJS({
    runningFlowTemp: {
        oriDate: formatDate().substr(0,10),
    },
    modalTemp: {
        oriDate: formatDate().substr(0,10),
        // uuidList: [],
    },
    views: {
        accountProjectRange: [],
        accountContactsRange: [],
        accountContactsRangeList: [],
        accountProjectList: [],
    },

    poundageCurrentCardList: [], // 账户手续费
    poundageProjectCardList: [],


    // 挂账、付款、收款
    formPos: '', // modal 
    accountDate: formatDate().substr(0,10), // 日期
    account: null,
    setAccount: false,
    needUsedPoundage: false, // 是否开启手续费
    receiveTotalMoney: 0,

    beZeroInventory: false, // 挂账和支付有
    beCarryoverOut: false,
    propertyCost: '',
    propertyCostList: [],
    carryoverCategoryList: [],
    carryoverCategoryItem: null,
    usedCarryoverProject: false,
    carryoverProjectCardList: [],
    carryoverProjectList: [],

    // 核记
    handlingFeeType: 'INCLUDE',
})

export default function handleApproalCalculateState(state = approalCalculateState, action) {
    return ({

        [ActionTypes.BEFORE_INSERT_APPROVAL_CALCULATE]		       : () => {

            state = state.set('runningFlowTemp', action.runningFlowTemp)
                        .set('modalTemp', action.modalTemp) 
            return state
        },
        [ActionTypes.CHANGE_SEARCH_RUNNING_CALCULATE_COMMON_STRING]		       : () => {
            
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },


    }[action.type] || (() => state))()
}