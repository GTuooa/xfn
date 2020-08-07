import React,{ Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'

import { formatFour, formatMoney } from 'app/utils'
import { NumberInput, TableItem, Icon } from 'app/components'
import { DatePicker, Input } from 'antd'
import InputFour from 'app/components/InputFour'

import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
let warehouseTotalAmount = 0
import XfnInput from 'app/components/Input'
export default
class WarehouseTableItem extends React.Component {
	render() {
		const {
			item,
			showChild,
			hideChildList,
			warehousePriceMode,
			isOpenedQuantity,
			enableWarehouse,
			unit,
			hideChildFunc,
			showChildFunc,
			line,
			level,
			isCheckOut,
			dispatch,
			index,
			openAssist,
			openBatch
		} = this.props
		let totalAmount = 0,totalNumber = 0
		const loop = (data) => data.map(v => {
			if (v.get('childList') && v.get('childList').size && !v.get('isEnd')) {
				loop(v.get('childList'))
			} else {
				if (openAssist || openBatch) {
					totalAmount += v.get('childList').reduce((pre,cur) => pre + (Number(cur.get('openedAmount')) || 0),0)
					totalNumber += v.get('childList').reduce((pre,cur) => pre + (Number(cur.get('openedQuantity')) || 0),0)
				} else {
					totalAmount += Number(v.get('openedAmount')) || 0
					totalNumber += Number(v.get('openedQuantity')) || 0
				}
			}
		})
		loop(item.get('childList'))
		const paddingLeft = 5+(level - 1)*7 + 'px'
		return <TableItem key={item.get('warehouseUuid')} line={line}>
			<li className='inventory-code' style={{paddingLeft}}>{item.get('warehouseCode')}</li>
			<li	className='inventory-name'><span>{item.get('warehouseName')}</span>
				{
					<Icon type={showChild?'up':'down'} onClick={() => {
						!showChild?
						showChildFunc()
						:
						hideChildFunc()
					}}/>
			}
		</li>
		{
			isOpenedQuantity?
			<li	className='force-centet'><span className='input-quantity'>{formatFour(totalNumber)}</span><span>{unit.get('name')}</span></li>:''
		}

			{/* {
				// warehousePriceMode !== 'U' && (isOpenedQuantity || enableWarehouse) || !isOpenedQuantity?
				isOpenedQuantity && !item.get('isEnd') ?
					<li	className='force-centet'>
						<NumberInput
						className='input-amount'
						type="regAmount"
						disabled={isCheckOut}
						placeholder="必填，请输入金额"
						value={item.get('openedAmount')}
						onChange={(value) => {
							dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'openedAmount'],value))
						}}
						/>
						<span>元</span>
					</li>
					:
					!isOpenedQuantity?
					<li className='force-centet'><span className='input-amount'>{formatMoney(totalAmount)}</span><span>元</span></li>:<li></li>
					// :''
			} */}
			<li className='force-centet'><span className='input-amount'>{formatMoney(totalAmount)}</span><span>元</span></li>
		</TableItem>
	}
}
