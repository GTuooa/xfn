import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import { TableItem, TableOver, Amount } from 'app/components'

@immutableRenderDecorator
export default
class JvItem extends React.Component {

	render() {
		const {
			jvitem,
			vcindexList,
			assDirection,
			dispatch,
			className,
			idx
		} = this.props

		return (
			<TableItem className={className} line={idx}>
				<li>{jvitem.get('vcdate')}</li>
				<TableOver textAlign="center" isLink={true} onClick={() => {
					dispatch(lrpzActions.getPzVcFetch(jvitem.get('vcdate').substr(0, 7), jvitem.get('vcindex'), vcindexList.findIndex(v => v == [jvitem.get('vcdate'), jvitem.get('vcindex')].join('_')), vcindexList))
					dispatch(allActions.showPzBomb(true,'AssMxb'))
				}}>记 {jvitem.get('vcindex')} 号</TableOver>
				<TableOver textAlign="left">{jvitem.get('jvabstract')}</TableOver>
				<li>{jvitem.get('jvdirection') === 'debit' ? <Amount>{jvitem.get('jvamount')}</Amount> : ""}</li>
				<li>{jvitem.get('jvdirection') === 'debit' ? "" : <Amount>{jvitem.get('jvamount')}</Amount>}</li>
				<li>{assDirection ? '借' : '贷'}</li>
				<li><Amount>{assDirection ? jvitem.get('balance') : -jvitem.get('balance')}</Amount></li>
			</TableItem>
		);
	}
}
