import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import InitLrItem from './InitLrItem.jsx'
import { TableWrap, TableBody, TableTitle, TableAll } from 'app/components'

@immutableRenderDecorator
export default
class InitTable extends React.Component {

	render() {

		const { incomestatement, dispatch, isAdmin } = this.props

		const titleList = ['项目', '行次', '本年累计期初金额']

		// const amontTwo = getAmount(0) - getAmount(1) - getAmount(2) - getAmount(10) - getAmount(13) - getAmount(17) + getAmount(19)
		// const amontTree = amontTwo + getAmount(21) - getAmount(23)
		// const amontFour = amontTree - getAmount(30)
		// 1-2-3-11-14-18-20+21+22
		const amontTwo = getAmount(0) - getAmount(1) - getAmount(2) - getAmount(10) - getAmount(13) - getAmount(17) - getAmount(19) + getAmount(20) + getAmount(21)
		// const amontTree = amontTwo + getAmount(21) - getAmount(23)
		const amontTree = amontTwo + getAmount(23) - getAmount(25)
		const amontFour = amontTree - getAmount(32)

		function getAmount(lineIndex) {
			const amount = incomestatement.getIn([lineIndex, 'amount'])
			return amount == '' ? 0 : Number(amount)
		}
		// const showincomestatement = incomestatement.size ? incomestatement.setIn([20, 'amount'], amontTwo).setIn([29, 'amount'], amontTree).setIn([31, 'amount'], amontFour) : incomestatement
		const showincomestatement = incomestatement.size ? incomestatement.setIn([22, 'amount'], amontTwo).setIn([31, 'amount'], amontTree).setIn([33, 'amount'], amontFour) : incomestatement

		return (
			<TableWrap>
				<TableAll className="initlrb-table">
					<TableTitle
						className="initlrb-table-width"
						titleList={titleList}
					/>
					<TableBody>
						{
							(showincomestatement || []).map((v, i) =>
								<InitLrItem
									idx={i}
									lrItem={v}
									className={"initlrb-table-width initlrb-tabel-justify"}
									key={i}
									dispatch={dispatch}
									// disabledModify={i === 20 || i === 29 || i === 31}
									disabledModify={i === 22 || i === 31 || i === 33}
									isAdmin={isAdmin}
								/>
							)
						}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}
