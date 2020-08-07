import { toJS, fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import fetchApi, { ROOTAPPROVAL } from 'app/constants/fetch.running.js'
import fetchGlApi from 'app/constants/fetch.constant.js'
import fetchCardApi from 'app/constants/fetch.account.js'
import { showMessage, DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { XFNVERSION, getUrlParam, ROOTURL } from 'app/constants/fetch.constant.js'
import * as relativeConfAction from 'app/redux/Config/Relative/relativeConf.action.js'
import * as projectConfActions from 'app/redux/Config/Project/projectConf.action.js'

export const getApprovalList = (uuid, isModify) => (dispatch, getState) => {
	fetchApi('getApprovalList', 'GET', ``, json => {
		if (showMessage(json)) {

			dispatch({
				type: ActionTypes.GET_APPROVAL_LIST,
				data:json.data
			})
		}
	})
}

export const getModelInfo = (modelCode,cb) => (dispatch, getState) => {
	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getModelInfo', 'GET', `modelCode=${modelCode}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_APPROVAL_MODEL_INFO,
				data:json.data
			})
		}
	})
}

export const getCategorySubList = (uuid,jrCategoryProperty) => (dispatch, getState) => {
	fetchApi('getCategorySubList', 'GET', `uuid=${uuid}&jrCategoryProperty=${jrCategoryProperty}`, json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'categoryList',
				value:fromJS([json.data])
			})
		}
	})
}

// export const getCardDetail = (uuid) => (dispatch, getState) => {
// 	fetchApi('getRunningDetail', 'GET', `uuid=${uuid}`, json => {
// 		if (showMessage(json)) {
// 			let jsonData = json.data.result
// 			delete jsonData['parentUuid']
// 			dispatch({
// 				type: ActionTypes.CHANGE_APPROVAL_MODAL_STATUS,
// 				name:'categoryCardList',
// 				receivedData: fromJS(jsonData),
// 			})
// 		}
// 	})
// }

export const getApprovalCurrentList = (categoryList,inCardList,outCardList,subCategoryList) => (dispatch, getState) => {
	const modelInfo = getState().editApprovalState.get('modelInfo')
	const jrCategoryUuid = modelInfo.get('jrCategoryId')
	const jrCategoryProperty = modelInfo.get('jrCategoryProperty')
	fetchCardApi('getApprovalCurrentList', 'POST', JSON.stringify({
		categoryList,
		inCardList,
		outCardList,
		subCategoryList,
		jrCategoryUuid,
		jrCategoryProperty
		}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'currentCardTree',
				value: fromJS(json.data),
			})
		}
	})
}
export const getApprovalCurrentCard = (categoryUuid,isTopCategory,categoryList,inCardList,outCardList,subCategoryList) => (dispatch, getState) => {
	const modelInfo = getState().editApprovalState.get('modelInfo')
	const jrCategoryUuid = modelInfo.get('jrCategoryId')
	const jrCategoryProperty = modelInfo.get('jrCategoryProperty')
	fetchCardApi('getApprovalCurrentCard', 'POST', JSON.stringify({
		categoryList,
		inCardList,
		outCardList,
		subCategoryList,
		categoryUuid:categoryUuid !== 'ALL'?categoryUuid:'',
		isTopCategory,
		jrCategoryUuid,
		jrCategoryProperty
		}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'currentCardList',
				value: fromJS(json.data),
			})
		}
	})
}

