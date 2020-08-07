import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon } from 'app/components'
import * as AmyebActions from 'app/redux/Yeb/AmountYeb/amountYeb.action.js'

@immutableRenderDecorator
export default
class TableTit extends React.Component {

	render() {

		const { dispatch, isShow, beSupport } = this.props
		const ulName = isShow ? 'spread' : 'noSpread'
		return (
			<div className="ammountyeb-table-title-wrap">
				<ul className={`ammountyeb-table-title-${ulName}`}>
					<li >{beSupport?'编码':'科目编码'}</li>
					<li ><span>{beSupport?'名称':'科目名称'}</span></li>
					<li >单位</li>
					<li className="ammountyeb-table-four">
						<div className="ammountyeb-table-title-text">期初余额</div>
						<div className="ammountyeb-table-title-item">
							<span>方向</span>
							<span>数量</span>
							<span>单价</span>
							<span>金额</span>
						</div>
					</li>
					<li className="ammountyeb-table-five">
						<div className="ammountyeb-table-title-text">本期借方</div>
						<div className="ammountyeb-table-title-item">
							<span>数量</span>
							<span>金额</span>
						</div>
					</li>
					<li className="ammountyeb-table-six">
						<div className="ammountyeb-table-title-text">本期贷方</div>
						<div className="ammountyeb-table-title-item">
							<span>数量</span>
							<span>金额</span>
						</div>
					</li>
					{/*  */}
					{
						isShow ?
							<li className="ammountyeb-table-seven" onClick={() => {
								dispatch(AmyebActions.changeAmyebShow())
							}}>
								<div className="ammountyeb-table-title-text">本年累计借方</div>
								<div className="ammountyeb-table-title-item">
									<span>数量</span>
									<span>金额</span>
								</div>
							<div className="ammountyeb-table-show-left"><Icon type="caret-left"/></div>
							</li> :
							<li className="ammountyeb-table-show" onClick={()=> dispatch(AmyebActions.changeAmyebShow())}>
								<div className="ammountyeb-table-show-left"><Icon type="caret-left"/></div>
									展开
								<div className="ammountyeb-table-show-right"><Icon type="caret-right"/></div>
							</li>
					}
					{
						isShow ?
							<li className="ammountyeb-table-eight" onClick={() => {
								dispatch(AmyebActions.changeAmyebShow())
							}}>
								<div className="ammountyeb-table-title-text">本年累计贷方</div>
								<div className="ammountyeb-table-title-item">
									<span>数量</span>
									<span>金额</span>
								</div>
								<div className="ammountyeb-table-show-right"><Icon type="caret-right"/></div>
							</li> : ''
					}
					<li className="ammountyeb-table-nine">
						<div className="ammountyeb-table-title-text">期末余额</div>
						<div className="ammountyeb-table-title-item">
							<span>方向</span>
							<span>数量</span>
							<span>单价</span>
							<span>金额</span>
						</div>
					</li>
				</ul>
				<i className="shadow-title-Amyeb"></i>
			</div>
		)
	}
}
