import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as currencyActions from 'app/redux/Config/Currency/currency.action'
import { Checkbox, Icon } from 'app/components'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
            key,
            item,
            idx,
            dispatch,
			allCheckboxDisplay,
			isEnd,
			history
		} = this.props

		return (
			<div className="currency-item-wrap">
				<div className="currency-item"
					style={{borderBottom: isEnd ? '0' : ''}}
					onClick={() => {
						if (item.get('standard') === '1') {
							return
						}

						if (allCheckboxDisplay) {
							dispatch(currencyActions.selectCurrencyItem(idx))
						} else {
							dispatch(currencyActions.modifyCurrency(item.get('fcNumber'), item.get('exchange')))
							history.push('/currency/relation/currencyoption')
						}
					}}>
					<Checkbox
						className="checkbox"
						checkedColor="#fb6"
						style={{display: allCheckboxDisplay ? '' : 'none'}}
						checked={item.get('selected') && item.get('standard') !== '1'}
						disabled={item.get('standard') === '1'}
					/>
					<span className="currency-item-info">{item.get('fcNumber')+ '_' + item.get('name')}</span>
					<Icon className="icon" type="arrow-right"/>
				</div>
			</div>
		);
	}
}
