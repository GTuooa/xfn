import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'

// import { DateLib, showMessage, formatDate, jsonifyDate, upfile }from 'app/utils'
import { DateLib, showMessage, formatDate, jsonifyDate }from 'app/utils'
import { message } from 'antd'
import { fromJS, toJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

function jsonDate (issuedate) {   //时间格式：2017-02
    const year = issuedate.substr(0, 4)
	const month = issuedate.substr(5, 2)
	return {
		year,
		month
	}
}

/******** 0.跳转  ********/
export const initLrpz = (strJudgeEnter, data) => ({
	type: ActionTypes.INIT_LRPZ,
	strJudgeEnter,
	data
})

export const switchLoadingMask = () => ({
    type: ActionTypes.SWITCH_LOADING_MASK
})

// 初始化、获取日期和最大凭证号
export const initAndGetLastVcIdFetch = (strJudgeEnter, date) => dispatch => {

    // // 进入录入凭证获取科目和辅助核算
    // fetchApi('getasslist', 'GET', '', json => {
    //     showMessage(json) && dispatch({
    //         type: ActionTypes.AFTER_GET_ASS_FETCH,
    //         receivedData: json.data
    //     })
    // })
    //
    // fetchApi('getaclist', 'GET', '', json => {
    //     if (showMessage(json)) {
    //         dispatch({
    //             type: ActionTypes.AFTER_GET_AC_LIST_FETCH,
    //             receivedData: json.data
    //         })
    //     }
    // })

	const vcDate = new DateLib(date)
	fetchApi('getLastVcIndex', 'POST', JSON.stringify({
		year: vcDate.getYear(),
		month: vcDate.getMonth()
	}), json => {
		if (showMessage(json)) {
			const data = {
				receivedData: json.data,
				vcDate: vcDate
			}
			dispatch(initLrpz(strJudgeEnter, data))
		}
	})
}

//获取一张凭证
export const getVcFetch = (issuedate, vcIndex, changedIdx, vcIndexList) => (dispatch, getState) => {
	const issueDateJson = jsonDate(issuedate)
    let voucherIdx = changedIdx
    let voucherIndexList = vcIndexList ? fromJS(vcIndexList) : vcIndexList
    if(voucherIndexList && voucherIndexList.size > 1){//正序排 从小到大
        let listOne = voucherIndexList.get(0)
        let listTwo = voucherIndexList.get(1)
        if(listOne > listTwo){
            voucherIndexList = voucherIndexList.reverse()
            voucherIdx = voucherIndexList.size - voucherIdx - 1
        }
    }

    const state = getState().lrpzState
    const voucherIndexListSize = state.getIn(['flags', 'voucherIndexList']).size - 1
    const isLastIdx = changedIdx == voucherIndexListSize ? true : false

    if (sessionStorage.getItem('enterLrpz') === 'home' && isLastIdx && sessionStorage.getItem('lastVcIsSave') === 'TRUE' ) {
        sessionStorage.setItem('lrpzHandleMode', 'insert')
        const data = {
            changedIdx: voucherIdx,
            vcIndexList: voucherIndexList
        }
        return dispatch(initLrpz('getVc', data))
    }

	fetchApi('getvc', 'POST', JSON.stringify({
		year: issueDateJson.year,
		month: issueDateJson.month,
		vcindex: vcIndex
	}), json => {
		if (showMessage(json)) {
			sessionStorage.setItem('lrpzHandleMode', 'modify')
			const data = {
				receivedData: json.data,
				changedIdx: voucherIdx,//changedIdx
				vcIndexList: voucherIndexList//vcIndexList
			}
			dispatch(initLrpz('getVcFetch', data))

            const jvList = fromJS(json.data.jvlist)
            const haveFCNmuber = jvList.some(v => v.get('fcNumber'))
            //判断凭证是否有外币
            if (haveFCNmuber) {
                dispatch(getFCListDataFetch('modify'))
            }
		}
	})
}

/********* 1.凭证操作 *********/
/*  凭证头部  */
export const changeVcId = (value) => ({
	type: ActionTypes.CHANGE_VC_ID,
	vcIndex: value
})

//改变凭证日期
export const changeVoucherDate = (date, vcDate) => dispatch => {

	const newDate = new DateLib(date)

	if (newDate.toString().substr(0, 7) == vcDate.substr(0, 7)) {  //同一个账期内
		dispatch ({
			type: ActionTypes.CHANGE_VOUCHER_DATE,
			vcDate: newDate.toString()
		})
	} else {   //不在同一个账期，需要获取该账期的最大凭证号
		fetchApi('getLastVcIndex', 'POST', JSON.stringify({
				year: newDate.getYear(),
				month: newDate.getMonth()
			}), json => {
			if (showMessage(json)) {
				const data = {
					receivedData: json.data,
					vcDate: newDate
				}
				dispatch(initLrpz('getLastVcIdFetch', data))
			}
		})
	}
}

/*  凭证分录  */
export const insertJvItem = (idx) => ({
	type: ActionTypes.INSERT_JV_ITEM,
	idx
})

export const deleteJvItem = (idx) => ({
	type: ActionTypes.DELETE_JV_ITEM,
	idx
})

export const changeJvAbstract = (jvAbstract, idx, bIfTrueLostFocus) => ({
	type: ActionTypes.CHANGE_JV_ABSTRACT,
	jvAbstract,
	idx,
	bIfTrueLostFocus
})

export const copyJvAbstract = (idx) => ({
	type: ActionTypes.COPY_JV_ABSTRACT,
	idx
})

export const changeJvDirection = (idx, jvDirection) => ({
	type: ActionTypes.CHANGE_JV_DIRECTION,
	idx,
	jvDirection
})

export const changeJvAmount = (amount, idx, jvDirection) => ({
	type: ActionTypes.CHANGE_JV_AMOUNT,
	amount,
	idx,
	jvDirection
})

export const changeJvAc = (idx, acId, acName, acFullName, assCategorys, acunitOpen) => ({
	type: ActionTypes.CHANGE_JV_AC,
	idx,
	acId,
	acName,
	acFullName,
	assCategorys,
    acunitOpen
})

export const refreshAcItemAsslist = (idx, newAsslist, assDropListFull) => ({
    type: ActionTypes.REFRESH_ACITEM_ASSLIST,
    idx,
    newAsslist,
    assDropListFull
})

/*  凭证分录 -- ass */
export const changeJvAss = (idx, assCategory, value) => ({
	type: ActionTypes.CHANGE_JV_ASS,
	idx,
	assCategory,
	value
})

// export const changeShowAssDisableInfo = (idx) => ({
//     type: ActionTypes.CHANGE_SHOW_ASS_DISABLE_INFO,
//     idx
// })

// export const changeLrpzAssInfo = (relatedAclist) => ({
//     type: ActionTypes.CHANGE_LRPZ_ASS_INFO,
//     relatedAclist
// })

export const showAssDisableModal = (asscategory) => ({
    type: ActionTypes.SHOW_LRPZ_ASS_DISABLE_MODAL,
    asscategory: asscategory ? asscategory : ''
})

/*  凭证分录 -- ac */
export const changeAcModalDisplay = (idx) => ({
	type: ActionTypes.CHANGE_AC_MODAL_DISPLAY,
	idx
})

export const changeTreeSelectContent = (info) => ({
	type: ActionTypes.CHANGE_TREE_SELECT_CONTENT,
	info
})

export const cancleAssInput = (idx, value) => ({
	type: ActionTypes.CANCLE_ASS_INPUT,
	idx,
	value
})

/*  凭证保存 */
export const saveJvItemFetch = (reDirect,autoEncode,saveWayModal,PzPermissionInfo) => (dispatch, getState) => {
    sessionStorage.setItem('reDirect',reDirect)
	const state = getState().lrpzState

	// const jvListOriginal = state.get('jvList').filter(v => v.get('acid') || v.get('jvabstract') || v.get('jvamount'))
    let jvListOriginal = state.get('jvList').filter(v => v.get('acid') || v.get('jvabstract') || v.get('jvamount'))
    const sobid = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    const useruuid = getState().homeState.getIn(['data', 'userInfo', 'useruuid'])
	//begin：本url影响编译环境，不可做任何修改
	// const dirUrl = `/test/${sobid}/${state.get('year')}-${state.get('month')}/${state.get('vcIndex')}`;
    const timestamp = new Date().getTime()
	const dirUrl = `/test/${sobid}/${useruuid}/${timestamp}`
	//end：本url影响编译环境，不可做任何修改
	let jvCompletion = [];
    if (jvListOriginal.size == 0) {
		return thirdParty.Alert('凭证分录不能为空')
    }

	jvListOriginal.map((v, i) => {
        const jvabstract = v.get('jvabstract').trim()
		if (!jvabstract) {
			const line = i + 1
			jvCompletion.push('第' + line + '行存在未填写完整的摘要')
		} else if (jvabstract === "结转本期损益") {
            const line = i + 1
            jvCompletion.push('第' + line + '行摘要"结转本期损益"为系统保留摘要字段，请通过"结账"功能结转本期损益')
		} else if (jvabstract === "结转本年利润") {
            const line = i + 1
            jvCompletion.push('第' + line + '行摘要"结转本年利润"为系统保留摘要字段，请通过"结账"功能结转本年利润')
		} else if (jvabstract === "期末汇兑损益") {
            const line = i + 1
            jvCompletion.push('第' + line + '行摘要"期末汇兑损益"为系统保留摘要字段，请通过"结账"功能调整汇兑损益')
		} else if (jvabstract === "计提折旧摊销费用") {
            const line = i + 1
            jvCompletion.push('第' + line + '行摘要"计提折旧摊销费用"为系统保留摘要字段，请通过系统相关功能生成折旧摊销凭证')
		}

        if (v.get('jvabstract').length > Limit.LRPZ_ABSTRACT_LENGTH) {
            const line = i + 1
            jvCompletion.push('第' + line + '行摘要长度不能超过' + Limit.LRPZ_ABSTRACT_LENGTH + '个字符')
        }
		if (!v.get('acid')) {
			const line = i + 1
			jvCompletion.push('第' + line + '行存在未填写完整的科目')
		}
		if (!v.get('jvamount') && v.get('jvamount') !== 0) {
			const line = i + 1
			jvCompletion.push('第' + line + '行存在未填写完整的金额')
		}

		if (v.get('jvamount') && v.get('price') && v.get('acunitOpen')=='1' && !v.get('jvcount')) {	//金额和单价有值数量没值
			const line = i + 1
			jvCompletion.push('第' + line + '行存在未填写完整的数量')
		}

        //金额,原币都有值，选择CNY，原币和金额不等
        const currencyItem = state.getIn(['flags', 'currencyList']).find(v => v.get('standard') == '1')
        // if (v.get('fcNumber') == 'CNY' && v.get('standardAmount') && v.get('jvamount')) {
        const currencyFcNumber = currencyItem ? currencyItem.get('fcNumber') : undefined
        if (v.get('fcNumber') == currencyFcNumber && v.get('standardAmount') && v.get('jvamount')) {
            if ( Number(v.get('standardAmount')) != Number(v.get('jvamount'))) {
                const line = i + 1
                jvCompletion.push('第' + line + '行为本位币：' + currencyItem.get('name') + '，请调整汇率为1')
            }
		}

        // 选了本位币，没填原币时补齐
        if (v.get('jvamount') && v.get('fcStatus')=='1' && !v.get('standardAmount') && v.get('fcNumber') == currencyFcNumber) {
            const fcNumber = currencyItem ? currencyItem.get('fcNumber') : ''
            const exchange = currencyItem ? currencyItem.get('exchange') : ''

            jvListOriginal = jvListOriginal.setIn([i, 'fcNumber'], fcNumber).setIn([i, 'exchange'], exchange).setIn([i, 'standardAmount'], v.get('jvamount'))
        }
        
        //金额有值,原币没值 ---> 默认选择人民币
        // if (v.get('jvamount') && v.get('fcStatus')=='1' && !v.get('standardAmount')) {
        //     const fcNumber = currencyItem ? currencyItem.get('fcNumber') : ''
        //     const exchange = currencyItem ? currencyItem.get('exchange') : ''

        //     jvListOriginal = jvListOriginal.setIn([i, 'fcNumber'], fcNumber).setIn([i, 'exchange'], exchange).setIn([i, 'standardAmount'], v.get('jvamount'))
		// }
	})


	if (jvCompletion.length){
		return thirdParty.Alert(jvCompletion.reduce((v, pre) => v + ',' + pre))
	}

	if (Number(state.getIn(['flags', 'debitTotal'])) !== Number(state.getIn(['flags', 'creditTotal']))){
		return thirdParty.Alert('借贷不平衡')
	}

	if (!state.get('vcIndex')){
		return thirdParty.Alert('凭证号未输入')
	}

	if (!state.get('vcDate')){
		return thirdParty.Alert('日期未输入')
	}
	// const jvList = state.get('jvList').update(v => v.filter(v => v.get('jvabstract')).map((v, i) => v.set('jvindex', ++ i)))
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const jvList = jvListOriginal.update(v => v.map((v, i) => v.set('jvindex', ++ i)))

	;({
		modify() {
			let dataFetch = fromJS({
				oldvcindex: state.get('oldVcIndex'),
				oldyear: state.get('oldYear'),
				oldmonth: state.get('oldMonth'),
				createdtime: state.get('createdTime'),
				createdby: state.get('createdBy'),
				closedby: state.get('closedby') ? state.get('closedby') : '',
				reviewedby: state.get('reviewedBy'),
				vcindex: state.get('vcIndex'),
				year: state.get('year'),
				month: state.get('month'),
				vcdate: state.get('vcDate'),
				jvlist: jvList,
                enclosureList: state.get('enclosureList'),
                dirUrl:dirUrl,
                autoEncode:autoEncode,
                enclosureCountUser: state.get('enclosureCountUser') ? state.get('enclosureCountUser') : '',
			})

			fetchApi('modifyVc', 'POST', JSON.stringify(dataFetch), json => {
                if (json.code === 15000) {
                    thirdParty.Alert('这有可能是因为分录的摘要中包含特殊字符（表情及异形字等），请修改后重试。若还出现该错误，请联系客服人员支持。')
                }
                else if(json.code === 15002){
                    if(PzPermissionInfo.getIn(['arrange', 'permission'])){
                        saveWayModal()
                    }else{
                        thirdParty.Alert('凭证号已存在')
                    }
                }
                else if (showMessage(json)) {
                    if(autoEncode!=''){
                        let getUpload=fromJS({
                            vcindex: json.data.vcindex,
                            year: state.get('year'),
                            month: state.get('month')
                        })
                        fetchApi('uploadgetfile', 'POST', JSON.stringify(getUpload), file => {
                            if (showMessage(file)){
                                dispatch({
                                    type: ActionTypes.GET_UPLOAD,
                                    receivedData: file.data
                                })
                            }
                        })
                    }
					if (reDirect === 'true') { //保存并新增
						fetchApi('getLastVcIndex', 'POST', JSON.stringify(dataFetch), json =>{
							if (showMessage(json)) {
								message.success('保存成功')
								const data = {
									receivedData: json.data,
									vcDate: new DateLib(dataFetch.get('vcdate')),
                                    voucherValueStart: [dataFetch.get('vcdate'), dataFetch.get('vcindex')].join('_'),
                                    voucherValueEnd: [dataFetch.get('vcdate'), json.data].join('_')
								}
                                sessionStorage.setItem('lastVcIsSave', 'TRUE')
								sessionStorage.setItem('lrpzHandleMode', 'insert')
								// dispatch(initLrpz('initAndGetLastVcIdFetch', data))
                                dispatch(initLrpz('initAndGetLastVcIdFetchAndVcList', data))
							}
						})
					} else { //保存
						message.success('保存成功')
						const data = {
							receivedData: {
								oldvcindex: dataFetch.get('vcindex'),
								oldyear: dataFetch.get('oldyear'),
								oldmonth: dataFetch.get('oldmonth'),
								createdtime: dataFetch.get('createdtime'),
								createdby: dataFetch.get('createdby'),
								closedby: dataFetch.get('closedby'),
								reviewedby: dataFetch.get('reviewedby'),
								vcindex: json.data.vcindex,
								year: dataFetch.get('year'),
								month: dataFetch.get('month'),
								vcdate: dataFetch.get('vcdate'),
								jvlist: jvList,
                                enclosureList: state.get('enclosureList').toJS(),
                                enclosureCountUser: state.get('enclosureCountUser'),
							},
							changedIdx: '',
							vcIndexList: []
						}

						sessionStorage.setItem('lrpzHandleMode', 'modify')
						dispatch(initLrpz('getVcFetch', data))
					}
				}
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			})
		},
		insert() {
			let dataFetch = fromJS({
				vcindex: state.get('vcIndex'),
				year: state.get('year'),
				month: state.get('month'),
				vcdate: state.get('vcDate'),
				jvlist: jvList,
                vcModelKey: state.get('vcKey'),
                enclosureList: state.get('enclosureList'),
                dirUrl:dirUrl,
                autoEncode:autoEncode,
                enclosureCountUser: state.get('enclosureCountUser'),
			})

			fetchApi('insertVc', 'POST', JSON.stringify(dataFetch), json => {
				if (json.code === 0) {
                    insertToDo(json, dataFetch)
				} else if (json.code === 15000) {
                    thirdParty.Alert('这有可能是因为分录的摘要中包含特殊字符（表情及异形字等），请修改后重试。若还出现该错误，请联系客服人员支持。')
                } else if (json.code === 15002) {  //凭证号重复
                    if(PzPermissionInfo.getIn(['arrange', 'permission'])){
                        saveWayModal()
                    }else{
                        message.info('凭证号重复，系统自动编号')
                        dispatch(saveJvItemFetch(reDirect,true,saveWayModal,PzPermissionInfo))
                    }
				} else showMessage(json)
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			})

			const insertToDo = (json, dataFetch) => {
                let getUpload=fromJS({
                    vcindex: json.data.vcindex,
                    year: state.get('year'),
                    month: state.get('month')
                })

				if (reDirect === 'true') { //保存并新增
					fetchApi('getLastVcIndex', 'POST', JSON.stringify(dataFetch), json => {
						if (showMessage(json)) {
							const data = {
								receivedData: json.data,
								vcDate: new DateLib(dataFetch.get('vcdate')),
                                voucherValueStart: [dataFetch.get('vcdate'), dataFetch.get('vcindex')].join('_'),
                                voucherValueEnd: [dataFetch.get('vcdate'), json.data].join('_')
							}
                            sessionStorage.setItem('lastVcIsSave', 'TRUE')
							sessionStorage.setItem('lrpzHandleMode', 'insert')
							// dispatch(initLrpz('initAndGetLastVcIdFetch', data))
                            dispatch(initLrpz('initAndGetLastVcIdFetchAndVcList', data))

							fetchApi('getperiod', 'GET', '', json =>{
								if (showMessage(json)) {
									message.success('保存成功')
									dispatch({
										type: ActionTypes.GET_PERIOD_FETCH,
										receivedData: json
									})
								}
							})
						}
					})
				} else {  //保存
                    fetchApi('uploadgetfile', 'POST', JSON.stringify(getUpload), file => {
                        if (showMessage(file)){
                            dispatch({
                                type: ActionTypes.GET_UPLOAD,
                                receivedData: file.data
                            })
                        }
                    })
					const createdTime = formatDate()
					const createdBy = getState().homeState.getIn(['data', 'userInfo', 'username'])
					const data = {
						receivedData: {
							oldvcindex: dataFetch.get('vcindex'),
							oldyear: dataFetch.get('oldyear'),
							oldmonth: dataFetch.get('oldmonth'),
							createdtime: createdTime,
							createdby: createdBy,
							closedby: dataFetch.get('closedby'),
							reviewedby: dataFetch.get('reviewedby'),
							vcindex: json.data.vcindex,
							year: dataFetch.get('year'),
							month: dataFetch.get('month'),
							vcdate: dataFetch.get('vcdate'),
							jvlist: jvList,
                            enclosureList: state.get('enclosureList').toJS(),
                            enclosureCountUser: state.get('enclosureCountUser'),
						},
						changedIdx: '',
						vcIndexList: []
					}
                    sessionStorage.setItem('lastVcIsSave', 'FALSE')
					sessionStorage.setItem('lrpzHandleMode', 'modify')
					dispatch(initLrpz('getVcFetch', data))
					fetchApi('getperiod', 'GET', '', json =>{
						if (showMessage(json)) {
							message.success('保存成功')
							dispatch({
								type: ActionTypes.GET_PERIOD_FETCH,
								receivedData: json
							})
						}
					})
				}
			}
		}
	}[sessionStorage.getItem('lrpzHandleMode')])()
}

/*  凭证审核 */
export const reviewedJvlist = (year, month, vcIndex, fromPzBomb, pzBombCallback) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const userName = getState().homeState.getIn(['data', 'userInfo', 'username'])
	fetchApi('reviewVc', 'POST', JSON.stringify({
		year,
		month,
        vcindexlist: [vcIndex],
        action: 'QUERY_VC-AUDIT'
	}), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            if (json.data.fail === 0) {
                if (fromPzBomb) {//凭证弹窗的审核
                    dispatch({
                        type: ActionTypes.PZBOMB_REVIEWEDBY_VC,
                        reviewedBy: userName
                    })
                    pzBombCallback && pzBombCallback()
                } else {
                    dispatch ({
                        type: ActionTypes.REVIEWEDBY_VC,
                        reviewedBy: userName
                    })
                }
            } else {
                thirdParty.Alert(json.data.failList[0])
            }
        }
	})
}

