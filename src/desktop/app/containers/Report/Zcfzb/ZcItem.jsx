import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Tooltip } from 'antd';
import XfnIcon from 'app/components/Icon'
import { Amount, TableItem } from 'app/components';

@immutableRenderDecorator
export default
class ZcItem extends React.Component {

	render() {

		const { zcList, className, idx } = this.props

		const showRule = {
			4: '「1122应收账款」末级科目的借方余额+「2203预收账款」末级科目的借方余额',
			5: '「1123预付账款」末级科目的借方余额+「2202应付账款」末级科目的借方余额',
			33: '「2202应付账款」末级科目的贷方余额+「1123预付账款」末级科目的贷方余额',
			34: '「2203预收账款」末级科目的贷方余额+「1122应收账款」末级科目的贷方余额(若「4402工程结算」贷方余额-「4401工程施工」借方余额为正数，该值也计入“预收账款”行次)',
		}

		return (
			<TableItem className={className} line={idx+1}>
				<li>
					<span style={{paddingLeft: (zcList.left.lineindex > 10 && zcList.left.lineindex < 14) ? '38px' : ''}}>
						{zcList.left.linename ? zcList.left.linename.replace(/:/g, '：') : zcList.left.linename}
						{
							showRule[zcList.left.lineindex] ?
							<Tooltip title={showRule[zcList.left.lineindex]}>
								<XfnIcon className="zcfzb-table-show-rule-icon" type="editTip" />
							</Tooltip>
							: null
						}
					</span>
				</li>
				<li>{zcList.left.lineindex}</li>
				<li><Amount>{zcList.left.closingbalance}</Amount></li>
				<li><Amount>{zcList.left.yearopeningbalance}</Amount></li>
				<li>
					{zcList.right.linename ? zcList.right.linename.replace(/:/g, '：') : zcList.right.linename}
					{
						showRule[zcList.right.lineindex] ?
						<Tooltip title={showRule[zcList.right.lineindex]}>
							<XfnIcon className="zcfzb-table-show-rule-icon" type="editTip" />
						</Tooltip>
						: null
					}
				</li>
				<li>{zcList.right.lineindex}</li>
				<li><Amount>{zcList.right.closingbalance}</Amount></li>
				<li><Amount>{zcList.right.yearopeningbalance}</Amount></li>
			</TableItem>
		)
	}
}
