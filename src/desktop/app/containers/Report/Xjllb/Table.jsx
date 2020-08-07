import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import XjItem from './XjItem.jsx'

import { TableWrap, TableBody, TableTitle, TableAll } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { cachFlowList } = this.props

		const titleList = ['项目', '行次', '本年累计金额', '本期金额']

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					<TableTitle
						className="xjll-table-width"
						titleList={titleList}
					/>
					<TableBody>
						{(cachFlowList || []).map((u,i) => {
							return (
								<XjItem
									key={i}
									idx={i}
									cachFlowItem={u}
									className={"xjll-table-width xjll-tabel-justify"}
								/>
							)
						})}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}

{/* <div className="layer">
	<i className="shadow-title-Xjllb"></i>
	<XjItem
		cachFlowItem={tableTitle}
		className={"Xjllb-table-title"}
		istitle={true}
	/>
	<div className="Xjllb-table-body">
		{(cachFlowList || []).map((u,i) => {
			return (
				<XjItem
					key={i}
					idx={i}
					cachFlowItem={u}
					className={"Xjllb-table-item"}
				/>
			)
		})}


	</div>
</ */}