/*  凭证反审核 */
export const cancelReviewedJvlist = (year, month, vcIndex, fromPzBomb, pzBombCallback) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('cancelReviewVc', 'POST', JSON.stringify({
		year,
		month,
        vcindexlist: [vcIndex],
        action: 'QUERY_VC-CANCEL_AUDIT'
	}), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            if (json.data.fail === 0) {
                if (fromPzBomb) {
                    dispatch ({
                        type: ActionTypes.CANCEL_PZBOMB_REVIEWEDBY_VC
                    })
                    pzBombCallback && pzBombCallback()
                } else {
                    dispatch({
                        type: ActionTypes.CANCEL_REVIEWEDBY_VC
                    })
                }
            } else {
                thirdParty.Alert(json.data.failList[0])
            }
        }
	})
}

/*  凭证清空 */
export const clearLrpz = () => ({
	type: ActionTypes.CLEAR_LRPZ
})

/* 凭证删除 */
export const deleteVcFetch = () => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const state = getState().lrpzState
    const voucherIdx = state.getIn(['flags', 'voucherIdx'])
    const voucherIndexList = state.getIn(['flags', 'voucherIndexList'])
    let nextVoucherIdx = '' //将要获取的凭证
    let idx = '' //凭证在 voucherIndexList 中的位置

    if (voucherIndexList.size) {
        if ((voucherIdx + 1) < voucherIndexList.size) { //下一张
            nextVoucherIdx = voucherIdx + 1
            idx = voucherIdx
        } else if ((voucherIdx - 1) != -1) {    //上一张
            nextVoucherIdx = voucherIdx - 1
            idx = voucherIdx - 1
        }
    }

    fetchApi('deletevc', 'POST', JSON.stringify({
		year: state.get('oldYear'),
		month: state.get('oldMonth'),
        vcindexlist: [state.get('oldVcIndex')],
        action: 'SAVE_VC-RUD_VC'
	}), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            if (nextVoucherIdx!=-1 && nextVoucherIdx!='') {
                const list = voucherIndexList.delete(voucherIdx)
                dispatch(getVcFetch(voucherIndexList.get(nextVoucherIdx).split('_')[0], voucherIndexList.get(nextVoucherIdx).split('_')[1], idx, list))
            } else {
                // dispatch(homeActions.removeTabpane('Lrpz', sessionStorage.getItem('enterLrpz')))
                if (sessionStorage.getItem('enterLrpz') === 'Home') {
                    sessionStorage.setItem('lrpzHandleMode', 'insert')
                    dispatch(clearLrpz())
                } else {
                    dispatch(homeActions.removeHomeTabpane('Edit'))
                }
            }
        }
    })

}

