import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import JvCardItem from './JvCardItem.jsx'
import { Amount, TableBody, TableItem, TableTitle, TableAll ,TablePagination} from 'app/components'

@immutableRenderDecorator
export default
class TableMx extends React.Component {

	render() {

		const { cardList, mxMaindata, dispatch,currentPage,pageCount,paginationCallBack} = this.props

		const titleList = ['编码', '名称', '原值', '残值率', '残值', '已用/总期', '期初累计(折/摊)', '期初净值', '本期(折/摊)', '期末累计(折/摊)', '期末净值']

		return (
			<TableAll type="max-mxb">
				<TableTitle
					titleList={titleList}
					className="assets-mxb-table-width"
				/>
				<TableBody>
					{(cardList || []).map((v, i) =>{
						return (
							<JvCardItem
								className="assets-mxb-table-width assets-mxb-table-justify"
								key={i}
								idx={i}
								dispatch={dispatch}
								mxItem={v}
							/>
					)})}
					<TableItem className="assets-mxb-table-width assets-mxb-table-justify assets-mxb-table-sumarry" line={cardList ? cardList.size +1 : 1}>
						<li></li>
						<li>本期合计</li>
						<li><Amount>{mxMaindata.get('cardValue')}</Amount></li>
						<li></li>
						<li><Amount>{mxMaindata.get('residualValue')}</Amount></li>
						<li></li>
						<li><Amount>{mxMaindata.get('sumStarDepreciation')}</Amount></li>
						<li><Amount>{mxMaindata.get('starNetWorth')}</Amount></li>
						<li><Amount>{mxMaindata.get('currentDepreciation')}</Amount></li>
						<li><Amount>{mxMaindata.get('sumEndDepreciation')}</Amount></li>
						<li><Amount>{mxMaindata.get('endNetWorth')}</Amount></li>
					</TableItem>
				</TableBody>
				<TablePagination
					currentPage={currentPage}
					pageCount={pageCount}
					paginationCallBack={(value) => paginationCallBack(value)}	
				/>
			</TableAll>
		)
	}
}
