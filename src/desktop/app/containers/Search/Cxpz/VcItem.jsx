import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import { Checkbox } from 'antd'
import jsonifyDate	from 'app/utils/jsonifyDate'
import { CxpzTableItem, TableOver, Amount } from 'app/components'
import { Icon } from 'app/components'
import { judgePermission } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class VcItem extends React.Component {
	render() {
		const {
			idx,
			vcitem,
			dispatch,
			vcindexList,
			selectVcAll,
			issuedate,
			showItem,
			className,
			line,
			// PzPermissionInfo,
			AC_BALANCE_STATEMENT,
			refreshCxpzCallBack,
			intelligentStatus
		} = this.props

		const issueDateJson = jsonifyDate(issuedate)
		return (
			<CxpzTableItem className={className} line={line}>
				<li onClick={() => dispatch(cxpzActions.selectVcItem(idx))}>
					<Checkbox checked={vcitem.get('checkboxDisplay')}/>
				</li>
				<TableOver textAlign="left">{vcitem.get('vcdate')}</TableOver>
				<TableOver isLink={true} textAlign="left" className="table-item-underline" onClick={() => {
					dispatch(lrpzActions.getPzVcFetch([issueDateJson.year, issueDateJson.month].join('-'), vcitem.get('vcindex'), idx, vcindexList))
					dispatch(allActions.showPzBomb(true, 'Cxpz', refreshCxpzCallBack))
				}}>
					记 {vcitem.get('vcindex')} 号
					{ vcitem.get('enclosurecount') ? <Icon type="paper-clip" /> : '' }
				</TableOver>
				<li
					onClick={() => {
						dispatch(lrpzActions.getPzVcFetch([issueDateJson.year, issueDateJson.month].join('-'), vcitem.get('vcindex'), idx, vcindexList))
						dispatch(allActions.showPzBomb(true, 'Cxpz', refreshCxpzCallBack))
					}}
					>
					{vcitem.get('jvlist').map((w, j) => <p className="table-item-line" key={j}>{w.get('jvabstract')}</p>)}
				</li>
				<li>
					{vcitem.get('jvlist').map((w, j) => {
						const asslist = w.get('asslist')
						const acStr = asslist.size ?
							`${w.get('acid')}_${w.get('acfullname')} ${asslist.map(m => `${m.get('assid')}_${m.get('assname')}`).join('_')}` :
							`${w.get('acid')} ${w.get('acfullname')}`

						return <p
							className="table-item-line"
							key={j}
							onClick={() => {
								// if (PzPermissionInfo.getIn(['toMxb', 'permission'])) {
									//读open权利
								if (AC_BALANCE_STATEMENT.get('open')) {
									sessionStorage.setItem('previousPage', 'kmyeb')
									// const info = asslist.size ? `${w.get('acid')}${Limit.TREE_JOIN_STR}${w.getIn(['asslist', 0, 'assid'])}${Limit.TREE_JOIN_STR}${w.getIn(['asslist', 0, 'asscategory'])}` : `${w.get('acid')}`
									const issuedateInfo = `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`
									dispatch(kmmxbActions.getMxbAclistFetch({
										issuedate: issuedateInfo,
										endissuedate: issuedateInfo,
										acId: w.get('acid'),
										assId: asslist.size ? w.getIn(['asslist', 0, 'assid']) : '',
										assCategory: asslist.size ? w.getIn(['asslist', 0, 'asscategory']) : '',
										condition: '',
										currentPage: '1',
									}))

									dispatch(homeActions.addPageTabPane('MxbPanes', 'Kmmxb', 'Kmmxb', '科目明细表'))
									dispatch(homeActions.addHomeTabpane('Mxb', 'Kmmxb', '科目明细表'))
								}
							}}
							>
							{acStr}
						</p>
					})}
				</li>
				<li>
					{vcitem.get('jvlist').map((w, j) => <p className="table-item-line-amonut" key={j}>{w.get('jvdirection') === 'debit' ? <Amount className="table-item-line-amonut" showZero={true}>{w.get('jvamount')}</Amount> : ''}</p>)}
				</li>
				<li>
					{vcitem.get('jvlist').map((w, j) => <p className="table-item-line-amonut" key={j}>{w.get('jvdirection') === 'debit' ? '' : <Amount className="table-item-line-amonut" showZero={true}>{w.get('jvamount')}</Amount>}</p>)}
				</li>
				<TableOver textAlign="left">
					{vcitem.get('createdby')}
				</TableOver>
				{
					!intelligentStatus?
					<TableOver textAlign="left">
						{vcitem.get('reviewedby')}
					</TableOver>:''
				}
			</CxpzTableItem>
		)
	}
}
