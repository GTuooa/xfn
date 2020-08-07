import React, { PropTypes } from 'react'
import { List, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import KmItem from './KmItem.jsx'
import { TableWrap, TableBody, TitleKmye, TableAll, TablePagination, TableItem, Amount } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
			dispatch,
			balanceaclist,
			chooseperiods,
			issuedate,
			endissuedate,
			kmyeAssCategory,
			currentPage,
			pageCount,
			paginationCallBack,
			acId,
			oldAssKmyebList,
			assIdTwo,
			doubleAssCategory,
			assNameTwo,
			assYebState,
			kmyeAssAcId
		} = this.props

		let numer = 0
		const amount = balanceaclist.get(0)
		
		return (
			<TableWrap notPosition={true}>
				<TableAll
					type="kmye"
					>
					<TitleKmye
						title1="编码"
						title2="核算项目"
						isAssYeb={true}
						dispatch={dispatch}
						assYebState={assYebState}
						fromAss={true}
					/>
					<TableBody>
						{
							balanceaclist.map((v, i) => {
								let line;
								let showchilditem;
								if(v.get('isWrap')){//一级的都显示
									line=++numer;
									showchilditem = v.get('showchilditem')
								}else{
									const wrapId = v.get('wrapId');//包裹的id
									const upperId = v.get('upperAssid');//上一级的id

									const acidLength = kmyeAssAcId ? kmyeAssAcId.split(' ')[0].length+2 : 4

									if (v.get('acid').length === acidLength) {
										showchilditem = balanceaclist.find(w => w.get('isWrap') && w.get('assid') == upperId).get('showchilditem')
									} else {
										showchilditem = balanceaclist.find(w => !w.get('isWrap') && w.get('wrapId') === wrapId && w.get('acid') == upperId).get('showchilditem')
									}

									line = showchilditem ? ++numer : 'hide';
								}
								return (<KmItem
									line={line}
									idx={i}
									key={i}
									kmitem={v}
									dispatch={dispatch}
									issuedate={issuedate}
									endissuedate={endissuedate}
									chooseperiods={chooseperiods}
									showchilditem={showchilditem}
									kmyeAssCategory={kmyeAssCategory}
									acId={acId}
									oldAssKmyebList={oldAssKmyebList}
									className={v.get('disableTime') ? 'fzhs-item-disable' : ''}
									assIdTwo={assIdTwo}
									doubleAssCategory={doubleAssCategory}
									assNameTwo={assNameTwo}
								/>)
							})
						}
						<TableItem className="kmyeb-table-width kmyeb-table-aligh">
							<li>本期合计</li>
							<li></li>
							<li>
								<span><Amount>{amount ? amount.get('debitOpeningBalanceTotal'): ''}</Amount></span>
								<span><Amount>{amount ? amount.get('creditOpeningBalanceTotal'): ''}</Amount></span>
								<span><Amount>{amount ? amount.get('debitTotal'): ''}</Amount></span>
								<span><Amount>{amount ? amount.get('creditTotal'): ''}</Amount></span>
								<span><Amount>{amount ? amount.get('debitSumTotal'): ''}</Amount></span>
								<span><Amount>{amount ? amount.get('creditSumTotal'): ''}</Amount></span>
								<span><Amount>{amount ? amount.get('debitClosingBalanceTotal'): ''}</Amount></span>
								<span><Amount>{amount ? amount.get('creditClosingBalanceTotal'): ''}</Amount></span>
							</li>
						</TableItem>
					</TableBody>
					<TablePagination
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(value) => paginationCallBack(value)}
					/>
				</TableAll>
			</TableWrap>
		)
	}
}
