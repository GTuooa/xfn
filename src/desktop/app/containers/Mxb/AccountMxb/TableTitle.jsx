import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {
		const { accountDetailType, className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className ? `${className} table-title` : "table-title"}>
                    <li className="account-mxb-table-item-date"><span>日期</span></li>
                    <li className="account-mxb-table-item-id"><span>流水号</span></li>
                    <li className="account-mxb-table-item-abstract"><span>摘要</span></li>
                    {
                        accountDetailType === 'OTHER_CATEGORY' ?
                        <li className="account-mxb-table-item-type"><span>类型</span></li>
                        : ''
                    }
                    <li className="account-mxb-table-item-debit-amount"><span>收款额</span></li>
                    <li className="account-mxb-table-item-credit-amount"><span></span>付款额</li>
                    {
                        accountDetailType === 'OTHER_TYPE' ?
                        <li className="account-mxb-table-item-direction"><span>方向</span></li>
                        : ''
                    }
                    <li className="account-mxb-table-item-closed-amount"><span>余额</span></li>
				</ul>
			</div>
		)
	}
}
