import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import InitLrItem from './InitLrItem.jsx'
import { TableWrap, TableBody, TableTitle, TableAll } from 'app/components'

@immutableRenderDecorator
export default
class InitTable extends React.Component {

	render() {

		const { incomestatement, dispatch, isAdmin } = this.props

		const titleList = ['项目', '行次', '本年累计期初金额']

		return (
			<TableWrap>
				<TableAll className="initXjllb">
					<TableTitle
						className="initXjllb-table-width"
						titleList={titleList}
					/>
					<TableBody>
						{
							(incomestatement || []).map((v, i) =>
								<InitLrItem
									idx={i}
									cashItem={v}
									className={"initXjllb-table-width initXjllb-table-justify"}
									key={i}
									dispatch={dispatch}
									disabledModify={i ===0 || i === 7 || i === 8 || i === 14 || i === 15 || i === 21 || i===22 || i===24 }
									isAdmin={isAdmin}
								/>
							)
						}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}
