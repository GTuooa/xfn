import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import XfnInput from 'app/components/Input'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon, Switch, Divider, Tooltip, Modal } from 'antd'
const Option = Select.Option
const RadioGroup = Radio.Group
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'

import SelectRadio from './SelectRadio'
import  Properties  from './Properties'
import  Invoice  from './Invoice'
import  Category  from './Category'
// import TransferProfitorCost from './TransferProfitorCost'
// import EditCardModal from './EditCardModal'
// import AddCardModal from './AddCardModal'
import { getCategorynameByType, numberTest, reg, regNegative, ProductProjectTest, changeCategoryAllowed } from './common/common'

import * as allActions from 'app/redux/Home/All/all.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
@connect(state => {
	const { editRunningState } = state
	return{ editRunningState }
})
@immutableRenderDecorator
export default
class RunningCardBody extends React.Component {
	state = {
			show:false,
			showModal:false,
			showModalStock:false,
			index:0,
			accountInput:'',
			stockInput:'',
			contactsInput:'',

	}
	componentDidMount() {
		// this.props.dispatch(allActions.getAcListFetch())
	}
	render() {
		const {
			insertOrModify,
			disabledChange,
            oriTemp,
            dispatch,
            accountList,
            taxRateTemp,
            payOrReceive,
            runningCategory,
			// homeState,
			// accountConfState,
			flags,
			editRunningState,
			// allState,
			disabledDate,
			configPermission,
			isCheckOut,
			enableWarehouse,
			openQuantity,
			accountPoundage,
			moduleInfo

		} = this.props

		const categoryType = oriTemp.get('categoryType')
		const {
			propertyShow,
			categoryTypeObj,
			direction,
			showInvoice,
			isShowAbout,
			specialState,
		} = getCategorynameByType(categoryType)
		const curDisableDate = (current) => {
			if (insertOrModify === 'modify' && pendingStrongList.getIn([0,'oriDate']) && pendingStrongList.some(v => v.get('beSelect'))) {
				return (moment(pendingStrongList.reverse().find(v => v.get('beSelect')).get('oriDate')) > current) || disabledDate(current)
			} else {
				return disabledDate(current)
			}
		}
		// const lrAclist = allState.get('lrAclist')
		// const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		// const useAssList = allState.get('allasscategorylist')
		const scale = taxRateTemp.get('scale')
		const payableAcFullName = taxRateTemp.get('payableAcFullName')
		const payableAcId = taxRateTemp.get('payableAcId')
		const payableAssCategory = taxRateTemp.get('payableAssCategory')
		const notBillingAssCategory = taxRateTemp.get('notBillingAssCategory')
		const notBillingAcId = taxRateTemp.get('notBillingAcId')
		const outputAcId = taxRateTemp.get('outputAcId')
		const payableRate = taxRateTemp.get('payableRate')
		const outputAssCategory = taxRateTemp.get('outputAssCategory')
		const waitOutputAcId = taxRateTemp.get('waitOutputAcId')
		const waitOutputAssCategory = taxRateTemp.get('waitOutputAssCategory')
		const inputAcId = taxRateTemp.get('inputAcId')
		const inputAssCategory = taxRateTemp.get('inputAssCategory')
		const certifiedAcId = taxRateTemp.get('certifiedAcId')
		const certifiedAssCategory = taxRateTemp.get('certifiedAssCategory')
		const beProject = oriTemp.get('beProject')
		const oriState = oriTemp.get('oriState')
		const runningType = oriTemp.get('runningType')
		const usedCurrent = oriTemp.get('usedCurrent')
		const currentCardList = oriTemp.get('currentCardList')
		const beAccrued = oriTemp.getIn([categoryTypeObj,'beAccrued'])
		const beWelfare = oriTemp.getIn([categoryTypeObj,'beWelfare'])
		const stockRange = oriTemp.getIn([categoryTypeObj,'stockRange']) || fromJS([])
		const stockCardList = oriTemp.get('stockCardList') || fromJS([])
		const propertyCarryover = oriTemp.get('propertyCarryover')
		const handleType = oriTemp.get('handleType')
		const assetType = oriTemp.get('assetType')
		const oriDate = oriTemp.get('oriDate')
		const usedProject = oriTemp.get('usedProject')
		const beSpecial = oriTemp.get('beSpecial')
		const beDeposited = oriTemp.get('beDeposited')
		const stockStrongList = oriTemp.get('stockStrongList')
		const carryoverStrongList = oriTemp.get('carryoverStrongList')
		const billStrongList = oriTemp.get('billStrongList')
		const beManagemented = oriTemp.getIn([categoryTypeObj,'beManagemented'])
		const contactsManagement = oriTemp.getIn([categoryTypeObj,'contactsManagement'])
		const pendingStrongList = oriTemp.get('pendingStrongList')
		const strongList = oriTemp.get('strongList')
		const oriAbstract = oriTemp.get('oriAbstract')
		const jrIndex = oriTemp.get('jrIndex')
		// const insertOrModify = editRunningState.getIn(['flags','insertOrModify'])
		const showContactsModal = editRunningState.getIn(['flags','showContactsModal'])
		const indexModal = editRunningState.getIn(['flags','indexModal'])
		const projectList = editRunningState.get('projectList')
		const contactsList = editRunningState.get('contactsList')
		const showSingleModal = editRunningState.get('showSingleModal')
		const MemberList = editRunningState.get('MemberList')
		const selectThingsList = editRunningState.get('selectThingsList')
		const thingsList = editRunningState.get('thingsList')
		const stockList = editRunningState.get('stockList')
		const warehouseList = editRunningState.get('warehouseList')
		const projectCardList = oriTemp.get('projectCardList')
		const propertyTax = oriTemp.get('propertyTax')
		const encodeType = oriTemp.get('encodeType')
		const fullCategoryName = oriTemp.get('fullCategoryName')
		const usedStock = oriTemp.get('usedStock')
		const currentProjectCardList = oriTemp.get('currentProjectCardList') || fromJS([])
		const curcurrentCardList = oriTemp.get('curcurrentCardList') || fromJS([])
		const newProjectRange = oriTemp.get('newProjectRange') || fromJS([])
		const name = oriTemp.get('name')
		const currentOriDate = oriTemp.get('currentOriDate')
		const propertyCostList = oriTemp.get('propertyCostList') || fromJS([])
		const projectTest = () => {
			if (insertOrModify === 'insert' && !beProject || insertOrModify === 'modify' && !beProject && !currentProjectCardList.size) {
				return false
			}
			switch(categoryType) {
				case 'LB_YYSR':
				case 'LB_YYZC':
				case 'LB_CQZC':
				case 'LB_FYZC':
				case 'LB_YYWSR':
				case 'LB_YYWZC':
					return true
				case 'LB_XCZC':
					if ((beAccrued || beWelfare) && oriState === 'STATE_XC_JT'
					||  !beAccrued && !beWelfare && (oriState === 'STATE_XC_FF'
					|| oriState === 'STATE_XC_JN')
					|| oriState === 'STATE_XC_YF'
					|| insertOrModify === 'modify' && currentProjectCardList.size) {
						return true
					}
					break
				case 'LB_SFZC':
					if (beAccrued && oriState === 'STATE_SF_JT'
					||  !beAccrued && oriState === 'STATE_SF_JN' && (propertyTax === 'SX_QYSDS' || propertyTax === 'SX_QTSF')
					|| insertOrModify === 'modify' && currentProjectCardList.size) {
						return true
					}
					break
				case 'LB_JK':
					if (handleType === 'JR_HANDLE_CHLX' && (beAccrued && oriState === 'STATE_JK_JTLX' || !beAccrued)|| insertOrModify === 'modify' && currentProjectCardList.size) {
						return true
					}
					break
				case 'LB_TZ':
					if (handleType === 'JR_HANDLE_QDSY' && (beAccrued && (oriState === 'STATE_TZ_JTGL' || oriState === 'STATE_TZ_JTLX') || !beAccrued)|| insertOrModify === 'modify' && currentProjectCardList.size) {
						return true
					}
					break
				case 'LB_ZB':
					break
				case 'LB_ZSKX':
					if (oriState !== 'STATE_ZS_TH') {
						return true
					}
					break
				case 'LB_ZFKX':
					if (oriState !== 'STATE_ZF_SH') {
						return true
					}
					break
				default:
			}
			return false
		}
	return (
      <div className="accountConf-modal-list editRunning-CardBody">
			<div
				className="pcxls-account"
				style={{display: oriTemp.get('beCertificate') ? 'block' : 'none'}}
				>
				已审核
			</div>
			{
				insertOrModify === 'modify'?
				<div className="edit-running-modal-list-item">
					<label>流水号：</label>
					<div>
						<XfnInput
							style={{width:'67px',marginRight:'5px'}}
							value={oriTemp.get('jrIndex')}
							onChange={(e) => {
								if (/^\d*$/.test(e.target.value)) {
									if (/^\d{0,6}$/.test(e.target.value)) {
										dispatch(editRunningActions.changeLrAccountCommonString('ori', 'jrIndex', e.target.value))
									} else {
										message.info('流水号不能超过6位')
									}
								} else {
									message.info('必须是数字')
								}
							}}
							PointDisabled={true}
						/>
						号
					</div>
				</div>
				:
				null
			}
			<div className="edit-running-modal-list-item">
				<label>日期：</label>
					<div>
						<DatePicker
							allowClear={false}
							disabledDate={curDisableDate}
							value={moment(oriDate)}
							disabled={assetType === 'JR_HANDLE_CZ' && insertOrModify === 'modify'}
							onChange={value => {
								const date = value.format('YYYY-MM-DD')
								dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								// if(paymentType === 'LB_SFGL' && (insertOrModify === 'modify' || insertOrModify === 'modify')){
								// 	return
								// }else{
									// if(preAmount<=0) {
									// 	dispatch(editRunningActions.changeLrAccountCommonString('ori', 'offsetAmount', 0))
									// }
								// }

							}}
						/>
					</div>
			</div>
			<div className="edit-running-modal-list-item">
				<label>流水类别：</label>
					<div className="lrls-account-box">
						<RunCategorySelect
							disabled={insertOrModify === 'modify' && !changeCategoryAllowed(categoryType,oriTemp.get('canBeModifyCategory'))}
							treeData={runningCategory}
							value={fullCategoryName}
							placeholder=""
							insertOrModify={insertOrModify}
							canBeModifyCategory={oriTemp.get('canBeModifyCategory')}
							parentDisabled={true}
							onChange={(value,label,extra) => {
								const valueList = value.split(Limit.TREE_JOIN_STR)
								const categoryIndexList = valueList[2].split('_')
								let category = runningCategory

								categoryIndexList.forEach((v, i) => {
									if (i < categoryIndexList.length-1) {
										category = category.getIn([Number(v), 'childList'])
									} else {
										category = category.getIn([Number(v)])
									}
								})
								if (insertOrModify === 'insert') {
									dispatch(editRunningActions.selectAccountRunningCategory(valueList[0]))
								} else {
									dispatch(editRunningActions.selectModifyRunningCategory(valueList[0]))
								}
							}}
						/>
						{
							contactsManagement
							&& oriState !== 'STATE_ZS_TH'
							&& oriState !== 'STATE_ZF_SH'
							&& (oriState !== 'STATE_JK_ZFLX'
							&& oriState !== 'STATE_TZ_SRGL'
							&& oriState !== 'STATE_TZ_SRLX'
							&& oriState !== 'STATE_ZB_ZFLR' && beAccrued || !beAccrued)
							|| insertOrModify === 'modify' && curcurrentCardList.size?
							<Switch
								className="use-unuse-style edit-running-switch"
								checked={usedCurrent}
								checkedChildren={'往来'}
								unCheckedChildren={'往来'}
								disabled={strongList.size && insertOrModify !== 'insert'}
								onChange={() => {
									dispatch(editRunningActions.changeLrAccountCommonString('ori','usedCurrent',!usedCurrent))
									if (usedCurrent) {
										// dispatch(editRunningActions.changeLrAccountCommonString('ori','currentCardList',fromJS([])))
									}
								}}
							/>:null
						}
						{
							projectTest() && ProductProjectTest(categoryType,newProjectRange)?
							<Switch
								className="use-unuse-style edit-running-switch"
								checked={usedProject}
								disabled={stockStrongList.size && insertOrModify !== 'insert'}
								checkedChildren={'项目'}
								unCheckedChildren={'项目'}
								onChange={() => {
									if (!usedProject && !projectCardList.size) {
										dispatch(editRunningActions.changeLrAccountCommonString('ori','projectCardList',fromJS([{cardUuid:'',amount:''}])))
									} else if (usedProject) {
										dispatch(editRunningActions.changeLrAccountCommonString('ori','projectCardList',fromJS([])))
										if (categoryType !== 'LB_YYZC') {
											dispatch(editRunningActions.changeLrAccountCommonString('ori','propertyCost',propertyCostList.get(0)))
										}
									}
									dispatch(editRunningActions.changeLrAccountCommonString('ori','usedProject',!usedProject))
								}}
							/>:null
						}
						{
							propertyCarryover === 'SX_HW_FW' && (stockRange.size && oriState !== 'STATE_YYSR_DJ' || insertOrModify === 'modify' && stockCardList.size)?
							<Switch
								className="use-unuse-style edit-running-switch"
								checked={usedStock}
								checkedChildren={'货物'}
								unCheckedChildren={'货物'}
								onChange={() => {
									if (!usedStock && !stockCardList.size) {
										dispatch(editRunningActions.changeLrAccountCommonString('ori','stockCardList',fromJS([{}])))
									} else if (usedStock) {
										dispatch(editRunningActions.changeLrAccountCommonString('ori','stockCardList',fromJS([])))
									}
									dispatch(editRunningActions.changeLrAccountCommonString('ori','usedStock',!usedStock))
								}}
							/>:null
						}
					</div>
			</div>
			<Properties
				dispatch={dispatch}
				oriTemp={oriTemp}
				flags={flags}
				insertOrModify={insertOrModify}
			/>
			<SelectRadio
				insertOrModify={insertOrModify}
				oriTemp={oriTemp}
				dispatch={dispatch}
				beSpecial={beSpecial}
				beDeposited={beDeposited}
				oriState={oriState}
				payOrReceive={payOrReceive}
				flags={flags}
				disabledChange={disabledChange}
			/>

			<div className="accountConf-separator"></div>
			<div className="edit-running-modal-list-item">
				<label>摘要：</label>
					<div>
						<Input className="focus-input"
                            onFocus={(e) => {
								document.getElementsByClassName('focus-input')[0].select();
							}}
							value={oriAbstract}
							onChange={(e) => {
								dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriAbstract', e.target.value))
							}}
						/>
					</div>
			</div>
			<Category
				oriTemp={oriTemp}
				accountList={accountList}
				projectList={projectList}
				contactsList={contactsList}
				dispatch={dispatch}
				flags={flags}
				categoryTypeObj={categoryTypeObj}
				taxRateTemp={taxRateTemp}
				showSingleModal={showSingleModal}
				MemberList={MemberList}
				selectThingsList={selectThingsList}
				thingsList={thingsList}
				stockList={stockList}
				warehouseList={warehouseList}
				insertOrModify={insertOrModify}
				isCheckOut={isCheckOut}
				enableWarehouse={enableWarehouse}
				openQuantity={openQuantity}
				accountPoundage={accountPoundage}
				moduleInfo={moduleInfo}
			/>
			<Modal
				title='选择保存方式'
				onOk={() => {
					dispatch(editRunningActions.changeLrAccountCommonString('',['flags','indexModal'], 0))
					dispatch(editRunningActions.saveRunningbusiness(indexModal === 2 ? true : false))
				}}
				onCancel={() => {
					dispatch(editRunningActions.changeLrAccountCommonString('',['flags','indexModal'], 0))
					dispatch(editRunningActions.changeLrAccountCommonString('ori','encodeType',''))
				}}
				visible={indexModal>=1}
			>
				<div>
					<div style={{marginBottom:'10px'}}>
						流水号:{jrIndex}号已经存在，您可以：
					</div>
					<div>
						<Radio.Group
							onChange={(e) => {
								dispatch(editRunningActions.changeLrAccountCommonString('ori','encodeType',e.target.value))
							}}
							value={encodeType}
						>
							{
								insertOrModify === 'modify' && (strongList.size || billStrongList.size || carryoverStrongList.size) && currentOriDate.substr(0,7) < oriDate.substr(0,7)?
								'':<Radio value={'1'}>
									系统自动编号 <Tooltip title='维持原流水号或自动新增为末尾最新流水编号' ><span className='icon-tips' style={{marginLeft:'5px'}}>?</span></Tooltip>
								</Radio>
							}
							<br style={{display:insertOrModify === 'modify' && (strongList.size || billStrongList.size || carryoverStrongList.size) && currentOriDate.substr(0,7) < oriDate.substr(0,7)?'none':''}}/>
							<Radio  value={'2'}>
								插入流水号<Tooltip title='当前流水号不变，原流水号将顺次后移' ><span className='icon-tips' style={{marginLeft:'5px'}}>?</span></Tooltip>
							</Radio>
						</Radio.Group>
				</div>
				</div>
			</Modal>
		</div>

		)
	}
}
