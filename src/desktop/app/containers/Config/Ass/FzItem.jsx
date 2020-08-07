import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox }	from 'antd'
import { TableItem, TableOver, Icon } from 'app/components'

import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'

@immutableRenderDecorator
export default
class FzItem extends React.Component {

	render() {

		const {
			idx,
			aclist,
			assItem,
			checked,
			dispatch,
            acidlist,
			className,
			activeAssCategory,
			itemId,
			markModifyIndex
		} = this.props

		return (
			<TableItem line={itemId+1} className={className}>
				<li onClick={() => dispatch(fzhsActions.selectAssItem(idx))}>
					<Checkbox checked={checked}/>
				</li>
				{/* <li>
					<span onClick={() => !sessionStorage.setItem('handleAss', 'modify') && dispatch(fzhsActions.changeFzModalDisplay(assItem))}>
						<Icon className="assconfig-left-edit-icon" type="edit" style={{color: '#666'}}/>
					</span>
				</li> */}
				<TableOver textAlign="left">{assItem.get('assid')}</TableOver>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						markModifyIndex(itemId)
						!sessionStorage.setItem('handleAss', 'modify') && dispatch(fzhsActions.changeFzModalDisplay(assItem)) && sessionStorage.removeItem('handleAssCustom')}
					}>
					{assItem.get('assname')}
				</TableOver>
				<li>
					<Icon type="check" style={{display: assItem.get('disableTime') ? '' : 'none', color: '#666'}} />
				</li>
			</TableItem>
		);
	}
}
