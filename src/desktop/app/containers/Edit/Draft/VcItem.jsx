import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import { Checkbox } from 'antd'
import { CxpzTableItem, TableOver, XfnIcon, Amount } from 'app/components'

@immutableRenderDecorator
export default
class VcItem extends React.Component {

	render() {

		const {
			dispatch,
			vcItem,
			idx,
			vcKeyList,
			className,
			line
		} = this.props

		return (
			<CxpzTableItem className={className} line={line}>
				<li onClick={() => dispatch(draftActions.selectDraftItem(idx))}>
					<Checkbox checked={vcItem.get('checkboxDisplay')}/>
				</li>
				<li>
					<XfnIcon type="lock-close" className="lock" style={{fontSize:'16px', display: vcItem.get('locked') == '1' ? 'block' : 'none'}}/>
				</li>
				<TableOver textAlign="left" style={{textDecoration : vcItem.get('locked') == '1' ? 'line-through' : ''}} >
					{vcItem.get('vcdate')}
				</TableOver>
				<TableOver isLink={true} textAlign="left" onClick={() => {
					sessionStorage.setItem('lrpzHandleMode', 'insert')
					dispatch(lrpzActions.getDraftItemFetch(vcItem.get('vckey'), idx, vcKeyList))
					// dispatch(homeActions.addTabpane('Lrpz'))
					dispatch(homeActions.addPageTabPane('EditPanes', 'Lrpz', 'Lrpz', '录入凭证'))
					dispatch(homeActions.addHomeTabpane('Edit', 'Lrpz', '录入凭证'))
				}}>
					<span className={vcItem.get('locked') == '1' ? 'draft-locked' : ''}>{vcItem.get('vcindex')} 号</span>
				</TableOver>
				<li>
					{vcItem.get('jvlist').map((w, j) => <p className="table-item-line" key={j}>{w.get('jvabstract')}</p>)}
				</li>
				<li>
					{vcItem.get('jvlist').map((w, j) => {
						const assList = w.get('asslist')
						const acStr = w.get('acid') ?  assList.size ?
							`${w.get('acid')}_${w.get('acfullname')} ${assList.map(m => `${m.get('assid')}_${m.get('assname')}`).join('_')}` :
							`${w.get('acid')} ${w.get('acfullname')}` : ''
						return <p className="table-item-line" key={j}>{acStr}</p>
					})}
				</li>
				<li>
					{
						vcItem.get('jvlist').map((w, j) =>
							<p className="table-item-line-amonut" key={j}>{w.get('jvdirection') === '' ?
							'' :
							w.get('jvdirection') === 'debit' ? <Amount className="table-item-line-amonut">{w.get('jvamount')}</Amount> : ''}</p>)}
				</li>
				<li>
					{
						vcItem.get('jvlist').map((w, j) =>
							<p className="table-item-line-amonut" key={j}>{w.get('jvdirection') === '' ?
							'' :
							w.get('jvdirection') === 'debit' ? '' : <Amount className="table-item-line-amonut">{w.get('jvamount')}</Amount>}</p>)}
				</li>
			</CxpzTableItem>
		)
	}
}