/********* 1.1 草稿 *********/
//暂存
export const draftSaveFetch = (vcKey) => (dispatch, getState) => {
    const state = getState().lrpzState
    let jvCompletion = []
    const jvListOriginal = state.get('jvList').filter(v => v.get('acid') || v.get('jvabstract') || v.get('jvamount'))

    jvListOriginal.map((v, i) => {
        if (v.get('jvabstract').length > Limit.LRPZ_ABSTRACT_LENGTH) {
            const line = i + 1
            jvCompletion.push('第' + line + '行摘要长度不能超过' + Limit.LRPZ_ABSTRACT_LENGTH + '个字符')
        }
    })

    if (jvCompletion.length){
		return thirdParty.Alert(jvCompletion.reduce((v, pre) => v + ',' + pre))
	}

	if (!state.get('vcIndex')){
		return thirdParty.Alert('凭证号未输入')
	}

	if (!state.get('vcDate')){
		return thirdParty.Alert('日期未输入')
	}
	const jvList = state.get('jvList').update(v => v.filter(v => v.get('acid') || v.get('jvabstract') || v.get('jvamount')).map((v, i) => v.set('jvindex', ++ i)))

    if (state.get('vcKey')) { //修改

        let data = fromJS({
            createdtime: state.get('createdTime'),
            createdby: state.get('createdBy'),
            closedby: state.get('closedby'),
            reviewedby: state.get('reviewedBy'),
			vcindex: state.get('vcIndex'),
			year: state.get('year'),
			month: state.get('month'),
			vcdate: state.get('vcDate'),
            //vckey:  state.getIn(['flags', 'locked'])== '1' ? '' : state.get('vcKey'),
            vckey: state.get('vcKey'),
			jvlist: jvList,
            enclosureCountUser: state.get('enclosureCountUser')
		})

        fetchApi('modifydraft', 'POST', JSON.stringify(data), json => {
            if (showMessage(json)) {
                if( state.getIn(['flags', 'locked'])== '1'){
                    message.success('新增草稿成功')
                }else{
                    if (json.data.isModify == '1') {
                        message.success('修改草稿成功')
                    } else {
                        message.success('新增草稿成功')
                    }
                }

                dispatch({
                    type: ActionTypes.TEMPORARY_SAVE_FETCH,
                    receivedData: json.data.vckey
                })
            }
        })
    } else { //保存
        let data = fromJS({
			vcindex: state.get('vcIndex'),
			year: state.get('year'),
			month: state.get('month'),
			vcdate: state.get('vcDate'),
			jvlist: jvList,
            enclosureCountUser: state.get('enclosureCountUser')
		})

        fetchApi('insertdraft', 'POST', JSON.stringify(data), json => {
            if (showMessage(json)) {
                message.success('新增草稿成功')
                dispatch({
                    type: ActionTypes.TEMPORARY_SAVE_FETCH,
                    receivedData: json.data
                })
            }
        })
    }
}

