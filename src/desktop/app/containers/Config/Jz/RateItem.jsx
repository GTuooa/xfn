import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, Input } from 'antd'
import { TableItem, TableOver, TableAll, TableTree, Price } from 'app/components'

import * as jzActions from 'app/redux/Config/Jz/jz.action'

@immutableRenderDecorator
export default
class RateItem extends React.Component {
	render() {
		const {
			idx,
			line,
			item,
			dispatch
		} = this.props

		return (
			<TableItem line={line} className={['rate-tabel-width', item.get('standard') == '1' ? 'rate-tabel-item-none' : ''].join(' ')}>
                <li>{item.get('fcNumber')}</li>
                <li>{item.get('name')}</li>
                <li><Price>{item.get('exchange')}</Price></li>
                <li>
					<Input
						type="text"
						className="rate-tabel-width-input"
						value={item.get('newExchange')}
						onChange={(e) => dispatch(jzActions.changeExchangeJz(idx, e.target.value))}
					/>
				</li>
            </TableItem>
		)
	}
}
