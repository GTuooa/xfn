import React,{ Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
// import 'app/components/common.less'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'

import { formatFour, formatMoney, DateLib, numberFourTest } from 'app/utils'
import { NumberInput, TableItem, XfnIcon } from 'app/components'
import { DatePicker, Input, Icon, Button, Modal, Divider, Select } from 'antd'
import InputFour from 'app/components/InputFour'
import XfnSelect from 'app/components/XfnSelect'

import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
let warehouseTotalAmount = 0
import XfnInput from 'app/components/Input'
export default
class SerialDrop extends React.Component {
	state={
		value:'',
		focus:false
	}
	render() {
		const { boxShow, batchDate, batchNumber, focus } = this.state
		const {
			dispatch,
			v,
			i,
			stockRange,
			stockCardList,
			oriDate,
			categoryTypeObj,
			stockList,
			taxRate
		} = this.props
		return(
			<span
				style={{overflow:!v.getIn(['financialInfo','openAssist']) && !v.getIn(['financialInfo','openAssist']) || !focus || !v.get('code')?'hidden':'visible'}}
				onClick={() => {
					this.setState({focus:true})
				}}
			>
				{
					(stockList.find(w => w.get('uuid') === v.get('cardUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
					<InputFour
						placeholder='输入数量'
						value={v.get('quantity')}
						onChange={(e) => {
							numberFourTest(e, (value) => {
								dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'quantity'], value))
								if (v.get('price') > 0) {
									const amount =((value || 0) * v.get('price')).toFixed(2)
									dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'amount'], amount))
									dispatch(editRunningActions.autoCalculateStockAmount())
									taxRate && dispatch(editRunningActions.changeAccountTaxRate())

								}
							})
						}}
					/>:''
				}
				<XfnIcon type='edit-pen'/>
				{
					v.get('openSerial')?
					<div style={{position:'relative'}}>
						<Input
							value={v.get('code') ?`${ v.get('code')?v.get('code'):''} ${v.get('name') ? v.get('name'):''}`:undefined}
							onChange={() => {
								dispatch(editRunningActions.changeLrAccountCommonString('ori', ['carryoverCardList',i], fromJS({})))
								dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i], fromJS({})))
							}}
							onFocus={() => {
								this.setState({focus:true})
							}}

						/>
						<div className='inventory-drop-content'>
							{
								v.getIn(['financialInfo','openAssist'])?
								<div>
									<span>属性：</span>
									{
										v.getIn(['financialInfo','assistClassificationList']).map(v =>
											<Select key={v.get('uuid')}>
												{
													v.get('propertyList').map(w =>
														<Option key={w.get('uuid')}>
															{w.get('name')}
														</Option>
													)
												}
											</Select>
										)
									}
								</div>:''
							}
							{
								v.getIn(['financialInfo','openBatch'])?
								<div>
									<span>批次：</span>
									<Select key={v.get('uuid')}>
										{
											(v.get('propertyList') || []).map(w =>
												<Option key={w.get('uuid')}>
													{w.get('name')}
												</Option>
											)
										}
									</Select>
								</div>:''
							}
							<div>
								{/* <Button>取消</Button> */}
								<Button type='primary'>确定</Button>
							</div>
						</div>
					</div>:''
				}


				}
			</span>
		)
	}
}
