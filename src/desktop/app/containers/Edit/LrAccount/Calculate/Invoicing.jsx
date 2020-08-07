import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Radio } from 'antd'
import { formatMoney, DateLib, formatDate } from 'app/utils'
import SelectAss from './SelectAss'
const RadioGroup = Radio.Group
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class Invoicing extends React.Component {
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
		const invoicingTemp = this.props.lrCalculateState.get('invoicingTemp')
		const flags = this.props.lrCalculateState.get('flags')
		const runningDate = invoicingTemp.get('runningDate')
		const billMakeOutType = invoicingTemp.get('billMakeOutType')
		const insertOrModify = flags.get('insertOrModify')
		insertOrModify === 'insert' && this.props.dispatch(lrCalculateActions.getInvoicingList(billMakeOutType, runningDate))
	}
	render() {
		const {
			lrCalculateState,
			dispatch,
			disabledDate,
			accountConfState,
			insertOrModify,
			allasscategorylist,
			hideCategoryList,
			yllsState,
			panes
		} = this.props
		const { yllsVisible } = this.state
		const scale = accountConfState.getIn(['taxRateTemp', 'scale'])

		const invoicingTemp = lrCalculateState.get('invoicingTemp')
		const invoicingList = lrCalculateState.get('invoicingList')
		const uuidList = invoicingTemp.get('uuidList')
		const makeOutBusinessUuid = invoicingTemp.get('makeOutBusinessUuid')
		const flowNumber = invoicingTemp.get('flowNumber')
		const billMakeOutType = invoicingTemp.get('billMakeOutType')
		const runningDate = invoicingTemp.get('runningDate')
		const runningAbstract = invoicingTemp.get('runningAbstract')
		const rateAsslist = lrCalculateState.getIn(['rateAcAndAsslist', 'assList'])
		const lsItemData = yllsState.get('lsItemData')
		const paymentTypeStr = "开具发票"
		const position = "invoicingTemp"
		let totalAmount = 0
		invoicingList.forEach(v => {
            if (uuidList.indexOf(v.get('uuid')) > -1) {
                totalAmount = totalAmount + v.get('tax')
            }
        })
		const selectAll = uuidList.size ? invoicingList.every((v, i) => uuidList.indexOf(v.get('uuid')) > -1) : false

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
									dispatch(lrCalculateActions.getInvoicingList(billMakeOutType, date))
								}
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
									return <Option key={i} value={v.get('categoryType')} >
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
							value={billMakeOutType}
							disabled={insertOrModify === 'modify'}
							onChange={e => {
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'billMakeOutType', e.target.value))
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningAbstract', {BILL_MAKE_OUT_TYPE_XS:'收入开具发票',BILL_MAKE_OUT_TYPE_TS:'退销开具红字发票'}[e.target.value]))
								dispatch(lrCalculateActions.getInvoicingList(e.target.value, runningDate))
							}}>
							<Radio key="a" value={'BILL_MAKE_OUT_TYPE_XS'}>销售开票</Radio>
							<Radio key="b" value={'BILL_MAKE_OUT_TYPE_TS'}>退销开票</Radio>
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

						let show = false
						if (scale === 'small') {
							show = v.get('type') === Limit.ACCOUNT_RATE_TYPE_OF_PAYABLE || v.get('type') === Limit.ACCOUNT_RATE_TYPE_OF_NOTBILLING
						} else if (scale === 'general') {
							show = v.get('type') === Limit.ACCOUNT_RATE_TYPE_OF_WAITOUTPUT || v.get('type') === Limit.ACCOUNT_RATE_TYPE_OF_OUTPUT
						}

						if (show) {
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
					<div className='lrAccount-detail-title-top'>请勾选需要开具发票的流水：</div>
					<div className='lrAccount-detail-title-bottom'>
						<span>已勾选流水：{uuidList.size}条</span>
						<span>
							待开发票税额:<span>{formatMoney(totalAmount, 2, '')}</span>
						</span>
					</div>
				</div>
				<TableAll className="lrAccount-table">
					<TableTitle
						className="account-invoicing-table-width"
						titleList={['日期', '流水号', '流水类别', '摘要','税额']}
						hasCheckbox={true}
						selectAcAll={selectAll}
						onClick={(e) => {
							e.stopPropagation()
							dispatch(lrCalculateActions.selectLrCalculateItemAll(selectAll, position, 'invoicingList'))
						}}
					/>
					<TableBody>
						{
							invoicingList.map(v => {
								return <TableItem className='account-invoicing-table-width' key={v.get('uuid')}>
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
									<li><p>{v.get('tax')}</p></li>
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
							uuidList={invoicingList.filter((v,i) => i>0 ? v.get('parentUuid') !== invoicingList.getIn([i-1,'parentUuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值')}
							showDrawer={() => this.setState({yllsVisible: true})}
							refreshList={() => dispatch(lrCalculateActions.getInvoicingList(billMakeOutType, runningDate))}
							// inputValue={inputValue}
						/>
						: ''
					}
				</TableAll>
			</div>
		)
    }
}
