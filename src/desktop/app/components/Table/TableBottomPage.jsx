import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Pagination,Select } from 'antd'
const Option = Select.Option
import './table.less'

@immutableRenderDecorator

class TableBottomPage extends React.Component{
	render() {
		const { otherComp, total, current, pageSize, onChange, className, classNameTemp,showSizeChanger,onShowSizeChange,hideOnSinglePage, pageList } = this.props
        // otherComp  其他内容
        // total 总条数
        // current 当前页
        // pageSize 分页条数

        const otherTemp = otherComp ? otherComp : null
		const pageListArr = pageList ? pageList : ['20','50','80','100']
		return (
			<div className={className ? `page-bottom-table-select ${className}` : 'page-bottom-table-select'}>
                <div className="table-pagination">
                    <Pagination
                        defaultCurrent={1}
                        total={total}
                        current={current}
                        pageSize={pageSize ? pageSize : 10}
                        hideOnSinglePage={hideOnSinglePage}
                        onChange={(page)=>{
                            onChange(page)
                        }}
                    />
					{
						showSizeChanger?
						<Select
							width={80}
							value={`${pageSize}条/页`}
							className="page-bottom-table-pagesize"
							onChange={(value) => {
								onShowSizeChange(value)
							}}
						>
							{
								pageListArr.map((v,i) => {
									return <Option key={'a'} value={v}>{`${v}条/页`}</Option>
								})
							}
						</Select> : null
					}


                </div>
				<div className={classNameTemp ? `table-pagination-other ${className}` : "table-pagination-other"}>
					{otherTemp}
				</div>

            </div>
		)
	}
}

export default TableBottomPage;