import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action.js'

import VcItem from './VcItem.jsx'
import TableTit from './TableTit.jsx'
import { TableWrap, TableBody, TableAll, TablePagination, TablePaginationPageSize, CxpzTableItem } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
			dispatch,
			selectVcAll,
			vclist,
			issuedate,
			vcindexSort,
			vcdateSort,
			vcreviewedSort,
			inputValue,
			sortByTimeOnClick,
			sortByIndexOnClick,
			sortByReviewedOnClick,
			currentPage,
			pageCount,
			pageSize,
			paginationCallBack,
			// PzPermissionInfo,
			searchType,
			refreshCxpzCallBack,
			intelligentStatus,
			// QUERY_VC
			AC_BALANCE_STATEMENT
		} = this.props

		// lrpz的上下张凭证数组vcindexList包含的是 ['2017-01_1'], 日期和凭证号的分隔符为 "_"
		const vcindexList = vclist.map(v => [v.get('vcdate'), v.get('vcindex')].join('_'))

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					<TableTit
						className="cxpz-table-width cxpz-table-title-justify"
						vcindexSort={vcindexSort}
						vcdateSort={vcdateSort}
						vcreviewedSort={vcreviewedSort}
						dispatch={dispatch}
						selectVcAll={selectVcAll}
						issuedate={issuedate}
						inputValue={inputValue}
						sortByTimeOnClick={sortByTimeOnClick}
						sortByIndexOnClick={sortByIndexOnClick}
						sortByReviewedOnClick={sortByReviewedOnClick}
						searchType={searchType}
						intelligentStatus={intelligentStatus}
						pageSize={pageSize}
					/>
					<TableBody>
						{vclist.map((v, i) => {
							return <VcItem
								className="cxpz-table-width cxpz-table-justify"
								line={i+1}
								idx={i}
								key={i}
								vcitem={v}
								dispatch={dispatch}
								selectVcAll={selectVcAll}
								vcindexList={vcindexList}
								issuedate={issuedate}
								AC_BALANCE_STATEMENT={AC_BALANCE_STATEMENT}
								// PzPermissionInfo={PzPermissionInfo}
								refreshCxpzCallBack={refreshCxpzCallBack}
								intelligentStatus={intelligentStatus}
							/>
						})}
					</TableBody>
		  {/** 		<TablePagination
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(value) => paginationCallBack(value)}
					/>
			*/}
					<TablePaginationPageSize
						pageSize={pageSize}
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(current,pageSize) => paginationCallBack(current,pageSize)}
					/>
				</TableAll>
			</TableWrap>
		)
	}
}
