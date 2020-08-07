import { showMessage, jsonifyDate, formatDate, DateLib } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as ActionTypes from './ActionTypes.js'
import { pushVouhcerToLrpzReducer ,getPeriodAndVcListFetch} from 'app/redux/Search/Cxpz/cxpz.action'
import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import { upfile } from 'app/utils'
// import { history } from 'app/containers/router'
import { fromJS, toJS }	from 'immutable'
export const reviewedJvlist = (year, month, vcindex) => (dispatch, getState) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	const username = getState().homeState.getIn(['data', 'userInfo', 'username'])
	fetchApi('reviewvc', 'POST', JSON.stringify({
		year,
		month,
		vcindexlist: [vcindex],
		action: 'QUERY_VC-AUDIT',
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()

			if (json.data.success > 0) {
				dispatch ({
					type: ActionTypes.REVIEWED_JVLIST,
					reviewedby: username
				})
				const issuedate = `${year}-${month}`
				dispatch(cxpzActions.getVcListFetch(issuedate))
			} else {
				alert(json.data.failList[0])
			}
		}
	})
}

export const cancelReviewedJvlist = (year, month, vcindex) => dispatch => {
	thirdParty.toast.loading('加载中...', 0)
	fetchApi('backreviewvc', 'POST', JSON.stringify({
		year,
		month,
		vcindexlist: [vcindex],
		action: 'QUERY_VC-CANCEL_AUDIT',
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()

			if (json.data.success > 0) {
				dispatch ({
					type: ActionTypes.CANCEL_REVIEWED_JVLIST
				})
				const issuedate = `${year}-${month}`
				dispatch(cxpzActions.getVcListFetch(issuedate))
			} else {
				alert(json.data.failList[0])
			}
		}
	})
}

// export const setCkpzIsShow = (bool) => dispatch => dispatch({
// 	type: ActionTypes.SET_CKPZ_IS_SHOW,
// 	bool
// })

// export const getLastVcIdFetch = (date) => dispatch => {
// 	const vcdate = new DateLib(date)
// 	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
// 	fetchApi('getlastvcindex', 'POST', JSON.stringify({
// 		year:  vcdate.getYear(),
// 		month: vcdate.getMonth()
// 	}), json => {
// 		if (showMessage(json)) {
// 			thirdParty.toast.hide()
// 			dispatch({
// 				type: ActionTypes.GET_LAST_VC_ID_FETCH,
// 				receivedData: json,
// 				vcdate
// 			})
// 		}
// 	})
// }

// export const modifyVcDate = (date) => ({
// 	type: ActionTypes.MODIFY_VCDATE,
// 	date
// })

export const modifyVcDate = (date, vcdate) => dispatch => {
	const newVcdate = new DateLib(date)
	if (newVcdate.valueOf().substr(0, 7) === vcdate.substr(0, 7)) {
		dispatch ({
			type: ActionTypes.MODIFY_VCDATE,
			date: newVcdate.valueOf()
		})
	} else {
		thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
		fetchApi('getlastvcindex', 'POST', JSON.stringify({
			year: newVcdate.getYear(),
			month: newVcdate.getMonth()
		}), json => {
			if (showMessage(json)) {
				thirdParty.toast.hide()
				dispatch({
					type: ActionTypes.GET_LAST_VC_ID_FETCH,
					receivedData: json,
					vcdate: newVcdate
				})
			}
		}
	)}
}

