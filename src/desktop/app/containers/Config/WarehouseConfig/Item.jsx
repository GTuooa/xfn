import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Checkbox, Switch }	from 'antd'
import { Icon } from 'app/components'
import { TableItem, TableOver } from 'app/components'

import * as warehouseConfigActions from 'app/redux/Config/warehouseConfig/warehouseConfig.action'

@immutableRenderDecorator
export default
class Item extends React.Component {

	static displayName = 'AccountCongigItem'

	// static propTypes = {
	// 	allState: PropTypes.instanceOf(Map),
	// 	assmxbState: PropTypes.instanceOf(Map),
	// 	homeState: PropTypes.instanceOf(Map),
	// 	dispatch: PropTypes.func
	// }

	render() {
		const {
			className,
			item,
			line,
			checked,
			dispatch,
			showModal,
			showChild,
			haveChild,
			leve,
			upperArr
        } = this.props
		const code = item.get('code')
		const name = item.get('name')
		const uuid = item.get('uuid')
		const canUse = item.get('canUse')
		const beUsed = item.get('beUsed')
		const style = {marginLeft:(leve -1)*10}
		const leveHolder = ({
			1: () => <span style={style}></span>,
			2: () => <span style={style}>-</span>,
			3: () => <span style={style}>--</span>,
			4: () => <span style={style}>---</span>
		}[leve])()
		return (
			<TableItem  className={className}>
				<li
					onClick={(e) => {
						e.stopPropagation()
						dispatch(warehouseConfigActions.warehouseCheckboxCheck(item,upperArr,checked))
					}}
				>
					<Checkbox checked={checked}/>
				</li>
				<li
				>
					{
						leve >= 4 || beUsed?
						<Icon
							type="plus"
							style={{opacity:'0.5'}}
						/>
						:
						<Icon type='plus'
							onClick={()=>{
								dispatch(warehouseConfigActions.beforeInsertWarehouseCard(() => showModal()))
								dispatch(warehouseConfigActions.changeWarehouseConfingCommonViews('insertOrModify','insert'))
								dispatch(warehouseConfigActions.changeWarehouseConfingCommonString('warehouse','insertParentDisabled',false))
								dispatch(warehouseConfigActions.changeWarehouseConfingCommonString('insertCard','parentCard',fromJS({code,name,uuid})))
							}}
						/>
					}

				</li>
				<TableOver
					textAlign="left"
					className='item-underline'
					isLink={true}
					onClick={(e) => {
						e.stopPropagation()
						dispatch(warehouseConfigActions.changeWarehouseConfingCommonString('warehouse','insertParentDisabled',true))
						dispatch(warehouseConfigActions.getWarehouseCard(item))
						dispatch(warehouseConfigActions.changeWarehouseConfingCommonViews('insertOrModify','modify'))
						showModal()
					}}>
					{code}
				</TableOver>
                <TableOver
					textAlign="left"
					>
				<span
					className={haveChild?'out-content':''}
					onClick={(e)=>{
						e.stopPropagation()
						dispatch(warehouseConfigActions.warehouseTraingleSwitch(showChild,uuid))
				}}>
					{leveHolder}
					{`${name}`}
					{
						haveChild?
						<Icon
							type={showChild?'up':'down'}
							style={{float:'right',lineHeight: 'inherit',marginRight:'5px'}}

						/>:''
					}
				</span>
                </TableOver>
                <TableOver >
					<Switch className='use-unuse-style'
						checked={canUse}
						onChange={(checked) => {
							dispatch(warehouseConfigActions.enabledCategory(item.get('uuid'),checked))
						}}
					/>
                </TableOver>
			</TableItem>
		)
	}
}
