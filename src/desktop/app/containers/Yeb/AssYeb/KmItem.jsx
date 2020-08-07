import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as assKmyebActions from 'app/redux/Yeb/AssYeb/assYeb.action.js'
import * as assmxbActions from 'app/redux/Mxb/AssMxb/assMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { TableItem, TableOver, ItemTriangle, Amount } from 'app/components'

@immutableRenderDecorator
export default
class KmItem extends React.Component {

	render() {

		const {
			kmitem,
			dispatch,
			chooseperiods,
			issuedate,
			endissuedate,
			kmyeAssCategory,
			line,
			idx,
			showchilditem,
			acId,
			oldAssKmyebList,
			className,
			assIdTwo,
			doubleAssCategory,
			assNameTwo
		} = this.props

		let paddingLeft='';
		if(kmitem.get('isWrap')){
			paddingLeft='4px';
		}else {
			paddingLeft='8px'
		}
		let acid=kmitem.get('assid');
		let upperAssid=kmitem.get('upperAssid');
		if(acid==upperAssid){
			acid=acId
		}

		return (
			<TableItem line={line} className={["kmyeb-table-width", "kmyeb-table-aligh", className].join(' ')}>
				<ItemTriangle
					isLink={true}
					showTriangle={kmitem.get('showchilditem') == false || kmitem.get('showchilditem')}
					showchilditem={ (showchilditem && kmitem.get('showchilditem')) }
					paddingLeft={paddingLeft}
					onClick={(e) => {
						e.stopPropagation()
						dispatch(assKmyebActions.showAssKmyebChildItiem(idx))
					}}
					IdOnClick={() => {
						sessionStorage.setItem('previousPage', 'asskmyeb')
						// !dispatch(asskmmxbActions.getAssMxbAclistFetch(issuedate, endissuedate, kmyeAssCategory, kmitem.get('wrapId'), assIdTwo, doubleAssCategory, assNameTwo, acid)) &&
						!dispatch(assmxbActions.getAssMxbAclistFetch(issuedate, endissuedate, kmyeAssCategory, kmitem.get('wrapId'), assIdTwo, assIdTwo ? doubleAssCategory : '', assNameTwo, acid)) &&
						// dispatch(homeActions.addTabpane('AssMxb'))
						dispatch(homeActions.addPageTabPane('MxbPanes', 'AssMxb', 'AssMxb', '辅助明细表'))
						dispatch(homeActions.addHomeTabpane('Mxb', 'AssMxb', '辅助明细表'))
						// 是否多账期的状态
						dispatch(assmxbActions.changeAssmxbChooseperiods(chooseperiods))
					}}
					className={(kmitem.get('showchilditem') == false || kmitem.get('showchilditem')) ? 'haveChild' : 'notHave'}
					>
					{kmitem.get('assid')}
				</ItemTriangle>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={(e) => {
						e.stopPropagation()
						sessionStorage.setItem('previousPage', 'asskmyeb')
						// !dispatch(asskmmxbActions.getAssMxbAclistFetch(issuedate, endissuedate, kmyeAssCategory, kmitem.get('wrapId'), assIdTwo, doubleAssCategory, assNameTwo, acid)) &&
						!dispatch(assmxbActions.getAssMxbAclistFetch(issuedate, endissuedate, kmyeAssCategory, kmitem.get('wrapId'), assIdTwo, assIdTwo ? doubleAssCategory : '', assNameTwo, acid)) &&
						// dispatch(homeActions.addTabpane('AssMxb'))
						dispatch(homeActions.addPageTabPane('MxbPanes', 'AssMxb', 'AssMxb', '辅助明细表'))
						dispatch(homeActions.addHomeTabpane('Mxb', 'AssMxb', '辅助明细表'))
						// 是否多帐期的状态
						dispatch(assmxbActions.changeAssmxbChooseperiods(chooseperiods))
					}}
					>
					{kmitem.get('assname')}
				</TableOver>
				<li>
					<span><Amount>{kmitem.get('debitOpeningBalance')}</Amount></span>
					<span><Amount>{kmitem.get('creditOpeningBalance')}</Amount></span>
					<span><Amount>{kmitem.get('debit')}</Amount></span>
					<span><Amount>{kmitem.get('credit')}</Amount></span>
					<span><Amount>{kmitem.get('debitSum')}</Amount></span>
					<span><Amount>{kmitem.get('creditSum')}</Amount></span>
					<span><Amount>{kmitem.get('debitClosingBalance')}</Amount></span>
					<span><Amount>{kmitem.get('creditClosingBalance')}</Amount></span>
				</li>
			</TableItem>
		)
	}
}
