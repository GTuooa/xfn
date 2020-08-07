import React from 'react'
import { Icon } from 'antd'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as currencyYebActions from 'app/redux/Yeb/CurrencyYeb/currencyYeb.action.js'

@immutableRenderDecorator
export default
class TableTit extends React.Component {
	render() {
		const { dispatch, isShow } = this.props
		const ulName = isShow ? 'spread' : 'noSpread'
		return (
				<div className="currencyYeb-table-title-wrap">
					<ul className={`currencyYeb-table-title-${ulName}`}>
						<li className="currencyYeb-table-one">编码</li>
						<li className="currencyYeb-table-two">币别</li>
						<li className="currencyYeb-table-three">
							<div className="currencyYeb-table-title-text">期初余额</div>
							<div className="currencyYeb-table-title-item">
								<span>借方原币</span>
								<span>借方本位币</span>
								<span>贷方原币</span>
								<span>贷方本位币</span>
							</div>
						</li>
						<li className="currencyYeb-table-four">
							<div className="currencyYeb-table-title-text">本期发生额</div>
							<div className="currencyYeb-table-title-item">
								<span>借方原币</span>
								<span>借方本位币</span>
								<span>贷方原币</span>
								<span>贷方本位币</span>
							</div>
						</li>

						{
							isShow ?
							<li className="currencyYeb-table-five" onClick={()=> dispatch(currencyYebActions.changeCurrencyYebShow())}>
								<div className="currencyYeb-table-show-left"><Icon type="caret-left" size="10"/></div>
								<div className="currencyYeb-table-title-text">本年发生额</div>
								<div className="currencyYeb-table-title-item">
									<span>借方原币</span>
									<span>借方本位币</span>
									<span>贷方原币</span>
									<span style={{justifyContent: 'flex-start'}}>贷方本位币</span>
								</div>
								<div className="currencyYeb-table-show-right"><Icon type="caret-right"/></div>
							</li> :
							<li className="currencyYeb-table-show" onClick={()=> dispatch(currencyYebActions.changeCurrencyYebShow())}>
								<div className="currencyYeb-table-show-left"><Icon type="caret-left"/></div>
									展开
								<div className="currencyYeb-table-show-right"><Icon type="caret-right"/></div>
							</li>
						}

						<li className="currencyYeb-table-six">
							<div className="currencyYeb-table-title-text">期末余额</div>
							<div className="currencyYeb-table-title-item">
								<span>借方原币</span>
								<span>借方本位币</span>
								<span>贷方原币</span>
								<span>贷方本位币</span>
							</div>
						</li>
					</ul>
					<i className="shadow-title-Amyeb"></i>
				</div>
		)
	}
}
