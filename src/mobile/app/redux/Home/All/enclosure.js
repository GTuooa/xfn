import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.running.js'
import fetchGlApi from 'app/constants/fetch.constant.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'


const enclosureState = fromJS({
    enclosureList: [],
	label: [],
})

// Reducer
export default function handleEnclosure(state = enclosureState, action) {
    return ({
        [ActionTypes.ENCLOSURE_GET_LS_LABEL_FETCH]							    : () => {
			let label = []
            action.receivedData.data.map((item) => {
                label.push({
                    key: item,
                    value: item
                })
            })
            state = state.set('label', fromJS(label))
            return state
		},
        [ActionTypes.ENCLOSURE_LIST]						                    : () => {
			let enclosureList = state.get('enclosureList').toJS()
            action.imgArr.forEach(v => {
                enclosureList.push(v)
            })
			state = state.set('enclosureList', fromJS(enclosureList))
            return state
		},
        [ActionTypes.DELETE_ENCLOSURE_UPLOAD_FJ_URL]							: () => {
            state.get('enclosureList').map((v,i) => {
                if (i == action.index) {
                    state = state.deleteIn(['enclosureList',i])
                }
            })
            return state
		},
        [ActionTypes.CHANGE_EDIT_RUNNING_TAG_NAME]								: () => {
			state.get('enclosureList').map((v, i) => {
                if (i == action.index) {
                    state = state.setIn(['enclosureList', i, 'label'], action.value)
                }
            })
            return state
		},
        [ActionTypes.INIT_ENCLOSURE]								            : () => {
            return state.set('enclosureList', fromJS([]))
		},

    }[action.type] || (() => state))()
}



const enclosureActions = {
    getLabelFetch: () => dispatch => {
        fetchApi('getLsLabel', 'POST', '', json => {
            if(showMessage(json)){
                dispatch({
                    type: ActionTypes.ENCLOSURE_GET_LS_LABEL_FETCH,
                    receivedData: json
                })
            }
        })
    },
    uploadFiles: (callbackJson, file, filesName, isLast) => (dispatch, getState )=> {
        let fileArr = []

        fileArr.push({
            fileName: filesName,
            // thumbnail: callbackJson.data.enclosurePath,
            enclosurePath: callbackJson.data.enclosurePath,
            size: (callbackJson.data.size/1024).toFixed(2),
            imageOrFile: callbackJson.data.mimeType.toString().toUpperCase().indexOf('IMAGE') > -1 ? 'TRUE' : 'FALSE',
            label: "无标签",
            beDelete: false,
            mimeType: callbackJson.data.mimeType
        })
        fetchApi('insertEnclosure', 'POST', JSON.stringify({
            enclosureList: fileArr
        }), json => {
            if (json.code === 0) {
                dispatch({
                    type: ActionTypes.ENCLOSURE_LIST,
                    imgArr: json.data.enclosureList,
                    isLast
                })
            }
            if (isLast) {
                thirdParty.toast.hide()
            }
        })
    },
    getUploadGetTokenFetch: () => (dispatch, getState) => {
        const expire = getState().allState.get('expire')
        const now = Date.parse(new Date()) / 1000

        if (expire < now + 300) {
            fetchGlApi('aliyunOssPolicy', 'GET', '', json => {
                dispatch({
                    type: ActionTypes.AFTER_GET_UPLOAD_SIGNATURE,
                    receivedData: json.data,
                    code: json.code
                })
            })
        }
    },
    deleteUploadFJUrl: (index, PageTab, paymentType) => ({
        type: ActionTypes.DELETE_ENCLOSURE_UPLOAD_FJ_URL,
        index
    }),
    changeTagName: (index, value) => ({
        type: ActionTypes.CHANGE_ENCLOSURE_TAG_NAME,
        index,
        value
    }),
    initEnclosure: () => ({
        type: ActionTypes.INIT_ENCLOSURE
    }),

}

export const ActionTypes = {
    ENCLOSURE_GET_LS_LABEL_FETCH : 'ENCLOSURE_GET_LS_LABEL_FETCH',
    ENCLOSURE_LIST : 'ENCLOSURE_LIST',
    AFTER_GET_UPLOAD_SIGNATURE: 'AFTER_GET_UPLOAD_SIGNATURE',
    DELETE_ENCLOSURE_UPLOAD_FJ_URL: 'DELETE_ENCLOSURE_UPLOAD_FJ_URL',
    CHANGE_ENCLOSURE_TAG_NAME: 'CHANGE_ENCLOSURE_TAG_NAME',
    INIT_ENCLOSURE: 'INIT_ENCLOSURE'
}

export { enclosureActions }
