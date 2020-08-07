import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount, TextInput } from 'app/components'
import * as jzActions from 'app/redux/Config/Jz/jz.action'

@immutableRenderDecorator
export default
class RateItem extends React.Component {

	render() {
		const {
			key,
			idx,
			item,
            dispatch
		} = this.props

// 改
		return (
            <div className='rate-item rate-table-item' style={{display: item.get('standard') === '1' ? 'none' : ''}}>
                <span>{item.get('fcNumber')}</span>
                <span>{item.get('name')}</span>
                <span>{item.get('exchange')}</span>
                <span>
                    <TextInput
                        className="rate-item-input"
                        value={item.get('newExchange')}
                        onChange={(value) => dispatch(jzActions.changeExchangeJz(idx, value))}
                    />
                </span>
            </div>
		)
	}
}
