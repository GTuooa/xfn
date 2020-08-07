import { showMessage, jsonifyDate } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import { pushVouhcerToLrpzReducer } from 'app/redux/Search/Cxpz/cxpz.action'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getAssMxbAclistAndReportdetailFetch = (issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo, isCheck) => dispatch => {
    dispatch(getAssMxbAclistFetch(issuedate, endissuedate, asscategory))
    dispatch(getreportassdetailFetch(issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo, isCheck))
}

// 获取明细表的aclist
export const getAssMxbAclistFetch = (issuedate, endissuedate, asscategory) => dispatch => {
	const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
	const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin

    //thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('reportassac', 'POST', JSON.stringify({
		begin,
		end,
		asscategory
	}), json => {
		if (showMessage(json)) {
            //thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_ASS_MXB_ACLIST_TFETCH,
				receivedData: json.data
			})

			dispatch({
				type: ActionTypes.CHANGE_ASSMXB_ISSUEDATE,
				issuedate,
				endissuedate,
				asscategory
			})

		} else {
            dispatch({
				type: ActionTypes.INIT_ASSMXB
			})
		}
	})
}

export const getreportassdetailFetch = (issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo, isCheck) => dispatch => {
	const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
    const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('reportassdetail', 'POST', JSON.stringify({
		begin,
		end,
		acid: acid ? acid : '',
		assid,
		asscategory,
        assIdTwo: assidTwo,
		assCategoryTwo: assidTwo ? asscategoryTwo : ''
	}), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_REPORT_ASS_DETAIL_FETCH,
				receivedData: json.data,
                assidTwo,
                asscategoryTwo
			})
            if(isCheck){//检验科目是否关联两个辅助核算
                dispatch(checkHaveDoubleAssFetch(issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo))
            }
		}
	})
}

export const getVcFetch = (issuedate, vcindex, history,jvlist) => dispatch => {
	const jsonDate = jsonifyDate(issuedate)
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getvc', 'POST', JSON.stringify({
		...jsonDate,
		vcindex
	}), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
			sessionStorage.setItem('lrpzHandleMode', 'modify')
			dispatch(pushVouhcerToLrpzReducer(json.data))
			sessionStorage.setItem('router-from', 'assmxb')
			history.push('/lrpz')
            dispatch(lrpzExportActions.setVcList(jvlist))
			dispatch(lrpzExportActions.setCkpzIsShow(true))
		}
	})
}

//第二个参数代表是否需要把end还原成begin
export const changeAssMxBeginDate = (begin, bool) => ({
	type: ActionTypes.CHANGE_ASSMX_BEGIN_DATE,
	begin,
	bool
})

//检查该科目是否关联两个辅助核算
export const checkHaveDoubleAssFetch = (issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo) => dispatch => {
    const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
    const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('checkHaveDoubleAssFetch', 'POST', JSON.stringify({
		begin,
		end,
		asscategory: asscategory,
		acid: acid
	}), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
			const isDouble = json.data[0].asslist.length ? true : false
			if(isDouble){//该科目挂了双辅助核算
				let doubleAss=[];
				const doubleAssCategory = json.data[0].asscategory
				json.data[0].asslist.forEach((v)=>{
					doubleAss.push({
						key: `${v['assid']} ${v['assname']}`,
						value: v['assid']
					})
				})
				doubleAss.unshift({key:'全部',value:''})
				thirdParty.chosen({
					source: doubleAss,
					onSuccess: (result) => {
                        dispatch(getreportassdetailFetch(issuedate, endissuedate, acid, assid, asscategory, result.value, doubleAssCategory))

                        dispatch({
                            type: ActionTypes.SET_DOUBLEASS,
                            doubleAss
                        })
					},
					onFail: (err) => {}
				})
			}
		}
	})
}