//获取单张草稿
export const getDraftItemFetch = (vcKey, changeDraftIdx, draftList) => (dispatch, getState) => {
    const state = getState().allState

    fetchApi('getdraft', 'POST', JSON.stringify({
        vckey: vcKey
    }), json => {
        if (showMessage(json)) {
            const getDraftItem = json.data
            if (json.data.locked == '1') {  //已锁定,自动获取凭证号和日期
                let vcDate = ''
                const year = state.getIn(['period', 'openedyear'])
        		const month = state.getIn(['period', 'openedmonth'])
                if (!year) {
                    vcDate = new Date()
                } else {
                    const lastDate = new Date(year, month, 0)
                    const currentDate = new Date()
                    const currentYear = new Date().getYear()
                    const currentMonth = new Date().getMonth() + 1
                    vcDate = lastDate < currentDate ? lastDate : (year == currentYear && month == currentMonth) ? currentDate : new Date(year, month, 1)
                }
                fetchApi('getLastVcIndex', 'POST', JSON.stringify({
                		year:  new DateLib(vcDate).getYear(),
                		month:  new DateLib(vcDate).getMonth()
                	}), json => {
                		if (showMessage(json)) {
                			const data = {
                                receivedData: getDraftItem,
                                draftList : draftList,
                                changeDraftIdx: changeDraftIdx,
                                vcKey: vcKey,
                				vcIndex: json.data,
                				vcDate:  new DateLib(vcDate)
                			}
                			dispatch(initLrpz('getVcIdAndGetDraftItemFetch', data))
                		}
            	})
            } else {
                const data = {
                    receivedData: getDraftItem,
                    draftList : draftList,
                    changeDraftIdx: changeDraftIdx,
                    vcKey: vcKey
    			}
                dispatch(initLrpz('getDraftItemFetch', data))
            }
        }
    })
}

