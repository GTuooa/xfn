import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import moment from 'moment'
import { toJS, fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Radio, message, Switch, Tooltip } from 'antd'
import { formatMoney, formatDate, numberCalculate } from 'app/utils'
const RadioGroup = Radio.Group
import { TableBody, TableTitle, TableItem, TableAll, TableOver, XfInput } from 'app/components'
import NumberInput from 'app/components/Input'
import CategorySelect from './component/CategorySelect'
import { getUuidList } from './component/CommonFun'
import { numberTest } from '../common/common'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class Kjfp extends React.Component {

	static displayName = 'Kjfp'

	constructor() {
		super()
		this.state = {
			showSingleJsAmount: 0,
		}
	}
	componentDidMount() {

	}
	componentWillReceiveProps(nextProps) {
		const nextUuidList = nextProps.InvoicingTemp.get('uuidList')
		const thisUuidList = this.props.InvoicingTemp.get('uuidList')


        if (nextUuidList.size !== thisUuidList.size) {
			let totalAmount = 0
			nextProps.InvoicingTemp.get('invoicingList').forEach(v => {
				if (nextUuidList.indexOf(v.get('jrJvUuid')) > -1) {
					if(nextProps.insertOrModify === 'insert'){
						totalAmount = numberCalculate(totalAmount,Math.abs(v.get('notHandleAmount')))
					}else{
						totalAmount = numberCalculate(numberCalculate(totalAmount,Math.abs(v.get('notHandleAmount'))),Math.abs(v.get('handleAmount')))
					}
				}
			})
			if(nextUuidList.size == 1 && nextProps.insertOrModify === 'modify' || nextUuidList.size == 1 && nextProps.insertOrModify === 'insert' ){
				this.props.dispatch(editCalculateActions.changeEditCalculateCommonState('InvoicingTemp', 'amount', totalAmount ))
			}else if(nextUuidList.size == 0 && nextProps.insertOrModify == 'insert'){
				this.props.dispatch(editCalculateActions.changeEditCalculateCommonState('InvoicingTemp', 'amount', '' ))
			}
        }
    }
	render() {
		const {
			InvoicingTemp,
			dispatch,
			disabledDate,
			insertOrModify,
			hideCategoryList,
			panes,
			taxRateTemp,
			calculateViews,
			disabledBeginDate,
		} = this.props
		const { showSingleJsAmount } = this.state

		const scale = taxRateTemp.get('scale')

		const uuidList = InvoicingTemp.get('uuidList')
		const makeOutBusinessUuid = InvoicingTemp.get('makeOutBusinessUuid')
		const jrNumber = InvoicingTemp.get('jrNumber')
		const jrIndex = InvoicingTemp.get('jrIndex')
		const billMakeOutType = InvoicingTemp.get('billMakeOutType')
		const isInvoicingAmount = InvoicingTemp.get('isInvoicingAmount')
		// const oriDate = insertOrModify === 'insert'?this.props.oriDate:InvoicingTemp.get('oriDate')
		const oriDate = this.props.oriDate
		const oriAbstract = InvoicingTemp.get('oriAbstract')
		const invoicingList = InvoicingTemp.get('invoicingList')
		const amount = Number(InvoicingTemp.get('amount')) < 0 ? -Number(InvoicingTemp.get('amount')) : InvoicingTemp.get('amount')

		const paymentTypeStr = calculateViews.get('paymentTypeStr')
		const position = "InvoicingTemp"
		let totalAmount = 0
		let jsAmount = 0 //价税合计
		let singleOriAmount = 0, singleNotHandleAmount = 0, singleHandleAmount = 0;

		const modify = insertOrModify === 'modify' ? true : false

		const disabledDateFun = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}
		let detailElementList = []
		let detailDate = formatDate().slice(0,10)
		let curDateTime = 0
		let hasQcData = false

		const finalUuidList = getUuidList(invoicingList) // 上下条

		invoicingList && invoicingList.forEach(v => {
			const itemDate = new Date(v.get('oriDate')).getTime()
            if (uuidList.indexOf(v.get('jrJvUuid')) > -1) {
				if(insertOrModify === 'insert'){
					totalAmount = numberCalculate(totalAmount,Math.abs(v.get('notHandleAmount')))
				}else{
					totalAmount = numberCalculate(numberCalculate(totalAmount,Math.abs(v.get('notHandleAmount'))),Math.abs(v.get('handleAmount')))
				}
				jsAmount += v.get('oriAmount')
				singleOriAmount = v.get('oriAmount')
				singleNotHandleAmount = Math.abs(v.get('notHandleAmount'))
				singleHandleAmount = Math.abs(v.get('handleAmount'))
				// 不能早于前置流水最晚日期
				detailDate = curDateTime > itemDate ? detailDate : v.get('oriDate')
				curDateTime = new Date(detailDate).getTime()

				if(v.get('beOpened')){
					hasQcData = true
				}
            }

			detailElementList.push(
				<TableItem className='account-invoicing-table-width' key={v.get('jrJvUuid')}>
					<li
						onClick={(e) => {
							e.stopPropagation()
							if(uuidList.size >= Limit.RUNNING_CHECKED_MAX_NUMBER){
								message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
							}else{
								dispatch(editCalculateActions.selectEditCalculateItem(v.get('jrJvUuid'), position))
							}

						}}
					>
						<Checkbox checked={uuidList.indexOf(v.get('jrJvUuid')) > -1}/>
					</li>
					<li>{v.get('oriDate')}</li>
					<TableOver
						textAlign='left'
						className='account-flowNumber'
						onClick={(e) => {
							e.stopPropagation()
							dispatch(previewRunningActions.getPreviewRunningBusinessFetch(v, 'lrls', fromJS(finalUuidList),()=>{
								insertOrModify === 'insert' && dispatch(editCalculateActions.getInvoicingList(billMakeOutType, oriDate))
							}))
						}}
					>
						<span>{v.get('beOpened') ? '' : `${v.get('jrIndex')}号`}</span>
					</TableOver>
					<li><span>{v.get('categoryName')}</span></li>
					<li><span>{v.get('oriAbstract')}</span></li>
					<li><p>{v.get('beOpened') ? '' : formatMoney(v.get('oriAmount'),2,'')}</p></li>
					<li><p>{v.get('beOpened') ? '' : v.get('taxRate') === -1 ? '**%' : `${formatMoney(v.get('taxRate'),0,'')}%`}</p></li>
					<li><p>{insertOrModify === 'insert' ? formatMoney(v.get('notHandleAmount'),2,'') : formatMoney(Number(v.get('handleAmount'))+Number(v.get('notHandleAmount')),2,'')}</p></li>
				</TableItem>
			)
        })
		const selectAll = uuidList.size ? invoicingList.every((v, i) => uuidList.indexOf(v.get('jrJvUuid')) > -1) : false

		const singleJsAmount = insertOrModify === 'insert' ? Number(singleOriAmount) * Number(amount) / Number(singleNotHandleAmount) :
												Number(singleOriAmount) * Number(amount) / Number(singleNotHandleAmount+singleHandleAmount)
		const jsInputAmount = uuidList.size > 1 ? jsAmount : uuidList.size === 0 ? 0 : showSingleJsAmount

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
				<div className="edit-running-modal-list-item">
					<label>日期：</label>
					<div>
						<DatePicker
							allowClear={false}
							disabledDate={(current) => {
								if (modify) {
									return disabledDateFun(current, modify, detailDate)
								} else {
									return disabledDateFun(current)
								}

							}}
							value={oriDate?moment(oriDate):''}
							onChange={value => {
								const date = value.format('YYYY-MM-DD')
								if (insertOrModify === 'insert') {
									dispatch(editCalculateActions.getInvoicingList(billMakeOutType, date))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								} else {
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								}
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
									return <Option key={i} value={v.get('categoryType')} >
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
				<div className="edit-running-modal-list-item">
					<label></label>
					<div>
						<RadioGroup
							value={billMakeOutType}
							disabled={insertOrModify === 'modify'}
							onChange={e => {
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'billMakeOutType', e.target.value))
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriState', {BILL_MAKE_OUT_TYPE_XS:'STATE_KJFP_XS',BILL_MAKE_OUT_TYPE_TS:'STATE_KJFP_TS'}[e.target.value]))
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', {BILL_MAKE_OUT_TYPE_XS:'收入开具发票',BILL_MAKE_OUT_TYPE_TS:'退销开具红字发票'}[e.target.value]))
								dispatch(editCalculateActions.getInvoicingList(e.target.value, oriDate))
							}}>
							<Radio key="a" value={'BILL_MAKE_OUT_TYPE_XS'}>销售开票</Radio>
							<Radio key="b" value={'BILL_MAKE_OUT_TYPE_TS'}>退销开票</Radio>
						</RadioGroup>
					</div>
				</div>
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
				<div className="edit-running-modal-list-item">
                    <label>{isInvoicingAmount ? '开票税额' : '价税合计'}</label>
                    <div>
						{
							isInvoicingAmount ?
							<XfInput
                                autoSelect={true}
                                disabled={uuidList.size >1}
                                value={uuidList.size > 1 ? totalAmount: uuidList.size === 0 ? 0 : amount}
                                mode="amount"
                                placeholder=""
								onChange={(e) =>{
									numberTest(e,(value) => {
										if(Number(value) > Number(totalAmount)){
											message.info('金额不能大于待开发票税额')
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'amount', ''))
										}else{
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'amount', value))
										}
									})
								}}
                            /> :
							<XfInput
                                autoSelect={true}
                                disabled={uuidList.size >1}
                                value={jsInputAmount}
                                mode="amount"
                                placeholder=""
								onChange={(e) =>{
									numberTest(e,(value) => {
										let amount = numberCalculate(numberCalculate(value,singleNotHandleAmount,2,'multiply'),singleOriAmount,2,'divide')

										if(Number(amount) > Number(totalAmount)){
											message.info('金额不能大于待处理价税合计')
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'amount', ''))
											this.setState({
												showSingleJsAmount: ''
											})
										}else{
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'amount', amount))
											this.setState({
												showSingleJsAmount: value
											})
										}

									})
								}}
                            />
						}

						{
							hasQcData || !isInvoicingAmount ? null : <span>价税合计：{uuidList.size == 1 ? formatMoney(singleJsAmount) : formatMoney(jsAmount)}</span>
						}
						{
							!isInvoicingAmount ? <span>税额：{formatMoney(amount)}</span> : null
						}

                    </div>
					{
						uuidList.size === 1 ?
						<Tooltip title={'切换税额计算方式'}>
							<Switch
								className="use-unuse-style lend-bg"
								checked={isInvoicingAmount}
								style={{ margin: '.1rem 0 0 .2rem' }}
								checkedChildren={''}
								unCheckedChildren={''}
								onChange={() => {
									this.setState({
										showSingleJsAmount: formatMoney(singleJsAmount)
									})
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'isInvoicingAmount', !isInvoicingAmount))
								}}
							/>
						</Tooltip> : null
					}
                </div>
				<div className='accountConf-separator'></div>
				<div className='editRunning-detail-title'>
					<div className='editRunning-detail-title-top'>请勾选需要开具发票的流水：</div>
					<div className='editRunning-detail-title-bottom'>
						<span>已勾选流水：{uuidList.size}条</span>
						<span>
							待开发票税额:<span>{formatMoney(totalAmount, 2, '')}</span>
						</span>
					</div>
				</div>
				<TableAll className="editRunning-table">
					<TableTitle
						className="account-invoicing-table-width"
						titleList={['日期', '流水号', '流水类别', '摘要','价税合计','税率','税额']}
						hasCheckbox={true}
						selectAcAll={selectAll}
						onClick={(e) => {
							e.stopPropagation()
							if(!selectAll && Number(uuidList.size) + Number(invoicingList.size) >= Limit.RUNNING_CHECKED_MAX_NUMBER){
								message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
							}else{
								dispatch(editCalculateActions.selectEditCalculateItemAll(selectAll, position, 'invoicingList'))
							}

						}}
					/>
					<TableBody>
						{detailElementList}
					</TableBody>
				</TableAll>
			</div>
		)
    }
}
