import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

// yezi
import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import { Modal } from 'antd'
import { TableItem, TableOver, Amount } from 'app/components'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
@immutableRenderDecorator
export default
class ItemAll extends React.Component {

	render() {
		const {
			idx,
			mxitem,
			issuedate,
			dispatch,
			className,
			panes,
			uuidList,
			wlRelate,
			editLrAccountPermission,
			showDrawer
		} = this.props

		const jumpMXToLr = (callBack) => {
			if (panes.includes('LrAccount')) {
				Modal.confirm({
					title: '温馨提示',
					content: '录入流水页面有未保存数据，是否直接覆盖',
					okText: '确定',
					cancelText: '不',
					onOk: () => {
						callBack()
					}
				})
			} else {
				callBack()
			}
		}
		const beBusiness = mxitem.get('beBusiness')
		const runningState = mxitem.get('runningState')
		const flowNumber = mxitem.get('runningIndex') && mxitem.get('runningIndex') > 0 ?  `${mxitem.get('flowNumber')}_${mxitem.get('runningIndex')}` : mxitem.get('flowNumber')
		const runningDate = mxitem.get('runningDate')
		const dateYmd = runningDate ? runningDate.substr(0,10) : ''
		return (
			<TableItem className={className} line={idx}>
				<li>{dateYmd}</li>
				<li
					onClick={() => {
						dispatch(yllsActions.getYllsBusinessData(mxitem,showDrawer))
						// if (editLrAccountPermission) {
						// 	if (!beBusiness && runningState !== 'STATE_ZZ') {
						// 		dispatch(cxlsActions.getBusinessPayment(mxitem,'',uuidList))
						// 	} else {
						// 		if (runningState === 'STATE_YYSR_JZCB') {
						// 			jumpMXToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_JZCB',uuidList)))
						// 		} else if (runningState === 'STATE_FPRZ_CG' || runningState === 'STATE_FPRZ_TG') {
						// 			jumpMXToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_FPRZ',uuidList)))
						// 		} else if (runningState === 'STATE_KJFP_XS' || runningState === 'STATE_KJFP_TS') {
						// 			jumpMXToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_KJFP',uuidList)))
						// 		} else if (runningState === 'STATE_ZCWJZZS') {
						// 			jumpMXToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_ZCWJZZS',uuidList)))
						// 		} else if (runningState === 'STATE_ZZ') {
						// 			jumpMXToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_ZZ',uuidList)))
						// 		} else if (runningState === 'STATE_GGFYFT') {
						// 			jumpMXToLr(() => dispatch(cxlsActions.jumpCommonCharge(mxitem,uuidList)))
						// 		} else {
						// 			dispatch(accountActions.getRunningBusinessDuty(mxitem.get('flowNumber'),mxitem.get('uuid'),uuidList))
						// 		}
						// 	}
						// }
					}}
					><span className="account-flowNumber">{flowNumber}</span></li>
				<TableOver className="abstract-left">{mxitem.get('runningAbstract')+(mxitem.get('cardAbstract')?mxitem.get('cardAbstract'):'')}</TableOver>
				<TableOver className="amountwlmx-title-cell">
					<div className="wlmx-amount-center">
						<Amount>{wlRelate == '2' ? mxitem.get('happenIncomeAmount') : mxitem.get('happenExpenseAmount')}</Amount>
					</div>
				</TableOver>
				<TableOver className='amountwlmx-title-cell'>
					<div className="wlmx-amount-center">
						<Amount>{wlRelate == '2' ? mxitem.get('paymentIncomeAmount') : mxitem.get('paymentExpenseAmount')}</Amount>
					</div>
				</TableOver>
				<TableOver>
					<div className="wlmx-amount-center">
						<Amount>{mxitem.get('balanceAmount')}</Amount>
					</div>
				</TableOver>

				</TableItem>
		);
	}
}
