import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'

import * as zhmxbActions from 'app/redux/Mxb/Zhmxb/zhmxb.action.js'

@immutableRenderDecorator
export default
class Ba extends React.Component {

	render() {
		const {
			ba,
			dispatch,
			className,
			issuedate,
			endissuedate,
			history
		} = this.props



		const accountType = {
			"cash" : '现金',
			"general" : '一般户',
			"basic" : '基本户',
			"Alipay" : '支付宝',
			"WeChat" : '微信',
			"other" : '其它',
		}

		return (
			<div className={'ba' + ' ' + className}>
				<div>
					<span
						className='name'
						onClick={(e) => {
							sessionStorage.setItem("fromPage", "zhyeb")
							dispatch(zhmxbActions.getBusinessDetail(history,ba,issuedate,endissuedate))
						}}
						>
						<span className='name-name'>{ba.get('name')}</span>
					</span>
					<span className="zhye-category-type">
						{accountType[ba.get('type')]}
						<span className="account-type-icon"></span>
					</span>
				</div>
				<div className='ba-info'>
					<Amount showZero={true}>{ba.get('beginAmount')}</Amount>
					<Amount showZero={true}>{ba.get('monthIncomeAmount')}</Amount>
					<Amount showZero={true}>{ba.get('monthExpenseAmount')}</Amount>
					<Amount showZero={true}>{ba.get('monthBalanceAmount')}</Amount>
				</div>
			</div>
		)
	}
}
