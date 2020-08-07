import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { toJS } from 'immutable'
import { message } from 'antd'
import { showMessage } from 'app/utils'

//获取pdf
export const getCxpzUploadEnclosure = (url, callback) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    // 获取oss上的某个文件时 要在地址中拼接一个 ’-internal‘ 例如： http://xfn-ddy-annex-bucket.oss-cn-hangzhou.aliyuncs.com/ 要改成 http://xfn-ddy-annex-bucket.oss-cn-hangzhou-internal.aliyuncs.com/

    if (url.indexOf('xfn-ddy-annex-bucket.oss-accelerate') > 0) {
        url = url.replace('xfn-ddy-annex-bucket.oss-accelerate', 'xfn-ddy-annex-bucket.oss-cn-hangzhou-internal')
    }

    fetchApi('uploadGetEnclosure', 'POST', JSON.stringify({
        enclosureUrl: url
    }), json => {
        if (showMessage(json)) {
            callback(json.data.enclosureFile)
        } else {
            callback('')
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
