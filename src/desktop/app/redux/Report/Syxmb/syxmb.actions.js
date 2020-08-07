import { showMessage } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

export const syxmbSortBySortName = (sortStandardStr, sortName) => ({
    type: ActionTypes.SYXMB_SORT_BY_SORTNAME,
    sortStandardStr,
    sortName
})
export const getSYXMBCardList = (issuedate, endissuedate,getPeriod)=>(dispatch,getState)=>{
    const cardUuid = getState().syxmbState.getIn(['view','cardUuid'])
    const beCategory = getState().syxmbState.getIn(['view','beCategory'])
    const needCategory = getState().syxmbState.getIn(['view','needCategory'])
    fetchApi('getSyxmbCardList','GET',
    `begin=${issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`:''}&end=${endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`:''}`,
    resp=>{
        if (showMessage(resp)) {
            let item
            const loop = (list) => list.map((e) => {
                if (e.uuid === cardUuid) {
                    item = e
                }
                if (e.categoryList.length > 0) {
                    loop(e.categoryList)
                }
                if (e.cardList.length > 0) {
                    loop(e.cardList)
                }
            })
            loop(resp.data.jrJvCardList)
            
            if (item) { // 树里选的
                dispatch({
                    type: ActionTypes.SET_SYXMB_CARD_LIST,
                    cardlist: resp.data.jrJvCardList,
                    cardUuid,
                    haveCategory: item.categoryList.length > 0
                })
                dispatch(getSYXMIncomeStatementFetch(issuedate, endissuedate,cardUuid,beCategory,needCategory,getPeriod))
            } else { // 全部
                dispatch({
                    type: ActionTypes.SET_SYXMB_CARD_LIST,
                    cardlist: resp.data.jrJvCardList,
                    cardUuid: ''
                })
                dispatch(getSYXMIncomeStatementFetch(issuedate, endissuedate,'',true,needCategory,getPeriod))
            }
        }
    })
}
export const getPeriodAndSYXMIncomeStatementFetch = (issuedate, endissuedate, cardUuid,beCategory,needCategory) => dispatch => {
	dispatch(getSYXMIncomeStatementFetch(issuedate, endissuedate, cardUuid, beCategory,needCategory,'true'))
}

export const getSYXMIncomeStatementFetch = (issuedate, endissuedate,cardUuid,beCategory,needCategory,getPeriod) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getSyxmbData', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : '',
		cardUuid:cardUuid ? cardUuid:'',
		getPeriod,
        beCategory:beCategory?'true':'false',
        needCategory:needCategory?'true':'false',
	}), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (json.code === 23001) {

            message.info(json.message)
            dispatch({type: ActionTypes.INTI_SYXMB})

		} else {
			if (showMessage(json)) {

				if (getPeriod === 'true') {

                    const issuedateNew = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
                    const endissuedateNew = endissuedate ? endissuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))

					dispatch({
						type: ActionTypes.GET_SYXM_INCOMESTATEMENT_FETCH,
						receivedData: json.data.mainData,
						issuedate: issuedateNew,
                        endissuedate: endissuedateNew,
						cardUuid,
                        refreshCardList:true
					})
                    dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
				} else {

					dispatch({
						type: ActionTypes.GET_SYXM_INCOMESTATEMENT_FETCH,
						receivedData: json.data.mainData,
						issuedate,
                        endissuedate,
						cardUuid,
                        refreshCardList:false
					})

				}
				dispatch(changeCharDidmount(true))
			} else {
                dispatch({type: ActionTypes.INTI_SYXMB})
			}
		}
	})
}
export const changeCharDidmount = (bool) => ({
	type: ActionTypes.CHANGE_SYXM_CHAR_DIDMOUNT,
	bool
})
export const changeSyxmbChooseMorePeriods = () => ({
    type: ActionTypes.CHANGE_SYXMB_CHOOSE_MORE_PERIODS
})
export const selectSyxmbCurrentAc = (issuedate, endissuedate, cardUuid, info) => (dispatch,getState) => {
    const needCategory = getState().syxmbState.getIn(['view','needCategory'])
    const beCategory = getState().syxmbState.getIn(['view','beCategory'])
    fetchApi('getSyxmbAcDetail', 'POST', JSON.stringify({
		begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
		end: `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`,
		cardUuid,
        acId: info === '0000' ? '' :info.split(" ")[0],
        needCategory:needCategory?'true':'false',
        beCategory:beCategory?'true':'false',
	}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.SYXMB_SELECT_AC,
                receivedData: json.data
            })
        }
    })

    dispatch({
        type: ActionTypes.SELECT_SYXMB_CURRENT_AC,
        info:info === '0000'?'损益净额':info.substr(info.split(" ")[0].length+1)
    })
}

export const changeTableShowChild = (id) => ({
    type: ActionTypes.CHANGE_SYXM_TABLE_SHOW_CHILD,
    id
})
export const changeNeedCategory = (bool) =>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_NEED_CATEGORY,
        bool
    })
}
export const handleCheckedShow=(bool)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_CHECKED_SHOW,
        bool
    })
}
export const setBeCategory = (bool) =>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_BE_CATEGORY,
        bool
    })
}
export const setCardName = (name) =>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_CARD_NAME,
        name
    })
}
export const changeAssOrAc = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANG_ASS_OR_AC,
        value
    })
}
export const changeUnit =(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_UNIT,
        value
    })
}
