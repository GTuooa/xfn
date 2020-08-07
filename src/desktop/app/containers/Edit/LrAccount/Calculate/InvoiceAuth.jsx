import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Radio } from 'antd'
import { formatMoney, DateLib, formatDate } from 'app/utils'
import SelectAss from './SelectAss'
const RadioGroup = Radio.Group
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'
import { toJS } from 'immutable'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
@immutableRenderDecorator
export default
class InvoiceAuth extends React.Component {
	constructor() {
		super()
		this.state = {
			yllsVisible:false
		}
	}
	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}
	componentDidMount() {
		const invoiceAuthTemp = this.props.lrCalculateState.get('invoiceAuthTemp')
		const flags = this.props.lrCalculateState.get('flags')
		const runningDate = invoiceAuthTemp.get('runningDate')
		const billAuthType = invoiceAuthTemp.get('billAuthType')
		const insertOrModify = flags.get('insertOrModify')
		insertOrModify === 'insert' && this.props.dispatch(lrCalculateActions.getInvoiceAuthList(billAuthType, runningDate))
	}
	render() {

		const {
			lrCalculateState,
			dispatch,
			disabledDate,
			insertOrModify,
			allasscategorylist,
			hideCategoryList,
			yllsState,
			panes,
			showDrawer
		} = this.props
		const { yllsVisible } = this.state
		const invoiceAuthTemp = lrCalculateState.get('invoiceAuthTemp')
		const invoiceAuthList = lrCalculateState.get('invoiceAuthList')
		const uuidList = invoiceAuthTemp.get('uuidList')
		const authBusinessUuid = invoiceAuthTemp.get('authBusinessUuid')
		const flowNumber = invoiceAuthTemp.get('flowNumber')
		const billAuthType = invoiceAuthTemp.get('billAuthType')
		const runningDate = invoiceAuthTemp.get('runningDate')
		const runningAbstract = invoiceAuthTemp.get('runningAbstract')
		const assList = invoiceAuthTemp.get('assList')
		const rateAsslist = lrCalculateState.getIn(['rateAcAndAsslist', 'assList'])
		const paymentTypeStr = "发票认证"
		const position = "invoiceAuthTemp"
		const lsItemData = yllsState.get('lsItemData')
		let totalAmount = 0
		invoiceAuthList.forEach(v => {
            if (uuidList.indexOf(v.get('uuid')) > -1) {
                totalAmount = totalAmount + v.get('amount')
            }
        })
		const selectAll = uuidList.size ? invoiceAuthList.every((v, i) => uuidList.indexOf(v.get('uuid')) > -1) : false

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
						<DatePicker allowClear={false} disabledDate={disabledDate} value={runningDate?moment(runningDate):''} onChange={value => {
							const date = value.format('YYYY-MM-DD')
							dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningDate', date))
							if (insertOrModify === 'insert') {
								dispatch(lrCalculateActions.getInvoiceAuthList(billAuthType, date))
							}
						}}/>
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
									return <Option key={v.get('type')} value={v.get('categoryType')}>
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
							value={billAuthType}
							disabled={insertOrModify === 'modify'}
							onChange={e => {
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'billAuthType', e.target.value))
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningAbstract', {BILL_AUTH_TYPE_CG:'增值税专用发票认证',BILL_AUTH_TYPE_TG:'退购红字发票认证'}[e.target.value]))
								dispatch(lrCalculateActions.getInvoiceAuthList(e.target.value, runningDate))
							}}>
							<Radio key="a" value={'BILL_AUTH_TYPE_CG'}>采购发票认证</Radio>
							<Radio key="b" value={'BILL_AUTH_TYPE_TG'}>退购发票认证</Radio>
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
					rateAsslist.size ?
					rateAsslist.map((v, i) => {
						if (v.get('type') === Limit.ACCOUNT_RATE_TYPE_OF_INPUT || v.get('type') === Limit.ACCOUNT_RATE_TYPE_OF_CERTIFIED) {
							return <div className="accountConf-modal-list-item" key={i}>
							<label>{v.get('assCategory')}：</label>
								<SelectAss
									assid={v.get('assId')}
									assname={v.get('assName')}
									asscategory={v.get('assCategory')}
									allasscategorylist={allasscategorylist}
									onChange={(value) => {
										dispatch(lrCalculateActions.changeLrCalculateRateAssList(value, i))
									}}
									className="accountConf-modal-list-ass-select"
									dispatch={dispatch}
								/>
							</div>
						}
					})
					: ''
				}
				<div className='accountConf-separator'></div>
				<div className='lrAccount-detail-title'>
					<div className='lrAccount-detail-title-top'>请勾选需要认证的流水发票：</div>
					<div className='lrAccount-detail-title-bottom'>
						<span>已勾选流水：{uuidList.size}条</span>
						<span>
							待认证税额:<span>{formatMoney(totalAmount, 2, '')}</span>
						</span>
					</div>
				</div>
				<TableAll className="lrAccount-table">
					<TableTitle
						className="account-invoice-auth-table-width"
						titleList={['日期', '流水号', '流水类别', '摘要', '税额']}
						hasCheckbox={true}
						selectAcAll={selectAll}
						onClick={(e) => {
							e.stopPropagation()
							dispatch(lrCalculateActions.selectLrCalculateItemAll(selectAll, position, 'invoiceAuthList'))
						}}
					/>
					<TableBody>
						{
							invoiceAuthList.map(v => {
								return <TableItem className='account-invoice-auth-table-width' key={v.get('uuid')}>
									<li
										onClick={(e) => {
											e.stopPropagation()
											dispatch(lrCalculateActions.selectLrCalculateItem(v.get('uuid'), position))
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
									<li><p>{billAuthType === 'BILL_AUTH_TYPE_CG' ? v.get('amount') : -v.get('amount')}</p></li>
								</TableItem>
							})
						}
					</TableBody>
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
							uuidList={invoiceAuthList.filter(v => v.get('runningAbstract') !== '期初余额' && v.get('uuid'))}
							showDrawer={() => this.setState({yllsVisible: true})}
							refreshList={() => dispatch(lrCalculateActions.getInvoiceAuthList(billAuthType, runningDate))}
							// inputValue={inputValue}
						/>
						: ''
					}
				</TableAll>
			</div>
		)
    }
}
