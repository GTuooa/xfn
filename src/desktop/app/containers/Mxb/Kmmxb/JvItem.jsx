import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Tooltip } from 'antd'
import { TableItem, TableOver, Amount } from 'app/components'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as allActions from 'app/redux/Home/All/all.action' 


@immutableRenderDecorator
export default
class JvItem extends React.Component {

	render() {

		const {
			idx,
			jvitem,
			issuedate,
			vcindexList,
			acDirection,
			dispatch,
			className,
			index,
			totalSize,
		} = this.props

		return (
			<TableItem className={className} line={idx+1}>
				<Tooltip title={`本页行次：${index}/${totalSize}`}><li>{jvitem.get('vcDate')}</li></Tooltip>
				<TableOver textAlign="center" isLink={true} onClick={() => {
					dispatch(lrpzActions.getPzVcFetch(jvitem.get('vcDate').substr(0, 7), jvitem.get('vcindex'), vcindexList.findIndex(v => v == [jvitem.get('vcDate'), jvitem.get('vcindex')].join('_')), vcindexList))
					dispatch(allActions.showPzBomb(true,'Mxb'))
				}}>记 {jvitem.get('vcindex')} 号</TableOver>
				<TableOver textAlign="left">{jvitem.get('jvAbstract')}</TableOver>
				<li><Amount>{jvitem.get('debitAmount')}</Amount></li>
				<li><Amount>{jvitem.get('creditAmount')}</Amount></li>
				<li>{acDirection}</li>
				<li><Amount>{jvitem.get('balanceAmount')}</Amount></li>
			</TableItem>
		);
	}
}
