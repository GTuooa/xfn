import React, { PropTypes }	from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Amount, XfInput } from 'app/components'
import { configCheck, decimal } from 'app/utils'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			leve,
			idx,
			hasSub,
			isExpanded,
			item,
			dispatch,
			isOpenedQuantity,
			parentUuidList,
			openAssist,
			openSerial,
			openBatch,
			openShelfLife,
			assistClick,
			serialClick,
		} = this.props

		const uuid = item.get('warehouseUuid')
		const code = item.get('warehouseCode')
		const name = item.get('warehouseName')
		const isEnd = item.get('isEnd')//末级仓库
		const openedQuantity = item.get('openedQuantity')
		const openedAmount = item.get('openedAmount')
		const amountInput = hasSub || (isEnd && (openAssist || openBatch)) ? false : true
		const quantityInput = hasSub || openSerial || (isEnd && (openAssist || openBatch)) ? false : true
		const uuidList = parentUuidList.slice(-2)
		const isOpenItem = uuidList[0]==uuidList[1] ? true : false//是否是属性列表
		const onlySerial = isEnd && openSerial && (!(openAssist || openBatch))//末级仓库且只开启序列号

		const leveHolder = ({
			1: () => '',
			2: () => <span className='ac-flag' style={{width:'.1rem',backgroundColor:'#D1C0A5'}}></span>,
			3: () => <span className='ac-flag' style={{width:'.2rem',backgroundColor:'#7E6B5A'}}></span>,
			4: () => <span className='ac-flag' style={{width:'.3rem',backgroundColor:'#59493f'}}></span>,
			5: () => '',
		}[leve])()

		let component = null
		if (isOpenItem) {
			const assistList = item.get('assistList') ? item.get('assistList') : fromJS([])
			const batch = item.get('batch') ? item.get('batch') : ''
			const expirationDate = item.get('expirationDate') ? item.get('expirationDate') : ''
			let nameStr = ''
			if (openAssist) { nameStr = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, nameStr) }
			if (openBatch && batch) { nameStr = `${nameStr}${nameStr?';':''}${batch}` }
			if (openShelfLife && expirationDate) { nameStr = `${nameStr}(${expirationDate})` }

			component = (
				<div className='open'>
					<div className='left'
						onClick={()=> {
							dispatch(inventoryConfAction.changeOpened('openedDelete', parentUuidList, openedQuantity, openedAmount, idx))
						}}
						>
						<Icon type="delete-plus"/>
					</div>
					<div className='right'>
						<div className='top underline blue'
							style={{display: (openAssist || openBatch) ? '' : 'none'}}
							onClick={() => assistClick()}
							>
							{nameStr ? nameStr : '点击选择'}
						</div>
						<div className='bottom'>
							<div className='underline blue' style={{display: (openSerial) ? '' : 'none'}} onClick={() => serialClick()}>
								{openedQuantity?<Amount decimalPlaces={4} decimalZero={false}>{openedQuantity}</Amount>:'点击输入'}
								<Icon type="edit"/>
							</div>
							<div style={{display: (!openSerial) ? '' : 'none'}}>
								<XfInput.BorderInputItem
									mode='number'
									negativeAllowed={true}
								    textAlign='right'
									value={openedQuantity}
									onChange={value => {
										let newValue = Number(value) ? Number(value) : 0
										let oldValue = Number(openedQuantity) ? Number(openedQuantity) : 0
										dispatch(inventoryConfAction.changeOpened('openedQuantity', parentUuidList, decimal(newValue-oldValue, 4), value, idx))
									}}
								/>
							</div>
							<div>
								<XfInput.BorderInputItem
								    mode='amount'
									negativeAllowed={true}
								    textAlign='right'
									value={openedAmount}
									onChange={value => {
										let newValue = Number(value) ? Number(value) : 0
										let oldValue = Number(openedAmount) ? Number(openedAmount) : 0
										dispatch(inventoryConfAction.changeOpened('openedAmount', parentUuidList, decimal(newValue-oldValue), value, idx))
									}}
								/>
							</div>
						</div>
					</div>

				</div>
			)
		}

		if (!isOpenItem) {
			component = (
				<div className='inventory-opened-item'>
					<div className='flex-four overElli'>
						{leveHolder}
						<div className="inventory-warehouse inventory-warehouse-sub overElli">
							<span className='name overElli'>{` ${code} ${name}`}</span>
							<div onClick={() => {
								if (isEnd) {//末级仓库
									dispatch(inventoryConfAction.changeOpened('openedAdd', parentUuidList))
								} else {//展开收起
									dispatch(inventoryConfAction.toggleLowerItem(uuid))}
								}
							}>
								<Icon type={isEnd ? 'add-plus' : "arrow-down"}
									style={{ //|| openSerial
										display : (hasSub || (isEnd && (openAssist || openBatch))) ? '' : 'none',
										transform: (isExpanded && (!isEnd)) ? 'rotate(180deg)' : ''
									}}
								/>
							</div>
						</div>
					</div>

					{
						isOpenedQuantity ?
						<div className='inventory-title-item flex-three'>
							{ !quantityInput ? (onlySerial ? <span className='underline blue' onClick={() => serialClick()}>
								{openedQuantity ? <Amount decimalPlaces={4} decimalZero={false}>{openedQuantity}</Amount> : '点击输入'}
								<Icon type="edit"/>
							</span> : <Amount showZero decimalPlaces={4} decimalZero={false}>{Number(openedQuantity)}</Amount>) : null}
							{ quantityInput ? <XfInput.BorderInputItem
							    mode='number'
								negativeAllowed={true}
							    textAlign='right'
								value={openedQuantity}
								// disabled={isCheckOut}
								onChange={value => {
									let newValue = Number(value) ? Number(value) : 0
									let oldValue = Number(openedQuantity) ? Number(openedQuantity) : 0
									dispatch(inventoryConfAction.changeOpened('openedQuantity', parentUuidList, decimal(newValue-oldValue, 4), value, idx))
								}}
							/> : null}
						</div> : null
					}
					<div className='inventory-title-item flex-three'>
						{ !amountInput ? <Amount showZero>{Number(openedAmount)}</Amount> : null}
						{ amountInput ? <XfInput.BorderInputItem
						    mode='amount'
							negativeAllowed={true}
						    textAlign='right'
							value={openedAmount}
							// disabled={isCheckOut}
							onChange={value => {
								let newValue = Number(value) ? Number(value) : 0
								let oldValue = Number(openedAmount) ? Number(openedAmount) : 0
								dispatch(inventoryConfAction.changeOpened('openedAmount', parentUuidList, decimal(newValue-oldValue), value, idx))
							}}
						/> : null}
					</div>


				</div>
			)
		}

		return component
	}
}