/********* 2.附件 *********/
//编辑图片名称
export const changeTagName = (index,value) => ({
    type: ActionTypes.CHANGE_TAG_NAME,
    index: index,
    value: value
})

export const deleteUploadImgUrl = (index) => ({
	type: ActionTypes.DELETE_UPLOAD_IMG_URL,
	index
})

// 手动修改附件数量
export const changeVcEnclosureCountUser = (value) => ({
	type: ActionTypes.CHANGE_VC_ENCLOSURE_COUNT_USER,
	value
})

 //改变图片列表的信息
export const changeEnclosureList = (imgArr) => ({
	type: ActionTypes.CHANGE_ENCLOSURE_LIST,
	imgArr
})

//附件上传
export const getUploadGetTokenFetch = () => (dispatch, getState) => {
	// fetchApi('uploadgettoken', 'GET', '', json => {
	// 	showMessage(json) &&
	// 	sessionStorage.setItem('token' ,json.data.token)
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
//获取附件信息
export const getUploadCallbackFetch = (vcindex, year, month,url) => dispatch => {
	fetchApi('uploadgetfile', 'POST', JSON.stringify({
		vcindex,
		year,
		month
	}), json => {
		showMessage(json)
	})
}
//初始化标签
export const initLabel = () => dispatch => {
	fetchApi('initLabel', 'POST', '',json => {showMessage(json)})
}

//获取标签
export const getLabelFetch = () => dispatch => {
	fetchApi('getFjLabelData', 'POST', '',json => {
        showMessage(json) &&
        dispatch({
                type: ActionTypes.GET_LABEL_FETCH,
                receivedData: json
            })
        })
}
//文件名重复时调用
// export const checkEnclosureList = (year, month, vcIndex, dirUrl, name, file, index, filesLength) => dispatch => {
export const checkEnclosureList = (year, month, vcIndex, name, file, callbackJson, isLast) => dispatch => {

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
                type: ActionTypes.CHANGE_ENCLOSURE_LIST,
                imgArr: json.data.enclosureList
            })
        }
        if (isLast) {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })

    // upfile({
    //     file: file,   //文件，必填,html5 file类型，不需要读数据流，files[0]
    //     name: name, //文件名称，选填，默认为文件名称
    //     token: sessionStorage.getItem('token'),  //token，必填
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
    //             let fileArr = []
    //             fileArr.push({
    //                 fileName: result.name,
    //                 thumbnail: result.url+'@50w_50h_90Q',
    //                 enclosurepath: result.url,
    //                 size: (result.fileSize/1024).toFixed(2),
    //                 imageOrFile: result.isImage.toString().toUpperCase(),
    //                 label: "无标签",
    //                 mimeType: result.mimeType
    //             })
    //             fetchApi('insertEnclosure', 'POST', JSON.stringify({
    //                 enclosureList: fileArr
    //             }), json => {
    //                 dispatch({
    //                     type: ActionTypes.CHANGE_ENCLOSURE_LIST,
    //                     imgArr: fileArr
    //                 })
    //             })
    //             if (index+1 === filesLength) {
    //                 dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    //             }
    //
    //         } else if (result.code == 'InvalidArgument') {
    //             if (index+1 === filesLength) {
    //                 dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    //             }
    //             return message.error('上传失败，文件名中不能包含 \ : * ? " < > | ; ／等字符')
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
}

