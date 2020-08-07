import React, { PropTypes, Fragment } from 'react'
import { Map } from 'immutable'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'

import { Icon, Button, ButtonGroup, Container, Row, Form, ScrollView, TextInput, MonthPicker, SinglePicker, Single, Multiple } from 'app/components'
import ChosenPicker from 'app/components/ChosenPicker'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import './sob-option.less'

import { homeActions } from 'app/redux/Home/home.js'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action'

const { Label, Control, Item } = Form

// function chooseLib(list, callback) {
// 	thirdParty.choose({
// 		startWithDepartmentId: 0,
// 		users: list.map(v => v.get('emplId')).toJS(),
// 		onSuccess: (resultlist) => {
// 			resultlist = resultlist.map(v => {
// 				v.emplId = v.emplId.toString()
// 				const openReview = list.find(w => w.get('emplId') === v.emplId.toString())
// 				v.openReview = openReview ? openReview.get('openReview') : false
// 				return v
// 			})
// 			callback(resultlist)
// 		},
// 		onFail: (err) => {
// 			alert(JSON.stringify(err))
// 		}
// 	})
// }

// function chooseReviewLib(list, callback) {
// 	thirdParty.choose({
// 		startWithDepartmentId: 0,
// 		users: list.map(v => v.get('emplId')).toJS(),
// 		onSuccess: (resultlist) => {
// 			resultlist = resultlist.map(v => {
// 				v.emplId = v.emplId.toString()
// 				// const openReview = list.find(w => w.get('emplId') === v.emplId.toString())
// 				// v.openReview = openReview ? openReview.get('openReview') : false
// 				v.openReview = true
// 				return v
// 			})
// 			callback(resultlist)
// 		},
// 		onFail: (err) => {
// 			alert(JSON.stringify(err))
// 		}
// 	})
// }

