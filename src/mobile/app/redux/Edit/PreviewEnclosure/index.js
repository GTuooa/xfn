import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

const ActionTypes = {
    CHANGE_PREVIEW_ENCLOSURE_URL   : 'CHANGE_PREVIEW_ENCLOSURE_URL'
}

//生产环境应当设置为空
const previewEnclosureState = fromJS({
    pdfUrl: '',
    base64: ''
})

export default function handleHome(state = previewEnclosureState, action) {
	return ({
		[ActionTypes.CHANGE_PREVIEW_ENCLOSURE_URL]			   : () => {
			return state = state.set('pdfUrl', action.url).set('base64', action.base64)
        },

	}[action.type] || (() => state))()
}

const previewEnclosureActions = {
    getCxpzUploadEnclosure: (url, callback) => dispatch => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

        // 获取oss上的某个文件时 要在地址中拼接一个 ’-internal‘ 例如： http://xfn-ddy-annex-bucket.oss-cn-hangzhou.aliyuncs.com/ 要改成 http://xfn-ddy-annex-bucket.oss-cn-hangzhou-internal.aliyuncs.com/

        if (url.indexOf('xfn-ddy-annex-bucket.oss-accelerate') > 0) {
            url = url.replace('xfn-ddy-annex-bucket.oss-accelerate', 'xfn-ddy-annex-bucket.oss-cn-hangzhou-internal')
        }

        fetchApi('uploadGetEnclosure', 'POST', JSON.stringify({
            enclosureUrl: url
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.CHANGE_PREVIEW_ENCLOSURE_URL,
                    url,
                    base64: json.data.enclosureFile
                })
                callback()
            }
        })
    },
    // setPreviewEnclosureUrl: (url) => ({
    //     type: ActionTypes.CHANGE_PREVIEW_ENCLOSURE_URL,
    //     url
    // })
}

export { previewEnclosureActions }
