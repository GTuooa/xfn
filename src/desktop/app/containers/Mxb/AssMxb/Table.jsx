import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import JvItem from './JvItem.jsx'
import { Switch } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { TableBody, TableItem, TableTitle, TableAll, Amount, TablePagination } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	constructor() {
		super()
		this.state = {assDirection: true}
	}

	render() {

		const {
			acid,
			assid,
			debit,
			credit,
			assname,
			assjvlist,
			acfullname,
			closingbalance,
			openingbalance,
			dispatch,
			vcindexList,
			currentPage,
			pageCount,
			assNameTwo,
			paginationCallBack
		} = this.props

		const { assDirection } = this.state

		const titleList = ['日期', '凭证字号', '摘要', '借方', '贷方', '方向', '余额']
		let assIdName = ''
		if(assNameTwo.split(Limit.TREE_JOIN_STR).length >1 && assNameTwo.split(Limit.TREE_JOIN_STR)[1] !== '全部'){
			assIdName = assNameTwo.replace(Limit.TREE_JOIN_STR,'_')
		}

		return (
			<TableAll shadowTop="51px" type="mxb">
				{/* <i className="shadow-title-mxb shadow-title-mxb-ass"></i> */}
				<div className="assmxz-left-table-first-tit">辅助项目: {assid ? `${assid}_${assname} ${assIdName}` : '无'}</div>
				<div className="assmxz-left-table-second-tit">科 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 目: {acid ? `${acid}_${acfullname}` : '全部'}</div>
				{/* <JvTitleItem/> */}
				<TableTitle
					titleList={titleList}
					className="assmxz-table-width"
				/>
				<TableBody>
					<TableItem className="assmxz-table-width assmxz-table-justify">
						<li></li>
						<li></li>
						<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期初余额</li>
						<li></li>
						<li></li>
						<li>
							<Switch
								className="use-unuse-style lend-bg"
								checked={!assDirection}
								checkedChildren="贷"
								unCheckedChildren="借"
								style={{width: 43}}
								onChange={() => this.setState({assDirection: !assDirection})}
							/>
						</li>
						<li><Amount>{assDirection ? openingbalance : -openingbalance}</Amount></li>
					</TableItem>
					{(assjvlist || []).map((v, i) =>
						<JvItem
							key={i}
							jvitem={v}
							idx={i}
							dispatch={dispatch}
							vcindexList={vcindexList}
							assDirection={assDirection}
							className="assmxz-table-width assmxz-table-justify"
						/>
					)}
					<TableItem className="assmxz-table-width assmxz-table-justify" line={assjvlist.size ? assjvlist.size : 2}>
						<li></li>
						<li></li>
						<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本期合计</li>
						<li><Amount>{debit}</Amount></li>
						<li><Amount>{credit}</Amount></li>
						<li>{assDirection}</li>
						<li><Amount>{assDirection ? closingbalance : -closingbalance}</Amount></li>
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