export const enterJvFetch = (refresh,openModal,autoEncode,pzPermissionInfo) => (dispatch, getState) => {
	const state = getState().lrpzState

	// const jvlistOriginal = state.get('jvlist').filter(v => v.get('acid') || v.get('jvabstract') || v.get('jvamount'))
	let jvlistOriginal = state.get('jvlist').filter(v => v.get('acid') || v.get('jvabstract') || v.get('jvamount'))

	let jvcompletion = []

	// const sobid = getState().homeState.getIn(['info', 'soblist',0,'sobid']);
	const sobid = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
	const useruuid = getState().homeState.getIn(['data', 'userInfo', 'useruuid'])
	//begin：本url影响编译环境，不可做任何修改
	// const dirUrl = `/test/${sobid}/${state.get('year')}-${state.get('month')}/${state.get('vcindex')}`;
	const timestamp = new Date().getTime()
	const dirUrl = `/test/${sobid}/${useruuid}/${timestamp}`;
	//end：本url影响编译环境，不可做任何修改
	if (jvlistOriginal.size == 0) {
		return thirdParty.Alert('凭证分录不能为空', )
    }

	jvlistOriginal.forEach((v, i) => {
		const jvabstract = v.get('jvabstract').trim()
		if (!jvabstract) {
			const line = i + 1
			jvcompletion.push('第' + line + '条分录存在未填写完整的摘要')
		} else if (jvabstract === "结转本期损益") {
            const line = i + 1
            jvcompletion.push('第' + line + '行摘要"结转本期损益"为系统保留摘要字段，请通过"结账"功能结转本期损益')
		} else if (jvabstract === "结转本年利润") {
            const line = i + 1
            jvcompletion.push('第' + line + '行摘要"结转本年利润"为系统保留摘要字段，请通过"结账"功能结转本年利润')
		} else if (jvabstract === "期末汇兑损益") {
            const line = i + 1
            jvcompletion.push('第' + line + '行摘要"期末汇兑损益"为系统保留摘要字段，请通过"结账"功能调整汇兑损益')
		} else if (jvabstract === "计提折旧摊销费用") {
            const line = i + 1
            jvcompletion.push('第' + line + '行摘要"计提折旧摊销费用"为系统保留摘要字段，请通过系统相关功能生成折旧摊销凭证')
		}

		if (v.get('jvabstract').length > Limit.LRPZ_ABSTRACT_LENGTH) {
            const line = i + 1
            jvcompletion.push('第' + line + '行摘要长度不能超过' + Limit.LRPZ_ABSTRACT_LENGTH + '个字符')
        }
		if (!v.get('acid')) {
			const line = i + 1
			jvcompletion.push('第' + line + '条分录存在未填写完整的科目')
		}
		if (v.get('jvamount') === '') {
			const line = i + 1
			jvcompletion.push('第' + line + '条分录存在未填写完整的金额')
		}

		if (v.get('asslist').some(v => v.get('assid') === '')) {
			const line = i + 1
			jvcompletion.push('第' + line + '条分录存在未填写完整的辅助核算')
		}

		if (v.get('jvamount') && v.get('price') && v.get('acunitOpen')=='1' && !v.get('jvcount')) {	//金额和单价有值数量没值
			const line = i + 1
			jvcompletion.push('第' + line + '行存在未填写完整的数量')
		}

		// 金额,原币都有值，选择CNY，原币和金额不等
		const currencyItem = state.getIn(['flags', 'currencyList']).find(v => v.get('standard') == '1')
		const currencyFcNumber = currencyItem ? currencyItem.get('fcNumber') : undefined
        if (v.get('fcNumber') == currencyFcNumber && v.get('standardAmount') && v.get('jvamount')) {
            if ( Number(v.get('standardAmount')) != Number(v.get('jvamount'))) {
                const line = i + 1
				jvcompletion.push('第' + line + '行为本位币：'+ currencyItem.get('name') +'，请调整汇率为1')
            }
		}

		// 选了本位币，没填原币时补齐
        if (v.get('jvamount') &&( v.get('fcStatus')=='1' || v.get('fcNumber') ) && !v.get('standardAmount') && v.get('fcNumber') == currencyFcNumber) {
            const fcNumber = currencyItem ? currencyItem.get('fcNumber') : ''
			const exchange = currencyItem ? currencyItem.get('exchange') : ''
            jvlistOriginal = jvlistOriginal.setIn([i, 'fcNumber'], fcNumber).setIn([i, 'exchange'], exchange).setIn([i, 'standardAmount'], v.get('jvamount'))
		}

		// //金额有值,原币没值 ---> 默认选择人民币
        // if (v.get('jvamount') &&( v.get('fcStatus')=='1' || v.get('fcNumber') ) && !v.get('standardAmount')) {
        //     const fcNumber = currencyItem ? currencyItem.get('fcNumber') : ''
		// 	const exchange = currencyItem ? currencyItem.get('exchange') : ''
        //     jvlistOriginal = jvlistOriginal.setIn([i, 'fcNumber'], fcNumber).setIn([i, 'exchange'], exchange).setIn([i, 'standardAmount'], v.get('jvamount'))
		// }

	})
	if (jvcompletion.length)
		return showMessage('', '', '', jvcompletion.reduce((v, pre) => v + ',' + pre))

	if (state.getIn(['flags', 'debitTotal']) !== state.getIn(['flags', 'creditTotal']))
		return showMessage('', '', '', '借贷不平衡')

	if (!state.get('vcindex'))
		return showMessage('', '', '', '凭证号未输入')

	if (!state.get('vcdate'))
		return showMessage('', '', '', '日期未输入')

	// dispatch({type: ActionTypes.SWITCH_LOADING_MASK})\
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

	let data = {
		vcindex: state.get('vcindex'),
		year: state.get('year'),
		month: state.get('month'),
		vcdate: state.get('vcdate'),
		enclosureCountUser: state.get('enclosureCountUser'),
		// jvlist: state.get('jvlist').map((v, i) => v.set('jvindex', (++i).toString()))
		jvlist: jvlistOriginal.map((v, i) => v.set('jvindex', (++i).toString()))

	}

	;({
		modify() {
			fetchApi('modifyvc', 'POST', JSON.stringify(Object.assign(data, {
				oldvcindex: state.get('oldvcindex'),
				oldyear: state.get('oldyear'),
				oldmonth: state.get('oldmonth'),
				createdtime: state.get('createdtime'),
				createdby: state.get('createdby'),
				closeby: state.get('closeby'),
				reviewedby: state.get('reviewedby'),
				enclosureList: state.get('enclosureList'),
				dirUrl:dirUrl,
				autoEncode:autoEncode,
			})), json => {
				if(json.code === 0){
					thirdParty.toast.success('修改凭证成功')
					dispatch(afterEnterJvFetch(json, refresh, '', '', ))
					const vcdate = state.get('vcdate')
					dispatch(cxpzActions.getVcListFetch(vcdate))
					dispatch(getVcFetch(vcdate, json.data.vcindex))

					//获取上传的附件
					fetchApi('uploadgetfile', 'POST', JSON.stringify({
						vcindex: json.data.vcindex,
						year: state.get('year'),
						month: state.get('month')
					}), json => {
                        if (showMessage(json)){
                            dispatch({
                                type: ActionTypes.GET_UPLOAD,
                                receivedData: json.data
                            })
                        }
                    })
					if(autoEncode!=''){
						openModal()
					}
				}
				if(json.code === 15002){
					if(pzPermissionInfo.getIn(['arrange', 'permission'])){
						openModal()
						thirdParty.toast.hide()
                    }else{
						thirdParty.toast.info('凭证号已存在',2, () => thirdParty.toast.hide())

					}
				}else{
					showMessage(json)
				}
			})
		},
		insert() {
			fetchApi('insertvc', 'POST', JSON.stringify(Object.assign(data,{
				vcModelKey: state.get('vckey'),
				dirUrl:dirUrl,
				enclosureList: state.get('enclosureList'),
				autoEncode:autoEncode,
			})), json => {
				if (json.code === 0) {
					thirdParty.toast.hide()
					thirdParty.toast.success('新增凭证成功')
					const createdtime = formatDate()
					const createdby = getState().homeState.getIn(['data', 'userInfo', 'username'])

					let NewVcIndex = json.data.vcindex
					if (refresh) {
						fetchApi('getlastvcindex', 'POST', JSON.stringify({
							year: state.get('year'),
							month: state.get('month')
						}), json => {
							if (showMessage(json)) {
								NewVcIndex = json.data
							}
						})
					}

					dispatch(afterEnterJvFetch(json, refresh, createdtime, createdby, NewVcIndex))
					fetchApi('getperiod', 'GET', '', json => {
						if (showMessage(json)) {
							dispatch({
								type: ActionTypes.GET_PERIOD_FETCH,
								receivedData: json
							})
							if (refresh !== true) {

								const vcdate = state.get('vcdate')
								sessionStorage.setItem('router-from', 'lrpz')
								dispatch(lrpzExportActions.setCkpzIsShow(true))
								dispatch(getVcFetch(vcdate, NewVcIndex))
							}
						}
					})
					//获取上传的附件
					fetchApi('uploadgetfile', 'POST', JSON.stringify({
						vcindex: NewVcIndex,
						year: state.get('year'),
						month: state.get('month')
					}), json => {
                        if (showMessage(json)){
                            dispatch({
                                type: ActionTypes.GET_UPLOAD,
                                receivedData: json.data
                            })
                        }
                    })
					if(autoEncode!='' && openModal!=''){
						openModal()
					}
				} else if (json.code === 15002) {
					if(pzPermissionInfo.getIn(['arrange', 'permission'])){
						openModal()
						thirdParty.toast.hide()
                    }else{
						const closeModal = ''
						dispatch(enterJvFetch('',closeModal,true,pzPermissionInfo))
					}
				} else showMessage(json)
			})
		}
	}[sessionStorage.getItem('lrpzHandleMode')])()
}

