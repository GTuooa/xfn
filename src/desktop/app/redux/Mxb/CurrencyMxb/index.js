import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const currencyMxbState = fromJS({
    issuedate: '',
    endissuedate: '',
    chooseperiods: false,
    selectedKeys: '0',
    currentNumber: '',
    currentAc: '',
    currentAsscategory: '',
    currentAssId: '',
    currentPage: 1,
	pageCount: 0,
    currencyAcList:[
        /*{
            number: '',
            name: '',
            'acList': [
                {
                    sobid: '',
                    acid : '',
                    acname : '',
                    category : '',
                    direction : '',
                    upperid : '',
                    acunit : '',
                    acunitOpen : ''
                }
            ]
        }*/
    ],
    currencyDetailList: [
        {
            acid: '',
            name: '',
            number: '',
            direction: '',
            debit: '',
            credit: '',
            fcDebit: '',
            fcCredit: '',
            openingBalance: '',
            closingBalance: '',
            fcOpeningBalance: '',
            fcClosingBalance: '',
            jvList: []
        }
    ]


})

export default function handleLrb(state = currencyMxbState, action) {
	return ({
        [ActionTypes.INIT_FCMXB]                        : () => currencyMxbState.set('issuedate', action.issuedate ? action.issuedate : '').set('endissuedate', action.endissuedate ? action.endissuedate : ''),
        [ActionTypes.AFTER_GET_FC_MXB_NO_ACLIST]        : () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate).set('currencyDetailList', currencyMxbState.get('currencyDetailList')),
        [ActionTypes.GET_FC_MXB_ACLIST]                 : () => state.set('currencyAcList', fromJS(action.receivedData)),
        [ActionTypes.GET_FC_DETAIL_FETCH]               : () => {
            return state.set('currencyDetailList', fromJS(action.receivedData))
                    .set('issuedate', action.issuedate)
                    .set('endissuedate', action.endissuedate)
                    .set('currentNumber', action.fcNumber)
                    .set('currentAc', action.acid)
                    .set('currentAsscategory', action.asscategory)
                    .set('currentAssId', action.assid)
                    .set('currentAsscategory', action.currentAsscategory)
                    .set('currentPage', action.currentPage) 
                    .set('pageCount', action.pageCount)
        },
        [ActionTypes.CHANGE_TREE_SELECTED_KEYS_FC]       : () => state.set('selectedKeys', action.selectedKeys),
        [ActionTypes.CHANGE_FC_MXB_CHOOSR_MORE_PERIODS]  : () => action.bool === undefined ? state.update('chooseperiods', v => !v) : state.set('chooseperiods', action.bool)

	}[action.type] || (() => state))()
}
