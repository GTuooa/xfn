import * as ActionTypes from './ActionTypes.js'
import { fromJS } from 'immutable'
import { showMessage, upfile, DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import fetchApi from 'app/constants/fetch.account.js'
import fetchGlApi from 'app/constants/fetch.constant.js'

//生产环境应当设置为空
const editRunningAllState = fromJS({
	views: {
        insertOrModify: 'insert',
		pageTab: 'business',
		paymentType: '',
		needSendRequest: false,
    },
    // 附件上传
    enclosureList: [],
    // previewImageList: [], //预览图片的地址的数组
    // needDeleteUrl: [],//需要删除的图片地址
    // tagModal: false,//标签组件的显示与否
    label: [],//附件标签
})

export default function handleEditRunningAll(state = editRunningAllState, action) {
	return ({
		[ActionTypes.INIT_EDIT_RUNNING_ALL]							: () => editRunningAllState,
		[ActionTypes.SWITCH_EDIT_RUNNING_SWITCH_PAGETAB]			: () => {
			if (action.value === 'payment') {
				state = state.setIn(['views', 'paymentType'], 'LB_ZZ')
			}
			return state = state.setIn(['views', 'pageTab'], action.value)
								.setIn(['views', 'insertOrModify'], 'insert')
								.set('enclosureList', fromJS([]))
		},
		[ActionTypes.CHANGE_EDIT_CALCULATE_PAYMENT_TYPE]			: () => {
			state = state.setIn(['views', 'paymentType'], action.value)
			return state
		},
        [ActionTypes.GET_JR_ORI]							        : () => {
			return state.set('enclosureList', action.receivedData.enclosureList ? fromJS(action.receivedData.enclosureList) : fromJS([]))
						.setIn(['views','insertOrModify'],action.isInsert ? 'insert' : 'modify')
		},
        [ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_EDIT]			: () => {

			return state.setIn(['views', 'pageTab'], action.PageTab)
						.setIn(['views', 'paymentType'], action.pageType)
						.setIn(['views', 'insertOrModify'], action.insertOrModify)
						.setIn(['views', 'needSendRequest'], action.needSendRequest)
						.set('enclosureList', action.enclosureList ? fromJS(action.enclosureList) : fromJS([]))
		},
		[ActionTypes.MODIFY_RUNNING_CALCULATE_INSERT_OR_MODIFY]		: () => {  // 跳转
			// if (action.saveAndNew) {
			// 	state = state.setIn(['views', 'insertOrModify'], 'insert')
			// } else {
			state = state.setIn(['views', 'insertOrModify'], 'modify')
			// }
			return state
		},
		[ActionTypes.CHANGE_EDIT_VIEWA_COMMON_STRING]		: () => {  // 跳转
			return state.setIn(['views', action.place], action.value)
		},
		[ActionTypes.SELECT_EDIT_RUNNING_CATEGORY]					: () => {  // 所有流水 编辑后 的新增
			state = state.setIn(['views', 'insertOrModify'], 'insert')
						.set('enclosureList', fromJS([]))
			// }
			return state
		},
		[ActionTypes.AFTER_SUCCESS_INSERT_CALCULATE_AND_NEW]		: () => {  // 核算管理头部 编辑后 的新增

			console.log('ssssss');
			state = state.setIn(['views', 'insertOrModify'], 'insert')
						.set('enclosureList', fromJS([]))
			return state
		},
		[ActionTypes.INIT_EDIT_CALCULATE_TEMP]                      : () => {
			if (action.strJudgeType === 'saveAndNew') {
				state = state.setIn(['views', 'insertOrModify'], 'insert')
							.set('enclosureList', fromJS([]))
			} else {
				state = state.setIn(['views', 'insertOrModify'], 'modify')
			}
			return state
		},
        [ActionTypes.CHANGE_EDIT_RUNNING_ENCLOSURE_LIST]			: () => { //改变附件列表的信息
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
        [ActionTypes.CHANGE_ENCLOSURElIST_FILE]			: () => { //添加附件
			let enclosureList = state.get('enclosureList').toJS();
			if(!action.pdfInsertFirst){
				enclosureList.pop()
			}

			state = state.set('enclosureList', fromJS(enclosureList.concat(action.value)))
						.set('enclosureCountUser', enclosureList.length+1)

			return state;
		},
        [ActionTypes.GET_EDIT_RUNNING_LABEL_FETCH]		            : () => { //获取附件的标签
            state = state.set('label', fromJS(action.receivedData.data))
            return state
        },
		[ActionTypes.CHANGE_RUNNING_TAG_NAME]		                : () => { //修改附件的标签
			state.get('enclosureList').map((v,i) => {
                if (i == action.index) {
                    state = state.setIn(['enclosureList', i, 'label'], action.value)
                }
            })
            return state
        },
		[ActionTypes.DELETE_RUNNING_ENCLOSURE_URL]			        : () => { //删除上传的附件
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
		[ActionTypes.CHANGE_EDIT_CALCULATE_NEED_SEND_REQUEST]			        : () => {//录入核算管理componentDidMount不请求
			return state = state.setIn(['views','needSendRequest'],false)
		},
	}[action.type] || (() => state))()
}

const editRunningAllActions = {
	switchEditRunningSwitchPageTab: (value) => (dispatch, getState) => {

		const period = getState().allState.get('period')
		const year = period.get('openedyear')
		const month = period.get('openedmonth')

		let oriDate = ''

		if (!year) {
			oriDate = new Date()
		} else {
			const lastDate = new Date(year, month, 0)
			const currentDate = new Date()
			const currentYear = new Date().getFullYear()
			const currentMonth = new Date().getMonth() + 1

			if (lastDate < currentDate) {   //本月之前
				oriDate = currentDate
			} else if (Number(year) == Number(currentYear) && Number(month) == Number(currentMonth)) {  //本月
				oriDate = currentDate
			} else {   //本月之后
				oriDate = new Date(year, Number(month)-1, 1)
			}
		}

		oriDate = new DateLib(oriDate).toString()

		dispatch({
			type: ActionTypes.SWITCH_EDIT_RUNNING_SWITCH_PAGETAB,
			value,
			oriDate
		})
	},
	changeEditCalculatePaymentType: (value) => dispatch => {
		dispatch({
			type: ActionTypes.CHANGE_EDIT_CALCULATE_PAYMENT_TYPE,
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
		fetchApi('insertEnclosure', 'POST', JSON.stringify({
			enclosureList: fileArr
		}), json => {
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.CHANGE_EDIT_RUNNING_ENCLOSURE_LIST,
					imgArr: json.data.enclosureList
				})
			}

			if (isLast) {
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			}
		})
        // upfile({
        //     file: files,   //文件，必填,html5 file类型，不需要读数据流，files[0]
        //     name: name, //文件名称，选填，默认为文件名称
        //     token: sessionStorage.getItem('uploadToken'),  //token，必填
        //     dir: dirUrl,  //目录，选填，默认根目录''
        //     retries: 0,  //重试次数，选填，默认0不重试
        //     maxSize: 10*1024*1024,  //上传大小限制，选填，默认0没有限制 10M
        //     mimeLimit: 'image/*', //image/jpeg
        //     insertOnly: 1,//0可覆盖  1 不可覆盖
        //     callback: function (percent, result) {
        //         // percent（上传百分比）：-1失败；0-100上传的百分比；100即完成上传
        //         // result(服务端返回的responseText，json格式)
        //         // result = JSON.stringify(result);
		//
        //         if (result.code == 'OK') {
        //             let fileArr=[];
        //             fileArr.push({
        //                 fileName: result.name,
        //                 thumbnail: result.url+'@50w_50h_90Q',
        //                 enclosurepath: result.url,
        //                 size: (result.fileSize/1024).toFixed(2),
        //                 imageOrFile: result.isImage.toString().toUpperCase(),
        //                 label: "无标签",
        //                 beDelete: false,
        //                 mimeType: result.mimeType
        //             })
		//
        //             fetchApi('insertEnclosure','POST',JSON.stringify({
        //                 enclosureList: fileArr
        //             }), json => {
        //                 if (showMessage(json)) {
        //                     dispatch({
        //                         type: ActionTypes.CHANGE_EDIT_RUNNING_ENCLOSURE_LIST,
        //                         imgArr:json.data.enclosureList
        //                     })
        //                 }
        //                 if (index+1 === filesLength) {
        //                     dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        //                 }
        //             })
        //         } else if (result.code == 'InvalidArgument') {
        //             if (index+1 === filesLength) {
        //                 dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        //             }
        //             return message.error('上传失败，文件名中不能包含  : * ? " < > | ; ／等字符')
        //         }
		//
        //         if (percent === -1) {
        //             if (index+1 === filesLength) {
        //                 dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        //             }
        //             return message.error(result)
        //         }
        //     }
        // })
    },
    //获取标签
    getRunningLabelFetch: () => dispatch => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getLsLabel', 'POST', '', json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_EDIT_RUNNING_LABEL_FETCH,
                    receivedData: json
                })
            }
        })
    },
    // 删除附件
    deleteRunningEnclosureUrl: (index) => ({
        type: ActionTypes.DELETE_RUNNING_ENCLOSURE_URL,
        index
    }),
    // 修改标签
    changeRunningTagName: (index, value) => ({
        type: ActionTypes.CHANGE_RUNNING_TAG_NAME,
        index,
        value
    }),
    // 附件上传获取toKen
    getUploadTokenFetch: () => (dispatch, getState) => {
        // fetchGlApi('uploadgettoken', 'GET', '', json => {
        //     showMessage(json) &&
        //     sessionStorage.setItem('uploadToken', json.data.token)
		// })

		const expire = getState().allState.get('expire')
		const now = Date.parse(new Date()) / 1000

		console.log(expire, now, expire < now + 300);
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
    lsDownloadEnclosure: (enclosureUrl, fileName) => dispatch => {
        // fetchGlApi('enclosureDownLoadNative', 'GET', `url=${enclosureUrl}&fileName=${fileName}`, json => {})
		thirdParty.openLink({
			// url: 'http://www.fannix.com.cn/xfn/support/desktop/app/index.html'
			url: enclosureUrl
		})
    },
	changeEditCalculateNeedSendRequest: () => dispatch => {
		dispatch({
			type: ActionTypes.CHANGE_EDIT_CALCULATE_NEED_SEND_REQUEST
		})
	},
}

export { editRunningAllActions }
