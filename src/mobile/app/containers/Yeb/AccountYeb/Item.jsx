import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'

import * as accountMxbActions from 'app/redux/Mxb/AccountMxb/accountMxb.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			item,
			dispatch,
			className,
			issuedate,
			endissuedate,
			history,
			chooseValue,
		} = this.props



		const accountType = {
			"cash" : '现金',
			"general" : '一般户',
			"basic" : '基本户',
			"Alipay" : '支付宝',
			"WeChat" : '微信',
			"other" : '其它',
            "spare": '备用金',
		}

		return (
			<div className={'ba' + ' ' + className}>
				<div>
					<span
						className='name'
						onClick={(e) => {
							sessionStorage.setItem("fromPage", "zhyeb")
							dispatch(accountMxbActions.getBusinessDetail(history,item,issuedate,endissuedate))
							dispatch(accountMxbActions.changeAccountMxbChooseValue(chooseValue))
						}}
						>
						<span className='name-name'>{item.get('name')}</span>
					</span>
					<span className="zhye-category-type">
						{accountType[item.get('type')]}
						<span className="account-type-icon"></span>
					</span>
				</div>
				<div className='ba-info'>
					<Amount showZero={true}>{item.get('openDebit')}</Amount>
					<Amount showZero={true}>{item.get('currentDebit')}</Amount>
					<Amount showZero={true}>{item.get('currentCredit')}</Amount>
					<Amount showZero={true}>{item.get('closeDebit')}</Amount>
				</div>
			</div>
		)
	}
}