export const getApprovalStockList = (categoryList,inCardList,outCardList,subCategoryList) => (dispatch, getState) => {
	const modelInfo = getState().editApprovalState.get('modelInfo')
	const jrCategoryUuid = modelInfo.get('jrCategoryId')
	const jrCategoryProperty = modelInfo.get('jrCategoryProperty')
	fetchCardApi('getApprovalStockList', 'POST', JSON.stringify({
		categoryList,
		inCardList,
		outCardList,
		subCategoryList,
		jrCategoryUuid,
		jrCategoryProperty
		}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'stockCardTree',
				value: fromJS(json.data),
			})
		}
	})
}
export const getApprovalStockCard = (categoryUuid,isTopCategory,categoryList,inCardList,outCardList,subCategoryList) => (dispatch, getState) => {
	const modelInfo = getState().editApprovalState.get('modelInfo')
	const jrCategoryUuid = modelInfo.get('jrCategoryId')
	const jrCategoryProperty = modelInfo.get('jrCategoryProperty')
	fetchCardApi('getApprovalStockCard', 'POST', JSON.stringify({
		categoryList,
		inCardList,
		outCardList,
		subCategoryList,
		categoryUuid:categoryUuid !== 'ALL'?categoryUuid:'',
		isTopCategory,
		jrCategoryUuid,
		jrCategoryProperty
		}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'stockCardList',
				value: fromJS(json.data),
			})
		}
	})
}
export const getApprovalProjectList = (categoryList,inCardList,outCardList,subCategoryList) => (dispatch, getState) => {
	const modelInfo = getState().editApprovalState.get('modelInfo')
	const jrCategoryUuid = modelInfo.get('jrCategoryId')
	const jrCategoryProperty = modelInfo.get('jrCategoryProperty')
	fetchCardApi('getApprovalProjectList', 'POST', JSON.stringify({
		categoryList,
		inCardList,
		outCardList,
		subCategoryList,
		jrCategoryUuid,
		jrCategoryProperty
		}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'projectCardTree',
				value: fromJS(json.data),
			})
		}
	})
}
export const getApprovalProjectCard = (categoryUuid,isTopCategory,categoryList,inCardList,outCardList,subCategoryList) => (dispatch, getState) => {
	const modelInfo = getState().editApprovalState.get('modelInfo')
	const jrCategoryUuid = modelInfo.get('jrCategoryId')
	const jrCategoryProperty = modelInfo.get('jrCategoryProperty')
	fetchCardApi('getApprovalProjectCard', 'POST', JSON.stringify({
		categoryList,
		inCardList,
		outCardList,
		subCategoryList,
		categoryUuid:categoryUuid !== 'ALL'?categoryUuid:'',
		isTopCategory,
		jrCategoryUuid,
		jrCategoryProperty
		}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'projectCardList',
				value: fromJS(json.data),
			})
		}
	})
}

export const changeModelString = (place,value) => ({
	type:ActionTypes.CHANGE_MODEL_STRING,
	place,
	value
	})
export const saveApprovalItem = cb => (dispatch, getState) => {
	const editApprovalState = getState().editApprovalState
	const componentList = editApprovalState.get('componentList').toJS()
	const modelInfo = editApprovalState.get('modelInfo').toJS()
	const modelCode = modelInfo.modelCode
	let departmentId = editApprovalState.get('departmentId')
	let BmIndex = componentList.findIndex(v => v.jrComponentType === 'BM')
	let picIndex = componentList.findIndex(v => v.componentType === 'DDPhotoField')
	const mxItem = componentList.find(v => v.jrComponentType === 'MX')
	const chIndex = mxItem.detailList[0].findIndex(v => v.jrComponentType === 'CH')
	const projectItem = componentList.find(v => v.jrComponentType === 'XM')
	const relativeItem = componentList.find(v => v.jrComponentType === 'WLDW')
	let valueList =  componentList.map(v => ({
		label:v.label,
		value:typeof(v.value) === 'object' ? JSON.stringify(v.value):v.value,
		detailValueList:(v.detailList || []).map(w => w.map(z => ({
			label:z.label,
			value:z.value ,
			componentType:z.componentType,
			jrComponentType:z.jrComponentType
			}))),
		componentType:v.componentType,
		jrComponentType:v.jrComponentType
		}))
		if (BmIndex > -1) {
			departmentId = editApprovalState.getIn(['views','departmentId'])
			valueList.splice(BmIndex,1)
		}
		thirdParty.toast.loading('加载中...', 0)
		fetchCardApi('saveApprovalItem', 'POST', JSON.stringify({
			valueList,
			modelInfo,
			departmentId
		}),json => {
			thirdParty.toast.hide()
				if (json.code === 0) {
					thirdParty.toast.success('成功')
					cb && cb()
				} else if (json.code === 900501) {
					thirdParty.Confirm({
						title: '提示',
						message: '该审批的选项超过钉钉模版范围，是否更新模版?',
						buttonLabels: ['取消', '确认'],
						onSuccess : (result) => {
							if (result.buttonIndex === 1) {
								let list = ['XM','WLDW']
								let stockCardList = [] ,contactCardList = [] ,projectCardList = []
								const curList = { XM:projectCardList, WLDW:contactCardList }
								const allList = list.forEach(jrComponentType => {
									const item = componentList.find(v => v.jrComponentType === jrComponentType)
									const index = componentList.findIndex(v => v.jrComponentType === jrComponentType)
									const mxItemList = componentList.find(v => v.jrComponentType === 'MX').detailList
									if (index > -1) {
										item.code && curList[jrComponentType].push({
											code:item.code,
											name:item.name,
											})
									} else {
										const newMxList = mxItemList.map(v => {
											const index = v.findIndex(w => w.jrComponentType === jrComponentType)
											if (index > -1 && v[index].code) {
												v[index].code && curList[jrComponentType].push({
													code:v[index].code,
													name:v[index].name
												})
											}
											})
									}
									})
								if (chIndex > -1) {
									stockCardList = mxItem.detailList.map(v => {
										const amountItem = v.find(w => w.jrComponentType === 'MX_AMOUNT')
										const chItem = v.find(w => w.jrComponentType === 'CH')
										return ({
											code:chItem.code,
											name:chItem.name,
											unit:amountItem.unit || ''
											})
									})
								}
								dispatch(updateInstanceModelBeforeSave(modelCode,contactCardList,projectCardList,stockCardList,cb))
							}
						}
					})
				} else {
					thirdParty.toast.info(json.message)

				}

		})

}
export const getUploadGetTokenFetch = () => (dispatch, getState) => {
    fetchGlApi('aliyunOssPolicy', 'GET', '', json => {
            dispatch({
                type: ActionTypes.AFTER_APPROVAL_GET_UPLOAD_SIGNATURE,
                receivedData: json.data,
				code: json.code
            })
        // }
    })
}