/********* 3. *********/
/*  科目新增  */
export const changelrAcModalDisplay = () => ({
	type: ActionTypes.CHANGE_LR_AC_MODAL_DISPLAY
})

export const changelrAcModalClear = () => ({
	type: ActionTypes.CHANGE_LR_AC_MODAL_CLEAR
})

export const changeLrAcidText = (acId, acList) => ({
	type: ActionTypes.CHANGE_LR_ACID_TEXT,
	acId,
	acList
})

export const changeLrAcNameText = (acName) => ({
	type: ActionTypes.CHANGE_LR_ACNAME_TEXT,
	acName
})

export const changeLrCategoryText = (category) => ({
	type: ActionTypes.CHANGE_LR_CATEGORY_TEXT,
	category
})

export const changeLrAcDirectionText = (category) => ({
	type: ActionTypes.CHANGE_LR_AC_DIRECTON_TEXT,
	category
})

// 是否开启数量核算
export const changeLrAcAmountStateText = () => ({
	type: ActionTypes.CHANGE_LR_AMOUNT_TEXT
})

// 将计算单位赋给state
export const changePzAcUnitText = (unit) => ({
	type: ActionTypes.CHANGE_LR_AC_UNIT_TEXT,
	unit
})

/*  辅助核算新增  */
export const changeLrFzhsModalDisplay = () => ({
	type: ActionTypes.CHANGE_LR_FZHS_MODAL_DISPLAY
})