const afterEnterJvFetch = (receivedData, refresh, createdtime, createdby, NewVcIndex) => ({
	type: ActionTypes.ENTER_JVITEM_FETCH,
	receivedData,
	refresh,
	createdtime,
	createdby,
	NewVcIndex
})


export const selectJv = (idx) => ({
	type: ActionTypes.SELECT_JV,
	idx
})

export const changeSelectComponentDisplay = () => ({
	type: ActionTypes.CHANGE_SELECT_COMPONENT_DISPLAY
})

export const changeVcId = (value) => ({
	type: ActionTypes.CHANGE_VC_ID,
	vcindex: value
})

export const changeJvAbstract = (value, idx) => ({
	type: ActionTypes.CHANGE_JV_ABSTRACT,
	jvabstract: value,
	idx
})

export const changeJvAcIdAndAcNameAndAssCategoryList = (idx, acid, acfullname, acname, asscategorylist) => ({
	type: ActionTypes.CHANGE_JV_ACID_AND_ACNAME_AND_ASSCATEGORYLIST,
	idx,
	acid,
	acname,
	acfullname,
	asscategorylist
})


export const changeJvAmount = (jvamount, idx) => ({
	type: ActionTypes.CHANGE_JV_AMOUNT,
	jvamount,
	idx
})

