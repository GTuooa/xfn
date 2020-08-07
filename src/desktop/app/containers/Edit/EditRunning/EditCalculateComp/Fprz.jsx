import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import moment from 'moment'
import { toJS, fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Radio, message } from 'antd'
import { formatMoney, formatDate, numberCalculate } from 'app/utils'
const RadioGroup = Radio.Group
import { TableBody, TableTitle, TableItem, TableAll, TableOver } from 'app/components'
import NumberInput from 'app/components/Input'
import CategorySelect from './component/CategorySelect'
import { getUuidList } from './component/CommonFun'
import { numberTest } from '../common/common'


import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class Fprz extends React.Component {

	static displayName = 'Fprz'

	constructor() {
		super()
		this.state = {

		}
	}
	componentDidMount() {
		// const InvoiceAuthTemp = this.props.InvoiceAuthTemp
		// const oriDate = this.props.oriDate
		// const billAuthType = InvoiceAuthTemp.get('billAuthType')
		// this.props.insertOrModify === 'insert' && this.props.dispatch(editCalculateActions.getInvoicingList(billAuthType, oriDate))
	}
	componentWillReceiveProps(nextProps) {
		const nextUuidList = nextProps.InvoiceAuthTemp.get('uuidList')
		const thisUuidList = this.props.InvoiceAuthTemp.get('uuidList')

        if (nextUuidList.size !== thisUuidList.size) {
			let totalAmount = 0
			nextProps.InvoiceAuthTemp.get('invoiceAuthList').forEach(v => {
				if (nextUuidList.indexOf(v.get('jrJvUuid')) > -1) {
					if(nextProps.insertOrModify === 'insert'){
						totalAmount = numberCalculate(totalAmount,Math.abs(v.get('notHandleAmount')))
					}else{
						totalAmount = numberCalculate(numberCalculate(totalAmount,Math.abs(v.get('notHandleAmount'))),Math.abs(v.get('handleAmount')))
					}
				}
			})
            if(nextUuidList.size == 1 && nextProps.insertOrModify === 'modify' || nextUuidList.size == 1 && nextProps.insertOrModify === 'insert' ){
				this.props.dispatch(editCalculateActions.changeEditCalculateCommonState('InvoiceAuthTemp', 'amount', totalAmount ))
			}else if(nextUuidList.size == 0 && nextProps.insertOrModify == 'insert'){
				this.props.dispatch(editCalculateActions.changeEditCalculateCommonState('InvoiceAuthTemp', 'amount', '' ))
			}
        }
    }
	render() {

		const {
			InvoiceAuthTemp,
			dispatch,
			disabledDate,
			insertOrModify,
			allasscategorylist,
			hideCategoryList,
			panes,
			showDrawer,
			calculateViews,
			disabledBeginDate,
		} = this.props
		const uuidList = InvoiceAuthTemp.get('uuidList') || fromJS([])
		const authBusinessUuid = InvoiceAuthTemp.get('authBusinessUuid')
		const jrIndex = InvoiceAuthTemp.get('jrIndex')
		const billAuthType = InvoiceAuthTemp.get('billAuthType')
		// const oriDate = insertOrModify === 'insert'?this.props.oriDate:InvoiceAuthTemp.get('oriDate')
		const oriDate = this.props.oriDate
		const oriAbstract = InvoiceAuthTemp.get('oriAbstract')
		const invoiceAuthList = InvoiceAuthTemp.get('invoiceAuthList')
		const amount = Number(InvoiceAuthTemp.get('amount')) < 0 ? -Number(InvoiceAuthTemp.get('amount')) : InvoiceAuthTemp.get('amount')

		const paymentTypeStr = calculateViews.get('paymentTypeStr')
		const position = "InvoiceAuthTemp"
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

		const finalUuidList = getUuidList(invoiceAuthList) // 上下条

		invoiceAuthList && invoiceAuthList.forEach(v => {
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
				<TableItem className='account-invoice-auth-table-width' key={v.get('jrJvUuid')}>
					<li
						onClick={(e) => {
							e.stopPropagation()
							if(uuidList.size >= Limit.RUNNING_CHECKED_MAX_NUMBER){
								message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
							}else{
								this.setState({
									changeAmount : true
								})
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
								insertOrModify === 'insert' && dispatch(editCalculateActions.getInvoicingList(billAuthType, oriDate))
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
		const selectAll = uuidList.size ? invoiceAuthList.every((v, i) => uuidList.indexOf(v.get('jrJvUuid')) > -1) : false

		const singleJsAmount = insertOrModify === 'insert' ? Number(singleOriAmount) * Number(amount) / Number(singleNotHandleAmount) :
												Number(singleOriAmount) * Number(amount) / Number(singleNotHandleAmount+singleHandleAmount)

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
									dispatch(editCalculateActions.getInvoicingList(billAuthType, date))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								} else {
								dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								}
							}}/>
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
									return <Option key={v.get('type')} value={v.get('categoryType')}>
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
							value={billAuthType}
							disabled={insertOrModify === 'modify'}
							onChange={e => {
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'billAuthType', e.target.value))
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriState', {BILL_AUTH_TYPE_CG:'STATE_FPRZ_CG',BILL_AUTH_TYPE_TG:'STATE_FPRZ_TG'}[e.target.value]))
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', {BILL_AUTH_TYPE_CG:'增值税专用发票认证',BILL_AUTH_TYPE_TG:'退购红字发票认证'}[e.target.value]))
								dispatch(editCalculateActions.getInvoicingList(e.target.value, oriDate))
							}}>
							<Radio key="a" value={'BILL_AUTH_TYPE_CG'}>采购发票认证</Radio>
							<Radio key="b" value={'BILL_AUTH_TYPE_TG'}>退购发票认证</Radio>
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
                    <label>{billAuthType === 'BILL_AUTH_TYPE_CG' ? '认证' : '对冲'}金额：</label>
                    <div>
                        <NumberInput value={uuidList.size > 1 ? totalAmount : uuidList.size === 0 ? 0 : amount}
							disabled={uuidList.size >1}
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
                        />
						{
							hasQcData ? null : <span>价税合计：{uuidList.size == 1 ? formatMoney(singleJsAmount) : formatMoney(jsAmount)}</span>
						}



                    </div>
                </div>
				<div className='accountConf-separator'></div>
				<div className='editRunning-detail-title'>
					<div className='editRunning-detail-title-top'>请勾选需要认证的流水发票：</div>
					<div className='editRunning-detail-title-bottom'>
						<span>已勾选流水：{uuidList.size}条</span>
						<span>
							待认证税额:<span>{formatMoney(totalAmount, 2, '')}</span>
						</span>
					</div>
				</div>
				<TableAll className="editRunning-table">
					<TableTitle
						className="account-invoice-auth-table-width"
						titleList={['日期', '流水号', '流水类别', '摘要','价税合计','税率', '税额']}
						hasCheckbox={true}
						selectAcAll={selectAll}
						onClick={(e) => {
							e.stopPropagation()
							if(!selectAll && Number(uuidList.size) + Number(invoiceAuthList.size) >= Limit.RUNNING_CHECKED_MAX_NUMBER){
								message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
							}else{
								dispatch(editCalculateActions.selectEditCalculateItemAll(selectAll, position, 'invoiceAuthList'))
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