export const changeLrAssCategory = (asscategory) => ({
	type: ActionTypes.CHANGE_LR_ASS_CATEGORY,
	asscategory
})

export const changeLrFzhsModalClear = () => ({
	type: ActionTypes.CHANGE_LR_FZHS_MODAL_CLEAR
})

export const changeLrAssId = (assId) => ({
	type: ActionTypes.CHANGE_LR_ASS_ID,
	assId
})

export const getAssNextCode = (asscategory) => (dispatch,getState) => {
    fetchApi('getassinput', 'GET', `assCategory=${asscategory}`, json => {
        if (showMessage(json)) {
   dispatch({
    type: ActionTypes.CHANGE_LR_ASS_ID,
    assId:json.data.newAssId
   })
        }
    })
}

export const changeLrAssName = (assName) => ({
	type: ActionTypes.CHANGE_LR_ASS_NAME,
	assName
})

/********* 3.1 数量核算 *********/
// export const getAmountDataFetch = (acId, vcDate, idx, asscategory, assid) => dispatch => {	// 获取数量一栏的信息
export const getAmountDataFetch = (acId, vcDate, idx, asscategory, assid, asscategoryTwo, assidTwo) => dispatch => {	// 获取数量一栏的信息
	const date = new DateLib(vcDate)
	fetchApi('getAmountData', 'POST',JSON.stringify({
		acid: acId,
		date: vcDate,
		year: date.getYear(),
		month: date.getMonth(),
        asscategory,
        assid,
        asscategoryTwo,
        assidTwo
	}), json => {
		showMessage(json) && dispatch({
			type: ActionTypes.GET_AMOUNT_DATA,
			receivedData: json.data,
			idx:idx
		})
	})
}

export const changeJvCount = (jvCount, idx, unitDecimalCount) => ({
	type: ActionTypes.CHANGE_JV_COUNT,
	jvCount,
	idx,
    unitDecimalCount
})

export const changeJvPrice = (jvPrice, idx) => ({
	type: ActionTypes.CHANGE_JV_PRICE,
	jvPrice,
	idx
})

export const autoCalculate = (idx, value, unitDecimalCount) => ({	 // 失去焦点后自动计算
	type: ActionTypes.AUTO_CALCULATE,
	idx,
	value,
    unitDecimalCount
})

/********* 3.1.1 科目余额 *********/
export const getAcCloseBalance = (acId, vcDate, idx, asscategory, assid, asscategoryTwo, assidTwo) => dispatch => {
    const date = new DateLib(vcDate)
    fetchApi('getAcCloseBalance', 'POST', JSON.stringify({
        acid: acId,
		year: date.getYear(),
		month: date.getMonth(),
        asscategory,
        assid,
        asscategoryTwo,
        assidTwo
    }), json => {
		if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_AC_CLOSE_BALANCE,
                receivedData: json.data,
                idx: idx
            })
        }
	})
}

/********* 3.2 外币核算 *********/
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

//选择币别
export const changeJvItemNumber = (idx, value) => ({
    type: ActionTypes.CHANGE_JV_ITEM_NUMBER,
    idx,
    value
})

//改变原币
export const changeJvStandardAmount = (idx, value) => ({
    type: ActionTypes.CHANGE_JV_STANDAR_AMOUNT,
    idx,
    value
})
//改变汇率
export const changeJvExchange = (idx, value) => ({
    type: ActionTypes.CHANGE_JV_EXCHANGE,
    idx,
    value
})

//外币存在
export const autoCalculateAll = (idx, value, unitDecimalCount) => ({
    type: ActionTypes.AUTO_CALCULATE_ALL,
    idx,
    value,
    unitDecimalCount
})

/********* 4. *********/
 /* 导入 */
