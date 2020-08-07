import React from 'react'
import { Button, Menu, Dropdown, Icon, Select, Input } from 'antd'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import TableTit from './TableTit.jsx'
import VcItem from './VcItem.jsx'

import { TableWrap, TableBody, TableAll, TablePagination, CxpzTableItem } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {
		const {
			vcKeyList,
			dateSort,
			indexSort,
			dispatch,
			draftList,
			selectDraftAll
		} = this.props

		return (
			<TableWrap className="table-max-width-second">
				<TableAll>
					<TableTit
						className="draft-table-width draft-table-title-justify"
						dateSort={dateSort}
						indexSort={indexSort}
						dispatch={dispatch}
						selectDraftAll={selectDraftAll}
					/>
					<TableBody>
						{
							draftList.map((u,i) => {
								return <VcItem
									idx={i}
									key={i}
									line={i+1}
									className="draft-table-width draft-table-justify"
									dispatch={dispatch}
									vcItem={u}
									vcKeyList={vcKeyList}
								/>
							})
						}
					</TableBody>
				</TableAll>
			</TableWrap>
            // <div className="layer">
			// 	<i className="shadow-title"></i>
			// 	<TableTit
			// 		dateSort={dateSort}
			// 		indexSort={indexSort}
			// 		dispatch={dispatch}
			// 		selectDraftAll={selectDraftAll}
			// 	/>
            //     <div className="draft-body">
			// 		<table>
			// 			<tbody>
			// 				{
			// 					draftList.map((u,i) => {
			// 						return <VcItem
			// 							idx={i}
			// 							key={i}
			// 							dispatch={dispatch}
			// 							vcItem={u}
			// 							vcKeyList={vcKeyList}
			// 						/>
			// 					})
			// 				}
			// 			</tbody>
			// 		</table>
			// 	</div>
			// </div>
		)
	}
}
