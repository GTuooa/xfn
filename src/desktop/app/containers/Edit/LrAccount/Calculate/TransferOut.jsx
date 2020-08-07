import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Radio } from 'antd'
const MonthPicker = DatePicker.MonthPicker
import { formatMoney, DateLib } from 'app/utils'
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
class TransferOut extends React.Component {
	constructor() {
		super()
		this.state = {
			yllsVisible:false
		}
	}
	componentDidMount() {

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
			yllsState,
			panes
		} = this.props
		const { yllsVisible } = this.state
		const transferOutTemp = lrCalculateState.get('transferOutTemp')
		const rateAsslist = lrCalculateState.getIn(['rateAcAndAsslist', 'assList'])
		const uuidList = transferOutTemp.get('uuidList')
		const runningDate = transferOutTemp.get('runningDate')
		const flowNumber = transferOutTemp.get('flowNumber')
		const runningAbstract = transferOutTemp.get('runningAbstract')
		const handleMonth = transferOutTemp.get('handleMonth')

		const transferOutObj = lrCalculateState.get('transferOutObj')
		const flowDtoList = transferOutObj.get('flowDtoList')
		const inputAmount = transferOutObj.get('inputAmount')
		const inputCount = transferOutObj.get('inputCount')
		const outputAmount = transferOutObj.get('outputAmount')
		const outputCount = transferOutObj.get('outputCount')
		const lsItemData = yllsState.get('lsItemData')
		const paymentTypeStr = "转出未交增值税"
		const position = "transferOutTemp"

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
						if (v.get('type') === Limit.ACCOUNT_RATE_TYPE_OF_TURNOUTUNPAID || v.get('type') === Limit.ACCOUNT_RATE_TYPE_OF_UNPAID) {
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

				<div className="accountConf-modal-list-item">
					<label className='large-width-label'>处理税额月份：</label>
					<div>
						<MonthPicker
							disabledDate={disabledDate}
							disabled={insertOrModify === 'modify'}
							value={handleMonth?moment(handleMonth):''}
							onChange={value => {
								const date = value.format('YYYY-MM')
								dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'handleMonth', date))
								dispatch(lrCalculateActions.getTransferOutList(date))
							}}
						/>
					</div>
				</div>
				<div className="accountConf-modal-list-item">
					<label>未交税额：</label>
					<div>
						{formatMoney(outputAmount - inputAmount, 2, '')}
					</div>
				</div>

				<div className='accountConf-separator'></div>

				<div className="accountConf-modal-list-item">
					销项税-流水数： {outputCount}条； 合计税额： {formatMoney(outputAmount, 2, '')}
				</div>
				<div className="accountConf-modal-list-item">
					进项税-流水数： {inputCount}条； 合计税额： {formatMoney(inputAmount, 2, '')}
				</div>

				<TableAll className="lrAccount-table">
					<TableTitle
						className="account-transfer-out-table-width"
						titleList={['日期', '流水号', '流水类别', '摘要', '类型','税额']}
						hasCheckbox={false}
					/>
					<TableBody>
						{
							flowDtoList.map(v => {
								return <TableItem className='account-transfer-out-table-width' key={v.get('uuid')}>
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
									<li><span>{v.get('billType') === 'bill_common' ? '销项税' : '进项税'}</span></li>
									<li><p>{v.get('parentTax')?v.get('parentTax'):v.get('tax')}</p></li>
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
							uuidList={flowDtoList.filter((v,i) => i>0 ? v.get('uuid') !== flowDtoList.getIn([i-1,'uuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值')}
							showDrawer={() => this.setState({yllsVisible: true})}
							refreshList={() => dispatch(lrCalculateActions.getTransferOutList(runningDate))}
							// inputValue={inputValue}
						/>
						: ''
					}
				</TableAll>
			</div>
		)
    }
}
