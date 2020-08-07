import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as zcfzbActions from 'app/redux/Report/Zcfzb/zcfzb.action.js'

import { Amount, TableItem } from 'app/components'
// import { Input } from 'antd'
import XfnInput from 'app/components/XfnInput'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class InitZcItem extends React.Component {

	render() {
		const {
			zcList,
			className,
			idx,
			disabledModify,
			dispatch,
			isAdmin,
			focusRef
		} = this.props

		const ignoreLineIndexArr = [15, 20, 29, 30, 41, 46, 47, 52, 53]
		const leftDisabledModify = ignoreLineIndexArr.indexOf(zcList.left.lineIndex) > -1 ? true : false
		const rightDisabledModify = ignoreLineIndexArr.indexOf(zcList.right.lineIndex) > -1 ? true : false
		const focusLeftAmount = zcList.left.lineIndex == focusRef ? true : false
		const focusRightAmount = zcList.right.lineIndex == focusRef ? true : false

		return (
			<TableItem className={className} line={idx+1}>
				<li>
					<span style={{paddingLeft: (zcList.left.lineIndex > 10 && zcList.left.lineIndex < 14) ? '38px' : ''}}>
						{zcList.left.lineName ? zcList.left.lineName.replace(/:/g, '：') : zcList.left.lineName}
					</span>
				</li>
				<li>{zcList.left.lineIndex}</li>
				<li>
					{
						leftDisabledModify ?
						<Amount className="initZcfzb-table-amount">{zcList.left.amount}</Amount> :
						(
							zcList.left.lineIndex && ignoreLineIndexArr.indexOf(zcList.left.lineIndex) < 0 ?
							<XfnInput
								autoSelect={true}
								showFormatMoney={true}
								className="initZcfzb-table-input"
								disabled={!isAdmin}
								value={zcList.left.amount}
								onFocus={e => {
									e.target.value = zcList.left.amount ? zcList.left.amount : ''
								}}
								onChange={(e) =>
									dispatch(zcfzbActions.changeInitZcfzbAmount(zcList.left.lineIndex, e.target.value))
								}
							/>
							: null
						)
					}
				</li>
				<li>{zcList.right.lineName ? zcList.right.lineName.replace(/:/g, '：') : zcList.right.lineName}</li>
				<li>{zcList.right.lineIndex}</li>
				<li>
					{
						rightDisabledModify ?
						<Amount className="initZcfzb-table-amount">{zcList.right.amount}</Amount> :
						(
							zcList.right.lineIndex && ignoreLineIndexArr.indexOf(zcList.right.lineIndex) < 0 ?
							<XfnInput
								autoSelect={true}
								showFormatMoney={true}
								className="initZcfzb-table-input"
								disabled={!isAdmin}
								value={zcList.right.amount}
								onBlur={e => {}}
								onFocus={e => {
									e.target.value = zcList.right.amount ? zcList.right.amount : ''
								}}
								onChange={(e) =>
									dispatch(zcfzbActions.changeInitZcfzbAmount(zcList.right.lineIndex, e.target.value))
								}
							/> : null
						)
					}
				</li>
			</TableItem>
		)
	}
}
