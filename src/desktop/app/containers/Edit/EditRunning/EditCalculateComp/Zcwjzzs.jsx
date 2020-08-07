import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select,message } from 'antd'
const MonthPicker = DatePicker.MonthPicker
import { formatMoney } from 'app/utils'
import { TableBody, TableTitle, TableItem, TableAll, TableOver } from 'app/components'
import { toJS } from 'immutable'

import CategorySelect from './component/CategorySelect'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class Zcwjzzs extends React.Component {

	constructor() {
		super()
		this.state = {
		}
	}
	componentDidMount() {

	}
	render() {

		const {
			TransferOutTemp,
			dispatch,
			disabledDate,
			// accountConfState,
			insertOrModify,
			hideCategoryList,
			panes,
			calculateViews
		} = this.props
		const uuidList = TransferOutTemp.get('uuidList')
		// const oriDate = insertOrModify === 'insert'?this.props.oriDate:TransferOutTemp.get('oriDate')
		const oriDate = this.props.oriDate
		const jrIndex = TransferOutTemp.get('jrIndex')
		const oriAbstract = TransferOutTemp.get('oriAbstract')
		const handleMonth = TransferOutTemp.get('handleMonth')

		const transferOutObj = TransferOutTemp.get('transferOutObj')
		const jrJvVatDtoList = transferOutObj.get('jrJvVatDtoList')
		const inputAmount = transferOutObj.get('inputAmount')
		const inputCount = transferOutObj.get('inputCount')
		const outputAmount = transferOutObj.get('outputAmount')
		const outputCount = transferOutObj.get('outputCount')
		const paymentTypeStr = calculateViews.get('paymentTypeStr')
		const position = "TransferOutTemp"

		return (
			<div className="accountConf-modal-list accountConf-modal-list-hidden">
			{
				insertOrModify === 'modify'?
				<div className="edit-running-modal-list-item">
					<label>流水号：</label>
					<div>
						<NumberInput
							style={{width:'70px',marginRight:'5px'}}
							value={jrIndex}
							onChange={(e) => {
								if (/^\d{0,6}$/.test(e.target.value)) {
									dispatch(editCalculateActions.changeEditCalculateCommonState(position,'jrIndex', e.target.value))
								} else {
									message.info('流水号不能超过6位')
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
			{
				// insertOrModify === 'modify' && jrIndex?
				// <div className="edit-running-modal-list-item">
				// <label>流水号：</label>
				// <div>{`${jrIndex}号`}</div>
				// </div> : ''
			}
				<div className="edit-running-modal-list-item">
					<label>日期：</label>
					<div>
						<DatePicker
							allowClear={false}
							disabledDate={disabledDate}
							value={oriDate?moment(oriDate):''}
							onChange={value => {
								const date = value.format('YYYY-MM-DD')
								// if (insertOrModify === 'insert') {
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								// } else {
								// 	dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriDate', date))
								// }
							}}
						/>
					</div>
				</div>
				{/* <div className="edit-running-modal-list-item">
					<label>流水类别：</label>
					<div>
						<Select
							disabled={insertOrModify === 'modify'}
							value={paymentTypeStr}
							onChange={value => {
								dispatch(editRunningActions.changeLrAccountCommonString('', ['flags','paymentType'], value))
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
				</div> */}
				<CategorySelect
					dispatch={dispatch}
					insertOrModify={insertOrModify}
					paymentTypeStr={paymentTypeStr}
					hideCategoryList={hideCategoryList}
				/>
				<div className='accountConf-separator'></div>

				<div className="edit-running-modal-list-item">
					<label>摘要：</label>
					<div>
						<Input className="focus-input"
							onFocus={(e) => {
								document.getElementsByClassName('focus-input')[0].select();
							}}
							value={oriAbstract}
							onChange={(e) => {
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', e.target.value))
							}}
						/>
					</div>
				</div>
				<div className='accountConf-separator'></div>

				<div className="edit-running-modal-list-item">
					<label className='large-width-label'>处理税额月份：</label>
					<div>
						<MonthPicker
							disabledDate={disabledDate}
							disabled={insertOrModify === 'modify'}
							value={handleMonth?moment(handleMonth):''}
							onChange={value => {
								const date = value.format('YYYY-MM')
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'handleMonth', date))
								dispatch(editCalculateActions.getTransferOutList(date))
							}}
						/>
					</div>
				</div>
				<div className="edit-running-modal-list-item">
					<label>未交税额：</label>
					<div>
						{formatMoney(outputAmount - inputAmount, 2, '')}
					</div>
				</div>

				<div className='accountConf-separator'></div>

				<div className="edit-running-modal-list-item">
					销项税-流水数： {outputCount}条； 合计税额： {formatMoney(outputAmount, 2, '')}
				</div>
				<div className="edit-running-modal-list-item">
					进项税-流水数： {inputCount}条； 合计税额： {formatMoney(inputAmount, 2, '')}
				</div>

				<TableAll className="lrAccount-table">
					<TableTitle
						className="account-transfer-out-table-width"
						titleList={['日期', '流水号', '流水类别', '摘要', '发票类型','价税合计','税率','税额']}
						hasCheckbox={false}
					/>
					<TableBody>
						{
							jrJvVatDtoList.map(v => {
								return <TableItem className='account-transfer-out-table-width' key={v.get('uuid')}>
									<li>{v.get('oriDate')}</li>
									<TableOver
										textAlign='left'
										className='account-flowNumber'
										onClick={(e) => {
											e.stopPropagation()
											dispatch(previewRunningActions.getPreviewRunningBusinessFetch(v, 'lrls'))
										}}
									>
										<span>{`${v.get('jrIndex')}号`}</span>
									</TableOver>
									<li><span>{v.get('categoryName')}</span></li>
									<li><span>{v.get('oriAbstract')}</span></li>
									<li><span>{v.get('pendingStrongType') === 'JR_STRONG_STAY_ZCXX' ? '销项税' : '进项税'}</span></li>
									<li><p>{formatMoney(v.get('oriAmount'),2,'')}</p></li>
									<li><p>{`${formatMoney(v.get('taxRate'),0,'')}%`}</p></li>
									<li><p>{formatMoney(v.get('taxAmount'),2,'')}</p></li>
								</TableItem>
							})
						}
					</TableBody>

				</TableAll>
			</div>
		)
    }
}
