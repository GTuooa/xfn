import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class VoucherBodyWrap extends React.Component {

	render() {
		const {
			amountDisplay,
			currencyDisplay
		} = this.props

		return (
			<div className="voucher-title">
				<div className="voucher-abstract">
					<span>摘要</span>
				</div>
				<div className="voucher-acount">
					<span>会计科目</span>
				</div>
                <div className="voucher-number-wrap"
					style={{display: amountDisplay ? 'block' : 'none'}}
					>
					<span>数量</span>
				</div>
				<div className="voucher-number-wrap"
					style={{display: currencyDisplay ? 'block' : 'none'}}
					>
					<span>外币</span>
				</div>
				<div className="voucher-cr">
					<div>借方金额</div>
					<ul className="voucher-amount-title text-show-wrap text-show-wrap-left">
						{['','亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分'].map((v, i) => <li key={i}>{v}</li>)}
					</ul>
				</div>
				<div className="voucher-de">
					<div>贷方金额</div>
					<ul className="voucher-amount-title text-show-wrap">
						{['','亿', '千', '百', '十', '万', '千', '百', '十', '元','角' , '分'].map((v, i) => <li key={i}>{v}</li>)}
					</ul>
				</div>
			</div>
		)
	}
}
