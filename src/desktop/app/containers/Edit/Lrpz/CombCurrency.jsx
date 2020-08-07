import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { fromJS, toJS } from 'immutable'
import { Icon, message, Input, Select } from 'antd'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class CombCurrency extends React.Component {

	componentDidUpdate(prevProps) {
		if (this.props.focusStandardAmount){
			this.refs[this.props.idStandardAmount].focus()
		}

		if (this.props.focusExchange){
			this.refs[this.props.idExchange].focus()
		}
	}

	render() {
		const {
			id,
            jvItem,
			dispatch,
			exchange,
			standardAmount,
			currencyList,
			onSelect,
			currencyDisplay,
			changeStandardAmount,
			changeExchange,
			idExchange,
			idStandardAmount,
			focusStandardAmount,
			focusExchange,
			focusClickStandardAmount,
			focusClickExchange,
			onFocusStandardAmount,
			onBlurStandardAmount,
			onFocusExchange,
			onBlurExchange
		} = this.props


		return (
			<div className="voucher-number-wrap"
				style={{background: jvItem.get('fcNumber') ? '#fff' :'#f9f9f9', display: currencyDisplay ? 'block' : 'none'}}
				>
                <ul className="voucher-currency"
					style={{display: jvItem.get('fcNumber') ? '' : 'none'}}
					>
                    <li
						onClick={() => {
							if (!focusStandardAmount){
								this.refs[idStandardAmount].select()
							 }
							 if (!focusStandardAmount){
							   focusClickStandardAmount(idStandardAmount)
						   }
					   }}
						>
                        <span>原币:</span>
                        <input
							ref={idStandardAmount}
							type="number"
							value={jvItem.get('fcNumber') ? standardAmount : ''}
							onChange={changeStandardAmount}
							onFocus={e => onFocusStandardAmount(e)}
 						    onBlur={e => onBlurStandardAmount()}

						/>
                    </li>
                    <li
						onClick={() => {
							if (!focusExchange){
								this.refs[idExchange].select()
							 }
							 if (!focusExchange){
							   focusClickExchange(idExchange)
						   }
					   }}>
						<span className="voucher-currency-select clearfix">
							<span className="voucher-currency-select-left">{jvItem.get('fcNumber')}</span>
							<span className="voucher-currency-select-right">
								<span onClick={() => onSelect('pre')}></span>
								<span onClick={() => onSelect('next')}></span>
							</span>
						</span>

						{/* <Select
							showSearch
							// className={"combselect-select"}
							optionFilterProp={"children"}
							notFoundContent="无法找到相应科目"
							// value={acValue}
							// onChange={value => value || onChange(value)}
							// onSelect={onChange}
							>
							{
								currencyList.map((u,i) => (
									<Option key={i} value={u.get('fcNumber')}>{u.get('fcNumber')}</Option>
								))
							}
						</Select> */}

						<input
							ref={idExchange}
							// type="number"
							value={jvItem.get('fcNumber') ? exchange : ''}
							onChange={changeExchange}
							onFocus={e => onFocusExchange(e)}
 						    onBlur={e => onBlurExchange()}
						/>
					</li>
                </ul>
            </div>
		)
	}
}
