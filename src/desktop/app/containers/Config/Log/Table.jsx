import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { List, toJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'

import { TableWrap, TableBody, TableItem, TableTitle, TableAll, TableOver, TablePagination } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {
		const { dispatch, currentPage, pageCount, paginationCallBack, logList } = this.props

		const titleList = ['序号', '日期', '操作人', '操作日志']

		const preCountSize = (currentPage-1) * Limit.LOG_PAGE_SIZE + 1

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					<TableTitle
						className="log-table-width"
						titleList={titleList}
					/>
					<TableBody>
						{
							logList.map((v, i) => {
								return 	<TableItem className="log-table-width" line={i+1}>
									<TableOver>{`${preCountSize+i}`}</TableOver>
									<TableOver>{v.get('startTime')}</TableOver>
									<TableOver>{v.get('userName')}</TableOver>
									<TableOver textAlign="left">{v.get('logDetail') ? v.get('logDetail') : '数据错误'}</TableOver>
								</TableItem>
							})
						}
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
