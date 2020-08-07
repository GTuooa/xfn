import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Pagination } from 'antd'
import './table.less'

@immutableRenderDecorator
export default
class TablePaginationPageSize extends React.Component{
	render() {
        const { currentPage, pageCount, paginationCallBack, pageSize} = this.props
        const pageSizeOptions =['50', '100', '200', '300']

		return (
            <div className="table-pagination-wrap">
                <Pagination
                    className='ant-pagination-pagesize'
                    total={(pageCount-1)*pageSize+1}
                    defaultPageSize={pageSize}
                    defaultCurrent={1}
                    current={currentPage}
                    //显示选择分页器
                    showSizeChanger
                    pageSizeOptions={pageSizeOptions}
                    // //pageSize就是显示的 几条/页   current是当前页
                    onShowSizeChange={(current, pageSize) => {paginationCallBack ? paginationCallBack(1,pageSize) : ''} }
                    onChange={(current, pageSize) => {paginationCallBack ? paginationCallBack(current,pageSize) : ''} }
                />
            </div>
		)
    }
}