export const uploadFiles = (enclosureList,placeArr,callbackJson, file, filesName, isLast) => (dispatch, getState )=> {
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
				type: ActionTypes.CHANGE_MODEL_ENCLOSURE_STRING,
				placeArr,
				value: fromJS(json.data.enclosureList),
			})
		}
		if (isLast) {
			thirdParty.toast.hide()
		}
	})
}

export const getSpaceInfo = (cb) => dispatch => {
	fetchApi('getSpaceInfo', 'GET', '',json => {
		if(showMessage(json)) {
			const spaceId =  json.data.processSpaceId
			dispatch({
				type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'spaceId',
				value: spaceId,
			})
			thirdParty.uploadAttachment({
				image:{multiple:true,compress:false,max:9,spaceId},
				space:{corpId:sessionStorage.getItem('corpId'),spaceId,isCopy:1 , max:9},
				file:{spaceId,max:1},
				types:["photo","camera","file","space"],//PC端支持["photo","file","space"]
				onSuccess : function(result) {
					const resultList = result.data.map(v => ({...v,type:result.type}))
					cb && cb(resultList)
				}
			})
		}
		})
}

// export const getSpaceInfo = (file,placeArr,enclosureList) => dispatch => {

	// let codeList = []
	// const promise1 = new Promise(resolve => {
	// 	thirdParty.requestAuthCode({
	// 		corpId:sessionStorage.getItem('corpId'),
	// 		onSuccess:(info) => {
	// 			codeList.push(info.code)
	// 			console
	// 			resolve()
	// 		}
	// 		})
	// })
	// const promise2 = new Promise(resolve => {
	// 	thirdParty.requestAuthCode({
	// 		corpId:sessionStorage.getItem('corpId'),
	// 		onSuccess:(info) => {
	// 			codeList.push(info.code)
	// 			resolve()
	// 		}
	// 		})
	// })
	// const href = location.href
	// const urlParam = getUrlParam(href)
	// let source = 'source=desktop'
    // let network = 'network=wifi'
    // const psiSobId = `psiSobId=${sessionStorage.getItem('psiSobId')}`
	// const psiCorpId = `psiCorpId=${sessionStorage.getItem('corpId')}`
	//
	// const isPlayStr = `isPlay=${global.isPlay}`
	// const version = `version=${XFNVERSION}`
	// const timestamp = `timestamp=${new Date().getTime()}`
	//
	// let ssid = `ssid=''`
	// let fetchErrCount = 0
	//
	// if (global.isInWeb) {
	// 	source = 'source=webDesktop'
	// }
	//
	// if (global.ssid) {
	// 	ssid = `ssid=${global.ssid}`
	// }
	//
    // const option = {
    //     method: 'POST',
    //     credentials: 'include',
    //     body: file
    // }
	// thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	// Promise.all([promise1, promise2])
	// .then(() => {
	// 	const customCode = 'customCode=' + codeList[0]
	// 	const instanceCode = 'instanceCode=' + codeList[1]
	// 	const url = `${ROOTAPPROVAL}/instance/enclosure/upload/space` + '?' + [network, source, psiSobId, version, timestamp, isPlayStr, ssid, customCode, instanceCode].join('&')
	// 	fetch(url, option)
	// 	.then(res => {
	// 		thirdParty.toast.hide()
	// 		if (res.status === 200) {
	// 			return res.json()
	// 		} else {
	// 			if (res.status.toString().indexOf('4') === 0 || res.status.toString().indexOf('5') === 0) {
	// 				fetchErrCount = fetchErrCount+1
	// 				if (fetchErrCount >= 5) {
	// 					url.indexOf('xfannixapp1948.eapps.dingtalkcloud.com') > -1
	// 					&& thirdParty.Confirm({
	// 						title: '提示',
	// 						message: '服务区连续多次未正常响应，网络状态可能不佳，点击“确认”可切换至备用通道。请注意：线路切换将重新登录。',
	// 						buttonLabels: ['取消', '确认'],
	// 						onSuccess : (result) => {
	// 							if (result.buttonIndex === 1) {
	//
	// 								const post = href.indexOf('?')
	// 								const endPost = href.indexOf('#/') == -1 ? href.length : href.indexOf('#/')
	// 								let serverMessage = href.slice(post+1, endPost)
	//
	// 								window.location.href = `${ROOTURL}/index.html?${serverMessage}&urlbackup=true`
	// 							}
	// 						}
	// 					})
	// 				}
	// 			}
	// 			return {
	// 				code: '-2',
	// 				// message: err
	// 				message: `通信异常，服务器返回码${res.status}`
	// 			}
	// 		}
	//
	// 	})
	// 	.then(json => {
	// 		console.log(json)
	// 		dispatch({
	// 			type: ActionTypes.CHANGE_MODEL_ENCLOSURE_STRING,
	// 			placeArr:[...placeArr,'value'],
	// 			value: fromJS([json.data.processFileInfo]),
	// 		})
	// 		dispatch({
	// 			type: ActionTypes.CHANGE_MODEL_ENCLOSURE_STRING,
	// 			placeArr:[...placeArr,'valueYl'],
	// 			value: fromJS([json.data.customFileInfo]),
	// 		})
	// 	})
	// 	.catch(err => {
	// 		return {
	// 			code: '-2',
	// 			message: `系统无响应`
	// 		}
	// 	})
	// })
	// Promise.all([promise1, promise2]).then(() => {
		// fetchApi('approvalEnclosureUpload', 'POST', file,json => {
			// if(showMessage(json)) {
				// dispatch({
				// 	type: ActionTypes.CHANGE_APPROVAL_STATUS,
				// 	name:'spaceId',
				// 	value: json.data.customSpaceId,
				// })
				// dispatch({
				// 	type: ActionTypes.CHANGE_MODEL_ENCLOSURE_STRING,
				// 	placeArr:[...placeArr,'value'],
				// 	value: fromJS([json.data.processFileInfo]),
				// })
				// dispatch({
				// 	type: ActionTypes.CHANGE_MODEL_ENCLOSURE_STRING,
				// 	placeArr:[...placeArr,'valueYl'],
				// 	value: fromJS([json.data.customFileInfo]),
				// })
				// thirdParty.uploadAttachment({
				// 	image:{multiple:true,compress:false,max:9,spaceId: json.data.customSpaceId},
				// 	space:{corpId:sessionStorage.getItem('corpId'),spaceId:json.data.customSpaceId,isCopy:1 , max:9},
				// 	file:{spaceId:json.data.customSpaceId,max:1},
				// 	types:["photo","camera","file","space"],//PC端支持["photo","file","space"]
				// 	onSuccess : function(result) {
				// 		const resultList = result.data.map(v => ({...v,type:result.type}))
				// 	},
				// 	onFail: function(err) {
				// 		alert(JSON.stringify(1,err));
				// 	}
				// })
			// }
		// })
	// })