export const changeJvDirection = (idx) => ({
	type: ActionTypes.CHANGE_JV_DIRECTION,
	idx
})

//增加分录
export const insertJv = idx => ({
	type: ActionTypes.INSERT_JV,
	idx
})

export const deleteJv = idx => ({
	type: ActionTypes.DELETE_JV,
	idx
})

export const deleteJvAll = () => ({
	type: ActionTypes.DELETE_JV_ALL
})

// export const initLrpz = () => ({
// 	type: ActionTypes.INIT_LRPZ
// })


export const changeJvAssIdAndAssName = (idx, assid, assname, asscategory) => ({
	type: ActionTypes.CHANGE_JV_ASSID_AND_ASSNAME,
	idx,
	assid,
	assname,
	asscategory
})


export const getVcFetch = (issuedate, vcindex) => dispatch => {
	const jsonDate = jsonifyDate(issuedate)
	fetchApi('getvc', 'POST', JSON.stringify({
		...jsonDate,
		vcindex
	}), json => {
		if (showMessage(json)) {
			sessionStorage.setItem('lrpzHandleMode', 'modify')
			dispatch(pushVouhcerToLrpzReducer(json.data))
		}
	})
}

// 暂存草稿
export const draftSaveFetch = () => (dispatch, getState) => {
	const state = getState().lrpzState
    let jvCompletion = []
	const jvListOriginal = state.get('jvlist').filter(v => v.get('acid') || v.get('jvabstract') || v.get('jvamount'))

    jvListOriginal.map((v, i) => {
        if (v.get('jvabstract').length > Limit.LRPZ_ABSTRACT_LENGTH) {
            const line = i + 1
            jvCompletion.push('第' + line + '行摘要长度不能超过' + Limit.LRPZ_ABSTRACT_LENGTH + '个字符')
        }
    })

	if (jvCompletion.length)
		return showMessage('', '', '', jvCompletion.reduce((v, pre) => v + ',' + pre))

	if (!state.get('vcindex'))
		return showMessage('', '', '', '凭证号未输入')

	if (!state.get('vcdate'))
		return showMessage('', '', '', '日期未输入')

	let data = {
		vcindex: state.get('vcindex'),
		year: state.get('year'),
		month: state.get('month'),
		vcdate: state.get('vcdate'),
		jvlist: state.get('jvlist').map((v, i) => v.set('jvindex', (++i).toString())),
		enclosureCountUser: state.get('enclosureCountUser'),
	}

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    if (state.get('vckey')) { //修改
		fetchApi('modifydraft', 'POST', JSON.stringify(Object.assign(data, {
				createdtime: state.get('createdtime'),
				createdby: state.get('createdby'),
				closeby: state.get('closeby'),
				reviewedby: state.get('reviewedby'),
				vckey: state.get('vckey'),
			})), json => {
			if (showMessage(json)) {
				if(state.getIn(['flags', 'locked']) == '1'){
					thirdParty.toast.success('新增草稿成功')
				} else{
					if (json.data.isModify == '1') {
						thirdParty.toast.success('修改草稿成功')
					} else {
						thirdParty.toast.success('新增草稿成功')
					}
				}
				dispatch({
                    type: ActionTypes.DRAFT_SAVE_FETCH,
                    receivedData: json.data.vckey
                })
			}
		})
    } else { //保存
        fetchApi('insertdraft', 'POST', JSON.stringify(data), json => {
            if (showMessage(json)) {
				thirdParty.toast.success('新增草稿成功')
                dispatch({
                    type: ActionTypes.DRAFT_SAVE_FETCH,
                    receivedData: json.data
                })
            }
        })
    }
}

