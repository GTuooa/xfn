import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Item from './Item.jsx'
import TableTitle from './TableTitle.jsx'

import { TableBody, TableItem, TableAll, Amount, TablePagination } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { dispatch, accountDetailType, detailList, beginDetail, totalDetail, currentTreeSelectItem, currentPage, pageCount, paginationCallBack,issuedate,endissuedate,currentAccoountUuid, jrAbstract, accountType } = this.props

		// accountDetailType : ACCOUNT_CATEGORY、 OTHER_CATEGORY、 OTHER_TYPE
		const name = currentTreeSelectItem.get('uuid') ? currentTreeSelectItem.get('fullname') : '全部'
		const haveOpenLine = !currentTreeSelectItem.get('uuid')

		const uuidListJs = detailList.toJS()
		let hash = {}
		const newUuidList = uuidListJs.reduce((item, next) => {
			hash[next.oriUuid] ? '' : hash[next.oriUuid] = true && item.push(next);
			return item
		}, [])
		const finalUuidList = newUuidList.length ? newUuidList.filter(v => v.oriUuid) : []

		return (
			<TableAll shadowTop="31px" type="mxb" newTable="true">
				<div className="account-mxb-title">流水类别: {name}</div>
				<TableTitle
					accountDetailType={accountDetailType}
					className="account-mxb-table-width"
				/>
				<TableBody>
					{
						haveOpenLine && beginDetail ?
						<TableItem className="account-mxb-table-width account-mxb-table-justify">
							<li className="account-mxb-table-item-date"></li>
							<li className="account-mxb-table-item-id"></li>
							<li className="account-mxb-table-item-abstract">期初余额</li>
							<li className="account-mxb-table-item-debit-amount"></li>
							<li className="account-mxb-table-item-credit-amount"></li>
							<li className="account-mxb-table-item-closed-amount"><Amount>{beginDetail.get('balance')}</Amount></li>
						</TableItem>
						: ''
					}
					{(detailList || fromJS([])).map((v, i) =>
						<Item
							line={haveOpenLine ? i : i+1}
							key={i}
							item={v}
							index={i+1}
							totalSize={detailList.size || 0}
							uuidList={fromJS(finalUuidList)}
							accountDetailType={accountDetailType}
							dispatch={dispatch}
							issuedate={issuedate}
							endissuedate={endissuedate}
							currentAccoountUuid={currentAccoountUuid}
							currentTreeSelectItem={currentTreeSelectItem}
							currentPage={currentPage}
							jrAbstract={jrAbstract}
							accountType={accountType}
							className="account-mxb-table-width account-mxb-table-justify"
						/>
					)}
					<TableItem className="account-mxb-table-width account-mxb-table-justify" line={haveOpenLine ? detailList.size : detailList.size+1}>
						<li className="account-mxb-table-item-date"></li>
						<li className="account-mxb-table-item-id"></li>
						<li className="account-mxb-table-item-abstract">{accountDetailType === 'OTHER_CATEGORY' ? '本期合计' : '合计'}</li>
						{
							accountDetailType === 'OTHER_CATEGORY' ?
							<li className="account-mxb-table-item-type"></li>
							: ''
						}
						<li className="account-mxb-table-item-debit-amount"><Amount>{totalDetail.get('debitAmount')}</Amount></li>
						<li className="account-mxb-table-item-credit-amount"><Amount>{totalDetail.get('creditAmount')}</Amount></li>
						{
							accountDetailType === 'OTHER_TYPE' ?
							<li className="account-mxb-table-item-direction"></li>
							: ''
						}
						<li className="account-mxb-table-item-closed-amount"><Amount>{totalDetail.get('balance')}</Amount></li>
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