function chooseComplexPicker(list, title, callback) {

	if (global.isplayground)
		return

	let appId = ''
	if (ROOTURL.indexOf('mtst.xfannix.com') > -1) {
		appId = Limit.APPID_TEST // '1390'
	} else if (ROOTURL.indexOf('mpre.xfannix.com') > -1) {
		appId = Limit.APPID_PREF // '3837'
	} else if (ROOTURL.indexOf('mobile.xfannix.com') > -1) {
		appId = Limit.APPID_FORM // '1948'
	}

	thirdParty.complexPicker({
		title: title,            //标题
		corpId: sessionStorage.getItem('corpId'),   //企业的corpId
		multiple: true,         //是否多选
		limitTips: "超出了",     //超过限定人数返回提示
		maxUsers: 1000,        //最大可选人数
		pickedUsers: list.map(v => v.get('emplId')).toJS(),    //已选用户
		pickedDepartments: [],          //已选部门
		disabledUsers: [],              //不可选用户
		disabledDepartments: [],        //不可选部门
		requiredUsers: [],              //必选用户（不可取消选中状态）
		requiredDepartments: [],        //必选部门（不可取消选中状态）
		appId: appId,                   //微应用的Id
		permissionType: "xxx",          //选人权限，目前只有GLOBAL这个参数
		responseUserOnly: true,        //ture表示返回人，false返回人和部门
		startWithDepartmentId: 0,   // 0表示从企业最上层开始，IOS不支持该字段
		onSuccess: (resultlist) => {
			resultlist = resultlist.users.map(v => {
				v.emplId = v.emplId.toString()
				// const openReview = list.find(w => w.get('emplId') === v.emplId.toString())
				// v.openReview = openReview ? openReview.get('openReview') : false
				return v
			})
			callback(resultlist)
		},
		onFail: (err) => {
			// alert(JSON.stringify(err))
		}
	})
}
//定义月份
const periodSourceModelList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
@connect(state => state)
export default
	class SobOption extends React.Component {

	constructor(props) {
		super(props)

		const selectedSob = this.props.sobConfigState.get('tempSob')
		const sobid = selectedSob.get('sobid')
		const moduleInfo = selectedSob.get('moduleInfo')

		const RUNNING = moduleInfo.get('RUNNING')

		// 如果权益到期记录原来是否开启
		let oldScxmBeOpen = false
		let oldSgxmBeOpen = false
		let oldQuantityBeOpen = false
		let oldWarehouseBeOpen = false
		let oldProcessBeOpen = false
		let oldAmbBeOpen = false
		let oldAssistBeOpen = false
		let oldSerialBeOpen = false
		let oldBatchBeOpen = false

		if (sobid) {
			if (RUNNING && RUNNING.get('beOpen')) {
				oldScxmBeOpen = moduleInfo.get('SCXM') ? moduleInfo.getIn(['SCXM', 'beOpen']) : false
				oldSgxmBeOpen = moduleInfo.get('SGXM') ? moduleInfo.getIn(['SGXM', 'beOpen']) : false
				oldQuantityBeOpen = moduleInfo.get('QUANTITY') ? moduleInfo.getIn(['QUANTITY', 'beOpen']) : false
				oldWarehouseBeOpen = moduleInfo.get('WAREHOUSE') ? moduleInfo.getIn(['WAREHOUSE', 'beOpen']) : false
				oldProcessBeOpen = moduleInfo.get('PROCESS') ? moduleInfo.getIn(['PROCESS', 'beOpen']) : false
				oldSerialBeOpen = moduleInfo.get('SERIAL') ? moduleInfo.getIn(['SERIAL', 'beOpen']) : false
				oldAssistBeOpen = moduleInfo.get('ASSIST') ? moduleInfo.getIn(['ASSIST', 'beOpen']) : false
				oldBatchBeOpen = moduleInfo.get('BATCH') ? moduleInfo.getIn(['BATCH', 'beOpen']) : false
			} else {
				oldAmbBeOpen = moduleInfo.get('AMB') ? moduleInfo.getIn(['AMB', 'beOpen']) : false
			}
		}
				
		this.state = {
			showRoleList: false,
			gettedIdentifyingCodeList: false,
			oldScxmBeOpen,
			oldSgxmBeOpen,
			oldQuantityBeOpen,
			oldWarehouseBeOpen,
			oldProcessBeOpen,
			oldAmbBeOpen,
			oldAssistBeOpen,
			oldSerialBeOpen,
			oldBatchBeOpen,
		}
	}

	componentDidMount() {
		if (this.props.sobConfigState.get('sobConfigMode') === 'insert') {
			thirdParty.setTitle({
				title: '新增账套'
			})
		} else if (this.props.sobConfigState.get('sobConfigMode') === 'modify') {
			thirdParty.setTitle({
				title: '编辑账套'
			})
		}
		thirdParty.setRight({ show: false })

		this.props.dispatch(homeActions.setDdConfig())
	}
	
	render() {
		const {
			sobConfigState,
			allState,
			dispatch,
			homeState,
			history
		} = this.props
		const {
			showRoleList,
			gettedIdentifyingCodeList,
			oldScxmBeOpen,
			oldSgxmBeOpen,
			oldQuantityBeOpen,
			oldWarehouseBeOpen,
			oldProcessBeOpen,
			oldAmbBeOpen,
			oldAssistBeOpen,
			oldSerialBeOpen,
			oldBatchBeOpen } = this.state

		const sobConfigMode = sobConfigState.get('sobConfigMode')
		const sobSelectedIndex = sobConfigState.get('sobSelectedIndex')
		const currencyModelList = allState.get('currencyModelList')

		const selectedSob = sobConfigState.get('tempSob')
		const template = selectedSob.get('template') || '0'
		const sobname = selectedSob.get('sobname')
		const sobid = selectedSob.get('sobid')
		const firstyear = selectedSob.get('firstyear')
		const firstmonth = selectedSob.get('firstmonth')
		let moduleInfo = selectedSob.get('moduleInfo')
		const running = moduleInfo.get('RUNNING')
		const gl = moduleInfo.get('GL')
		const currency = moduleInfo.get('CURRENCY')		
		const adminlist = selectedSob.get('adminlist')
		const observerlist = selectedSob.get('observerlist')
		const operatorlist = selectedSob.get('operatorlist')
		const vcObserverList = selectedSob.get('vcObserverList')//凭证观察员
		const cashierList = selectedSob.get('cashierList')//出纳员
		const flowObserverList = selectedSob.get('flowObserverList')//流水观察员
		const reviewList = selectedSob.get('reviewList')//账套审核员
		const vcReviewList = selectedSob.get('vcReviewList')//凭证审核员
		const flowReviewList = selectedSob.get('flowReviewList')//流水审核员
		const jrModelList = selectedSob.get('jrModelList')//智能版流水账套模版
		const sobModel = selectedSob.get('sobModel')//选中的智能版流水账套模版
		const currencyTem = selectedSob.get('currency')//选中的智能版流水账套模版
		const customizeList = selectedSob.get('customizeList')//选中的智能版流水账套模版
		const moduleMap = selectedSob.get('moduleMap')//复制账套判断用，只读
		const accountModelList = selectedSob.get('accountModelList')

		const isAdmin = homeState.getIn(['data', 'userInfo', 'isAdmin'])
		const isFinance = homeState.getIn(['data', 'userInfo', 'isFinance'])
		const isDdAdmin = homeState.getIn(['data', 'userInfo', 'isDdAdmin'])
		const isDdPriAdmin = homeState.getIn(['data', 'userInfo', 'isDdPriAdmin'])
		const emplID = homeState.getIn(['data', 'userInfo', 'emplID'])

		const isloading = allState.get('isloading')

		// const adminName = adminlist.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''
		// const operatorName = operatorlist.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''
		// const cashierListName = cashierList.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''
		// const observerName = observerlist.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''
		// const vcObserverName = vcObserverList.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''
		// const flowObserverName = flowObserverList.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''
		// const reviewListName = reviewList.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''
		// const vcReviewListName = vcReviewList.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''
		// const flowReviewListName = flowReviewList.reduce((p, v, i) => i == 0 ? v.get('name') : [p, v.get('name')].join('、'), '') || ''


		const source = [] // 会计版可选模版
		accountModelList.forEach(v => {
			source.push({
				key: v.get('modelName'),
				value:  v.get('modelNumber'),
			})
		})
		//会计年度月   
		const periodStartMonth = selectedSob.get('periodStartMonth')
		//遍历01，02，03，04月份
		const periodSource = []
		periodSourceModelList.forEach(v=>{
			periodSource.push({
				key: `每年${Number(v)}月起始`,
				value:v,
			})
		})

		let jrModelSource = []
		jrModelList.forEach(v => {
			if (v.get('modelId')) {
				jrModelSource.push({
					key: v.get('modelId'),
					label: v.get('modelName'),
					childList: []
				})
			} else { // 自定义
				let childList = []
				customizeList.forEach(v => childList.push({
					key: v.get('sobId'),
					label: v.get('sobName'),
					childList: []
				}))
				jrModelSource.push({
					key: v.get('modelId'),
					label: v.get('modelName'),
					childList: childList
				})
			}
		})
		jrModelSource.push({
			key: '识别码复制',
			label: '识别码复制',
			childList: []
		})

		const templateTypeZN = ['3']
		let templateTypeKJ = [] // 不是游乐场时是 ['4', '5']
		if (sobid) { // 编辑时
			templateTypeKJ = ['4', '5']
		} else { // 新增时
			accountModelList.forEach(v => {
				templateTypeKJ.push(v.get('modelNumber'))
			})
		}
		
		const smartRoleInfo = selectedSob.get('smartRoleInfo')
		const accountingRoleInfo = selectedSob.get('accountingRoleInfo')
		const sobType = templateTypeZN.indexOf(template) > -1 ? 'SMART' : 'ACCOUNTING'
		const roleList = sobType === 'SMART' ? smartRoleInfo : accountingRoleInfo
		const listName = sobType === 'SMART' ? 'smartRoleInfo' : 'accountingRoleInfo' 

		const isModuleDisabled = (modelName) => {

			// moduleInfo.getIn(['SCXM', 'beOverdue']) ? true : (sobid ? false : (sobModel && sobModel.get('newJr') === true ? (moduleMap && moduleMap.get('SCXM') ? moduleMap.getIn(['SCXM', 'beOpen']) : false) : false))
			if (sobid) { // 修改
				if (moduleInfo.getIn([modelName, 'beOverdue'])) {
					
					if (modelName == 'SCXM') {
						return !oldScxmBeOpen
					}
					if (modelName == 'SGXM') {
						return !oldSgxmBeOpen
					}
					if (modelName == 'QUANTITY') {
						return !oldQuantityBeOpen
					}
					if (modelName == 'ASSIST') {
						return !oldAssistBeOpen
					}
					if (modelName == 'SERIAL') {
						return !oldSerialBeOpen
					}
					if (modelName == 'BATCH') {
						return !oldBatchBeOpen
					}
					if (modelName == 'WAREHOUSE') {
						return !oldWarehouseBeOpen
					}
					if (modelName == 'PROCESS') {
						return !oldProcessBeOpen
					}
				}
			} else { // 新增
				if (moduleInfo.getIn([modelName, 'beOverdue'])) {
					return true
				} else {
					return (sobModel && sobModel.get('newJr') === true ? (moduleMap && moduleMap.get(modelName) ? moduleMap.getIn([modelName, 'beOpen']) : false) : false)
				}
			}
		}

		const optionModal = []
		const selectModalList = []
		const selectModalvalue = []
		if (templateTypeZN.indexOf(template) > -1) {
			if (moduleInfo.get('RUNNING_GL') && moduleInfo.getIn(['RUNNING_GL', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['RUNNING_GL', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['RUNNING_GL', 'moduleCode']))

			}
			if (moduleInfo.get('RUNNING_GL')) {
				selectModalList.push({
					key: moduleInfo.getIn(['RUNNING_GL', 'moduleName']),
					value: moduleInfo.getIn(['RUNNING_GL', 'moduleCode'])
				})
			}
			if (moduleInfo.get('PROCESS') && moduleInfo.getIn(['PROCESS', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['PROCESS', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['PROCESS', 'moduleCode']))

			}
			if (moduleInfo.get('PROCESS')) {
				selectModalList.push({
					key: moduleInfo.getIn(['PROCESS', 'moduleName']),
					value: moduleInfo.getIn(['PROCESS', 'moduleCode']),
					// disabled: sobid ? (moduleInfo.getIn(['PROCESS', 'beOverdue']) ? !oldProcessBeOpen : false) : (moduleInfo.getIn(['PROCESS', 'beOverdue']) ? true : false)
					disabled: isModuleDisabled('PROCESS')
				})
			}
			if (moduleInfo.get('PROJECT') && moduleInfo.getIn(['PROJECT', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['PROJECT', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['PROJECT', 'moduleCode']))

			}
			if (moduleInfo.get('PROJECT')) {
				selectModalList.push({
					key: moduleInfo.getIn(['PROJECT', 'moduleName']),
					value: moduleInfo.getIn(['PROJECT', 'moduleCode']),
					disabled: sobid ? false : (sobModel && sobModel.get('newJr') === true ? (moduleMap && moduleMap.get('PROJECT') ? moduleMap.getIn(['PROJECT', 'beOpen']) : false) : true)
				})
			}
			if (moduleInfo.get('SCXM') && moduleInfo.getIn(['SCXM', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['SCXM', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['SCXM', 'moduleCode']))

			}
			if (moduleInfo.get('SCXM')) {
				selectModalList.push({
					key: moduleInfo.getIn(['SCXM', 'moduleName']),
					value: moduleInfo.getIn(['SCXM', 'moduleCode']),
					disabled: isModuleDisabled('SCXM')
				})
			}
			if (moduleInfo.get('SGXM') && moduleInfo.getIn(['SGXM', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['SGXM', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['SGXM', 'moduleCode']))

			}
			if (moduleInfo.get('SGXM')) {
				selectModalList.push({
					key: moduleInfo.getIn(['SGXM', 'moduleName']),
					value: moduleInfo.getIn(['SGXM', 'moduleCode']),
					disabled: isModuleDisabled('SGXM')
				})
			}
			if (moduleInfo.get('INVENTORY') && moduleInfo.getIn(['INVENTORY', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['INVENTORY', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['INVENTORY', 'moduleCode']))

			}
			if (moduleInfo.get('INVENTORY')) {
				selectModalList.push({
					key: moduleInfo.getIn(['INVENTORY', 'moduleName']),
					value: moduleInfo.getIn(['INVENTORY', 'moduleCode']),
					disabled: sobid ? false : (sobModel && sobModel.get('newJr') === true ? (moduleMap && moduleMap.get('INVENTORY') ? moduleMap.getIn(['INVENTORY', 'beOpen']) : false) : true)
				})
			}
			if (moduleInfo.get('WAREHOUSE') && moduleInfo.getIn(['WAREHOUSE', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['WAREHOUSE', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['WAREHOUSE', 'moduleCode']))

			}
			if (moduleInfo.get('WAREHOUSE')) {
				selectModalList.push({
					key: moduleInfo.getIn(['WAREHOUSE', 'moduleName']),
					value: moduleInfo.getIn(['WAREHOUSE', 'moduleCode']),
					// disabled: moduleInfo.getIn(['WAREHOUSE', 'beOverdue']) ? true : (sobid ? false : (sobModel && sobModel.get('newJr') === true ? (moduleMap && moduleMap.get('WAREHOUSE') ? moduleMap.getIn(['WAREHOUSE', 'beOpen']) : false) : false))
					disabled: isModuleDisabled('WAREHOUSE')
				})
			}
			if (moduleInfo.get('QUANTITY') && moduleInfo.getIn(['QUANTITY', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['QUANTITY', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['QUANTITY', 'moduleCode']))
			}
			if (moduleInfo.get('QUANTITY')) {
				selectModalList.push({
					key: moduleInfo.getIn(['QUANTITY', 'moduleName']),
					value: moduleInfo.getIn(['QUANTITY', 'moduleCode']),
					// disabled: moduleInfo.getIn(['QUANTITY', 'beOverdue']) ? true :  (sobid ? false : (sobModel && sobModel.get('newJr') === true ? (moduleMap && moduleMap.get('QUANTITY') ? moduleMap.getIn(['QUANTITY', 'beOpen']) : false) : false))
					disabled: isModuleDisabled('QUANTITY')
				})
			}
			if (moduleInfo.get('ASSIST') && moduleInfo.getIn(['ASSIST', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['ASSIST', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['ASSIST', 'moduleCode']))
			}
			if (moduleInfo.get('ASSIST')) {
				selectModalList.push({
					key: moduleInfo.getIn(['ASSIST', 'moduleName']),
					value: moduleInfo.getIn(['ASSIST', 'moduleCode']),
					disabled: isModuleDisabled('ASSIST')
				})
			}
			if (moduleInfo.get('SERIAL') && moduleInfo.getIn(['SERIAL', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['SERIAL', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['SERIAL', 'moduleCode']))
			}
			if (moduleInfo.get('SERIAL')) {
				selectModalList.push({
					key: moduleInfo.getIn(['SERIAL', 'moduleName']),
					value: moduleInfo.getIn(['SERIAL', 'moduleCode']),
					disabled: isModuleDisabled('SERIAL')
				})
			}
			if (moduleInfo.get('BATCH') && moduleInfo.getIn(['BATCH', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['BATCH', 'moduleName'])) // 
				selectModalvalue.push(moduleInfo.getIn(['BATCH', 'moduleCode']))
			}
			if (moduleInfo.get('BATCH')) {
				selectModalList.push({
					key: moduleInfo.getIn(['BATCH', 'moduleName']),
					value: moduleInfo.getIn(['BATCH', 'moduleCode']),
					disabled: isModuleDisabled('BATCH')
				})
			}
		} else {
			if (moduleInfo.get('ASSETS') && moduleInfo.getIn(['ASSETS', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['ASSETS', 'moduleName']))
				selectModalvalue.push(moduleInfo.getIn(['ASSETS', 'moduleCode']))
			}
			if (moduleInfo.get('ASSETS')) {
				selectModalList.push({
					key: moduleInfo.getIn(['ASSETS', 'moduleName']),
					value: moduleInfo.getIn(['ASSETS', 'moduleCode'])
				})
			}
			if (moduleInfo.get('CURRENCY') && moduleInfo.getIn(['CURRENCY', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['CURRENCY', 'moduleName']))
				selectModalvalue.push(moduleInfo.getIn(['CURRENCY', 'moduleCode']))
			}
			if (moduleInfo.get('CURRENCY')) {
				selectModalList.push({
					key: moduleInfo.getIn(['CURRENCY', 'moduleName']),
					value: moduleInfo.getIn(['CURRENCY', 'moduleCode'])
				})
			}
			if (moduleInfo.get('ASS') && moduleInfo.getIn(['ASS', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['ASS', 'moduleName']))
				selectModalvalue.push(moduleInfo.getIn(['ASS', 'moduleCode']))
			}
			if (moduleInfo.get('ASS')) {
				selectModalList.push({
					key: moduleInfo.getIn(['ASS', 'moduleName']),
					value: moduleInfo.getIn(['ASS', 'moduleCode'])
				})
			}
			if (moduleInfo.get('AMB') && moduleInfo.getIn(['AMB', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['AMB', 'moduleName']))
				selectModalvalue.push(moduleInfo.getIn(['AMB', 'moduleCode']))
			}
			if (moduleInfo.get('AMB')) {
				selectModalList.push({
					key: moduleInfo.getIn(['AMB', 'moduleName']),
					value: moduleInfo.getIn(['AMB', 'moduleCode']),
					disabled: sobid ? (moduleInfo.getIn(['AMB', 'beOverdue']) ? !oldAmbBeOpen : false) : (moduleInfo.getIn(['AMB', 'beOverdue']) ? true : false)
				})
			}
			if (moduleInfo.get('NUMBER') && moduleInfo.getIn(['NUMBER', 'beOpen'])) {
				optionModal.push(moduleInfo.getIn(['NUMBER', 'moduleName']))
				selectModalvalue.push(moduleInfo.getIn(['NUMBER', 'moduleCode']))
			}
			if (moduleInfo.get('NUMBER')) {
				selectModalList.push({
					key: moduleInfo.getIn(['NUMBER', 'moduleName']),
					value: moduleInfo.getIn(['NUMBER', 'moduleCode'])
				})
			}
		}


		// 是否是体验模式
		const isPlay = homeState.getIn(['views', 'isPlay'])

		let sourceList = []
		currencyModelList.forEach(v => {
			sourceList.push({
				key: v.get('name'),
				value: v.get('fcNumber')
			})
		})

		const showMoreStyle = { display: sobid ? '' : (showRoleList ? '' : 'none') }
		const prefix = `  - `

		return (
			<Container className="sob-option">
				<ScrollView flex="1">
					<ul className="sob-option-sob-type">
						{
							(sobid ? templateTypeZN.indexOf(template) > -1 : running) ?
								<li
									className={templateTypeZN.indexOf(template) > -1 ? 'sob-option-sob-type-current' : ''}
									onClick={() => {
										if (templateTypeZN.indexOf(template) === -1) {
											dispatch(sobConfigActions.changeSobTemplate('3'))
										}
									}}
								>
									智能版
							</li> : ''
						}
						{
							(sobid ? templateTypeKJ.indexOf(template) > -1 : gl) ?
								<li
									className={templateTypeKJ.indexOf(template) > -1 ? 'sob-option-sob-type-current' : ''}
									onClick={() => {
										if (templateTypeKJ.indexOf(template) === -1) {
											dispatch(sobConfigActions.changeSobTemplate(templateTypeKJ[0]))
										}
									}}
								>
									会计版
							</li> : ''
						}
					</ul>
					{
						templateTypeZN.indexOf(template) > -1 ?
							<div className="sob-option-title-tip">
								<p>专为0基础财务打造，老板、出纳均可使用。</p>
								<p>场景化录入流水，精准输出专业报表</p>
							</div> :
							<div className="sob-option-title-tip">
								<p>专为财务老鸟打造，专业凭证录入模式，</p>
								<p>支持选配辅助核算、外币、资产等模板。</p>
							</div>
					}
					<ul className="sob-option-input-wrap">
						<li className="sob-option-input">
							<span className="sob-option-input-lable">
								<span className="sob-option-input-label sob-option-input-label-main">账套名称</span>
								<span style={{ color: '#d10000' }}>*</span>
							</span>
							<TextInput
								className="sob-option-input-input"
								value={sobname}
								placeholder="请输入账套名称"
								onChange={value => dispatch(sobConfigActions.changeSobName(value))}
							/>
							<Icon className="icon" type="arrow-right" size='12' />
						</li>
						<li className='sob-option-input sob-option-input-month'>
							<span className="sob-option-input-lable">
								<span className="sob-option-input-label sob-option-input-label-main">起始账期</span>
								<span style={{ color: '#d10000' }}>*</span>
							</span>
							<MonthPicker
								format={'YYYY_MM'}
								onChange={value => {
									const first = new DateLib(value)
									dispatch(sobConfigActions.changeSobFirstYearMonth(first.getYear(), first.getMonth()))
								}}
							>
								<div className={firstyear ? "sob-option-month-picker-wrap" : "sob-option-month-picker-wrap sob-option-month-picker-wrap-placeholder"}>
									{firstyear ? `${firstyear}年${firstmonth}月` : '请选择日期'}
								</div>
							</MonthPicker>
							<Icon className="icon" type="arrow-right" size='12' />
						</li>
						
						{
							templateTypeKJ.indexOf(template) > -1 && !sobid ?  // 会计版选模版
								<li className="sob-option-input">
									<span className="sob-option-input-lable">
										<span className="sob-option-input-label sob-option-input-label-main">账套模版</span>
										<span style={{ color: '#d10000' }}>*</span>
									</span>
									<SinglePicker
										className="sob-option-input-singlepicker"
										district={source}
										onOk={(result) => {
											const sobItem = accountModelList.find(v => v.get('modelNumber') === result.value)
											dispatch(sobConfigActions.changeZNSobModel(sobItem)) // 不仅用在智能版了
											dispatch(sobConfigActions.changeSobTemplate(result.value))
										}}
									>
										<span className="sob-option-input-singlepicker-inner">{source.find(v => v.value === template).key}</span>
									</SinglePicker>
									<Icon className="icon" type="arrow-right" size='12' />
								</li> : ''
						}
						{
							templateTypeZN.indexOf(template) > -1 && !sobid ?  // 智能版选模版
								<li className="sob-option-input">
									<span className="sob-option-input-lable">
										<span className="sob-option-input-label sob-option-input-label-main">账套模版</span>
										<span style={{ color: '#d10000' }}>*</span>
									</span>
									<ChosenPicker
										className="sob-option-input-singlepicker"
										parentDisabled={true}
										onChange={value => {

											if (value.key === '识别码复制') {
												if (!gettedIdentifyingCodeList) {
													this.setState({gettedIdentifyingCodeList: true})
													dispatch(sobConfigActions.getIdentifyingCodeList())
												}
												dispatch(sobConfigActions.initIdentifyingCodeTemp())
												history.push('/config/sob/copymodule')
												return
											}

											const firstLeve = jrModelList.find(v => v.get('modelId') === value.key)
											if (firstLeve) { // 选择的模版而不是复制
												const sobItem = jrModelList.find(v => v.get('modelId') === value.key)
												dispatch(sobConfigActions.changeZNSobModel(sobItem))
												if (sobItem.get('newJr') === true) {
													if (sobItem.getIn(['moduleMap', 'INVENTORY'])) {
														moduleInfo = moduleInfo.setIn(['INVENTORY', 'beOpen'], sobItem.getIn(['moduleMap', 'INVENTORY', 'beOpen']))
													}
													if (sobItem.getIn(['moduleMap', 'PROJECT'])) {
														moduleInfo = moduleInfo.setIn(['PROJECT', 'beOpen'], sobItem.getIn(['moduleMap', 'PROJECT', 'beOpen']))
													}
													if (sobItem.getIn(['moduleMap', 'QUANTITY']) && !moduleInfo.getIn(['QUANTITY', 'beOverdue'])) {
														moduleInfo = moduleInfo.setIn(['QUANTITY', 'beOpen'], sobItem.getIn(['moduleMap', 'QUANTITY', 'beOpen']))
													}
													if (sobItem.getIn(['moduleMap', 'ASSIST']) && !moduleInfo.getIn(['ASSIST', 'beOverdue'])) {
														moduleInfo = moduleInfo.setIn(['ASSIST', 'beOpen'], sobItem.getIn(['moduleMap', 'ASSIST', 'beOpen']))
													}
													if (sobItem.getIn(['moduleMap', 'SERIAL']) && !moduleInfo.getIn(['SERIAL', 'beOverdue'])) {
														moduleInfo = moduleInfo.setIn(['SERIAL', 'beOpen'], sobItem.getIn(['moduleMap', 'SERIAL', 'beOpen']))
													}
													if (sobItem.getIn(['moduleMap', 'BATCH']) && !moduleInfo.getIn(['BATCH', 'beOverdue'])) {
														moduleInfo = moduleInfo.setIn(['BATCH', 'beOpen'], sobItem.getIn(['moduleMap', 'BATCH', 'beOpen']))
													}
													if (sobItem.getIn(['moduleMap', 'WAREHOUSE']) && !moduleInfo.getIn(['WAREHOUSE', 'beOverdue'])) {
														moduleInfo = moduleInfo.setIn(['WAREHOUSE', 'beOpen'], sobItem.getIn(['moduleMap', 'WAREHOUSE', 'beOpen']))
													}
													if (sobItem.getIn(['moduleMap', 'SCXM']) && !moduleInfo.getIn(['SCXM', 'beOverdue'])) {
														moduleInfo = moduleInfo.setIn(['SCXM', 'beOpen'], sobItem.getIn(['moduleMap', 'SCXM', 'beOpen']))
													}
													if (sobItem.getIn(['moduleMap', 'SGXM']) && !moduleInfo.getIn(['SGXM', 'beOverdue'])) {
														moduleInfo = moduleInfo.setIn(['SGXM', 'beOpen'], sobItem.getIn(['moduleMap', 'SGXM', 'beOpen']))
													}
	
													dispatch(sobConfigActions.sobOptionChangeContent('moduleInfo', moduleInfo))
													dispatch(sobConfigActions.sobOptionChangeContent('moduleMap', sobItem.get('moduleMap')))
												} else {
													const newItem = moduleInfo.setIn(['INVENTORY', 'beOpen'], true).setIn(['PROJECT', 'beOpen'], true)
													dispatch(sobConfigActions.sobOptionChangeContent('moduleInfo', newItem))
													dispatch(sobConfigActions.sobOptionChangeContent('moduleMap', newItem))
												}
											} else { // 复制账套
												const customizeItem = customizeList.find(v => v.get('sobId') === value.key)
												dispatch(sobConfigActions.setSobChangeCopyModuleItem(customizeItem, value.key, false))
												history.push('/config/sob/copymodule')
											}
										}}
										district={jrModelSource}
									>
										<span className={sobModel ? "sob-option-input-single-inner" : "sob-option-input-single-inner sob-option-month-picker-wrap-placeholder"}>
											{/* {sobModel ? sobModel.get('modelName') : '请选择'} */}
											{sobModel ? sobModel.get('customize') === true ? `${sobModel.get('sobName')} (起始账期:${sobModel.get('firstYear')}年${sobModel.get('firstMonth')}月)` : (sobModel.get('modelName') ? sobModel.get('modelName') : sobModel.get('sobName')) : '请选择'}
										</span>
									</ChosenPicker>
									<Icon className="icon" type="arrow-right" size='12' />
								</li> : ''
						}
						{
							templateTypeKJ.indexOf(template) > -1  ? 
							<li className="sob-option-input">
								<span className="sob-option-input-lable">
									<span className="sob-option-input-label sob-option-input-label-main">会计年度</span>
									<span style={{ color: '#d10000' }}>*</span>
								</span>
								<Single
									className="sob-option-input-singlepicker"
									district={periodSource}
									onOk={value =>dispatch(sobConfigActions.sobOptionChangeContent('periodStartMonth', value.value))}
								>
									<span className="sob-option-input-single-inner">{periodSource.find(item=> item.value === periodStartMonth).key}</span>  
								</Single>
								<Icon className="icon" type="arrow-right" size='12' />
							</li>:''
						}
						{
							templateTypeKJ.indexOf(template) > -1 && (currency && currency.get('beOpen')) ?  // 会计版选模版
							<li className="sob-option-input">
								<span className="sob-option-input-lable">
									<span className="sob-option-input-label sob-option-input-label-main">本位币</span>
									<span style={{ color: '#d10000' }}>*</span>
								</span>
								<Single
									className='sob-option-input-singlepicker'
									district={sourceList}
									value={currencyTem ? (currencyModelList.find(v => v.get('fcNumber') == currencyTem) ? currencyModelList.find(v => v.get('fcNumber') == currencyTem).get('name') : '') : '人民币'}
									onOk={value => {
										dispatch(sobConfigActions.changeSobCurrencyModel(value.value))
									}}
								>
									<span className="sob-option-input-single-inner">
										{currencyTem ? (currencyModelList.find(v => v.get('fcNumber') == currencyTem) ? currencyModelList.find(v => v.get('fcNumber') == currencyTem).get('name') : '') : '人民币'}
									</span>
								</Single>
								<Icon className="icon" type="arrow-right" size='12' />
							</li> : ''
						}
						<Multiple
							district={selectModalList}
							value={selectModalvalue}
							title={'功能模块'}
							// className={'config-form-item-auto-heigth-row'}
							onOk={(value) => {
								const valueArr = value.map(v => v.value)
								dispatch(sobConfigActions.sobOptionChangeFunMultipleModuel(valueArr, selectModalList))
							}}
						>
							<li className='sob-option-input'>
								<span className="sob-option-input-lable">
									<span className="sob-option-input-label sob-option-input-label-main">功能模块</span>
								</span>
								<div className='sob-option-input-fun'>
									<span className="sob-option-input-fun-detail">
										{optionModal.map((v, i) => {
											return <span key={i}>{optionModal.length - 1 == i ? v : v + '、'}</span>
										})}
									</span>
									<Icon className="icon" type="arrow-right" size='12' />
								</div>
							</li>
						</Multiple>

						<li className='sob-option-input' style={{ background: showRoleList ? '#fbfbfb' : '#fff' }} onClick={() => this.setState({ showRoleList: !showRoleList })}>
							<span className="sob-option-input-lable">
								<span className="sob-option-input-label sob-option-input-label-main">角色权限</span>
							</span>
							<div className='sob-option-input-fun'></div>
							<Icon type="arrow-down" size='12' />
						</li>
						{
							roleList.map((v, i) => {
								return (
									<li className='sob-option-input' style={showMoreStyle}>
										<span className="sob-option-input-lable">
											<span className="sob-option-input-label">{prefix}{v.get('roleName')}</span>
										</span>
										<div
											className='sob-option-input-fun'
											onClick={() => {
												chooseComplexPicker(v.get('userList'), `选择${v.get('roleName')}`, (resultlist) => {
													dispatch(sobConfigActions.changeSobPermissionList(listName, i, resultlist))
												})
											}}
										>
											<div className='sob-option-input-fun-role'>
												{
													v.get('userList').size ?
														<span className="sob-option-input-fun-role-list"><span>{v.get('userList').map(w => w.get('name')).join('、')}</span></span> :
														<span className="sob-option-input-fun-role-placeholder"></span>
												}
											</div>
											<Icon className="icon" type="arrow-right" size='12' />
										</div>
									</li>
								)
							})
						}
						{/* <li className='sob-option-input' style={showMoreStyle}>
							<span className="sob-option-input-lable">
								<span className="sob-option-input-label">{prefix}账套管理员</span>
							</span>
							<div
								className='sob-option-input-fun'
								onClick={() => {
									chooseComplexPicker(adminlist, '选择账套管理员', (resultlist) => {
										dispatch(sobConfigActions.changeSobPermissionList('adminlist', resultlist))
									})
								}}
							>
								<div className='sob-option-input-fun-role'>
									{
										adminName ?
											<span className="sob-option-input-fun-role-list"><span>{adminName}</span></span> :
											<span className="sob-option-input-fun-role-placeholder"></span>
									}
								</div>
								<Icon className="icon" type="arrow-right" size='12' />
							</div>
						</li>
						<li className='sob-option-input' style={showMoreStyle}>
							<span className="sob-option-input-lable">
								<span className="sob-option-input-label">{prefix}账套审核员</span>
							</span>
							<div
								className='sob-option-input-fun'
								onClick={() => {
									chooseComplexPicker(reviewList, '选择账套审核员', (resultlist) => {
										dispatch(sobConfigActions.changeSobPermissionList('reviewList', resultlist))
									})
								}}
							>
								<div className='sob-option-input-fun-role'>
									{
										reviewListName ?
											<span className="sob-option-input-fun-role-list"><span>{reviewListName}</span></span> :
											<span className="sob-option-input-fun-role-placeholder"></span>
									}
								</div>
								<Icon className="icon" type="arrow-right" size='12' />
							</div>
						</li>
						<li className='sob-option-input' style={showMoreStyle}>
							<span className="sob-option-input-lable">
								<span className="sob-option-input-label">{prefix}账套观察员</span>
							</span>
							<div
								className='sob-option-input-fun'
								onClick={() => {
									chooseComplexPicker(observerlist, '选择账套观察员', (resultlist) => {
										dispatch(sobConfigActions.changeSobPermissionList('observerlist', resultlist))
									})
								}}
							>
								<div className='sob-option-input-fun-role'>
									{
										observerName ?
											<span className="sob-option-input-fun-role-list"><span>{observerName}</span></span> :
											<span className="sob-option-input-fun-role-placeholder"></span>
									}
								</div>
								<Icon className="icon" type="arrow-right" size='12' />
							</div>
						</li>

						{
							gl && gl.get('beOpen') ?
								<li className='sob-option-input' style={showMoreStyle}>
									<span className="sob-option-input-lable">
										<span className="sob-option-input-label">{prefix}记账员</span>
									</span>
									<div
										className='sob-option-input-fun'
										onClick={() => {
											chooseComplexPicker(operatorlist, '选择记账员', (resultlist) => {
												dispatch(sobConfigActions.changeSobPermissionList('operatorlist', resultlist))
											})
										}}
									>
										<div className='sob-option-input-fun-role'>
											{
												operatorName ?
													<span className="sob-option-input-fun-role-list"><span>{operatorName}</span></span> :
													<span className="sob-option-input-fun-role-placeholder"></span>
											}
										</div>
										<Icon className="icon" type="arrow-right" size='12' />
									</div>
								</li>
								: ''
						}
						{
							gl && gl.get('beOpen') ?
								<li className='sob-option-input' style={showMoreStyle}>
									<span className="sob-option-input-lable">
										<span className="sob-option-input-label">{prefix}凭证审核员</span>
									</span>
									<div
										className='sob-option-input-fun'
										onClick={() => {
											chooseComplexPicker(vcReviewList, '选择凭证审核员', (resultlist) => {
												dispatch(sobConfigActions.changeSobPermissionList('vcReviewList', resultlist))
											})
										}}
									>
										<div className='sob-option-input-fun-role'>
											{
												vcReviewListName ?
													<span className="sob-option-input-fun-role-list"><span>{vcReviewListName}</span></span> :
													<span className="sob-option-input-fun-role-placeholder"></span>
											}
										</div>
										<Icon className="icon" type="arrow-right" size='12' />
									</div>
								</li>
								: ''
						}
						{
							gl && gl.get('beOpen') ?
								<li className='sob-option-input' style={showMoreStyle}>
									<span className="sob-option-input-lable">
										<span className="sob-option-input-label">{prefix}凭证观察员</span>
									</span>
									<div
										className='sob-option-input-fun'
										onClick={() => {
											chooseComplexPicker(vcObserverList, '选择凭证观察员', (resultlist) => {
												dispatch(sobConfigActions.changeSobPermissionList('vcObserverList', resultlist))
											})
										}}
									>
										<div className='sob-option-input-fun-role'>
											{
												vcObserverName ?
													<span className="sob-option-input-fun-role-list"><span>{vcObserverName}</span></span> :
													<span className="sob-option-input-fun-role-placeholder"></span>
											}
										</div>
										<Icon className="icon" type="arrow-right" size='12' />
									</div>
								</li>
								: ''
						}

						{
							running && running.get('beOpen') ?
								<li className='sob-option-input' style={showMoreStyle}>
									<span className="sob-option-input-lable">
										<span className="sob-option-input-label">{prefix}出纳员</span>
									</span>
									<div
										className='sob-option-input-fun'
										onClick={() => {
											chooseComplexPicker(cashierList, '选择出纳员', (resultlist) => {
												dispatch(sobConfigActions.changeSobPermissionList('cashierList', resultlist))
											})
										}}
									>
										<div className='sob-option-input-fun-role'>
											{
												cashierListName ?
													<span className="sob-option-input-fun-role-list"><span>{cashierListName}</span></span> :
													<span className="sob-option-input-fun-role-placeholder"></span>
											}
										</div>
										<Icon className="icon" type="arrow-right" size='12' />
									</div>
								</li>
								: ''
						}
						{
							running && running.get('beOpen') ?
								<li className='sob-option-input' style={showMoreStyle}>
									<span className="sob-option-input-lable">
										<span className="sob-option-input-label">{prefix}流水审核员</span>
									</span>
									<div
										className='sob-option-input-fun'
										onClick={() => {
											chooseComplexPicker(flowReviewList, '选择流水审核员', (resultlist) => {
												dispatch(sobConfigActions.changeSobPermissionList('flowReviewList', resultlist))
											})
										}}
									>
										<div className='sob-option-input-fun-role'>
											{
												flowReviewListName ?
													<span className="sob-option-input-fun-role-list">{flowReviewListName}</span> :
													<span className="sob-option-input-fun-role-placeholder"></span>
											}
										</div>
										<Icon className="icon" type="arrow-right" size='12' />
									</div>
								</li>
								: ''
						}
						{
							running && running.get('beOpen') ?
								<li className='sob-option-input' style={showMoreStyle}>
									<span className="sob-option-input-lable">
										<span className="sob-option-input-label">{prefix}流水观察员</span>
									</span>
									<div
										className='sob-option-input-fun'
										onClick={() => {
											chooseComplexPicker(flowObserverList, '选择流水观察员', (resultlist) => {
												dispatch(sobConfigActions.changeSobPermissionList('flowObserverList', resultlist))
											})
										}}
									>
										<div className='sob-option-input-fun-role'>
											{
												flowObserverName ?
													<span className="sob-option-input-fun-role-list"><span>{flowObserverName}</span></span> :
													<span className="sob-option-input-fun-role-placeholder"></span>
											}
										</div>
										<Icon className="icon" type="arrow-right" size='12' />
									</div>
								</li>
								: ''
						} */}
					</ul>
				</ScrollView>
				<ButtonGroup type='ghost' height={50}>
					<Button onClick={() => history.goBack()}><Icon type="cancel" />取消</Button>
					<Button onClick={() => {

						// if (isPlay) {
						// 	return thirdParty.Alert('体验模式不能新增或修改账套')
						// }

						if (sobname === '') {
							thirdParty.toast.info('账套名称不可为空')
							return;
						}
						const isChinese = /[\u4e00-\u9fa5]/g
						const isChineseSign = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g
						// ： 。 ；  ， ： “ ”（ ） 、 ？ 《 》
						let acnameLimitLength = 30
						if (!isChinese.test(sobname) && !isChineseSign.test(sobname)) {
							acnameLimitLength = 60
						}
						if (sobname.length > acnameLimitLength){
							thirdParty.toast.info('账套名称包含中文及中文标点字符，长度不能超过30位；否则，长度不能超过60位')
							return;
						}

						if (firstyear === '') {
							thirdParty.toast.info('起始账期不可为空')
							return;
						}
						// 账套新增校验是否是钉钉管理员
						if (!selectedSob.get('sobid')) {

							if (templateTypeZN.indexOf(template) > -1) { // 智能版新增不能不选模版
								if (!(sobModel && sobModel.get('modelId'))) {
									thirdParty.toast.info('账套模版不可为空')
									return;
								}
							}

							if (isAdmin === 'TRUE' || isFinance === 'TRUE' || isDdAdmin === 'TRUE' || isDdPriAdmin === 'TRUE') {
								dispatch(sobConfigActions.sobOptionSave(history))
							} else {
								thirdParty.Alert('您没有权限')
							}
						} else { // 修改校验是否是彼账套管理员
							const sob = sobConfigState.get('sobList').filter(v => v.get('sobid') === selectedSob.get('sobid')).get(0)
							const adminlist = sob.get('adminlist')
							const isSobAdmin = adminlist.find(v => v.get('emplId') === emplID)

							if (isSobAdmin || isAdmin === 'TRUE') {
								dispatch(sobConfigActions.sobOptionSave(history))
								// dispatch(allActions.enterSobFetch(selectedSob))
							} else {
								thirdParty.Alert('您没有权限')
							}
						}
					}}><Icon type="save" />保存</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
