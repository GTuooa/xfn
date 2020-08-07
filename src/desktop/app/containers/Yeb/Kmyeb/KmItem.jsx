import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as kmyebActions from 'app/redux/Yeb/Kmyeb/kmyeb.action.js'
import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { TableItem, TableOver, ItemTriangle, Amount } from 'app/components'

@immutableRenderDecorator
export default
class KmItem extends React.Component {

	render() {

		const { kmitem, dispatch, issuedate, showchilditem, endissuedate, line, chooseValue } = this.props
		
		return (
			<TableItem line={line} className="kmyeb-table-width kmyeb-table-aligh">
				<ItemTriangle
					isLink={true}
					showTriangle={kmitem.get('childList').size}
					showchilditem={showchilditem}
					paddingLeft={kmitem.get('acId').length > 4 ? '4px' : ''}
					className={kmitem.has('showchilditem') ? 'haveChild' : 'notHave'}
					onClick={(e) => {
						e.stopPropagation()
						dispatch(kmyebActions.showChildItiem(kmitem.get('acId')))
					}}
					IdOnClick={() => {
						sessionStorage.setItem('previousPage', 'kmyeb')
						!dispatch(kmmxbActions.getMxbAclistFetch({
							issuedate: issuedate,
							endissuedate: endissuedate,
							acId: kmitem.get('acId'),
							assId: '',
							assCategory: '',
							condition: '',
							currentPage: '1',
						})) &&
						dispatch(kmmxbActions.changeAcMxbChooseValue(chooseValue))
						dispatch(homeActions.addPageTabPane('MxbPanes', 'Kmmxb', 'Kmmxb', '科目明细表'))
						dispatch(homeActions.addHomeTabpane('Mxb', 'Kmmxb', '科目明细表'))
					}}
				>
					{kmitem.get('acId')}
				</ItemTriangle>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						sessionStorage.setItem('previousPage', 'kmyeb')
						!dispatch(kmmxbActions.getMxbAclistFetch({
							issuedate: issuedate,
							endissuedate: endissuedate,
							acId: kmitem.get('acId'),
							assId: '',
							assCategory: '',
							condition: '',
							currentPage: '1',
						})) &&
						dispatch(kmmxbActions.changeAcMxbChooseValue(chooseValue))
						dispatch(homeActions.addPageTabPane('MxbPanes', 'Kmmxb', 'Kmmxb', '科目明细表'))
						dispatch(homeActions.addHomeTabpane('Mxb', 'Kmmxb', '科目明细表'))
					}}
				>
					{kmitem.get('acName')}
				</TableOver>
				<li>
					<span><Amount>{kmitem.get('beginDebitAmount')}</Amount></span>
					<span><Amount>{kmitem.get('beginCreditAmount')}</Amount></span>
					<span><Amount>{kmitem.get('happenDebitAmount')}</Amount></span>
					<span><Amount>{kmitem.get('happenCreditAmount')}</Amount></span>
					<span><Amount>{kmitem.get('yearDebitAmount')}</Amount></span>
					<span><Amount>{kmitem.get('yearCreditAmount')}</Amount></span>
					<span><Amount>{kmitem.get('endDebitAmount')}</Amount></span>
					<span><Amount>{kmitem.get('endCreditAmount')}</Amount></span>
				</li>
			</TableItem>
		)
	}
}
