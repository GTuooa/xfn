import { showMessage, DateLib } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

const ActionTypes = {
    INIT_LRPZ                : 'INIT_LRPZ',
    GET_LAST_VC_ID_FETCH     : 'GET_LAST_VC_ID_FETCH',
    SET_CKPZ_IS_SHOW         : 'SET_CKPZ_IS_SHOW',
    GET_FJ_DATA              : 'GET_FJ_DATA',
    SET_LRPX_VCLIST          : 'SET_LRPX_VCLIST'
}

export const initLrpz = () => ({
	type: ActionTypes.INIT_LRPZ
})

export const getLastVcIdFetch = (date) => dispatch => {
	const vcdate = new DateLib(date)
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getlastvcindex', 'POST', JSON.stringify({
		year:  vcdate.getYear(),
		month: vcdate.getMonth()
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_LAST_VC_ID_FETCH,
				receivedData: json,
				vcdate
			})
		}
	})
}

export const setCkpzIsShow = (bool) => dispatch => dispatch({
	type: ActionTypes.SET_CKPZ_IS_SHOW,
	bool
})

//获取附件信息
export const getFjFetch = (vcitem,vcList=[]) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getVcFetch', 'POST',JSON.stringify({
		year: vcitem.get('year') ? vcitem.get('year') : vcitem.get('vcdate').substr(0,4),
		month: vcitem.get('month') ? vcitem.get('month') : vcitem.get('vcdate').substr(5,2),
		vcindex:vcitem.get('vcindex')
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_FJ_DATA,
				receivedData: json.data
			})
			dispatch({
				type: ActionTypes.SET_CKPZ_IS_SHOW,
				bool: true
			})
            dispatch({
                type:ActionTypes.SET_LRPX_VCLIST,
                vcList
            })
		}
	})
}
export const setVcList=(vcList)=>dispatch=>{
    dispatch({
        type:ActionTypes.SET_LRPX_VCLIST,
        vcList
    })
}
