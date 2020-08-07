import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import KmItem from './KmItem.jsx'
import { TableWrap, TableBody, TitleKmye, TableAll, TableItem, Amount } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { dispatch, balanceaclist, issuedate, endissuedate, showchildList, chooseValue } = this.props

		const detailList = balanceaclist.get('detailList')
		
		let line = 0

		const loop = (data, parentLine) => data.map((item, index) => {
			line = parentLine ? parentLine : line + 1
			if (item.get('childList') && item.get('childList').size) {
				return (
					<div>
						<KmItem
							kmitem={item}
							showchilditem={showchildList.indexOf(item.get('acId')) > -1}
							line={line}
							key={index}
							dispatch={dispatch}
							issuedate={issuedate}
							chooseValue={chooseValue}
							endissuedate={endissuedate}
						/>
						{showchildList.indexOf(item.get('acId')) > -1 ? loop(item.get('childList'), line) : null}
					</div>
				)
			} else {
				return (
		            <KmItem
						kmitem={item}
						line={line}
						key={index}
						dispatch={dispatch}
						issuedate={issuedate}
						chooseValue={chooseValue}
						endissuedate={endissuedate}
					/>
		        )
			}
		})

		return (
			<TableWrap notPosition={true}>
				<TableAll type="kmye">
					<TitleKmye
						title1="科目编码"
						title2="科目"
						dispatch={dispatch}
					/>
					<TableBody>
						{loop(detailList)}
						<TableItem className="kmyeb-table-width kmyeb-table-aligh">
							<li>本期合计</li>
							<li></li>
							<li>
								<span><Amount>{balanceaclist.get('allBeginDebitAmount')}</Amount></span>
								<span><Amount>{balanceaclist.get('allBeginCreditAmount')}</Amount></span>
								<span><Amount>{balanceaclist.get('allHappenDebitAmount')}</Amount></span>
								<span><Amount>{balanceaclist.get('allHappenCreditAmount')}</Amount></span>
								<span><Amount>{balanceaclist.get('allYearDebitAmount')}</Amount></span>
								<span><Amount>{balanceaclist.get('allYearCreditAmount')}</Amount></span>
								<span><Amount>{balanceaclist.get('allEndDebitAmount')}</Amount></span>
								<span><Amount>{balanceaclist.get('allEndCreditAmount')}</Amount></span>
							</li>
						</TableItem>
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}