export const getFileUploadFetch = (form,openModal) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('vcImport', 'UPLOAD', form, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if(showMessage(json)){
			dispatch(afterLrVcImport(json))
			openModal()
			let delayTime = 500;
			if(json.data.total > 400){
				delayTime = 2000;
			}
			const loop = function (accessToken) {
				const time = setTimeout(() => {
					let showMessageMask = getState().lrpzState.getIn(['flags','showLrModalMask'])
					fetchApi('acImportProgress', 'GET', `accessToken=${accessToken}`, json => {
						if(showMessage(json)){
							dispatch({
								type:ActionTypes.GET_LRPZ_IMPORT_PROGRESS,
								receivedData:json,
                                accessToken:accessToken
							})
							if ((json.data.progress >= 100) && (json.data.successList.length > 0)) {
                                fetchApi('getperiod', 'GET', '', json => {
                                    dispatch({
                                        type: ActionTypes.GET_PERIOD_FETCH,
                                        receivedData: json
                                    })
                                })
							}
							if(showMessageMask && json.data.progress < 100){
								loop(accessToken)
							}
						}
					})
					clearTimeout(time)
				},delayTime)
			}
			loop(json.data.accessToken)
		}
	})
}

export const errorExlDown = () => (dispatch,getState) => {
    const accessToken = getState().lrpzState.getIn(['importProgressInfo','accessToken'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('downVcError', 'POST', JSON.stringify({accessToken:accessToken}), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const beforeLrVcImport = () => ({
	type: ActionTypes.BEFORE_LR_VC_IMPORT
})

export const closeLrImportContent = () => ({
	type: ActionTypes.CLOSE_LR_IMPORT_CONTENT
})

export const afterLrVcImport = (receivedData) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_LR_VC_IMPORT,
		receivedData
	})
}

export const judgeTitleFixed = () => ({
	type: ActionTypes.JUDGE_TITLE_FIXED
})

// 点击复制命令后，将lrpzHandleMode改为‘insert’，并将原有的一些数据清空
export const afterCopyClick = (jvList) => ({
	type: ActionTypes.AFTER_COPY_CLICL,
	jvList
})

/********* 5.快捷键 *********/
 /* 快捷键说明弹窗的状态 */
export const shortcut = () => ({
	type: ActionTypes.SHORT_CUT
})

export const changeFocusInput = (ref) => ({
	type: ActionTypes.CHANGE_FOCUS_INPUT,
	ref
})

//切换贷借方金额
export const changeJvDirectionByKey = (idx, direction) => ({
	type: ActionTypes.CHANGE_JV_DIRECTION_BY_KEY,
	idx,
	direction
})

//凭证弹窗获取vc的接口
export const getPzVcFetch = (issuedate, vcIndex, changedIdx, vcIndexList) => (dispatch) => {
    const issueDateJson = jsonDate(issuedate)
    let voucherIdx = changedIdx
    let voucherIndexList = vcIndexList ? fromJS(vcIndexList) : vcIndexList
  // if(voucherIndexList && voucherIndexList.size > 1){//正序排 从小到大
  //     voucherIndexList = voucherIndexList.sort((a,b)=>{
  //       if(a.split('_')[1] < b.split('_')[1]){
  //         return -1
  //       }
  //       if(a.split('_')[1] > b.split('_')[1]){
  //         return 1
  //       }
  //       if(a.split('_')[1] === b.split('_')[1]){
  //         return 0
  //       }
  //     })
  //     voucherIndexList.forEach((v,i)=>{
  //       if(v.split('_')[1]== vcIndex){
  //         voucherIdx = i
  //       }
  //     })
  // }

	fetchApi('getvc', 'POST', JSON.stringify({
		year: issueDateJson.year,
		month: issueDateJson.month,
		vcindex: vcIndex
	}), json => {
		if (showMessage(json)) {
            dispatch({
                type: ActionTypes.INIT_PZ_BOMB,
                receivedData: json.data,
                voucherIdx,
                voucherIndexList
            })
		}
	})
}
/* 凭证弹窗的凭证删除 */
export const deletePzBombVcFetch = () => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const state = getState().pzBombState
    const voucherIdx = state.getIn(['flags', 'voucherIdx'])
    const voucherIndexList = state.getIn(['flags', 'voucherIndexList'])
    let nextVoucherIdx = '' //将要获取的凭证
    let idx = '' //凭证在 voucherIndexList 中的位置

    if (voucherIndexList.size) {
        if ((voucherIdx + 1) < voucherIndexList.size) { //下一张
            nextVoucherIdx = voucherIdx + 1
            idx = voucherIdx
        } else if ((voucherIdx - 1) != -1) {    //上一张
            nextVoucherIdx = voucherIdx - 1
            idx = voucherIdx - 1
        }
    }

    fetchApi('deletevc', 'POST', JSON.stringify({
		year: state.get('year'),
		month: state.get('month'),
        vcindexlist: [state.get('vcIndex')],
        action: 'COMMON-DELETE'
	}), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)){
            const homeState = getState().homeState
            const panes = homeState.get('panes')
            if (panes.some(v => v.get('title') === '查询流水')) {
                const cxlsState = getState().cxlsState
                const currentPage = cxlsState.get('currentPage')
                const waterType = cxlsState.getIn(['flags','mainWater'])
                const curAccountUuid = cxlsState.getIn(['flags','curAccountUuid'])
                const issuedate = cxlsState.getIn(['flags', 'issuedate'])
                dispatch(cxlsActions.getBusinessList(issuedate,waterType,curAccountUuid,currentPage))
            }
            if (nextVoucherIdx!=-1 && nextVoucherIdx!='') {
                const list = voucherIndexList.delete(voucherIdx)
                dispatch(getPzVcFetch(voucherIndexList.get(nextVoucherIdx).split('_')[0], voucherIndexList.get(nextVoucherIdx).split('_')[1], idx, list))
            } else {
              dispatch(allActions.showPzBomb(false))
            }
        }
    })

}

export const changeMessageMask = () => ({
	type: ActionTypes.CHANGE_LRPZ_MESSAGEMASK,
})
