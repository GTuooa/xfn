import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { fromJS, toJS } from 'immutable'
import { Icon, message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class CombNumber extends React.Component {

	componentDidUpdate(prevProps) {
		// if (this.props.focusAmount && sessionStorage.getItem('lrpzHandleMode') == 'insert'){
		if (this.props.focusAmount){
			this.refs[this.props.idAmount].focus()
		}

		// if (this.props.focusPrice && sessionStorage.getItem('lrpzHandleMode') == 'insert'){
		if (this.props.focusPrice){
			this.refs[this.props.idPrice].focus()
		}
	}

	render() {
		const {
			jvItem,
			dispatch,
			jvCount,
			price,
			onChangeAmount,
			onFocusAmount,
			onBlurAmount,
			onChangePrice,
			onFocusPrice,
			onBlurPrice,
			idAmount,
			idPrice,
			focusAmount,
			focusPrice,
			focusClickAmount,
			focusClickPrice,
			amountDisplay
		} = this.props

		return (
			<div className="voucher-number-wrap"
                style={{background: jvItem.get('acunitOpen')=='1' ? '#fff' :'#f9f9f9', display: amountDisplay ? 'block' : 'none'}}
                >
                <ul className={`voucher-number`}
					style={{display:jvItem.get('acunitOpen')=='1'?'':'none'}}
					>
					<li
						onClick={() => {
							if (!focusAmount){
								this.refs[idAmount].select()
							 }
							 if (!focusAmount){
							   focusClickAmount(idAmount)
						   }
					   }}
					   >
					   <span>数量:</span>
                       <input
						   ref={idAmount}
						//    type="number"
						   value={jvItem.get('acunitOpen')=='1' ? jvCount : ''}
						   onChange={e => onChangeAmount(e)}
						   onFocus={e => onFocusAmount(e)}
						   onBlur={e => onBlurAmount()}
					   />
                       <span>{jvItem.get('jvunit')}</span>
                   </li>

	               <li
					   onClick={() => {
						   if (!focusPrice){
							   this.refs[idPrice].select()
						   }
						   if (!focusPrice){
							   focusClickPrice(idPrice)
						   }
					   }}
					   >
					   <span>单价:</span>
                       <input
						   ref={idPrice}
						//    type="number"
						   value={jvItem.get('acunitOpen')=='1' ? price : ''}
						   onChange={e => onChangePrice(e)}
						   onFocus={e => onFocusPrice(e)}
						   onBlur={e => onBlurPrice()}
					   />
                   </li>
               </ul>

			</div>
		)
	}
}
