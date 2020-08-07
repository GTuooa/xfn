import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import VcItem from './VcItem.jsx'
import TableTit from './TableTit.jsx'

import { TableWrap, TableBody, TableAll } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {
	render() {

		const { dispatch, selectVcAll, vclist, issuedate, vcindexSort, vcdateSort, inputValue, PzPermissionInfo } = this.props

		const vcindexList = vclist.map(v => [v.get('vcdate'), v.get('vcindex')].join('_'))

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					<TableTit
						className="fjgl-table-width fjgl-table-title-justify"
						vcindexSort={vcindexSort}
						vcdateSort={vcdateSort}
						dispatch={dispatch}
						selectVcAll={selectVcAll}
					/>
					<TableBody>
						{vclist.map((v, i) => {
							return <VcItem
								className="fjgl-table-width fjgl-table-justify"
								idx={i}
								key={i}
								vcitem={v}
								dispatch={dispatch}
								selectVcAll={selectVcAll}
								vcindexList={vcindexList}
								issuedate={issuedate}
								PzPermissionInfo={PzPermissionInfo}
							/>
						})}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}
