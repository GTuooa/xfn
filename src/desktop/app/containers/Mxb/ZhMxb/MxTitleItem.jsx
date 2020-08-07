import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class lsTitleItem extends React.Component {
	render() {
		// console.log('JvTitleItem')
		const { className,accountType, curAccountUuid, property } = this.props
		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title table-title-amountzhmx`}>
					<li><span>日期</span></li>
					<li><span>流水号</span></li>
					<li><span>摘要</span></li>
					<li><span>类型</span></li>
					<li><span>收款额</span></li>
					<li><span>付款额</span></li>
					{
						curAccountUuid == '全部' || accountType == '全部'?
						<li><span>余额</span></li>
						:
						property === '支出' ?
						<li><span>付款净额</span></li>
						:
						<li><span>收款净额</span></li>
					}
				</ul>
				<i className="shadow-title-amountzhmx"></i>
			</div>
		)
	}
}
