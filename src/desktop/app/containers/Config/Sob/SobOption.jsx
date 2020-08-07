import React, { PropTypes, Fragment } from 'react'
import { Map,List, fromJS } from 'immutable'
import { connect } from 'react-redux'

import { Button, Tooltip, Input, DatePicker, Checkbox, message, Select, Modal } from 'antd'
import { Icon } from 'app/components'
import { toJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import moment from 'moment';
import RolePick from './RolePick'
import FunModal from './FunModal'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import * as Limit from 'app/constants/Limit.js'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action.js'
import './sobOptionStyle.less'

const { MonthPicker} = DatePicker;
const monthFormat = 'YYYY-MM';
const periodSourceModelList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

@connect(state => state)
export default
class SobOption extends React.Component {

	static displayName = 'SobOption'

	constructor(props) {
		super(props)

		const selectedSob = this.props.sobOptionState.get('tempSob')
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
			showChoosenModal : false,
			choosenSobName: '',
			isIdentifyingCode: false,
			gettedIdentifyingCodeList: false,
			identifyingCode: '',
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
		this.props.dispatch(homeActions.setDdConfig())
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.sobConfigState != nextprops.sobConfigState || this.props.homeState !== nextprops.homeState || this.props.sobOptionState !== nextprops.sobOptionState || this.state !== nextstate
	}

	componentWillReceiveProps(nextprops) {
		if (this.props.sobOptionState.getIn(['tempSob', 'sobid']) !== nextprops.sobOptionState.getIn(['tempSob', 'sobid'])) {

			const moduleInfo = nextprops.sobOptionState.getIn(['tempSob', 'moduleInfo'])

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

			if (nextprops.sobOptionState.getIn(['tempSob', 'sobid'])) { // 修改账套时
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
				oldScxmBeOpen,
				oldSgxmBeOpen,
				oldQuantityBeOpen,
				oldWarehouseBeOpen,
				oldProcessBeOpen,
				oldSerialBeOpen,
				oldAssistBeOpen,
				oldBatchBeOpen,
				oldAmbBeOpen,
			}
		}
	}

	render() {

		const { dispatch, allState, sobConfigState, sobOptionState, homeState } = this.props
		const {
			showChoosenModal,
			choosenSobName,
			isIdentifyingCode,
			gettedIdentifyingCodeList,
			identifyingCode,
			oldScxmBeOpen,
			oldSgxmBeOpen,
			oldQuantityBeOpen,
			oldWarehouseBeOpen,
			oldProcessBeOpen,
			oldAmbBeOpen,
			oldAssistBeOpen,
			oldSerialBeOpen,
			oldBatchBeOpen
		} = this.state

		const newEquity = homeState.getIn(['data', 'userInfo', 'newEquity'])
		const permission = homeState.getIn(['permissionInfo','Config','edit','permission'])
        const tempSob = sobOptionState.get('tempSob')
        const sobname = tempSob.get('sobname')
        const sobid = tempSob.get('sobid')
		const firstyear = tempSob.get('firstyear')
		const firstmonth = tempSob.get('firstmonth')
		//会计年度月 
		const periodStartMonth = tempSob.get('periodStartMonth')
		let time = null
		if(firstyear != ''){
			time = firstyear+'-'+firstmonth
		}

		let moduleInfo = tempSob.get('moduleInfo')
		const running = moduleInfo.get('RUNNING')
		const runningGl = moduleInfo.get('RUNNING_GL')
		const gl = moduleInfo.get('GL')
		const assets = moduleInfo.get('ASSETS')
		const enclosureRun = moduleInfo.get('ENCLOSURE_RUN')
		const currency = moduleInfo.get('CURRENCY')
		const ass = moduleInfo.get('ASS')
		const amb = moduleInfo.get('AMB')
		const enclosureGl = moduleInfo.get('ENCLOSURE_GL')
		const number = moduleInfo.get('NUMBER')
		const process = moduleInfo.get('PROCESS')
		const inventory = moduleInfo.get('INVENTORY')
		const quantity = moduleInfo.get('QUANTITY')
		const warehouse = moduleInfo.get('WAREHOUSE')
		const project = moduleInfo.get('PROJECT')
		const projectSCXM = moduleInfo.get('SCXM')
		const projectSGXM = moduleInfo.get('SGXM')
		const assist = moduleInfo.get('ASSIST')
		const batch = moduleInfo.get('BATCH')
		const serial = moduleInfo.get('SERIAL')

		// const adminlist = tempSob.get('adminlist')//管理员
		// const observerlist = tempSob.get('observerlist')//总观察员
		// const operatorlist = tempSob.get('operatorlist')//记账员
		// const vcObserverList = tempSob.get('vcObserverList')//凭证观察员
		// const cashierList = tempSob.get('cashierList')//出纳员
		// const flowObserverList = tempSob.get('flowObserverList')//流水观察员
		// const reviewList = tempSob.get('reviewList')//流水审核员
		// const vcReviewList = tempSob.get('vcReviewList')//流水审核员
		// const flowReviewList = tempSob.get('flowReviewList')//流水审核员

		const accountingRoleInfo = tempSob.get('accountingRoleInfo')
		const smartRoleInfo = tempSob.get('smartRoleInfo')

		const jrModelList = tempSob.get('jrModelList')//智能版流水账套模版
		const sobModel = tempSob.get('sobModel')//选中的智能版流水账套模版
		const currencyTem = tempSob.get('currency')//选中的智能版流水账套模版
		const customizeList = tempSob.get('customizeList')//选中的智能版流水账套模版
		const moduleMap = tempSob.get('moduleMap')//不是复制的账套为 undefined，复制账套判断用，只读
		const accountModelList = tempSob.get('accountModelList')

		const template = tempSob.get('template')
		const canModify = tempSob.get('canModify')
		const newJr = tempSob.get('newJr')
		const isAdmin = homeState.getIn(['data', 'userInfo', 'isAdmin'])
		const isFinance = homeState.getIn(['data', 'userInfo', 'isFinance'])
		const isDdAdmin = homeState.getIn(['data', 'userInfo', 'isDdAdmin'])
		const isDdPriAdmin = homeState.getIn(['data', 'userInfo', 'isDdPriAdmin'])
		const emplID = homeState.getIn(['data', 'userInfo', 'emplID'])
		const currencyModelList = allState.get('currencyModelList')
		const identifyingCodeList = sobOptionState.get('identifyingCodeList') // 
		const copyModuleMapItem = sobOptionState.get('copyModuleMapItem') // 
		const copyModuleIsNewJr = sobOptionState.get('copyModuleIsNewJr') // 是否是老流水

		const source = []
		accountModelList.forEach(v => {
			source.push({
				key: v.get('modelName'),
				value:  v.get('modelNumber'),
			})
		})
		//遍历01，02，03，04月份
		const periodSource = []
		periodSourceModelList.forEach(v=>{
			periodSource.push({
				key:v-1,
				value:v,
			})
		})
		// [
		// {
		// 	key: '小企业账套',
		// 	value: '4'
		// }, {
		// 	key: '空账套',
		// 	value: '5'
		// }]


		const templateTypeZN = ['3']
		let templateTypeKJ = [] // 不是游乐场时是 ['4', '5']
		if (sobid) { // 编辑时
			templateTypeKJ = ['4', '5']
		} else { // 新增时
			accountModelList.forEach(v => {
				templateTypeKJ.push(v.get('modelNumber'))
			})
		}

		// 是否是体验模式
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const isNewJr = sobModel && sobModel.get('newJr') === true

		const copyModuleList = [ 'COPY_BASIS_SETTING', 'COPY_PRODUCTION_SETTING', 'COPY_CONSTRUCTION_SETTING', 'COPY_DEPOT_SETTING', 'COPY_QUANTITY_SETTING', 'COPY_ASSIST_SETTING', 'COPY_SERIAL_SETTING', 'COPY_BATCH_SETTING', 'COPY_BALANCE_SETTING']
		const otherCopyModuleList = ['COPY_PROCESS_SETTING']

		return (
            <ContainerWrap type="config-one" className="sob-option-wrap">
				<div className="tab-box-wrap">
					<Button
						onClick={() => {
							dispatch(homeActions.addPageTabPane('ConfigPanes', 'Sob', 'Sob', '账套设置'))
							dispatch(homeActions.addHomeTabpane('Config', 'Sob',  '账套设置'))
						}}
					>
						返回账套列表
					</Button>
					<div className="tab-box-wrap">
						<div className="tab-box">
							{
								(sobid ? templateTypeZN.indexOf(template) > -1 : running) ?
								<div
									className={templateTypeZN.indexOf(template) > -1 ? 'tab-selected': ''}
									onClick={()=> {
										if (templateTypeZN.indexOf(template) === -1) {
											dispatch(sobConfigActions.sobOptionChangeSobTemplate('3'))
										}
									}}
								>
									智能版
								</div> : ''
							}
							{
								(sobid ? templateTypeKJ.indexOf(template) > -1 : gl) ?
								<div
									className={templateTypeKJ.indexOf(template) > -1 ? 'tab-selected': ''}
									onClick={() => {
										if (templateTypeKJ.indexOf(template) === -1) {
											// dispatch(sobConfigActions.sobOptionChangeSobTemplate('4'))
											dispatch(sobConfigActions.sobOptionChangeSobTemplate(templateTypeKJ[0]))
										}
									}}
								>
									会计版
								</div> : ''
							}
						</div>
					</div>
				</div>

				<div className="sob-option-row-wrap">
					<div className="sob-option-row-tip">
						<span>
							<span>*</span>&nbsp;&nbsp;{templateTypeZN.indexOf(template) > -1 ? '专为0基础财务打造，老板、出纳均可使用。场景化录入流水，精准输出专业报表。' : '专为财务老鸟打造，专业凭证录入模式，支持选配辅助核算、外币、资产等模块'}
						</span>
					</div>
	                <div className="sob-option-row">
	                    <label>
	                        <span>*</span>&nbsp;&nbsp;账套名称：
	                    </label>
	                    <Input
							placeholder="输入账套名称"
							value={sobname}
							onChange={(e)=>dispatch(sobConfigActions.sobOptionChangeContent('sobname',e.target.value))}
						/>
	                </div>
	                <div className="sob-option-row">
	                    <label>
	                        <span>*</span>&nbsp;&nbsp;起始账期：
	                    </label>
	                    <MonthPicker
							style={{width: 300}}
						 	onChange={(date,dateString) => dispatch(sobConfigActions.sobOptionChangeTime(dateString))}
						 	placeholder="请选择日期"
							value={time === null ? null : moment(time, monthFormat)}
						/>
					</div>
					{
						templateTypeKJ.indexOf(template) > -1 && !sobid ? // 会计版选模版
						<div className="sob-option-row">
							<label>
								<span>*</span>&nbsp;&nbsp;账套模版：
							</label>
							<Select
								value={source.find(v => v.value === template).key}
								style={{width: 300}}
								onChange={value => {
									if (!sobid) {
										const sobItem = accountModelList.find(v => v.get('modelNumber') === value)
										dispatch(sobConfigActions.sobOptionChangeContent('sobModel', sobItem))
										dispatch(sobConfigActions.sobOptionChangeContent('template', value))
									}
								}}
							>
								{source.map((v, i) => <Select.Option value={v.value} key={i}>{v.key}</Select.Option>)}
							</Select>
		                </div> : ''
					}
					{
						templateTypeZN.indexOf(template) > -1 && !sobid ? // 智能版选模版
						<div className="sob-option-row">
							<label>
								<span>*</span>&nbsp;&nbsp;账套模版：
							</label>
							<Select
								value={sobModel ? (sobModel.get('customize') === true ? `${sobModel.get('sobName')} (起始账期:${sobModel.get('firstYear')}年${sobModel.get('firstMonth')}月)` : (sobModel.get('modelName') ? sobModel.get('modelName') : sobModel.get('sobName'))) : ''}
								style={{width: 300}}
								onChange={value => {
									if (!value) { // 选择了复制账套
										this.setState({showChoosenModal: true})
									} else { // 选择了具体的模版
										const sobItem = jrModelList.find(v => v.get('modelId') === value)
										dispatch(sobConfigActions.sobOptionChangeContent('sobModel', sobItem))
										if (sobItem.get('newJr') === true) { 
											if (sobItem.getIn(['moduleMap', 'INVENTORY'])) {
												moduleInfo = moduleInfo.setIn(['INVENTORY', 'beOpen'], sobItem.getIn(['moduleMap', 'INVENTORY', 'beOpen']))
											}
											if (sobItem.getIn(['moduleMap', 'PROJECT'])) {
												moduleInfo = moduleInfo.setIn(['PROJECT', 'beOpen'], sobItem.getIn(['moduleMap', 'PROJECT', 'beOpen']))
											}
											if (sobItem.getIn(['moduleMap', 'QUANTITY']) && !sobItem.getIn(['moduleMap', 'QUANTITY', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['QUANTITY', 'beOpen'], sobItem.getIn(['moduleMap', 'QUANTITY', 'beOpen']))
											}
											if (sobItem.getIn(['moduleMap', 'ASSIST']) && !sobItem.getIn(['moduleMap', 'ASSIST', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['ASSIST', 'beOpen'], sobItem.getIn(['moduleMap', 'ASSIST', 'beOpen']))
											}
											if (sobItem.getIn(['moduleMap', 'BATCH']) && !sobItem.getIn(['moduleMap', 'BATCH', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['BATCH', 'beOpen'], sobItem.getIn(['moduleMap', 'BATCH', 'beOpen']))
											}
											if (sobItem.getIn(['moduleMap', 'SERIAL']) && !sobItem.getIn(['moduleMap', 'SERIAL', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['SERIAL', 'beOpen'], sobItem.getIn(['moduleMap', 'SERIAL', 'beOpen']))
											}
											if (sobItem.getIn(['moduleMap', 'WAREHOUSE']) && !sobItem.getIn(['moduleMap', 'WAREHOUSE', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['WAREHOUSE', 'beOpen'], sobItem.getIn(['moduleMap', 'WAREHOUSE', 'beOpen']))
											}
											if (sobItem.getIn(['moduleMap', 'SCXM']) && !sobItem.getIn(['moduleMap', 'SCXM', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['SCXM', 'beOpen'], sobItem.getIn(['moduleMap', 'SCXM', 'beOpen']))
											}
											if (sobItem.getIn(['moduleMap', 'SGXM']) && !sobItem.getIn(['moduleMap', 'SGXM', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['SGXM', 'beOpen'], sobItem.getIn(['moduleMap', 'SGXM', 'beOpen']))
											}

											dispatch(sobConfigActions.sobOptionChangeContent('moduleInfo', moduleInfo))
											dispatch(sobConfigActions.sobOptionChangeContent('moduleMap', sobItem.get('moduleMap')))
										} // 没有 else 是因为，应该没有不是新流水的模版
									}
								}}
							>
								{jrModelList.map((v, i) => <Select.Option value={v.get('modelId')} key={i}>{v.get('modelName')}</Select.Option>)}
							</Select>
		                </div> : ''
					}
					{
						templateTypeKJ.indexOf(template) > -1 ?
						<div className="sob-option-row">
							<label>
								<span>*</span>&nbsp;&nbsp;会计年度：
							</label>
							<Select
								value={periodStartMonth ? periodStartMonth : ''}
								style={{ width: 300 }}
								onChange={value => {
									dispatch(sobConfigActions.sobOptionChangeContent('periodStartMonth', value))
								}}
							>
								{periodSource.map((v, i) => <Select.Option value={v.value} key={i}>每年{v.value - 1 + 1}月起始</Select.Option>)}
							</Select>
						</div> : ''
					}
					{
						(templateTypeKJ.indexOf(template) > -1) && (currency && currency.get('beOpen'))  ? // 会计版选模版
						<div className="sob-option-row">
							<label>
								<span>*</span>&nbsp;&nbsp;本位币：
							</label>
							<Select
								showSearch
								style={{width: 300}}
								optionFilterProp={"children"}
								notFoundContent="无法找到相应币别"
								value={currencyTem ? (currencyModelList.find(v => v.get('fcNumber') == currencyTem) ? currencyModelList.find(v => v.get('fcNumber') == currencyTem).get('name') : '') : '人民币'}
								onSelect={value => {
									const fcNumber = value.split(Limit.FC_NUMBER_AND_NAME_CONNECT)[0]
									// const name = value.split(Limit.FC_NUMBER_AND_NAME_CONNECT)[1]
									// const item = currencyModelList.find(v => v.get('fcNumber') == fcNumber)
									dispatch(sobConfigActions.sobOptionChangeContent('currency', fcNumber))
								}}
							>
								{currencyModelList.map((u,i) =>
									(<Option key={i} value={`${u.get('fcNumber')}${Limit.FC_NUMBER_AND_NAME_CONNECT}${u.get('name')}`}>
										{`${u.get('fcNumber')} ${u.get('name')}`}
									</Option>)
								)}
							</Select>
						</div>: ''
					}
					{
						!sobid ?
						<Modal
							width="500px"
							okText="保存"
							visible={showChoosenModal}
							maskClosable={false}
							title={"复制账套模版"}
							onCancel={() => {
								this.setState({identifyingCode: '', choosenSobName: '', showChoosenModal: false, isIdentifyingCode: false})
								dispatch(sobConfigActions.initIdentifyingCodeTemp())
							}}
							footer={[
								<Button
									key="ok"
									type="primary"
									disabled={!(choosenSobName || identifyingCodeList.find(v => v.get('copyCode') === identifyingCode))}
									onClick={() => {

										let jrLodalItem
										if (isIdentifyingCode) { 
											const customizeItem = identifyingCodeList.find(v => v.get('copyCode') === identifyingCode)
											jrLodalItem = customizeItem.set('modelId', customizeItem.get('sobId')).set('copyModuleMap', copyModuleMapItem)	
										} else {
											const customizeItem = customizeList.find(v => v.get('sobName') === choosenSobName)
											jrLodalItem = jrModelList.find(v => v.get('customize') === true) // 复制账套的那个
											jrLodalItem = jrLodalItem.merge(customizeItem).set('modelId', customizeItem.get('sobId')).set('copyModuleMap', copyModuleMapItem)	
										}

										dispatch(sobConfigActions.sobOptionChangeContent('sobModel', jrLodalItem))
										if (jrLodalItem.get('newJr') === true) {
											let moduleMap = jrLodalItem.get('moduleMap')
											if (jrLodalItem.getIn(['moduleMap', 'PROCESS']) && !moduleInfo.getIn(['PROCESS', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['PROCESS', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'PROCESS', 'beOpen']))
												moduleMap = moduleMap.setIn(['PROCESS', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_PROCESS_SETTING', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'INVENTORY'])) {
												moduleInfo = moduleInfo.setIn(['INVENTORY', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'INVENTORY', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'PROJECT'])) {
												moduleInfo = moduleInfo.setIn(['PROJECT', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'PROJECT', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'QUANTITY']) && !moduleInfo.getIn(['QUANTITY', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['QUANTITY', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'QUANTITY', 'beOpen']))
												moduleMap = moduleMap.setIn(['QUANTITY', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_QUANTITY_SETTING', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'ASSIST']) && !moduleInfo.getIn(['ASSIST', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['ASSIST', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'ASSIST', 'beOpen']))
												moduleMap = moduleMap.setIn(['ASSIST', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_ASSIST_SETTING', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'SERIAL']) && !moduleInfo.getIn(['SERIAL', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['SERIAL', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'SERIAL', 'beOpen']))
												moduleMap = moduleMap.setIn(['SERIAL', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_SERIAL_SETTING', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'BATCH']) && !moduleInfo.getIn(['BATCH', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['BATCH', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'BATCH', 'beOpen']))
												moduleMap = moduleMap.setIn(['BATCH', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_BATCH_SETTING', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'WAREHOUSE']) && !moduleInfo.getIn(['WAREHOUSE', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['WAREHOUSE', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'WAREHOUSE', 'beOpen']))
												moduleMap = moduleMap.setIn(['WAREHOUSE', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_DEPOT_SETTING', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'SCXM']) && !moduleInfo.getIn(['SCXM', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['SCXM', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'SCXM', 'beOpen']))
												moduleMap = moduleMap.setIn(['SCXM', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_PRODUCTION_SETTING', 'beOpen']))
											}
											if (jrLodalItem.getIn(['moduleMap', 'SGXM']) && !moduleInfo.getIn(['SGXM', 'beOverdue'])) {
												moduleInfo = moduleInfo.setIn(['SGXM', 'beOpen'], jrLodalItem.getIn(['moduleMap', 'SGXM', 'beOpen']))
												moduleMap = moduleMap.setIn(['SGXM', 'beOpen'], jrLodalItem.getIn(['copyModuleMap', 'COPY_CONSTRUCTION_SETTING', 'beOpen']))
											}

											dispatch(sobConfigActions.sobOptionChangeContent('moduleInfo', moduleInfo))
											dispatch(sobConfigActions.sobOptionChangeContent('moduleMap', moduleMap))
										} else {
											const newItem = moduleInfo.setIn(['INVENTORY', 'beOpen'], true).setIn(['PROJECT', 'beOpen'], true)
											dispatch(sobConfigActions.sobOptionChangeContent('moduleInfo', newItem))
											dispatch(sobConfigActions.sobOptionChangeContent('moduleMap', newItem))
										}
										this.setState({identifyingCode: '', choosenSobName: '', showChoosenModal: false, isIdentifyingCode: false})
										dispatch(sobConfigActions.initIdentifyingCodeTemp())
									}}>
									确 定
								</Button>
							]}
						>
							<div className="sob-option-choosen-modal">
								<div>
									<span className="sob-option-choosen-label">
										账套模版:
									</span>
									<span>
										{
											isIdentifyingCode ?
											<Input
												placeholder="请输入识别码"
												style={{width: 300}}
												value={identifyingCode}
												// identifyingCodeList
												onChange={e => {
													this.setState({identifyingCode: e.target.value})
													const identifyingItem = identifyingCodeList.find(v => v.get('copyCode') === e.target.value)
													if (identifyingItem) {
														dispatch(sobConfigActions.setSobChangeCopyModuleItem(identifyingItem.get('copyModuleMap'), identifyingItem.get('newJr')))
													}
												}}
												suffix={identifyingCode ?
													(identifyingCodeList.find(v => v.get('copyCode') === identifyingCode) ?
													<Icon type="check-circle" theme="filled" style={{ color: 'green' }} />
													:
													<Icon type="close-circle" theme="filled" style={{ color: 'red' }} />)
													: <div></div>
												}
											/>
											:
											<Select
												value={choosenSobName}
												style={{width: 300}}
												onChange={(value, key) => {
													this.setState({choosenSobId: key, choosenSobName: value})
													const customizeItem = customizeList.find(v => v.get('sobName') === value)
													if (customizeItem) {
														dispatch(sobConfigActions.setSobChangeCopyModuleItem(customizeItem.get('copyModuleMap'), customizeItem.get('newJr')))
													}
												}}
											>
												{customizeList.map((v, i) => <Select.Option value={v.get('sobName')} key={v.get('sobId')}>{v.get('sobName')}</Select.Option>)}
											</Select>
										}
									</span>
								</div>
								<div className="sob-option-choosen-right-or-not">
									{
										isIdentifyingCode ? (identifyingCode ? (identifyingCodeList.find(v => v.get('copyCode') === identifyingCode) ? <span style={{ color: 'green' }} >识别码正确，请选择需复制的内容</span> : <span style={{ color: 'red' }} >识别码错误，请核对后再输入</span>) : '') : ''
									}
								</div>
								<div className="sob-option-choosen-copy-warp">
									<span>
										选择复制的内容
									</span>
									<ul className="sob-option-choosen-copy-list">
										{
											copyModuleList.map((v, i) => {
												if (copyModuleMapItem.get(v)) {

													const canModify = v === 'COPY_BALANCE_SETTING' ? (copyModuleMapItem.getIn([v, 'canModify']) && copyModuleList.every((w => copyModuleMapItem.get(w) && w !== 'COPY_BALANCE_SETTING' ? copyModuleMapItem.getIn([w, 'beOpen']) : true))) : copyModuleMapItem.getIn([v, 'canModify'])

													let preLimite = false
													if ((v === 'COPY_ASSIST_SETTING' || v === 'COPY_SERIAL_SETTING' || v === 'COPY_BATCH_SETTING') && !copyModuleMapItem.getIn(['COPY_QUANTITY_SETTING', 'beOpen'])) {
														preLimite = true
													}

													return (
														<li
															key={i}
															className="sob-option-choosen-copy-item"
														>
															<Checkbox
																disabled={!copyModuleIsNewJr || !canModify || preLimite}
																checked={copyModuleMapItem.getIn([v, 'beOpen'])}
																onClick={() => {
																	dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn([v, 'moduleCode']), !copyModuleMapItem.getIn([v, 'beOpen'])))
																	// 期初值只能copyModuleList里其他模块全钩选时才可以勾选,所以取消勾选时要连带取消期初值的勾选
																	if (!copyModuleMapItem.getIn([v, 'beOpen']) === false && v !== 'COPY_BALANCE_SETTING') {
																		dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn(['COPY_BALANCE_SETTING', 'moduleCode']), false))
																	}
																	// 辅助属性的东西需要数量开启才能复制
																	if (v === 'COPY_QUANTITY_SETTING' && !copyModuleMapItem.getIn([v, 'beOpen']) === false) {
																		// 关闭数量核算要同时关闭关联的三个辅助属性
																		if (copyModuleMapItem.get('COPY_ASSIST_SETTING')) {
																			dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn(['COPY_ASSIST_SETTING', 'moduleCode']), false))
																		}
																		if (copyModuleMapItem.get('COPY_SERIAL_SETTING')) {
																			dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn(['COPY_SERIAL_SETTING', 'moduleCode']), false))
																		}
																		if (copyModuleMapItem.get('COPY_BATCH_SETTING')) {
																			dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn(['COPY_BATCH_SETTING', 'moduleCode']), false))
																		}
																	}
																}}
															></Checkbox> {copyModuleMapItem.getIn([v, 'moduleName'])}
														</li>
													)
												} else {
													return null
												}
											})
										}
										{
											otherCopyModuleList.map((v, i) => {  // 和期初值无关端模块
												if (copyModuleMapItem.get(v)) {

													const canModify = copyModuleMapItem.getIn([v, 'canModify'])

													return (
														<li
															key={i}
															className="sob-option-choosen-copy-item"
														>
															<Checkbox
																disabled={!copyModuleIsNewJr || !canModify}
																checked={copyModuleMapItem.getIn([v, 'beOpen'])}
																onClick={() => {
																	dispatch(sobConfigActions.sobChangeCopyModuleItem(copyModuleMapItem.getIn([v, 'moduleCode']), !copyModuleMapItem.getIn([v, 'beOpen'])))
																}}
															></Checkbox> {copyModuleMapItem.getIn([v, 'moduleName'])}
														</li>
													)
												} else {
													return null
												}
											})
										}
									</ul>		
								</div>
								<div className="sob-option-choosen-copy-way">
									<span onClick={() => {
										if (!gettedIdentifyingCodeList) {
											this.setState({gettedIdentifyingCodeList: true})
											dispatch(sobConfigActions.getIdentifyingCodeList())
										}
										this.setState({isIdentifyingCode: !isIdentifyingCode, identifyingCode: '', choosenSobId: '', choosenSobName: ''})
										dispatch(sobConfigActions.initIdentifyingCodeTemp())
									}}>{isIdentifyingCode ? '复制本团队账套' : '用识别码复制账套'}</span>
								</div>
							</div>
						</Modal>
						: null
					}
					<FunModal
						running={running}
						runningGl={runningGl}
						gl={gl}
						assets={assets}
						enclosureRun={enclosureRun}
						currency={currency}
						ass={ass}
						amb={amb}
						enclosureGl={enclosureGl}
						number={number}
						process={process}
						inventory={inventory}
						quantity={quantity}
						warehouse={warehouse}
						project={project}
						projectSCXM={projectSCXM}
						projectSGXM={projectSGXM}
						assist={assist}
						batch={batch}
						serial={serial}
						templateTypeZN={templateTypeZN}
						templateTypeKJ={templateTypeKJ}
						template={template}
						dispatch={dispatch}
						isPlay={isPlay}
						sobid={sobid}
						isNewJr={isNewJr}
						moduleMap={moduleMap}
						oldScxmBeOpen={oldScxmBeOpen}
						oldSgxmBeOpen={oldSgxmBeOpen}
						oldQuantityBeOpen={oldQuantityBeOpen}
						oldWarehouseBeOpen={oldWarehouseBeOpen}
						oldProcessBeOpen={oldProcessBeOpen}
						oldAmbBeOpen={oldAmbBeOpen}
						oldSerialBeOpen={oldSerialBeOpen}
						oldAssistBeOpen={oldAssistBeOpen}
						oldBatchBeOpen={oldBatchBeOpen}
					/>
					<RolePick
						// adminlist={adminlist}
						// observerlist={observerlist}
						// operatorlist={operatorlist}
						// vcObserverList={vcObserverList}
						// cashierList={cashierList}
						// flowObserverList={flowObserverList}
						// reviewList={reviewList}
						// vcReviewList={vcReviewList}
						// flowReviewList={flowReviewList}


						dispatch={dispatch}
						running={running}
						gl={gl}
						sobid={sobid}
						sobname={sobname}
						canModify={canModify && (templateTypeKJ.indexOf(template) > -1 || (templateTypeZN.indexOf(template) > -1 && newJr))}
						sobType={templateTypeZN.indexOf(template) > -1 ? 'SMART' : 'ACCOUNTING'}
						accountingRoleInfo={accountingRoleInfo}
						smartRoleInfo={smartRoleInfo}
					/>
					<div
						className="save-btn"
						onClick={() =>{
							// if (newEquity) {
							// 可以进来的新增的应该是钉钉管理员，为防止账套为空是没有权限，做了!tempSob.get('sobid')可以保存
							if (sobname === '') {
								message.info('账套名称不可为空')
								return ;
							}

							const isChinese = /[\u4e00-\u9fa5]/g
							const isChineseSign = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g
							// ： 。 ；  ， ： “ ”（ ） 、 ？ 《 》

							let acnameLimitLength = 30
							if (!isChinese.test(sobname) && !isChineseSign.test(sobname)) {
								acnameLimitLength = 60
							}

							if (sobname.length > acnameLimitLength) {
								return message.warn(`账套名称包含中文及中文标点字符，长度不能超过30位；否则，长度不能超过60位`)
							}

							if (firstyear === '') {
								message.info('起始账期不可为空')
								return ;
							}
							// 账套新增校验是否是钉钉管理员
							if (!tempSob.get('sobid')) {

								if (templateTypeZN.indexOf(template) > -1) { // 智能版新增不能不选模版
									if (!(sobModel && sobModel.get('modelId'))) {
										message.info('账套模版不可为空')
										return ;
									}
								}

								if (isAdmin === 'TRUE' || isFinance === 'TRUE' || isDdAdmin === 'TRUE' || isDdPriAdmin === 'TRUE') {
									dispatch(sobConfigActions.sobOptionSave())
								} else {
									thirdParty.Alert('您没有权限')
								}
							} else { // 修改校验是否是彼账套管理员
								const sob = sobConfigState.get('sobList').filter(v => v.get('sobid') === sobid).get(0)
								const adminlist = sob.get('adminlist')
								const isSobAdmin = adminlist.find(v => v.get('emplId') === emplID)

								if (isSobAdmin || isAdmin === 'TRUE')	{
									dispatch(sobConfigActions.sobOptionSave())
								} else {
									thirdParty.Alert('您没有权限')
								}
							}
						}}
					>
						保存
					</div>
				</div>
            </ContainerWrap>
		)
	}
}
