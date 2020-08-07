import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Input } from 'antd'
import { formatMoney } from 'app/utils'
import { TableItem, Amount } from 'app/components'
import XfnInput from 'app/components/XfnInput'

import * as xjllbActions from 'app/redux/Report/Xjllb/xjllb.action.js'

@immutableRenderDecorator
export default
class InitLrItem extends React.Component {

	constructor() {
		super()
		this.state = {lrbClickBool: false}
	}

	render() {

		const { cashItem, className, dispatch, disabledModify, idx, isAdmin } = this.props

		const { lrbClickBool } = this.state
		const lineIndex = cashItem.get('lineIndex') == 23 || cashItem.get('lineIndex') ==24 || cashItem.get('lineIndex') ==25 ? '' : cashItem.get('lineIndex')
		const lineName = cashItem.get('lineName')
		const amount = cashItem.get('lineIndex') == 23 || cashItem.get('lineIndex') ==24 || cashItem.get('lineIndex') ==25 ? '' : cashItem.get('amount')

		return (
			<TableItem className={className} line={idx+1}>
				<li>{lineName.replace(/\./g, '、').replace(/:/g, '：')}</li>
				<li>{lineIndex}</li>
				<li
					// onClick={() => {
					// if (!disabledModify && lineIndex ){
					// 	// this.refs[lineIndex].select()
					// }}}
				>
					{
						disabledModify ?
							<Amount className="initXjllb-amount-line">{amount}</Amount> :
							<XfnInput
								autoSelect={true}
								showFormatMoney={true}
								className='initXjllb-table-input'
								disabled={!isAdmin}
								value={amount}
								onFocus={e => {
									e.target.value = amount ? amount : ''
								}}
								onChange={(e) =>
									dispatch(xjllbActions.changeInitXjllbAmount(idx, e.target.value))
								}
							/>
					}
				</li>
			</TableItem>
		)
	}
}
