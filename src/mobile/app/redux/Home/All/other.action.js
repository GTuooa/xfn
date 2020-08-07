import * as ActionTypes from './ActionTypes'
import fetchApi from 'app/constants/fetch.constant.js'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { AGENTID } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'

export const initApp = () => dispatch => {

	dispatch({type: ActionTypes.INIT_ALL})
	// 设置
	dispatch({type: ActionTypes.INIT_ACCONFIG})
	dispatch({type: ActionTypes.INIT_ACCOUNT_CONFIG})
	dispatch({type: ActionTypes.INIT_ACCOUNT_SETTING})
	dispatch({type: ActionTypes.INIT_ASSCONFIG})
	dispatch({type: ActionTypes.INIT_ASSETS})
	dispatch({type: ActionTypes.INIT_INVENCONFIG})
	dispatch({type: ActionTypes.INIT_IUCONFIG})
	dispatch({type: ActionTypes.INIT_CURRENCY})
	dispatch({type: ActionTypes.INIT_JZ})
	dispatch({type: ActionTypes.INIT_QCYE})
	dispatch({type: ActionTypes.INIT_LSQC})
	dispatch({type: ActionTypes.INIT_SECURITY})
	dispatch({type: ActionTypes.INIT_SOBCONFIG})

	// EDIT
	dispatch({type: ActionTypes.INIT_DRAFT})
	dispatch({type: ActionTypes.INIT_LRPZ})

	// mxb
	dispatch({type: ActionTypes.INIT_AMOUNTMXB})
	dispatch({type: ActionTypes.INIT_ASSMXB})
	dispatch({type: ActionTypes.INIT_CURRENCY_MXB})
	dispatch({type: ActionTypes.INIT_MXB})
	dispatch({type: ActionTypes.INIT_LS_MXB})
	dispatch({type: ActionTypes.INIT_ZHMXB})
	dispatch({type: ActionTypes.INIT_WLMXB})
	dispatch({type: ActionTypes.INIT_XMMXB})

	// 报表
	dispatch({type: ActionTypes.INIT_AMBSYB})
	dispatch({type: ActionTypes.INIT_BOSS})
	dispatch({type: ActionTypes.INIT_LRB})
	dispatch({type: ActionTypes.INIT_XJLLB})
	dispatch({type: ActionTypes.INIT_YJSFB})
	dispatch({type: ActionTypes.INIT_ZCFZB})

	// 查询
	dispatch({type: ActionTypes.INIT_CXLS})
	dispatch({type: ActionTypes.INIT_CXPZ})

	// 余额表
	dispatch({type: ActionTypes.INIT_AMOUNTYEB})
	dispatch({type: ActionTypes.INIT_ASSETSYEB})
	dispatch({type: ActionTypes.INIT_ASSKMYEB})
	dispatch({type: ActionTypes.INIT_CURRENCY_YEB})
	dispatch({type: ActionTypes.INIT_KMYEB})
	dispatch({type: ActionTypes.INIT_LSYEB})
	dispatch({type: ActionTypes.INIT_ZHYEB})
	dispatch({type: ActionTypes.INIT_WLYEB})
	dispatch({type: ActionTypes.INIT_XMYEB})

}


export const getPeriodFetch = (issuedate, dispatch, callback) => {
	fetchApi('getperiod', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_PERIOD_FETCH,
				receivedData: json
			})
			const period = json.data

			if (!period.openedyear && !period.closedyear)
				return//history.goBack()

			if (period.openedyear && period.openedmonth)
				issuedate = `${period.openedyear}-${period.openedmonth}`
			else if (period.closedyear && period.closedmonth)
				issuedate = `${period.closedyear}-${period.closedmonth}`

			callback(issuedate)
		}
	})
}

export const everyTableGetPeriod = (json) => dispatch => {

	const issuedate = json.data.periodDtoJson.openedyear + '-' + json.data.periodDtoJson.openedmonth

	const period = {data: json.data.periodDtoJson}

	dispatch({
		type: ActionTypes.GET_PERIOD_FETCH,
		receivedData: period
	})

	return issuedate
}

