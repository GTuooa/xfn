import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'


// 修改税费状态
export const changeTaxConfQuery = (isTaxQuery) => dispatch => {
    dispatch({
        type: ActionTypes.CHANGE_TAX_CONF_QUERY,
        isTaxQuery
    })
}
// 税率设置
export const accountConfTaxRateSettingScale = (value) => ({
    type: ActionTypes.RUNNING_CONF_TAX_RATE_SETTING_SCALE,
    value
})
// 进项税科目
export const selectTaxConfAllAc = (acId, acFullName, asscategorylist, tab, place) => ({
    type: ActionTypes.SELECT_TAX_CONF_ALL_AC,
    acId,
    acFullName,
    asscategorylist,
    place
})
export const changeTaxConfCommonString = (tab, place, value) => (dispatch) => {
    let placeArr = typeof place === 'string'?[`${tab}`,place]:[`${tab}`, ...place]
    dispatch({
      type: ActionTypes.CHANGE_TAX_CONF_COMMON_STRING,
      placeArr,
      value
    })
}
