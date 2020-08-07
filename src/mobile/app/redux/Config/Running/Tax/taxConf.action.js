import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'


// 修改税费状态
export const changeTaxConfQuery = (isTaxQuery) => dispatch => {
    dispatch({
        type: ActionTypes.CHANGE_TAX_CONF_QUERY,
        isTaxQuery
    })
}