export const reportGetIssuedateAndFreshPeriod = (json) => dispatch => {

	//  1、从“首页”进入报表：
    // （1）若起始账期早于等于当前账期，默认显示当前账期；
    // （2）若起始账期晚于当期账期，默认显示第一个未结账账期；
    let issuedate
	const firstyear = json.data.periodDtoJson.firstyear
    const firstmonth = json.data.periodDtoJson.firstmonth

	const currentDate = new Date()
	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	if (Number(firstyear) < Number(currentYear)) {   //本年之前
		issuedate = `${currentYear}-${currentMonth >= 10 ? currentMonth : '0'+currentMonth}`
	} else if (Number(firstmonth) <= Number(currentMonth)) {  //本月及之前
		issuedate = `${currentYear}-${currentMonth >= 10 ? currentMonth : '0'+currentMonth}`
	} else {   //本月之后
		const openedyear = json.data.periodDtoJson.openedyear
		const openedmonth = json.data.periodDtoJson.openedmonth
		issuedate = `${openedyear}-${openedmonth}期`
	}

	const period = {data: json.data.periodDtoJson}

	dispatch({
		type: ActionTypes.GET_PERIOD_FETCH,
		receivedData: period
	})

	return issuedate
}

// 余额明细表账期
export const everyTableGetIssuedate = (period) => dispatch => {

	const firstyear = Number(period.firstyear)
	const lastyear = Number(period.lastyear)
	const firstmonth = Number(period.firstmonth)
	const lastmonth = Number(period.lastmonth)
	const openyear = Number(period.openedyear)
	const openmonth = Number(period.openedmonth)
	const issues= []
	// 当前账期大于最后流水账期，起始账期到当前账期；当前账期小于最后流水账期，起始账期到最后流水账期；
	if (openyear > lastyear || openyear == lastyear && openmonth > lastmonth) {
		for (let year = openyear; year >= firstyear; -- year) {
			if (firstyear === 0)
				break
			for (let month = (year === openyear ? openmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month) {
				issues.push({
					value:`${year}-${month < 10 ? '0' + month : month}`,
					key:`${year}年第${month < 10 ? '0' + month : month}期`
				})
			}
		}
	} else {
		for (let year = lastyear; year >= firstyear; -- year) {
			if (firstyear === 0)
			break
			for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month) {
				issues.push({
					value:`${year}-${month < 10 ? '0' + month : month}`,
					key:`${year}年第${month < 10 ? '0' + month : month}期`
				})
			}
		}
	}
	return issues
}

