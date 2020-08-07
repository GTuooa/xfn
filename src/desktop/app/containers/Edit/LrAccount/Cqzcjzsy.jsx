import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { DateLib, formatMoney }	from 'app/utils'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Timeline, Tabs, Tree, Switch } from 'antd'
const TreeNode = Tree.TreeNode
const TabPane = Tabs.TabPane
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'
import  QcModal  from './QcModal'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import { toJS, fromJS } from 'immutable'
import moment from 'moment'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
@immutableRenderDecorator
export default
class ModifyModal extends React.Component {
	constructor() {
		super()
		this.state = {
			yllsVisible:false
    }
	}
	componentDidMount() {
		this.props.dispatch(lrAccountActions.getAssetsCleaningCategory())
	}
	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}
	render() {
		const {
			onCancel,
			dispatch,
			showRunningInfo,
			showRunningInfoModal,
			runningInfoModalType,
			modifyRunningModal,
			CqzcTemp,
			disabledBeginDate,
			flags,
			accountList,
			hideCategoryList,
			configPermissionInfo,
			yllsState,
			panes
		} = this.props
		const { yllsVisible } = this.state
		let paymentTypeList = {'LB_JZSY': '长期资产处置损益'}
		const paymentType = flags.get('paymentType')
		const paymentInsertOrModify = flags.get('paymentInsertOrModify')
		const isQuery = flags.get('isQuery')
		const selectedKeys = flags.get('selectedKeys')
		const disabledDate = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}
		const selectList = flags.get('selectList')
		const detail = CqzcTemp.get('detail')
		const cardList = CqzcTemp.get('cardList')
		const acList = CqzcTemp.get('acList')
		const usedCard = CqzcTemp.get('usedCard')
		const issuedate = flags.get('issuedate')
		const modify = flags.get('modify')
		const accountType = flags.get('accountType')
		const managerCategoryList = flags.get('managerCategoryList')
		const handlingAmount = CqzcTemp.get('handlingAmount')
		const showContactsModal = flags.get('showContactsModal')
		const runningIndex = CqzcTemp.get('runningIndex')
		const contactsCardRange = CqzcTemp.get('contactsCardRange')
		const categoryName = CqzcTemp.getIn(['detail','categoryName'])
		const beProject = CqzcTemp.getIn(['detail','beProject'])
		const runningDate = CqzcTemp.getIn(['detail','runningDate'])
		const runningAbstract = CqzcTemp.getIn(['detail','runningAbstract'])
		const usedProject = CqzcTemp.getIn(['detail','usedProject'])
		const categoryUuid = CqzcTemp.getIn(['detail','categoryUuid'])
		const businessList = CqzcTemp.getIn(['detail','businessList'])
		const depreciationAmount = CqzcTemp.getIn(['detail','acAssets','depreciationAmount'])
		const flowNumber = CqzcTemp.getIn(['detail','flowNumber'])
		const originalAssetsAmount = CqzcTemp.getIn(['detail','acAssets','originalAssetsAmount'])
		const netProfitAmount = CqzcTemp.getIn(['detail','netProfitAmount'])
		const lossAmount = CqzcTemp.getIn(['detail','lossAmount'])
		const projectCard = CqzcTemp.getIn(['detail','projectCard'])?CqzcTemp.getIn(['detail','projectCard']):fromJS([])
		const direction = CqzcTemp.get('direction')
		const projectRange = CqzcTemp.get('projectRange')
		const assetsCategory = CqzcTemp.get('assetsCategory')
		const projectList = CqzcTemp.get('projectList')
		const flowType = CqzcTemp.get('flowType')
		const moedAmount = CqzcTemp.get('moedAmount')
		const isQueryByBusiness = flags.get('isQueryByBusiness')
		const MemberList = flags.get('MemberList')
		const selectThingsList = flags.get('selectThingsList')
		const thingsList = flags.get('thingsList')
		const indexSize = businessList.size?businessList.reduce((total,cur) => cur.get('beSelect')?total+1:total,0):0
		const totalAmount = businessList.size?businessList.reduce((total,cur) =>cur.get('beSelect')?total+Number(cur.get('amount'))-Number(cur.get('tax')):total,0):0
		const reg = /^\d*\.?\d{0,2}$/
		let selectAcAll = businessList.size && businessList.every(v => v.get('beSelect'))
		const lsItemData = yllsState.get('lsItemData')
		return (
			paymentType === 'LB_JZSY'?
				<div className="accountConf-modal-list accountConf-modal-list-hidden">
					{
						paymentInsertOrModify === 'modify'?
						<div className="accountConf-modal-list-item">
							<label>流水号</label>
							<div>{flowNumber}</div>
						</div>:''
					}
					<div className="accountConf-modal-list-item">
						<label>日期：</label>
						<div>
							<DatePicker
								allowClear={false}
								disabledDate={(current) => {
									if (modify) {
										const detailDate = detail.getIn(['businessList', 0, 'runningDate'])
										return disabledDate(current, modify, detailDate)
									} else {
										return disabledDate(current)
									}


								}}
								value={moment(runningDate)}
								onChange={value => {
								const date = value.format('YYYY-MM-DD')
								dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','runningDate'], date))
								if(paymentInsertOrModify === 'modify'){
									return
								}else{
									if(categoryUuid) {
										dispatch(lrAccountActions.getAssetsCarryoverList(date, categoryUuid))
									}
								}

							}}/>
						</div>
					</div>
					<div className="accountConf-modal-list-item">
						<label>流水类别：</label>
						<div>
							<Select
								disabled={modify || accountType === 'single'}
								value={paymentTypeList[paymentType]}
								onChange={value => {
									dispatch(lrAccountActions.changeLrAccountCommonString('',['flags','paymentType'],value))
								}}
								>
									{
										hideCategoryList && hideCategoryList.size ? hideCategoryList.map(item => {
											return <Option key={item.get('uuid')} value={item.get('categoryType')}>
												{item.get('name')}
											</Option>
										})
										:
										null
								}

							</Select>
						</div>

					</div>
					<div className="accountConf-modal-list-item">
						<label>处理类别：</label>
						<div className='chosen-right' style={{display:'flex'}}>
							<RunCategorySelect
								treeData={assetsCategory}
								value={categoryName}
								placeholder=""
								parentDisabled={true}
								disabled={paymentInsertOrModify === 'modify'}
								onChange={value => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','categoryUuid'], valueList[0]))
									dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','categoryName'], valueList[1]))
									dispatch(lrAccountActions.getAssetsCarryoverList(runningDate, valueList[0]))
									let projectRange = fromJS([])
									const loopFind = (itemList,uuid) => {
										itemList.map(v => {
											if (v.get('uuid') === uuid && v.get('beProject')) {
												projectRange = v.get('projectRange')
												return
											} else {
												v.get('childList').size && loopFind(v.get('childList'),uuid)
											}

										})
									}
									loopFind(assetsCategory.getIn([0,'childList']),valueList[0])
									if (projectRange.size) {
										dispatch(lrAccountActions.getJzsyProjectCardList(projectRange))
									} else {
										dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','beProject'],false))
									}
								}}
							/>
							{
								beProject?
								<Switch
									className="use-unuse-style lrls-jzsy-box"
									style={{margin:'.1rem 0 0 .2rem'}}
									checked={usedProject}
									checkedChildren={'项目'}
									onChange={() => {
										if (!usedProject && !projectCard.size) {
											dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc',['detail','projectCard'],fromJS([{uuid:'',amount:''}])))
										} else if (usedProject) {
											dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc',['detail','projectCard'],fromJS([])))
										}
										dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc',['detail','usedProject'],!usedProject))
									}}
								/>:''
							}

							</div>
						</div>
						{
						    usedProject?
								projectCard.map((v,i) =>
								<div key={i} className='project-content-area' style={projectCard.size>1?{}:{border:'none',marginBottom:'0'}}>
								<div className="accountConf-modal-list-item" >
									<label>项目：</label>
									<div className='chosen-right'>
										<Select
											combobox
											showSearch
											value={`${v.get('code') !== 'COMNCRD' && v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
											onChange={value => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const uuid = valueList[0]
												const code = valueList[1]
												const name = valueList[2]
												dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','projectCard',i], fromJS({uuid,name,code})))
											}}
											>
											{projectList.filter(v => v.get('code') !== 'COMNCRD').map((v, i) =>
												<Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
													{`${v.get('code') !== 'COMNCRD'?v.get('code'):''} ${v.get('name')}`}
												</Option>
											)}
										</Select>
										<div className='chosen-word'
											onClick={() => {
												dispatch(lrAccountActions.getProjectAllCardList(projectRange,'showContactsModal'))
												dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'project'))
												this.setState({
													index:i,
												})

										}}>选择</div>
									</div>
								</div>

								</div>
							):null
						}
					<div className="accountConf-modal-list-item">
						<label>摘要：</label>
						<div>
							<Input

								value={runningAbstract}
								onChange={(e) => {
									dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','runningAbstract'], e.target.value))
								}}
							/>
						</div>
					</div>
					<div className="accountConf-modal-list-item">
						<label>{`净${netProfitAmount>=0?'收益':'损失'}金额：`}</label>
						<div>
							{netProfitAmount>=0?netProfitAmount:lossAmount}
						</div>
					</div>
					<div className="accountConf-modal-list-item">
						<label>资产原值：</label>
						<div>
							<Input
								value={originalAssetsAmount}
								onChange={(e) => {
									//e.targt.value小于计提
									if (e.target.value === undefined)
										return

									let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
									if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
										value = value.substr(1)
									}
									if (reg.test(value) || value === '') {
										dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','acAssets','originalAssetsAmount'], value))
										dispatch(lrAccountActions.calculateGainForJzsy())
									} else {
										message.info('金额只能输入带两位小数的数字')
									}

								}}
							/>
						</div>
					</div>
					<div className="accountConf-modal-list-item">
						<label>累计折旧摊销：</label>
						<div>
							<Input
								value={depreciationAmount}
								onChange={(e) => {
									//e.targt.value小于计提
									if (e.target.value === undefined)
										return

									let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
									if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
										value = value.substr(1)
									}
									if (reg.test(value) || value === '') {
										dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','acAssets','depreciationAmount'], value))
										dispatch(lrAccountActions.calculateGainForJzsy())
									} else {
										message.info('金额只能输入带两位小数的数字')
									}

								}}
							/>
						</div>
					</div>
					<div className='accountConf-separator'></div>
					<div className='lrAccount-detail-title'>
						<div className="lrAccount-detail-title-top">请勾选需要处理的流水：</div>
						<div className='lrAccount-detail-title-bottom'>
							<span>
								已勾选流水：{indexSize}条
							</span>
							<span>
								{`处置金额合计：`}<span>{formatMoney(totalAmount,2,'')}</span>
							</span>
						</div>
					</div>
					<TableAll className="lrAccount-table">
						<TableTitle
							className="lrAccount-table-jzsy-width"
							titleList={['流水号','流水类别','金额']}
							hasCheckbox={true}
							selectAcAll={selectAcAll}
							onClick={(e) => {
									e.stopPropagation()
									if (businessList.every(v => v.get('beSelect'))) {
										businessList.forEach((v,i) => dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','businessList',i,'beSelect'], false)))
									} else {
										businessList.forEach((v,i) => dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','businessList',i,'beSelect'], true)))
									}
									dispatch(lrAccountActions.calculateGainForJzsy())

							}}
						/>
						<TableBody>
							{
								businessList.size?
								businessList.map((v,i) =>
									<TableItem className='lrAccount-table-jzsy-width' key={v.get('uuid')}>
										<li
											onClick={(e) => {
												e.stopPropagation()
												dispatch(lrAccountActions.changeLrAccountCommonString('Cqzc', ['detail','businessList',i,'beSelect'], !v.get('beSelect')))
												dispatch(lrAccountActions.calculateGainForJzsy())
											}}
										>
											<Checkbox checked={v.get('beSelect')} />
										</li>
										<TableOver
											textAlign='left'
											className='account-flowNumber'
											onClick={() => {
												dispatch(yllsActions.getYllsBusinessData(v,() => this.setState({yllsVisible: true})))
											}}
										>
											<span>{v.get('flowNumber')}</span>
										</TableOver>
										<li>{v.get('categoryName')}</li>
										<li><span style={{textAlign:'right'}}>{formatMoney(Number(v.get('amount'))-Number(v.get('tax')),2,'')}</span></li>
									</TableItem>
								):''
							}

					</TableBody>
				</TableAll>
				<QcModal
					showContactsModal={showContactsModal}
					MemberList={MemberList}
					thingsList={thingsList}
					selectThingsList={selectThingsList}
					dispatch={dispatch}
					currentCardType={'project'}
					modalName={'showContactsModal'}
					palceTemp={'Cqzc'}
					selectedKeys={selectedKeys}
					projectRange={projectRange}
					index={0}
				/>
				{
					yllsVisible ?
					<Ylls
						yllsVisible={yllsVisible}
						dispatch={dispatch}
						yllsState={yllsState}
						onClose={() => this.setState({yllsVisible: false})}
						editLrAccountPermission={true}
						panes={panes}
						lsItemData={lsItemData}
						uuidList={businessList.filter(v => v.get('runningAbstract') !== '期初余额' && v.get('uuid'))}
						showDrawer={() => this.setState({yllsVisible: true})}
						refreshList={() => {
							if(paymentInsertOrModify === 'modify'){
								return
							}else{
								if(categoryUuid) {
									dispatch(lrAccountActions.getAssetsCarryoverList(runningDate, categoryUuid))
								}
							}
					}}
						// inputValue={inputValue}
					/>
					: ''
				}
			</div>
			:
			null
		)
	}
}
