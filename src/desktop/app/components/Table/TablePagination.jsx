import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Pagination } from 'antd'
import './table.less'

@immutableRenderDecorator
export default
class TablePagination extends React.Component{
	render() {
		const { currentPage, pageCount, paginationCallBack, className, ...others } = this.props

		return (
            <div className={`table-pagination-wrap ${className}`}>
                <Pagination
					{...others}
                    current={currentPage}
                    total={pageCount*10}
                    onChange={(value) => paginationCallBack ? paginationCallBack(value) : ''}
                />
            </div>
		)
	}
}