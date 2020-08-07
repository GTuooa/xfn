import React,{ Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'

import { formatFour, formatMoney, DateLib, jxcConfigCheck } from 'app/utils'
import { NumberInput, TableItem } from 'app/components'
import { DatePicker, Input, Icon, Button, Modal, message } from 'antd'
import InputFour from 'app/components/InputFour'
import { batchReg, batchMessage } from './common'
import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
let warehouseTotalAmount = 0
import XfnInput from 'app/components/Input'
export default
class BatchDrop extends React.Component {
	state={
		batchNumber:'',
		batchDate:'',
		value:'',
		expirationDate:''
	}
	componentDidMount() {
		// document.body.addEventListener('click', e => {
		// 	e.stopPropagation()
		// 	console.log(e.target.className)

	}
	getCurShelfLife = (startDate,endDate) => {
		const sDate1 = Date.parse(startDate)
		const sDate2 = Date.parse(endDate)
		return sDate2 > sDate1 ? Math.floor((sDate2 - sDate1) / (24 * 3600 * 1000)):null
	}
	calculLife = (date,day) => {
		const sDate = Date.parse(date)
		const newDate = new Date(sDate + day*24*3600*1000)
		return new DateLib(newDate).toString()
	}
	initState = () => {
		this.setState({
			batchDate:'',
			batchNumber:'',
			expirationDate:''
		})
	}
	render() {
		const { batchDate, batchNumber, expirationDate } = this.state
		const {
			dispatch,
			uuid,
			onChange,
			close,
			visible,
			openShelfLife,
			onOk,
			shelfLife,
			callBack
		} = this.props
		return(
				<Modal
					title='新增批次'
					visible={visible}
					onCancel={close}
					footer={[
						<Button onClick={close}>取消</Button>,
						<Button onClick={() => {
							onOk?
							onOk(batchNumber,batchDate,expirationDate,close,callBack)
							:
							dispatch(editInventoryCardActions.insertBatch(batchNumber,openShelfLife?batchDate:'',openShelfLife?expirationDate:'',uuid,close,callBack))
						}}>保存</Button>,
						<Button
							type='primary'
							onClick={() => {
							onOk?
							onOk(batchNumber,batchDate,expirationDate,this.initState,callBack)
							:
							dispatch(editInventoryCardActions.insertBatch(batchNumber,openShelfLife?batchDate:'',openShelfLife?expirationDate:'',uuid,this.initState,callBack))
						}}>保存并新增</Button>
					]}
					>
					<div className={`batch-select-frame`}>
						<div >
							<span><span style={{color:'red'}}>*</span>批次号：</span>
							<Input
								value={batchNumber}
								onChange={e => {
									e.preventDefault()
									if (batchReg.test(e.target.value)) {
										this.setState({batchNumber:e.target.value})

									} else {
										message.info(batchMessage)
									}
								}}
								placeholder='请输入批次号'

							/>
						</div>
						{
							openShelfLife?
							<div>
								<span>生产日期：</span>
								<DatePicker
									placeholder='请选择生产日期'
									allowClear={false}
									size='small'
									// disabledDate={curDisableDate}
									// value={moment(oriDate)}
									value = {batchDate?moment(batchDate):''}
									onChange={value => {
										const date = value.format('YYYY-MM-DD')
										this.setState({batchDate:date})
										if (!expirationDate && shelfLife) {
											this.setState({expirationDate:this.calculLife(date,shelfLife)})

										}
										// dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
									}}
								/>
							</div>:''
						}
						{
							openShelfLife?
							<div>
								<span><span style={{color:'red'}}>*</span>截止日期：</span>
								<DatePicker
									placeholder='请选择截止日期'
									allowClear={false}
									size='small'
									// disabledDate={curDisableDate}
									// value={moment(oriDate)}
									value = {expirationDate? moment(expirationDate) : ''}
									onChange={value => {
										const date = value.format('YYYY-MM-DD')
										this.setState({expirationDate:date})
										// dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
									}}
								/>
							</div>:''
						}
						{
							openShelfLife && (shelfLife || batchDate && expirationDate)?
							<div>
								<span></span>
								<div>{`(${shelfLife?`默认保质期：${shelfLife}天 `:''}${this.getCurShelfLife(batchDate,expirationDate)?`实际保质期：${this.getCurShelfLife(batchDate,expirationDate)}天`:''})`}</div>
							</div>:''
						}
					</div>
				</Modal>
		)
	}
}
