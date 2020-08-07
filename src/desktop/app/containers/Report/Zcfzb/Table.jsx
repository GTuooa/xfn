import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import ZcItem from './ZcItem.jsx'
import { TableWrap, TableBody, TableTitle, TableAll } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { balancesheet } = this.props

		const titleList = ['资产', '行次', '期末余额', '年初余额', '负债和所有者权益', '行次', '期末余额', '年初余额']

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					<TableTitle
						className={"zcfzb-table-width"}
						titleList={titleList}
					/>
					<TableBody>
						{
							balancesheet.map((v, i) =>
								<ZcItem
									className={"zcfzb-table-width zcfzb-table-justify"}
									zcList={v}
									idx={i}
									key={i}
								/>
							)
						}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}