// }

export const initModel = modelCode => dispatch => {
	dispatch({
		type: ActionTypes.INIT_EDIT_APPROVAL_STATE,
		})
		if (modelCode) {
			dispatch(getModelInfo(modelCode))
		}
}
export const getCustomSpaceAndPreview = (item) => dispatch => {
	fetchApi('getCustomSpace', 'POST', JSON.stringify({
		fileId:item.get('fileId'),
		spaceId:item.get('spaceId'),
		type:'download'
		}), json => {
		if (showMessage(json)) {
			thirdParty.preview({
				corpId:sessionStorage.getItem('corpId'),
				spaceId:item.get('spaceId'),
				fileId:item.get('fileId'),
				fileName:item.get('fileName'),
				fileSize: item.get('fileSize'),
				fileType:item.get('fileType'),
				onSuccess : function(result) {

				},
				onFail : function(err) {
					console.log(err)
				}
			})
		}
	})
}

export const getApprovalProcessModelList = (param) => (dispatch, getState) => { // 无参数表示按原有状态查询

    const searchApprovalState = getState().searchApprovalState

    fetchApi('getapprovalprocessmodellist', 'POST', JSON.stringify({
        ...param
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_APPROVAL_STATUS,
				name:'processModelList',
                value: fromJS(json.data)
            })
        }
    })
}

