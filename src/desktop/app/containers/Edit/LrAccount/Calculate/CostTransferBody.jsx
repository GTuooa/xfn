import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Radio, Icon } from 'antd'
import XfIcon from 'app/components/Icon'
import { formatMoney, DateLib } from 'app/utils'
import SelectAss from './SelectAss'
const RadioGroup = Radio.Group
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
// yezi
import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
import  QcModal  from '../QcModal'
import moment from 'moment'
@immutableRenderDecorator
export default
class CostTransferBody extends React.Component {
	constructor() {
		super()
		this.state = {
			index: 0,
			yllsVisible:false
		}
	}
	componentDidMount() {
		const { lrCalculateState } = this.props
		const runningDate = lrCalculateState.getIn(['costTransferTemp','runningDate'])
		const runningState = lrCalculateState.getIn(['costTransferTemp','runningState'])
		runningDate && this.props.dispatch(lrAccountActions.getCostStockList(runningDate,runningState))
	}
	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}
	render() {

		const {
			lrCalculateState,
			dispatch,
			disabledDate,
			// accountConfState,
			insertOrModify,
			allasscategorylist,
			hideCategoryList,
			cardTemp,
			flags,
			calculateTemp,
			yllsState,
			panes
		} = this.props
		const { yllsVisible } = this.state
		const costTransferTemp = lrCalculateState.get('costTransferTemp')
		const costTransferList = lrCalculateState.get('costTransferList')
		const selectI = lrCalculateState.getIn(['flags','selectI'])
		const uuidList = costTransferTemp.get('uuidList')
		const carryoverBusinessUuid = costTransferTemp.get('carryoverBusinessUuid')
		const flowNumber = costTransferTemp.get('flowNumber')
		const categoryUuid = costTransferTemp.get('categoryUuid')
		const runningState = costTransferTemp.get('runningState')
		const runningDate = costTransferTemp.get('runningDate')
		const runningAbstract = costTransferTemp.get('runningAbstract')
		const carryoverAmount = costTransferTemp.get('carryoverAmount')
		const categoryName  = costTransferTemp.get('categoryName')
		const assList = costTransferTemp.get('assList')
		const selectedKeys = flags.get('selectedKeys')
		const treeData = costTransferTemp.get('runningCategory').size ? costTransferTemp.get('runningCategory') : fromJS([{childList:[]}])
		// 筛出营业收入和其子类别
		// const treeData = accountConfState.updateIn(['runningCategory', 0, 'childList'], v => v.filter(w => w.get('name') === '营业收入')).get('runningCategory')

		const paymentTypeStr = "成本结转"
		const position = "costTransferTemp"

		// const stockRange = cardTemp.getIn(['acBusinessIncome','stockRange'])
		const stockRange = costTransferTemp.get('stockRange')
		const stockCardList = costTransferTemp.get('stockCardList')
		const cardUuid = costTransferTemp.get('cardUuid')
		const showContactsModal = flags.get('showContactsModal')
		const MemberList = flags.get('MemberList')
		const thingsList = flags.get('thingsList')
		const selectThingsList = flags.get('selectThingsList')
		const currentCardType = flags.get('currentCardType')
		const costStockList = flags.get('costStockList')
		const stockCardUuidList = costTransferTemp.get('stockCardUuidList')
		const lsItemData = yllsState.get('lsItemData')
		let totalAmount = 0
		costTransferList.forEach(v => {
            if (uuidList.indexOf(v.get('uuid')) > -1) {
                totalAmount = totalAmount + v.get('amount')
            }
        })
		const selectAll = uuidList.size ? costTransferList.every((v, i) => uuidList.indexOf(v.get('uuid')) > -1) : false

		let  costStockOption =[],stockCardIdList=[]
		stockCardList.map(v =>{
			stockCardIdList.push(v.get('uuid'))
		})
		if(costStockList && costStockList.size) {
			costStockList.forEach((v, i) => {
				if(stockCardIdList.indexOf(v.get('uuid')) === -1){
					costStockOption.push(
						<Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('uuid')}`}>
						{`${v.get('code')} ${v.get('name')}`}
					</Option>
			)
				}

		})
		}

		return (
			<div className="accountConf-modal-list accountConf-modal-list-hidden">
				{
					insertOrModify === 'modify' && flowNumber ?
					<div className="accountConf-modal-list-item">
						<label>流水号：</label>
						<div>{flowNumber}</div>
					</div> : ''
				}
				<div className="accountConf-modal-list-item">
					<label>日期：</label>
					<div>
						<DatePicker
							allowClear={false}
							disabledDate={disabledDate}
							value={runningDate?moment(runningDate):''}
							onChange={value => {
								const date = value.format('YYYY-MM-DD')
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningDate', date))
								if (insertOrModify === 'insert') {
									dispatch(lrAccountActions.getCostStockList(date,runningState))
									dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer','cardUuid', ''))
									dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer',['stockCardRange','code'], ''))
									dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer',['stockCardRange','name'], ''))
									// dispatch(lrCalculateActions.initCostTransferList())
								}
								dispatch(lrCalculateActions.getCostCategory(sessionStorage.getItem('psiSobId'),runningState,date))
							}}
						/>
					</div>
				</div>
				<div className="accountConf-modal-list-item">
					<label>流水类别：</label>
					<div>
						<Select
							disabled={insertOrModify === 'modify'}
							value={paymentTypeStr}
							onChange={value => {
								dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags','paymentType'], value))
							}}
							>
							{
								hideCategoryList.map((v, i) => {
									return <Option key={i} value={v.get('categoryType')}>
										{v.get('name')}
									</Option>
								})
							}
						</Select>
					</div>
				</div>
				<div className="accountConf-modal-list-item">
					<label></label>
					<div>
						<RadioGroup
							value={runningState}
							disabled={insertOrModify === 'modify'}
							onChange={e => {
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningState', e.target.value))
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningAbstract', {STATE_YYSR_XS:'销售存货结转成本',STATE_YYSR_TS:'销货退回结转成本'}[e.target.value]))
								dispatch(lrCalculateActions.getCostTransferList( e.target.value, runningDate))
								dispatch(lrAccountActions.getCostStockList(runningDate,e.target.value))
							}}>
							<Radio key="a" value={'STATE_YYSR_XS'}>销售成本结转</Radio>
							<Radio key="b" value={'STATE_YYSR_TS'}>退销转回成本</Radio>
						</RadioGroup>
					</div>
				</div>
				<div className='accountConf-separator'></div>

				<div className="accountConf-modal-list-item">
					<label>摘要：</label>
					<div>
						<Input
							value={runningAbstract}
							onChange={(e) => {
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningAbstract', e.target.value))
							}}
						/>
					</div>
				</div>
				{
					assList.size ?
					assList.map((v, i) => {
						return <div className="accountConf-modal-list-item" key={i}>
							<label>{v.get('assCategory')}：</label>
							<SelectAss
								assid={v.get('assId')}
								assname={v.get('assName')}
								asscategory={v.get('assCategory')}
								allasscategorylist={allasscategorylist}
								onChange={(value) => {
									dispatch(lrCalculateActions.changeLrCostTransferRunningAssList(value, i))
								}}
								className="accountConf-modal-list-ass-select"
								dispatch={dispatch}
							/>
						</div>
					})
					: ''
				}


				<div className='accountConf-separator'></div>
					{
						stockCardList && stockCardList.map((v,i) =>{
							let curStockUuid,curStockAmount=0
							stockCardUuidList && stockCardUuidList.map((item,j) => {
								if(item.get('uuid') === v.get('uuid')){
									curStockUuid = item.get('uuid')
									curStockAmount += item.get('amount')
								}
							})
							return <div>
							<div className="accountConf-modal-list-item">
								<label>存货：</label>
								<div className='chosen-right'>
									<Select
										showSearch
										combobox
										disabled={insertOrModify === 'modify'}
										value={`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
										onChange={
											value => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const code =  valueList[0]
												const name = valueList[1]
												const uuid = valueList[2]
												const amount = v.get('amount')
												dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer',['stockCardList',i], fromJS({uuid,name,code,amount})))

												dispatch(lrCalculateActions.getCostTransferList(runningState, runningDate))
												dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer', ['stockCardList',i,'amount'], ''))

											}
										}
										>
											{costStockOption}
									</Select>
									{
										insertOrModify !== 'modify' ?
										<div className='chosen-word'
											onClick={() => {
												dispatch(lrAccountActions.getCostCardList(runningDate,runningState,'showContactsModal'))
												dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'stock'))
												dispatch(lrCalculateActions.changeLrCalculateCommonState('flags', 'selectI', i))

										}}>选择</div>
										: ''
									}

								</div>
								{
									insertOrModify === 'modify' ? '' :
									<span className='icon-content'>
										<span className="icon-plus-margin">
											<XfIcon
												type="simple-plus"
												theme="outlined"
												onClick={() => {
													dispatch(lrCalculateActions.changeStockList(stockCardList,i,'add'))

												}}
											/>
										</span>
										{
											stockCardList.size >1 ?
												<span>
													<XfIcon
														type="sob-delete"
														theme="outlined"
														onClick={() => {
															dispatch(lrCalculateActions.changeStockList(stockCardList,i,'delete'))
														}}
													/>
												</span> : ''
										}

									</span>
								}


							</div>
							{
								<div className="accountConf-modal-list-item">
									<label>成本金额：</label>
									<div>
										<Input
											value={v.get('amount')}
											disabled={insertOrModify === 'modify' ?  false : totalAmount == 0 || v.getIn('uuid') === curStockUuid}
											onChange={(e) => {
												if (/^[-\d]\d*\.?\d{0,2}$/g.test(e.target.value) || e.target.value === '') {
													dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer', ['stockCardList',i,'amount'], e.target.value))
												}
											}}
										/>
									</div>
									<div className="income-money">收入金额：{curStockAmount.toFixed(2)}</div>
								</div>
							}

							</div>
						}

						)
					}




				<div className='lrAccount-detail-title'>
					<div className='lrAccount-detail-title-top'>请勾选需要核账的流水：</div>
					<div className='lrAccount-detail-title-bottom'>
						<span>已勾选流水：{uuidList.size}条</span>

						<span>
							{runningState === 'STATE_YYSR_XS' ? '收入' : '退销'}
							金额合计:
							<span>{formatMoney(totalAmount, 2, '')}</span>
						</span>
					</div>
				</div>
				<TableAll className="lrAccount-table">
					<TableTitle
						className="account-cost-transfer-table-width"
						titleList={['日期', '流水号', '流水类别','摘要','存货', '收入金额']}
						hasCheckbox={true}
						selectAcAll={selectAll}
						onClick={(e) => {
							e.stopPropagation()
							dispatch(lrCalculateActions.selectLrCalculateItemAll(selectAll, position, 'costTransferList'))
						}}
					/>
					<TableBody>
						{
							costTransferList.map(v => {
								return <TableItem className='account-cost-transfer-table-width' key={v.get('uuid')}>
									<li
										onClick={(e) => {
											e.stopPropagation()
											dispatch(lrCalculateActions.selectLrCalculateItem(v.get('uuid'), position, v.get('stockCardUuid'),v.get('amount')))
										}}
									>
										<Checkbox checked={uuidList.indexOf(v.get('uuid')) > -1}/>
									</li>
									<li>{v.get('runningDate')}</li>
									<TableOver
										textAlign='left'
										className='account-flowNumber'
										onClick={() => {
											dispatch(yllsActions.getYllsBusinessData(v,() => this.setState({yllsVisible: true})))
										}}
									>
										<span>{v.get('flowNumber')}</span>
									</TableOver>
									<li><span>{v.get('categoryName')}</span></li>
									<li><span>{v.get('runningAbstract')}</span></li>
									<li><span>{v.get('cardStockName')}</span></li>
									<li><p>{v.get('amount')}</p></li>
								</TableItem>
							})
						}
					</TableBody>
				</TableAll>
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
						uuidList={costTransferList.filter((v,i) => i>0 ? v.get('parentUuid') !== costTransferList.getIn([i-1,'parentUuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值')}
						showDrawer={() => this.setState({yllsVisible: true})}
						refreshList={() => dispatch(lrCalculateActions.getCostTransferList(runningState, runningDate))}
						// inputValue={inputValue}
					/>
					: ''
				}

				<QcModal
					showContactsModal={showContactsModal}
					MemberList={MemberList}
					thingsList={thingsList}
					selectThingsList={selectThingsList}
					dispatch={dispatch}
					currentCardType={currentCardType}
					modalName={'showContactsModal'}
					palceTemp={'card'}
					runningState={runningState}
					categoryTypeObj={'acBusinessIncome'}
					fromCarryOver={true}
					categoryUuid={cardUuid}
					runningDate={runningDate}
					selectedKeys={selectedKeys}
					index={selectI}
				/>
			</div>
		)
    }
}
