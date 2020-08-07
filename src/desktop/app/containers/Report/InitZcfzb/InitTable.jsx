import React, { PropTypes } from 'react'
import { Map, List, toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import InitZcItem from './InitZcItem.jsx'
import { TableWrap, TableBody, TableTitle, TableAll } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
			isAdmin,
			initBaSheetList,
			dispatch,
			focusRef
		} = this.props

		const titleList = ['资产', '行次', '年初余额', '负债和所有者(或股东)权益', '行次', '年初余额']
		let convertBalancesheet = ''
		let balancesheet = []

		//调整在页面中显示的格式
		convertBalancesheet = initBaSheetList.toJS()
		convertBalancesheet.splice(0, 0, {lineName: '流动资产：'})
		convertBalancesheet.splice(16, 0, {lineName: '非流动资产：'})
		convertBalancesheet.splice(32, 0, {lineName: '流动负债：'})
		convertBalancesheet.splice(44, 0,{lineName: '非流动负债：'})
		convertBalancesheet.splice(51, 0, {},{},{},{},{},{}, {lineName: '所有者权益(或股东权益)：'})

		for (let i = 0; i < 32; ++i) {
			balancesheet.push({
				left: convertBalancesheet[i] || {},
				right: convertBalancesheet[i + 32] || {}
			})
		}

		return (
			<TableWrap className="table-max-width-first">
				<TableAll>
					<TableTitle
						className={"initZcfzb-table-width"}
						titleList={titleList}
					/>
					<TableBody>
						{
							balancesheet.map((v, i) =>
								<InitZcItem
									dispatch={dispatch}
									className="initZcfzb-table-width"
									zcList={v}
									idx={i}
									key={i}
									isAdmin={isAdmin}
									focusRef={focusRef}
								/>
							)
						}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}
