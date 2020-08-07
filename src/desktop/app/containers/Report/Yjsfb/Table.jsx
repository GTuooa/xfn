import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { fromJS } from 'immutable'
import SfItem from './SfItem.jsx'

import { ExportModal, TableWrap, TableBody, TableItem, TableTitle, TableOver, TableAll } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { initPeriodList,showChildList ,dispatch} = this.props

		const titleList = ['项目', '本年累计金额', '本期金额']

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					<TableTitle
						className="sfb-table-width"
						titleList={titleList}
					/>
					<TableBody>
						{
							(initPeriodList || []).map((v, i) =>
								<SfItem
									sjItem={v}
									className="sfb-table-width sfb-tabel-justify"
									key={i}
									idx={i}
									showChildList={showChildList}
									dispatch={dispatch}
								/>
							)
						}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}