//获取单张草稿
export const getDraftItemFetch = (vckey) => (dispatch, getState) => {
    const state = getState().allState
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getdraft', 'POST', JSON.stringify({
        vckey: vckey
    }), json => {
        if (showMessage(json)) {
			thirdParty.toast.hide()
            const getDraftItem = json.data
			dispatch({
				type: ActionTypes.GET_DRAFT_ITEM_FETCH,
				getDraftItem: getDraftItem,
				judgeLocked: false
			})
        }
    })
}

//锁定
export const lockDraft = (vckey) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('lockdraft', 'POST', JSON.stringify({
        vcKeyList: [vckey]
    }), json => {
        if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.LRPZ_LOCE_DRAFT
			})
		}
    })
}

//解锁
export const unLockDraft = (vckey) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('unlockdraft', 'POST', JSON.stringify({
        vcKeyList: [vckey]
    }), json => {
        if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.LRPZ_UN_LOCE_DRAFT
			})
		}
    })
}

//删除
export const deleteDraft = (vckey, history) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('deletedraft', 'POST', JSON.stringify({
        vcKeyList: [vckey]
    }), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			// history.push('/draft')
			history.goBack()
			dispatch(draftActions.getDraftListFetch('全部'))
		}
    })
}

/********* 数量核算 *********/
// 获取数量一栏的信息
export const getAmountDataFetch = (acId, vcDate, idx, assid, asscategory, assidTwo, asscategoryTwo) => dispatch => {
	const date = new jsonifyDate(vcDate)
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getAmountData', 'POST',JSON.stringify({
		acid: acId,
		date: vcDate,
		year: date.year,
		month: date.month,
		assid,
		asscategory,
		assidTwo,
		asscategoryTwo
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_AMOUNT_DATA,
				receivedData: json.data,
				idx:idx
			})
		}
	})
}
// 改变数量
export const changeJvCount = (jvCount, idx, unitDecimalCount) => ({
	type: ActionTypes.CHANGE_JV_COUNT,
	jvCount,
	idx,
	unitDecimalCount
})

// 改变单价
export const changeJvPrice = (jvPrice, idx) => ({
	type: ActionTypes.CHANGE_JV_PRICE,
	jvPrice,
	idx
})

// 失去焦点后自动计算
export const autoCalculate = (idx, value, unitDecimalCount) => ({
	type: ActionTypes.AUTO_CALCULATE,
	idx,
	value,
	unitDecimalCount
})
export const clearAcUnitOpen = (idx) => ({
	type: ActionTypes.CLEAR_AC_UNIT_OPEN,
	idx
})

// //获取附件信息
// export const getFjFetch = (vcitem) => dispatch => {
// 	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
// 	fetchApi('getVcFetch', 'POST',JSON.stringify({
// 		year: vcitem.get('year') ? vcitem.get('year') : vcitem.get('vcdate').substr(0,4),
// 		month: vcitem.get('month') ? vcitem.get('month') : vcitem.get('vcdate').substr(5,2),
// 		vcindex:vcitem.get('vcindex')
// 	}), json => {
// 		if (showMessage(json)) {
// 			thirdParty.toast.hide()
// 			dispatch({
// 				type: ActionTypes.GET_FJ_DATA,
// 				receivedData: json.data
// 			})
// 			dispatch({
// 				type: ActionTypes.SET_CKPZ_IS_SHOW,
// 				bool: true
// 			})
// 		}
// 	})
// }