export const allExportDo = (url, option) => (dispatch, getState) => {

	const emplID = getState().homeState.getIn(['data', 'userInfo', 'emplID'])

	// thirdParty.requestOperateAuthCode({
	// 	corpId: sessionStorage.getItem('corpId'),
	// 	agentId: sessionStorage.getItem('agentId'),
	// 	onSuccess: (result) => {

	// 		const code = result.code
	// 		fetchApi(url, 'POST', JSON.stringify({
	// 			code,
	// 			userIdList: [emplID],
	// 			...option
	// 		}), json => {
	// 			// alert('url:'+url+ ';' + JSON.stringify({
	// 			// 	code,
	// 			// 	userIdList: [emplId],
	// 			// 	...option
	// 			// }))
	// 			showMessage(json) && thirdParty.toast.success('打印文件已通过企业消息发送给您，请注意查收')
	// 		})
	// 	},
	// 	onFail: (err) => {
			fetchApi(url, 'POST', JSON.stringify({
				userIdList: [emplID],
				...option
			}), json => {
				showMessage(json) && thirdParty.toast.success('打印文件已通过企业消息发送给您，请注意查收')
			})
	// 	}
	// })
}
// 导航栏右边的按钮设置
// 'mxb', ddPDFCallback, ddExcelCallback, '', allddExcelCallback, 'havePDFAll'
export const navigationSetMenu = (exportType, ddPDFCallback, ddExcelCallback, allddPDFCallback, allddExcelCallback, havePDFAll, ddExcelVcCallback, alllAcDdPDFCallback, pdfSecondAcSub, allPdfExportLedger2, excelExportLedger) => (dispatch, getState) => {

	const homeState = getState().homeState
	const sobInfo = homeState.getIn(['data', 'userInfo','sobInfo'])
	const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 : false
	const isPlay = homeState.getIn(['views', 'isPlay'])
	if (isPlay) {
		thirdParty.setRight({show: false})
		return
	}


	const reportExcelPermission = homeState.getIn(['permissionInfo', 'Report', 'exportExcel', 'permission'])

	if (reportExcelPermission || exportType !== 'config') {
		thirdParty.setMenu({
			backgroundColor : "#ADD8E6",
			textColor : "#ADD8E611",
			items : [
				{
					"id":"1",//字符串
					"iconId":"导出",//字符串，图标命名
					"text":"导出"
				}
				// {
				//     "id":"2",
				// "iconId":"photo",
				//   "text":"dierge"
				// }
			],
			onSuccess: data => {
				if (data.id === '1') {
					if (exportType === 'lrb') {
						dispatch(exportTypeLrb(reportExcelPermission, ddPDFCallback, ddExcelCallback))
					}
					if (exportType === 'kmyeb') {
						dispatch(exportTypeKmyeb(reportExcelPermission, ddPDFCallback, ddExcelCallback, allddPDFCallback))
					}
					if (exportType === 'config') {
						dispatch(exportTypeConfig(ddExcelCallback))
					}
					if (exportType === 'mxb') {
						dispatch(exportTypeMxb(reportExcelPermission, ddPDFCallback, ddExcelCallback, allddPDFCallback, allddExcelCallback, havePDFAll, ddExcelVcCallback, alllAcDdPDFCallback, pdfSecondAcSub, allPdfExportLedger2, excelExportLedger))
					}
					if (exportType === 'PDF-vc') {
						dispatch(exportTypePDFVc(ddPDFCallback,isRunning))
					}
					if (exportType === 'excel-vc')  {
						dispatch(exportTypeExcelVc(ddExcelCallback))
					}
					if (exportType === 'runningReport') {
						dispatch(exportTypeRunningRepor(ddExcelCallback, allddExcelCallback))
					}
					if (exportType === 'config-inventory') {//存货卡片导出
						dispatch(exportTypeConfigInventory(ddPDFCallback, ddExcelCallback))
					}
				}
			},
			onFail: function(err) {
				alert(JSON.stringify(err))
			}
		})
	} else {
		thirdParty.setRight({show: false})
	}
}

