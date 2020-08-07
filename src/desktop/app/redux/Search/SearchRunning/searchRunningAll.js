import * as ActionTypes from './ActionTypes.js'
import { fromJS } from 'immutable'
import { showMessage, upfile, DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import fetchApi from 'app/constants/fetch.account.js'
import fetchGlApi from 'app/constants/fetch.constant.js'

//生产环境应当设置为空
const searchRunningAllState = fromJS({
	// views: {
    //     insertOrModify: 'insert',
	// 	pageTab: 'business',
	// 	paymentType: '',
    // },
    // 附件上传
    enclosureList: [],
    // previewImageList: [], //预览图片的地址的数组
    // needDeleteUrl: [],//需要删除的图片地址
    // tagModal: false,//标签组件的显示与否
    label: [],//附件标签
})

export default function handleEditRunningAll(state = searchRunningAllState, action) {
	return ({
		// [ActionTypes.INIT_SEARCH_RUNNING_ALL]							: () => searchRunningAllState,
		// [ActionTypes.SWITCH_SEARCH_RUNNING_SWITCH_PAGETAB]			: () => {
		// 	if (action.value === 'payment') {
		// 		state = state.setIn(['views', 'paymentType'], 'LB_ZZ')
		// 	}
		// 	return state = state.setIn(['views', 'pageTab'], action.value)
		// 						.setIn(['views', 'insertOrModify'], 'insert')
		// 						.set('enclosureList', fromJS([]))
		// },
		// [ActionTypes.CHANGE_SEARCH_CALCULATE_PAYMENT_TYPE]			: () => {
		// 	state = state.setIn(['views', 'paymentType'], action.value)
		// 	return state
		// },
        // [ActionTypes.GET_JR_ORI]							        : () => {
		// 	return state.set('enclosureList', action.receivedData.enclosureList ? fromJS(action.receivedData.enclosureList) : fromJS([]))
		// 				.setIn(['views', 'insertOrModify'], 'modify')
		// },
        // [ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_EDIT]			: () => {

		// 	return state.setIn(['views', 'pageTab'], action.PageTab)
		// 				.setIn(['views', 'paymentType'], action.pageType)
		// 				.setIn(['views', 'insertOrModify'], action.insertOrModify)
		// 				.set('enclosureList', action.enclosureList ? fromJS(action.enclosureList) : fromJS([]))
		// },
		// [ActionTypes.MODIFY_RUNNING_CALCULATE_INSERT_OR_MODIFY_SEARCH]		: () => {  // 跳转
		// 	// if (action.saveAndNew) {
		// 	// 	state = state.setIn(['views', 'insertOrModify'], 'insert')
		// 	// } else {
		// 	state = state.setIn(['views', 'insertOrModify'], 'modify')
		// 	// }
		// 	return state
		// },
		// [ActionTypes.SELECT_EDIT_RUNNING_CATEGORY]					: () => {  // 所有流水 编辑后 的新增
		// 	state = state.setIn(['views', 'insertOrModify'], 'insert')
		// 				.set('enclosureList', fromJS([]))
		// 	// }
		// 	return state
		// },
		// [ActionTypes.AFTER_SUCCESS_INSERT_CALCULATE_AND_NEW_SEARCH]		: () => {  // 核算管理头部 编辑后 的新增

		// 	// console.log('ssssss');
		// 	state = state.setIn(['views', 'insertOrModify'], 'insert')
		// 				.set('enclosureList', fromJS([]))
		// 	return state
		// },
		// [ActionTypes.INIT_EDIT_CALCULATE_TEMP]                      : () => {

		// 	// console.log('saveAndNew');
		// 	if (action.strJudgeType === 'saveAndNew') {
		// 		state = state.setIn(['views', 'insertOrModify'], 'insert')
		// 					.set('enclosureList', fromJS([]))
		// 	} else {
		// 		state = state.setIn(['views', 'insertOrModify'], 'modify')
		// 	}
		// 	return state
		// },
        [ActionTypes.CHANGE_EDIT_SEARCH_RUNNING_ENCLOSURE_LIST]			: () => { //改变附件列表的信息
			let enclosureList = [];
			state.get('enclosureList').map(v=>{
				enclosureList.push(v)
			})
			action.imgArr.forEach(v=>{
				enclosureList.push(v)
			})
			state = state.set('enclosureList', fromJS(enclosureList))
						.set('enclosureCountUser', enclosureList.length)

			return state;
        },
        [ActionTypes.CLEAR_ENCLOSURELIST]		            : () => {
            state = state.set('enclosureList', fromJS([]))
            return state
        },
        [ActionTypes.GET_EDIT_SEARCH_RUNNING_LABEL_FETCH]		            : () => { //获取附件的标签
            state = state.set('label', fromJS(action.receivedData.data))
            return state
        },
		[ActionTypes.CHANGE_SEARCH_RUNNING_TAG_NAME]		                : () => { //修改附件的标签
			state.get('enclosureList').map((v,i) => {
                if (i == action.index) {
                    state = state.setIn(['enclosureList', i, 'label'], action.value)
                }
            })
            return state
        },
		[ActionTypes.DELETE_SEARCH_RUNNING_ENCLOSURE_URL]			        : () => { //删除上传的附件
            // let needDeleteUrl = []
            // state.get('needDeleteUrl').map(v => {
            //     needDeleteUrl.push(v)
            // })
            state.get('enclosureList').map((v, i) => {
                if (i == action.index) {
                    // needDeleteUrl.push(state.getIn(['enclosureList', i]).set('beDelete', true))
                    state = state.deleteIn(['enclosureList', i])
                }
            })
            state = state.set('enclosureCountUser', state.get('enclosureList').size)
						// .set('needDeleteUrl', fromJS(needDeleteUrl))
            return state
        },
	}[action.type] || (() => state))()
}

export const searchRunningAllActions = {
    clearEnclosureList: () => dispatch => {
		dispatch({
			type: ActionTypes.CLEAR_ENCLOSURELIST,
        })
	},
	changeEditCalculatePaymentType: (value) => dispatch => {
		dispatch({
			type: ActionTypes.CHANGE_SEARCH_CALCULATE_PAYMENT_TYPE,
			value
		})
	},
    uploadFiles: (name, files, callbackJson, isLast) => dispatch => {

		let fileArr = []

		fileArr.push({
			fileName: name,
			// thumbnail: callbackJson.data.enclosurePath,
			enclosurePath: callbackJson.data.enclosurePath,
			size: (callbackJson.data.size/1024).toFixed(2),
			imageOrFile: callbackJson.data.mimeType.toString().toUpperCase().indexOf('IMAGE') > -1 ? 'TRUE' : 'FALSE',
			label: "无标签",
			beDelete: false,
			mimeType: callbackJson.data.mimeType
		})
		// dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		fetchApi('insertEnclosure', 'POST', JSON.stringify({
			enclosureList: fileArr
		}), json => {
			// dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.CHANGE_EDIT_SEARCH_RUNNING_ENCLOSURE_LIST,
					imgArr: json.data.enclosureList
				})
			}
			if (isLast) {
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			}
		})
    },
    //获取标签
    getRunningLabelFetch: () => dispatch => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getLsLabel', 'POST', '', json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_EDIT_SEARCH_RUNNING_LABEL_FETCH,
                    receivedData: json
                })
            }
        })
    },
    // clearRunningEnclosure: () => ({
    //     type: ActionTypes.CLEAR_ENCLOSURELIST,
    // }),
    // 删除附件
    deleteRunningEnclosureUrl: (index) => ({
        type: ActionTypes.DELETE_SEARCH_RUNNING_ENCLOSURE_URL,
        index
    }),
    // 修改标签
    changeRunningTagName: (index, value) => ({
        type: ActionTypes.CHANGE_SEARCH_RUNNING_TAG_NAME,
        index,
        value
    }),
    // 附件上传获取toKen
    getUploadTokenFetch: () => (dispatch, getState) => {
		const expire = getState().allState.get('expire')
        const now = Date.parse(new Date()) / 1000
		// console.log(expire, now, expire < now + 300);
		if (expire < now + 300) {
			fetchGlApi('aliyunOssPolicy', 'GET', '', json => {
				// if (showMessage(json)) {
					dispatch({
						type: ActionTypes.AFTER_GET_UPLOAD_SIGNATURE,
						receivedData: json.data,
						code: json.code
					})
				// }
			})
		}
    },
    // lsDownloadEnclosure: (enclosureUrl, fileName) => dispatch => {
    //     // fetchGlApi('enclosureDownLoadNative', 'GET', `url=${enclosureUrl}&fileName=${fileName}`, json => {})
	// 	thirdParty.openLink({
	// 		// url: 'http://www.fannix.com.cn/xfn/support/desktop/app/index.html'
	// 		url: enclosureUrl
	// 	})
    // },
}