// 附件上传token
// 获取 token
export const getUploadGetTokenFetch = () => (dispatch, getState) => {
	// fetchApi('uploadgettoken', 'GET', '', json => {
	// 	showMessage(json) &&
	// 	sessionStorage.setItem('uploadToken', json.data.token)
	// })
	const expire = getState().allState.get('expire')
    const now = Date.parse(new Date()) / 1000

    console.log(expire, now, expire < now + 300);
    if (expire < now + 300) {
        fetchApi('aliyunOssPolicy', 'GET', '', json => {
            // if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.AFTER_GET_UPLOAD_SIGNATURE,
                    receivedData: json.data,
					code: json.code
                })
            // }
        })
    }
}
//改变图片列表的信息
export const changeEnclosureList = (imgArr) => ({
   type: ActionTypes.CHANGE_ENCLOSURE_LIST,
   imgArr
})

// 手动修改附件数量
export const changeVcEnclosureCountUser = (value) => ({
	type: ActionTypes.CHANGE_VC_ENCLOSURE_COUNT_USER,
	value
})

//删除图片
export const deleteUploadImgUrl = (i) => ({
	type: ActionTypes.DELETE_UPLOAD_IMG_URL,
	index:i
})
//初始化标签
export const initLabel = () => dispatch => {
	// thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('initLabel', 'POST', JSON.stringify({
		year: '2017'
	}),json => {
		if (showMessage(json)) {
			// thirdParty.toast.hide()
			dispatch(getLabelFetch())
		}
	})
}

//获取标签
export const getLabelFetch = () => dispatch => {
	// thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getFjLabelData', 'POST', '',json => {
		if (showMessage(json)) {
			// thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_LABEL_FETCH,
				receivedData: json
			})
		}
	})
}

//更改标签名
export const changeTagName = (index,value) => ({
	type: ActionTypes.CHANGE_TAG_NAME,
	index: index,
	value: value
})

// file, i, length, enclosureCountNumber, Orientation
export const uploadFiles = (callbackJson, file, filesName, isLast) => (dispatch, getState) => {
// export const uploadFiles = (callbackJson, index, filesLength, Orientation) => (dispatch, getState) => {

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
				type: ActionTypes.CHANGE_ENCLOSURE_LIST,
				imgArr: json.data.enclosureList,
			})
		}
		if (isLast) {
			thirdParty.toast.hide()
		}
    })
	// const homeState = getState().homeState
	// const sobid = homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
	// const useruuid = homeState.getIn(['data', 'userInfo', 'useruuid'])
	// //begin：本url影响编译环境，不可做任何修改
	// // const dirUrl = `test/${sobid}/${year}-${month}/${vcIndex}`;
	// const timestamp = new Date().getTime()
	// const dirUrl = `test/${sobid}/${useruuid}/${timestamp}`
	//
	// let fileName = file['name']
	// const fileExtend = fileName.substring(fileName.lastIndexOf('.')).toUpperCase()
	//
	// if (fileExtend === '.JPG' || fileExtend === '.JPEG' || fileExtend === '.PNG' || fileExtend === '.GIF') {
	// 	fileName = (new Date()).valueOf()+ '.jpg'
	// }
	//
	// let orientationNum = Orientation ? Orientation : 1
	//
	// upfile({
	// 	file: file,   //文件，必填,html5 file类型，不需要读数据流，files[0]
	// 	name: fileName, //文件名称，选填，默认为文件名称
	// 	token: sessionStorage.getItem('uploadToken'),  //token，必填
	// 	dir: dirUrl,  //目录，选填，默认根目录''
	// 	retries: 0,  //重试次数，选填，默认0不重试
	// 	// maxSize: 10485760,  //上传大小限制，选填，默认0没有限制 2M
	// 	maxSize: 10*1024*1024,  //上传大小限制，选填，默认0没有限制 10M
	// 	mimeLimit: 'image/*', //image/jpeg
	// 	insertOnly: 1,//0可覆盖  1 不可覆盖
	// 	callback: function (percent, result) {
	// 		// percent（上传百分比）：-1失败；0-100上传的百分比；100即完成上传
	// 		// result(服务端返回的responseText，json格式)
	// 		// result = JSON.stringify(result);
	// 		// thirdParty.toast.hide()
	//
	// 		if (result.code == 'OK') {
	// 			let fileArr=[];
	// 			fileArr.push({
	// 				fileName:result.name,
	// 				thumbnail:result.url+'@50w_50h_90Q',
	// 				enclosurepath:result.url,
	// 				size:(result.fileSize/1024).toFixed(2),
	// 				imageOrFile:result.isImage.toString().toUpperCase(),
	// 				label:"无标签",
	// 				beDelete: false,
	// 				mimeType:result.mimeType,
	// 				orientation: orientationNum
	// 			})
	// 			fetchApi('insertEnclosure','POST',JSON.stringify({
	// 				enclosureList: fileArr
	// 			}), json => {
	//
	// 				if (showMessage(json,'','','',true)) {
	// 					dispatch({
	// 						type: ActionTypes.CHANGE_ENCLOSURE_LIST,
	// 						imgArr: fileArr,
	// 					})
	// 				}
	// 				if(index + 1 === filesLength){
	// 					thirdParty.toast.hide()
	// 				}
	// 			})
	//
	// 		} else if (result.code == 'InvalidArgument') {
	// 			if(index + 1 === filesLength){
	// 				thirdParty.toast.hide()
	// 			}
	// 			return thirdParty.toast.info('上传失败，文件名中不能包含 \ : * ? " < > | ; ／等字符')
	// 		} else {
	// 			if(index + 1 === filesLength){
	// 				thirdParty.toast.hide()
	// 			}
	// 		}
	// 		if (percent === -1) {
	// 			return thirdParty.toast.info(result)
	// 		}
	// 	}
	// })
}