export const getRelationList = (param, currentPage=1, shouldConcat,_self,callBack) => (dispatch, getState) => { // 无参数表示按原有状态查询

    !shouldConcat && thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const editApprovalState = getState().editApprovalState
    delete param.refresh

    const newCurrentPage = currentPage || editApprovalState.getIn(['views', 'currentPage'])

    fetchApi('getRelationList', 'POST', JSON.stringify({
        // currentPage: currentPage || searchApprovalState.get('currentPage'),
        currentPage: newCurrentPage,
        pageSize: Limit.EDIT_APPROVAL_PAGE,
        ...param,
    }), json => {
        !shouldConcat && thirdParty.toast.hide()
        if (showMessage(json)) {
			if(shouldConcat) {
				_self.setState({
					isLoading: false
				})
			}
            dispatch({
                type: ActionTypes.AFTER_GET_EDIT_APPROVAL_PROCESSLIST,
                receivedData: json.data,
                param,
                currentPage: newCurrentPage,
				shouldConcat
            })
            callBack && callBack()
        }
    })
}

export const changeApprovalOutString = (name,value) => dispatch => dispatch({
	type: ActionTypes.CHANGE_APPROVAL_STATUS,
	name,
	value,
})

export const beforeAddManageTypeCard = (showModal,insertOrModify) => dispatch => {
    const getCode = () => {
        fetchApi(`getInitRelaCard`, 'GET', '', json => {
            if (showMessage(json)) {
                dispatch(relativeConfAction.changeRelativeCardContent('code', json.data.code))
            }
        })
    }
	dispatch(relativeConfAction.getRelativeListTitle())
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', json => {
        if (showMessage(json)) {
            getCode()
            dispatch({
                type:ActionTypes.BEFORE_ADD_MANAGE_TYPE_CARD,
                data:json.data,
                insertOrModify,
				fromPage:'editApproval'
            })
        }
        thirdParty.toast.hide()
    })
    showModal()
}

export const updateInstanceModel = (modelCode,cardType,card,closeModal)  => (dispatch,getState) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('updateInstanceModel', 'POST', JSON.stringify({
		modelCode,
		[cardType+'List']:[card]
		}),json => {
			thirdParty.toast.hide()
			if (showMessage(json)) {
				thirdParty.toast.info('保存成功')
				const componentList = getState().editApprovalState.get('componentList')
				const mxItemList = componentList.find(v => v.get('jrComponentType') === 'MX').get('detailList')
				const mxItemIndex = componentList.findIndex(v => v.get('jrComponentType') === 'MX')
				const jrComponentType = {
					contactCard:'WLDW',
					projectCard:'XM',
					stockCard:'CH'
					}[cardType]
				const selectValueScope = {
					contactCard:json.data.contactSelectValueScope,
					projectCard:json.data.projectSelectValueScope,
					stockCard:json.data.stockSelectValueScope
					}[cardType]
				const item = componentList.find(v => v.get('jrComponentType') === jrComponentType)
				const index = componentList.findIndex(v => v.get('jrComponentType') === jrComponentType)
				if (index > -1) {
					dispatch(changeModelString(['componentList',index,'selectValueScope'],fromJS(selectValueScope)))
				} else {
					const newMxList = mxItemList.map(v => {
						const index = v.findIndex(w => w.get('jrComponentType') === jrComponentType)
						return v.setIn([index,'selectValueScope'],fromJS(selectValueScope))
						})
					dispatch(changeModelString(['componentList',mxItemIndex,'detailList'],fromJS(newMxList)))
				}
				closeModal()
			}
	})

}

export const updateInstanceModelBeforeSave = (modelCode,contactCardList,projectCardList,stockCardList,cb)  => (dispatch,getState) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('updateInstanceModel', 'POST', JSON.stringify({
		modelCode,
		contactCardList,
		projectCardList,
		stockCardList
		}), json => {
			thirdParty.toast.hide()
			if (showMessage(json)) {
				dispatch(saveApprovalItem(cb))
			}
		})
}

export const beforeInsertProjectCard = ()  => dispatch => {
	dispatch(projectConfActions.changeProjectData(['views', 'insertOrModify'], 'insert'))
	fetchApi(`getProjectConfigHighType`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.PROJECT_HIGH_TYPE,
                list: json.data
            })
			dispatch(projectConfActions.initProjectData('data','editApproval'))
			dispatch(projectConfActions.getProjectTree(json.data[1].uuid))
			dispatch(projectConfActions.getProjectCardCode())
        }
    })


}
