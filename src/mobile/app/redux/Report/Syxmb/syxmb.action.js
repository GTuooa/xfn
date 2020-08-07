import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getSyxmbCardList=(issuedate, endissuedate, getPeriod)=>(dispatch,getState)=>{
	const cardUuid = getState().syxmbState.get('cardUuid')
	const beCategory = getState().syxmbState.get('beCategory')
	const needCategory = getState().syxmbState.get('needCategory')
	fetchApi('getSYXMBCardList','GET',
	`begin=${issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}`:''}&end=${endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}`:`${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}`}`,
	resp=>{
		if (showMessage(resp)) {
			let item
			const loop = (list)=>list.map((e)=>{   // 检验当前选中是否还有，如果没有了，切换到全部
				if(e.uuid===cardUuid){
					item = e
				}
				if(e.categoryList.length>0){
					loop(e.categoryList)
				}
				if(e.cardList.length>0){
					loop(e.cardList)
				}
			})
			loop(resp.data.jrJvCardList)
			
			if (getPeriod==='true') {
				dispatch({
					type:ActionTypes.SET_CARD_NAME,
					name:'全部'
				})
				dispatch({
					type:ActionTypes.SET_SYXMB_CARD_LIST,
					cardlist:resp.data.jrJvCardList,
					cardUuid:''
				})
				dispatch(getAMBIncomeStatementFetch(issuedate, endissuedate,'',true,needCategory,getPeriod))
			} else {
				if (item) {
					dispatch({
						type:ActionTypes.SET_SYXMB_CARD_LIST,
						cardlist:resp.data.jrJvCardList,
						cardUuid,
						haveCategory: item.categoryList.length > 0
					})
					
					dispatch(getAMBIncomeStatementFetch(issuedate, endissuedate,cardUuid,beCategory,needCategory,getPeriod))
				} else {
					dispatch({
						type:ActionTypes.SET_CARD_NAME,
						name:'全部'
					})
					dispatch({
						type:ActionTypes.SET_SYXMB_CARD_LIST,
						cardlist:resp.data.jrJvCardList,
						cardUuid:''
					})
					dispatch(getAMBIncomeStatementFetch(issuedate, endissuedate,'',true,needCategory,getPeriod))
				}
			}

		}
	})

}

export const getPeriodAndAMBIncomeStatementFetch = (issuedate, endissuedate, cardUuid, beCategory,needCategory,) => dispatch => {
	dispatch(getAMBIncomeStatementFetch(issuedate, endissuedate, cardUuid, beCategory, 'true'))
}

export const getAMBIncomeStatementFetch = (issuedate, endissuedate, cardUuid, beCategory,needCategory, getPeriod) => dispatch => {

	// const begin = issuedate.substr(0, 4)+''+issuedate.substr(5, 2)
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getSyxmbIncomeStatement', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : (issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : ''),
		cardUuid:cardUuid?cardUuid:'',
		beCategory:beCategory?'true':'false',
		needCategory:needCategory?'true':'false',
		getPeriod
	}), json => {
		if (json.code === 23001) {
			thirdParty.toast.hide()
			thirdParty.Alert(json.message, '收到')

		} else {
			if (showMessage(json)) {
				thirdParty.toast.hide()
				if (getPeriod === 'true') {

					const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
					const issuedateNew = issuedate ? issuedate : openedissuedate

					dispatch({
						type: ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH,
						// receivedData: json.data.ambIncomeStatementJson,
						receivedData: json.data.ambIncomeStatementJson,
						issuedate: issuedateNew,
						cardUuid,
						beCategory
					})

				} else {
					dispatch({
						type: ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH,
						// receivedData: json.data,
						receivedData: json.data,
						issuedate,
						endissuedate,
						cardUuid,
						beCategory
					})
				}

				dispatch(changeCharDidmount(true))
			}
		}
		// dispatch(afterGetAMBIncomeStatement(json, issuedate, assId, assCategory))
	})
}

export const switchCharStatus = (nextStatus) => ({
	type: ActionTypes.SWITCH_CHAR_STATUS,
	nextStatus
})

export const changeCharDidmount = (bool) => ({
	type: ActionTypes.CHANGE_CHAR_DIDMOUNT,
	bool
})

export const setAmbAssId = (assId) => ({
	type: ActionTypes.SET_AMB_ASSID,
	assId
})

export const seAmbAsscategory = (assCategory) => ({
	type: ActionTypes.SET_AMB_ASSCATEGORY,
	assCategory
})
//第二个参数代表是否需要把end还原成begin
export const changeAmbBeginDate = (begin, bool) => ({
	type: ActionTypes.CHANGE_AMB_BEGIN_DATE,
	begin,
	bool
})
export const setCardName=(name)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.SET_CARD_NAME,
		name
	})
}
export const handleCheckBoxShow=(bool)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.HANDLE_CHECKBOX_SHOW,
		bool
	})
}
export const changeNeedCategory=(bool)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.CHANGE_NEED_CATEGORY,
		bool
	})
}