// 4种导出的方式
// 导出利润表、资产负债、现金流量表、科目余额表等简单PDF和excel
export const exportTypePDFVc = (ddPDFCallback,isRunning) => dispatch => {

	thirdParty.actionSheet({
		title: "请选择PDF打印纸型",
		cancelButton: '取消',
		otherButtons: ['A4', 'A5', '12*24', '14*24'],
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				const needA4 = {
					'0':'A4',
					'1':'A5',
					'2':'1224',
					'3':'1424'
				}[buttonIndex]
				isNeedCreatedby (needA4,isRunning)
				// if (buttonIndex === 0) {
				// 	const needA4 = 'A4'
				// 	isNeedCreatedby (needA4)
				// } else if (buttonIndex === 1) {
				// 	const needA4 = 'A5'
				// 	isNeedCreatedby (needA4)
				// } else if (buttonIndex === 2) {
				// 	const needA4 = '1224'
				// 	isNeedCreatedby (needA4)
				// } else if (buttonIndex === 3) {
				// 	const needA4 = '1424'
				// 	isNeedCreatedby (needA4)
				// }
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})

	function isNeedCreatedby (needA4,isRunning) {
		thirdParty.actionSheet({
			title: isRunning ? '是否导出制单人' : '是否打印“制单人”、“审核人”名称',
			cancelButton: '取消',
			otherButtons: ['是', '否'],
			onSuccess: (result) => {

				const buttonIndex = result.buttonIndex

				if (buttonIndex == -1) {
					return
				} else if (buttonIndex > -1) {
					if (buttonIndex === 0) {
						const needCreatedby = '1'
						// dispatch(ddPDFCallback(needA4, needCreatedby))
						isRunning?
						isNeedReview(needA4, needCreatedby)
						:
						isNeedAss(needA4, needCreatedby)
					} else if (buttonIndex === 1) {
						const needCreatedby = '0'
						// dispatch(ddPDFCallback(needA4, needCreatedby))
						isRunning?
						isNeedReview(needA4, needCreatedby)
						:
						isNeedAss(needA4, needCreatedby)
					}
				}
			},
			onFail: (err) => {alert(JSON.stringify(err))}
		})
	}

	function isNeedAss (needA4, needCreatedby) {
		thirdParty.actionSheet({
			title: "是否导出辅助核算",
			cancelButton: '取消',
			otherButtons: ['是', '否'],
			onSuccess: (result) => {

				const buttonIndex = result.buttonIndex

				if (buttonIndex == -1) {
					return
				} else if (buttonIndex > -1) {
					if (buttonIndex === 0) {
						const needAss = '1'
						dispatch(ddPDFCallback(needA4, needCreatedby, needAss))
					} else if (buttonIndex === 1) {
						const needAss = '0'
						dispatch(ddPDFCallback(needA4, needCreatedby, needAss))
					}
				}
			},
			onFail: (err) => {alert(JSON.stringify(err))}
		})
	}
	function isNeedReview (needA4, needCreatedby) {
		thirdParty.actionSheet({
			title: "是否导出审核人",
			cancelButton: '取消',
			otherButtons: ['是', '否'],
			onSuccess: (result) => {

				const buttonIndex = result.buttonIndex

				if (buttonIndex == -1) {
					return
				} else if (buttonIndex > -1) {
					if (buttonIndex === 0) {
						const needReviewedBy = '1'
						let appId = ''
						if (ROOTURL.indexOf('mtst.xfannix.com') > -1) {
							appId = Limit.APPID_TEST // '1390'
						} else if (ROOTURL.indexOf('mpre.xfannix.com') > -1) {
							appId = Limit.APPID_PREF // '3837'
						} else if (ROOTURL.indexOf('mobile.xfannix.com') > -1) {
							appId = Limit.APPID_FORM // '1948'
						}

						thirdParty.complexPicker({
							title: '选择审核员',            //标题
							corpId: sessionStorage.getItem('corpId'),   //企业的corpId
							multiple: false,         //是否多选
							limitTips: "超出了",     //超过限定人数返回提示
							maxUsers: 1000,        //最大可选人数
							pickedUsers: [],    //已选用户
							pickedDepartments: [],          //已选部门
							disabledUsers: [],              //不可选用户
							disabledDepartments: [],        //不可选部门
							requiredUsers: [],              //必选用户（不可取消选中状态）
							requiredDepartments: [],        //必选部门（不可取消选中状态）
							appId: appId,                   //微应用的Id
							permissionType: "xxx",          //选人权限，目前只有GLOBAL这个参数
							responseUserOnly: true,        //ture表示返回人，false返回人和部门
							startWithDepartmentId: 0 ,   // 0表示从企业最上层开始，IOS不支持该字段
							onSuccess: (resultlist) => {
								if (resultlist.users.length) {
									dispatch(ddPDFCallback(needA4, needCreatedby, needReviewedBy,resultlist.users[0].name))
								}
							},
							onFail: (err) => {
								// alert(JSON.stringify(err))
							}
						})
						// dispatch(ddPDFCallback(needA4, needCreatedby, needReviewedBy))
					} else if (buttonIndex === 1) {
						dispatch(ddPDFCallback(needA4, needCreatedby, '0'))
					}
				}
			},
			onFail: (err) => {alert(JSON.stringify(err))}
		})
	}
}


