import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class VoucherBottom extends React.Component {

	render() {
		const {
			createdBy,
			modifiedTime,
			createdTime
		} = this.props

		return (
			<div className="voucher-footer">
				<span>制单人:{createdBy}</span>
				<span>修改时间:{modifiedTime}</span>
				<span>录入时间:{createdTime}</span>
			</div>
		)
	}
}
