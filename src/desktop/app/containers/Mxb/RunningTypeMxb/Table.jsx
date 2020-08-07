import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Item from './Item.jsx'
import TableTitle from './TableTitle.jsx'

import { TableBody, TableItem, TableAll, Amount, TablePagination, TableOver} from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { dispatch, currentPage, pageCount, paginationCallBack,runningTypeDetailList,openDetail, totalAmountList, acName, refreshList } = this.props

		const uuidListJs = runningTypeDetailList.toJS()
		let hash = {}
		const newUuidList = uuidListJs.reduce((item, next) => {
			hash[next.oriUuid] ? '' : hash[next.oriUuid] = true && item.push(next);
			return item
		}, [])
		const finalUuidList = newUuidList.length ? newUuidList.filter(v => v.oriUuid) : []
		const directionName = {
            'debit' : '借',
            'credit' : '贷',
            '' : ''
        }
		return (
			<TableAll shadowTop="32px" type="mxb" newTable="true">
				<div className="runningType-mxb-title">类型: {acName}</div>
				<TableTitle
					className="runningType-mxb-table-width"
				/>
				<TableBody className='runningType-mxb-table-content'>
					{
						runningTypeDetailList && runningTypeDetailList.map((item,i) => {
							return (
								<Item
									key={i}
									index={runningTypeDetailList ? runningTypeDetailList.getIn([0,'oriAbstract']) === '期初余额' ? i : i+1 : 0}
									className="runningType-mxb-table-width"
									item={item}
									line={i}
									uuidList={fromJS(finalUuidList)}
									dispatch={dispatch}
									refreshList={refreshList}
									totalSize={runningTypeDetailList ? runningTypeDetailList.getIn([0,'oriAbstract']) === '期初余额' ? runningTypeDetailList.size -1 : runningTypeDetailList.size : 0}
								/>
							)
						})
					}
					<TableItem className="runningType-mxb-table-width"
					line={runningTypeDetailList.size ? runningTypeDetailList.size+1 : 1}
					>
						<li></li>
						<li></li>
						<li>合计</li>
						<li>
							<span><Amount>{totalAmountList.get('allDebitAmount')}</Amount></span>
						</li>
						<li>
							<span><Amount>{totalAmountList.get('allCreditAmount')}</Amount></span>
						</li>
						<li><span>{directionName[totalAmountList.get('direction')]}</span></li>
						<li>
							<span><Amount>{totalAmountList.get('allBalanceAmount')}</Amount></span>
						</li>
					</TableItem>

				</TableBody>
				{
					<TablePagination
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(value) => paginationCallBack(value)}
					/>
				}
			</TableAll>
		)
	}
}
