import React, { PropTypes }	from 'react'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, Icon } from 'app/components'

import * as warehouseConfActions from 'app/redux/Config/Warehouse/WarehouseConf.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {
	static displayName = 'WarehouseItem'

	render() {
		const {
			hasSub,
			isExpanded,
			item,
			isAdd,
			isDelete,
			dispatch,
			leve,
			checked,
			history,
		} = this.props

		const leveHolder = ({
			1: () => '',
			2: () => <span className='ac-flag' style={{width:'.1rem',backgroundColor:'#D1C0A5'}}></span>,
			3: () => <span className='ac-flag' style={{width:'.2rem',backgroundColor:'#7E6B5A'}}></span>,
			4: () => <span className='ac-flag' style={{width:'.3rem',backgroundColor:'#59493f'}}></span>
		}[leve])()

		const uuid = item.get('uuid')
		const code = item.get('code')
		const name = item.get('name')

		return (
			<div className={leve == 1 ? "warehouse-item" : 'warehouse-item warehouse-sub'}>
				<Checkbox
					className=""
					style={{display: isDelete ? '' : 'none'}}
					checked={checked}
					onClick={() => {
						dispatch(warehouseConfActions.checkedWarehouseCard(uuid))
					}}
				/>
				<Icon
					style={{
						display: isAdd ? '' : 'none',
						color:'#5d81d1',
						marginRight: '.05rem',
						visibility: leve > 3 ? 'hidden' : ''
					}}
					type="add-plus-fill"
					size="18"
					onClick={() => {
						dispatch(warehouseConfActions.addWarehouseCard({uuid, code, name}))
						history.push('/config/warehouse/card')
					}}
				/>
				{leveHolder}
				<div className="warehouse-item-name">
					<span
						onClick={() => {
							if (isAdd) {
								dispatch(warehouseConfActions.addWarehouseCard({uuid, code, name}))
								history.push('/config/warehouse/card')
							} else if (isDelete) {
								dispatch(warehouseConfActions.checkedWarehouseCard(uuid))
							} else {
								dispatch(warehouseConfActions.getWarehouseSingleCard(uuid, history))
							}
						}}
					>
						{` ${code} ${name}`}
					</span>
				</div>
				<div onClick={() => { dispatch(warehouseConfActions.toggleLowerItem(uuid))}}>
					<Icon type="arrow-down"
						style={{
							display : hasSub ? '' : 'none',
							transform: isExpanded ? 'rotate(180deg)' : ''
						}}
					/>
				</div>
			</div>
		)
	}
}
