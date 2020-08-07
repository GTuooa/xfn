import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

// yezi
import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as zhmxActions from 'app/redux/Mxb/ZhMxb/zhMxb.action'
import { Icon } from 'antd'
import { TableItem, TableOver, Amount, Modal } from 'app/components'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			line,
			mxitem,
			haveChild,
			showChild,
			issuedate,
			dispatch,
			className,
			panes,
			uuidList,
			editLrAccountPermission,
			showDrawer
		} = this.props
		const beBusiness = mxitem.get('beBusiness')
		const runningState = mxitem.get('runningState')
		const jumpCxToLr = (callBack) => {
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
		return (
			<TableItem className={className} line={line}>
				<TableOver textAlign='left'>{mxitem.get('runningDate')}</TableOver>
				<TableOver
					textAlign='left'
				><span
					className='account-flowNumber'
					onClick={() => {
						dispatch(yllsActions.getYllsBusinessData(mxitem,showDrawer))
						// if (editLrAccountPermission) {
						// 	if (!beBusiness && runningState !== 'STATE_ZZ') {
						// 		dispatch(cxlsActions.getBusinessPayment(mxitem,'',uuidList))
						// 	} else {
						// 		if (runningState === 'STATE_YYSR_JZCB') {
						// 			jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_JZCB',uuidList)))
						// 		} else if (runningState === 'STATE_FPRZ_CG' || runningState === 'STATE_FPRZ_TG') {
						// 			jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_FPRZ',uuidList)))
						// 		} else if (runningState === 'STATE_KJFP_XS' || runningState === 'STATE_KJFP_TS') {
						// 			jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_KJFP',uuidList)))
						// 		} else if (runningState === 'STATE_ZCWJZZS') {
						// 			jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_ZCWJZZS',uuidList)))
						// 		} else if (runningState === 'STATE_ZZ') {
						// 			jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(mxitem, 'modify', 'LB_ZZ',uuidList)))
						// 		} else if (runningState === 'STATE_GGFYFT') {
						// 			jumpCxToLr(() => dispatch(cxlsActions.jumpCommonCharge(mxitem,uuidList)))
						// 		} else {
						// 			dispatch(accountActions.getRunningBusinessDuty(mxitem.get('flowNumber'),mxitem.get('uuid'),uuidList))
						// 		}
						// 	}
						// }
				}}>{mxitem.get('flowNumber')}</span></TableOver>
				<TableOver textAlign='left'>{mxitem.get('runningAbstract')+(mxitem.get('cardAbstract')?mxitem.get('cardAbstract'):'')}</TableOver>
				<TableOver textAlign='right'><Amount>{mxitem.get('incomeAmount')}</Amount></TableOver>
				<TableOver textAlign='right'><Amount>{mxitem.get('expenseAmount')}</Amount></TableOver>
				<TableOver textAlign='right'><Amount>{mxitem.get('balanceAmount')}</Amount></TableOver>
				</TableItem>
		);
	}
}
