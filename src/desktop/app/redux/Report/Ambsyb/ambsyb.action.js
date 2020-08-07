import { showMessage } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

export const ambSortBySortName = (sortStandardStr, sortName) => ({
    type: ActionTypes.AMB_SORT_BY_SORTNAME,
    sortStandardStr,
    sortName
})

export const getPeriodAndAMBIncomeStatementFetch = (issuedate, endissuedate, assId, assCategory) => dispatch => {
	dispatch(getAMBIncomeStatementFetch(issuedate, endissuedate, assId, assCategory, 'true'))
}

export const getAMBIncomeStatementFetch = (issuedate, endissuedate, assId, assCategory, getPeriod) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('AMBPcIncomeStatement', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : '',
		ass: {
			assId: assId ? assId : '',
			assCategory: assCategory ? assCategory : ''
		},
		getPeriod
	}), json => {
		if (json.code === 23001) {

            message.info(json.message)
            dispatch({type: ActionTypes.INIT_AMBSYB})

		} else {
			if (showMessage(json)) {

				if (getPeriod === 'true') {

					const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
					const issuedateNew = issuedate ? issuedate : openedissuedate
                    const endissuedateNew = endissuedate ? endissuedate : openedissuedate

					dispatch({
						type: ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH,
						receivedData: json.data.mainData,
						issuedate: issuedateNew,
                        endissuedate: endissuedateNew,
						assId,
						assCategory
					})

				} else {

					dispatch({
						type: ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH,
						receivedData: json.data.mainData,
						issuedate,
                        endissuedate,
						assId,
						assCategory
					})

				}
				dispatch(changeCharDidmount(true))
			} else {
                dispatch({type: ActionTypes.INIT_AMBSYB})
			}
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const getAmbAssCategoryList = () => dispatch => {
	fetchApi('asslistforamb', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_AMB_ASS_CATEGORY_LIST,
				receivedData: json.data,
			})
		}
	})
}

export const changeAmbsybChooseMorePeriods = () => ({
    type: ActionTypes.CHANGE_AMBSYB_CHOOSE_MORE_PERIODS
})

export const changeCharDidmount = (bool) => ({
	type: ActionTypes.CHANGE_CHAR_DIDMOUNT,
	bool
})

export const selectAmbCurrentAc = (issuedate, endissuedate, assId, assCategory, info) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('AMBAcDetail', 'POST', JSON.stringify({
		begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
		end: `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`,
		ass: {
			assId,
			assCategory
		},
        acId: info === '0000' ? '' : info.split(Limit.ASS_SPLIT)[0]
	}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AMB_SELECT_AC,
                receivedData: json.data
            })
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })

    dispatch({
        type: ActionTypes.SELECT_AMB_CURRENT_AC,
        info
    })
}

export const changeTableShowChild = (id) => ({
    type: ActionTypes.CHANGE_TABLE_SHOW_CHILD,
    id
})