//外币
// 获取外币一栏的信息
export const getFCListDataFetch = (idx) => dispatch => {
    fetchApi('getFCList', 'GET','', json => {
		if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_FC_LIST_DATA_FETCH,
                receivedData: json.data,
                idx: idx
            })
        }
	})
}

export const clearFCListData = (idx) => ({
	type: ActionTypes.CLEAR_FC_LIST_DATA,
	idx
})

export const changeJvStandardAmount = (idx, value) => ({
	type: ActionTypes.CHANGE_JV_STANDARDAMOUNT,
	idx,
	value
})

export const changeJvNumber = (idx, fcNumber, exchange) => ({
	type: ActionTypes.CHANGE_JV_NUMBER,
	idx,
	fcNumber,
	exchange
})

export const changeJvExchange = (idx, value) => ({
	type: ActionTypes.CHANGE_JV_EXCHANGE,
	idx,
	value
})

//外币存在，失去焦点时计算
export const autoCalculateAll = (idx, value) => ({
    type: ActionTypes.AUTO_CALCULATE_ALL,
    idx,
    value
})
export const deletePz=(year, month, vcindex,history)=>(dispatch,getState)=>{
	const enclosureCountUser = getState().lrpzState.get('enclosureCountUser')
	const vcList =  getState().lrpzState.get('vcList').toJS()
	const message = enclosureCountUser>0?'凭证下存在附件,附件也将被删除' : '确定删除吗'

	thirdParty.Confirm({
		message: message,
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				fetchApi('deletevc', 'POST', JSON.stringify({
					year ,
					month ,
					vcindexlist:[vcindex],
					action: 'QUERY_VC-DELETE_VC'
				}),resp=>{
					if (showMessage(resp)){
						let currentIndex = vcList.findIndex((value, index)=>{
							return value.vcindex === vcindex
						})
						if(currentIndex===vcList.length-1){//最后一条，跳转到上个页面
							// dispatch(getPeriodAndVcListFetch())
							// history.push('/cxpz')
							history.goBack()
						}else{//显示下一条
							let nextVcItem={}
							let loop=(index)=>{
								if(vcList[index+1] && vcList[index+1].vcindex === vcindex){
									loop(index+1)
								}else{
									nextVcItem =vcList[index+1]
									return vcList[index+1]
								}
							}
							loop(currentIndex)
							if(nextVcItem){
								dispatch(lrpzExportActions.getFjFetch(fromJS(nextVcItem),fromJS(vcList)))
							}else{
								history.goBack()
							}
						}
					}
				})
			}
		},
		onFail : (err) => alert(err)
	})



}
