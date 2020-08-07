import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { DatePicker, InputNumber, Select, message } from 'antd'
import moment from 'moment'
import * as lrpzActions_init from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class VorcherTitle extends React.Component {

	render() {

		const {
			year,
			month,
			vcDate,
			vcIndex,
			dispatch,
			closedBy,
			reviewedBy,
			disabledDate,
			enclosureCountUser
		} = this.props

		console.log('sdf', moment.locale);

		const lrpzActions = (!!closedBy || !!reviewedBy) ? new Proxy({}, {get: () => () => ({type: 'NO_CHANGE'})}) : lrpzActions_init

		const dateFormat = 'YYYY-MM-DD'

		return (
			<div className="voucher-header">
				<div className="voucher-mark">
					<span>凭证字</span>
					<span>
						<Select defaultValue="记" style={{width: 60}}>
							<Select.Option value="记">记</Select.Option>
						</Select>
					</span>
					<span>
						<InputNumber min={1} style={{width: 60}} value={vcIndex}
							onChange={(value) => {
								dispatch(lrpzActions.changeVcId(value))
							}}
						/>
					</span>
					<span>号</span>
				</div>
				<div className="voucher-date">
					<span>日期 </span>
					<DatePicker format={dateFormat} value={vcDate ? moment(vcDate, dateFormat) : ''} disabledDate={disabledDate} onChange={(date, dateString) => dispatch(lrpzActions.changeVoucherDate(dateString, vcDate))} />
				</div>
				<div className="voucher-header-tit">记账凭证</div>
				<span>
					{`${year} 年 第${month} 期`}
				</span>
				<div className="voucher-header-enclosure">
					<span>附件：</span>
					<span>
						<InputNumber min={0} max={99} size="small" style={{width: 60}} value={enclosureCountUser}
							onChange={(value) => {
								if (value === undefined) {
									value = ''
								}
								dispatch(lrpzActions.changeVcEnclosureCountUser(value))
							}}
						/>
					</span>
					<span>个</span>
				</div>
				<div
					className="voucher-account"
					style={{display: closedBy ? 'block' : (reviewedBy ? 'block': 'none')}}
					>
					{closedBy ? '已结账' : '已审核'}
				</div>
			</div>
		);
	}
}