export const exportTypeExcelVc = (ddExcelCallback) => dispatch => {
	thirdParty.actionSheet({
		title: "请选择导出文件方式",
		cancelButton: '取消',
		otherButtons: ["Excel导出"],
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) {
					dispatch(ddExcelCallback())
				}
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

export const exportTypeLrb = (reportExcelPermission, ddPDFCallback, ddExcelCallback) => dispatch => {

	const buttonList = reportExcelPermission ? ["PDF导出", "Excel导出"] : ["PDF导出"]

	thirdParty.actionSheet({
		title: "请选择导出文件方式",
		cancelButton: '取消',
		otherButtons: buttonList,
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) {
					dispatch(ddPDFCallback())
				} else if (buttonIndex === 1) {
					dispatch(ddExcelCallback())
				}
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

export const exportTypeKmyeb = (reportExcelPermission, ddPDFCallback, ddExcelCallback, allddPDFCallback) => dispatch => {

	const buttonList = reportExcelPermission ? ["PDF导出", "Excel导出"] : ["PDF导出"]
	const buttonPdfList = ["科目余额表导出", "凭证汇总表导出"]


	thirdParty.actionSheet({
		title: "请选择导出文件方式",
		cancelButton: '取消',
		otherButtons: buttonList,
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) { // PDF导出
					thirdParty.actionSheet({
						title: "请选择导出文件方式",
						cancelButton: '取消',
						otherButtons: buttonPdfList,
						onSuccess: (result) => {
							const buttonIndex = result.buttonIndex
							if (buttonIndex == -1) {
								return
							} else if (buttonIndex > -1) {
								if (buttonIndex === 0) {
									dispatch(ddPDFCallback())
								} else if (buttonIndex === 1) {
									dispatch(allddPDFCallback())
								}
							}
						},
						onFail: (err) => {alert(JSON.stringify(err))}
					})
				} else if (buttonIndex === 1) { // excel导出
					dispatch(ddExcelCallback())
				}
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

export const exportTypeConfig = (ddExcelCallback) => dispatch => {

	const buttonList = ["Excel导出"]

	thirdParty.actionSheet({
		title: "请选择导出文件方式",
		cancelButton: '取消',
		otherButtons: buttonList,
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) {
					dispatch(ddExcelCallback())
				}
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

export const exportTypeRunningRepor = (ddExcelCallback, allddExcelCallback) => dispatch => {

	const buttonList = ["Excel导出当前明细", "Excel导出所有明细"]

	thirdParty.actionSheet({
		title: "请选择导出文件方式",
		cancelButton: '取消',
		otherButtons: buttonList,
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) {
					dispatch(ddExcelCallback())
				}
				if (buttonIndex === 1) {
					dispatch(allddExcelCallback())
				}
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

export const exportTypeMxb = (reportExcelPermission, ddPDFCallback, ddExcelCallback, allddPDFCallback, allddExcelCallback, havePDFAll, ddExcelVcCallback, alllAcDdPDFCallback, pdfSecondAcSub, allPdfExportLedger2, excelExportLedger) => dispatch => {

	const buttonList = havePDFAll ? (reportExcelPermission ? ["PDF导出当前明细", "PDF导出所有明细", havePDFAll, "Excel导出当前明细", "Excel导出所有明细", "Excel导出总账"] : ["PDF导出当前明细", "PDF导出所有明细（一级科目）", havePDFAll]) : (reportExcelPermission ? ["PDF导出当前明细", "Excel导出当前明细", "Excel导出所有明细"] : ["PDF导出当前明细"])

	thirdParty.actionSheet({
		title: "请选择导出文件方式",
		cancelButton: '取消',
		otherButtons: buttonList,
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) {
					dispatch(ddPDFCallback())
				}
				if (havePDFAll) {
					if (buttonIndex === 1) {
						// dispatch(alllAcDdPDFCallback())
						dispatch(firstOrSecondAc('detail', alllAcDdPDFCallback, allddPDFCallback, pdfSecondAcSub, allPdfExportLedger2))
					}
					if (buttonIndex === 2) {
						// dispatch(allddPDFCallback())
						dispatch(firstOrSecondAc('total', alllAcDdPDFCallback, allddPDFCallback, pdfSecondAcSub, allPdfExportLedger2))
					}
					if (buttonIndex === 3) {
						// dispatch(ddExcelCallback())
						dispatch(kmmxbExcelVcOrDetail(ddExcelCallback, ddExcelVcCallback))
					}
					if (buttonIndex === 4) {
						dispatch(allddExcelCallback())
					}
					if (buttonIndex === 5) {
						dispatch(excelExportLedger())
					}
				}
				if (!havePDFAll && reportExcelPermission) {
					if (buttonIndex === 1) {
						dispatch(ddExcelCallback())
					}
					if (buttonIndex === 2) {
						dispatch(allddExcelCallback())
					}
				}
				// excelExportLedger
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

const firstOrSecondAc = (type, alllAcDdPDFCallback, allddPDFCallback, pdfSecondAcSub, allPdfExportLedger2) => dispatch => {
	thirdParty.actionSheet({
		title: "更多导出方式",
		cancelButton: '取消',
		otherButtons: ["一级科目", "二级科目"],
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) {
					if (type === 'detail') { // 所有明细
						dispatch(alllAcDdPDFCallback())
					} else if (type === 'total') { // 总账
						dispatch(allddPDFCallback())
					}
				} else if (buttonIndex === 1){
					if (type === 'detail') { // 所有明细
						dispatch(pdfSecondAcSub())
					} else if (type === 'total') { // 总账
						dispatch(allPdfExportLedger2())
					}
				}
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

const kmmxbExcelVcOrDetail = (ddExcelCallback, ddExcelVcCallback) => dispatch => {
	thirdParty.actionSheet({
		title: "更多导出方式",
		cancelButton: '取消',
		otherButtons: ["分录", "凭证"],
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) {
					dispatch(ddExcelCallback())
				} else if (buttonIndex === 1){
					dispatch(ddExcelVcCallback())
				}
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

// 获取 有辅助核算项目 和 关联了科目 的辅助核算类别
// 调用者： 辅助核算余额表， 辅助核算明细表
export const getDefaultAssCategoryOfAssMxbAndAssYeb = () => (dispatch, getState) => {

	const allState = getState().allState
	const assTags = allState.get('assTags')
	const acasslist = allState.get('acasslist')
	let defaultAssCatagory = ''

	if (acasslist.size > 0) {
		const matchList = acasslist.filter(v => v.get('asslist').size && v.get('aclist').size).map(v => v.get('asscategory'))
		if (matchList.size) {
			for (let i = 0; i < assTags.size; i ++) {
				if (matchList.indexOf(assTags.get(i)) > -1) {
					defaultAssCatagory = assTags.get(i)
					break
				}
			}
		} else {
			defaultAssCatagory = assTags.get(0)
		}
	} else {
		defaultAssCatagory = assTags.get(0)
	}
	return defaultAssCatagory
}

export const changeSystemunitDecimalCount = (value) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('modifyUnitDecimalCount', 'POST', JSON.stringify({unitDecimalCount: value}), json => {
		if (showMessage(json, 'show')) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.CHANGE_SYSTEM_UNIT_DECIMAL_COUNT,
				value
			})
		}
	})
}

export const sendGuideImage = (url) => dispatch => {
    fetchApi('sendGuideImage', 'GET', `imageURL=${url}`, json => {
        if (showMessage(json)) {
            thirdParty.toast.info('打印文件已通过企业消息发送给您，请注意查收')
        }
    })
}

export const exportTypeConfigInventory = (ddPDFCallback, ddExcelCallback) => dispatch => {

	const buttonList = ["存货", "存货期初值"]

	thirdParty.actionSheet({
		title: "请选择导出内容",
		cancelButton: '取消',
		otherButtons: buttonList,
		onSuccess: (result) => {

			const buttonIndex = result.buttonIndex

			if (buttonIndex == -1) {
				return
			} else if (buttonIndex > -1) {
				if (buttonIndex === 0) {
					dispatch(ddPDFCallback())
				}
				if (buttonIndex === 1) {
					dispatch(ddExcelCallback())
				}
			}
		},
		onFail: (err) => {alert(JSON.stringify(err))}
	})
}

export const changeOfflineStatus = () => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_OFFLINE_STATUS,
		bool: true
	})

	setTimeout(() => dispatch({
		type: ActionTypes.CHANGE_OFFLINE_STATUS,
		bool: false
	}), 2000)
}
