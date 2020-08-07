import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { DateLib } from 'app/utils'

const approalAccountState = fromJS({

    accountDate: new DateLib().valueOf(),
    selectList: [],

    account: null,

    fromPage: '',
    receiveAmount: 0,
    setAccount: false,
    needUsedPoundage: false,
    poundageCurrentCardList: [], // 手续费所选的往来
    poundageProjectCardList: [], // 手续费所选的项目

    poundageCurrentList: [], // 可选的列表
    poundageProjectList: [], // 可选的列表

    accountProjectRange: [],
    accountContactsRange: [],
    conSetAccount: false,

    beZeroInventory: false, // 挂账和支付有
    beCarryoverOut: false,
    propertyCost: '',
    propertyCostList: [],
    carryoverCategoryList: [],
    carryoverCategoryItem: null,
    usedCarryoverProject: false,
    carryoverProjectCardList: [],
    carryoverProjectList: [],

    handlingFeeType: 'INCLUDE'
})

export default function handleApproalCalculateState(state = approalAccountState, action) {
    return ({

        // [ActionTypes.BEFORE_INSERT_APPROVAL_CALCULATE]		       : () => {

        //     state = state.set('runningFlowTemp', action.runningFlowTemp)
        //                 .set('modalTemp', action.modalTemp) 
        //     return state
        // },
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