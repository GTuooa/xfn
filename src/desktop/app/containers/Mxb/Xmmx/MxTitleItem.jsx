import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class lsTitleItem extends React.Component {
	render() {
		// console.log('JvTitleItem')
		const { className,accountType, curAccountUuid, property, amountType } = this.props
		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title xmmxb-table-width`}>
					<li><span>日期</span></li>
					<li><span>流水号</span></li>
					<li><span>摘要</span></li>
					{
						amountType === 'DETAIL_AMOUNT_TYPE_HAPPEN'?
						<li><span>收入额</span></li>
						:
						<li><span>实收额</span></li>
					}
					{
						amountType === 'DETAIL_AMOUNT_TYPE_HAPPEN'?
						<li><span>支出额</span></li>
						:
						<li><span>实付额</span></li>
					}
					{
						amountType === 'DETAIL_AMOUNT_TYPE_HAPPEN'?
						<li><span>收支净额</span></li>
						:
						<li><span>收付净额</span></li>
					}
				</ul>
				<i className="shadow-title-amountxmmx"></i>
			</div>
		)
	}
}
