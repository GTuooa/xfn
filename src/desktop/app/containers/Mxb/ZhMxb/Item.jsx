import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

// yezi
import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as zhmxActions from 'app/redux/Mxb/ZhMxb/zhMxb.action'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
import { Modal, Icon } from 'antd'
import { type } from 'app/containers/components/moduleConstants/common'

import { TableItem, TableOver, Amount } from 'app/components'

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
		console.log(showDrawer);
		return (
			<TableItem className={className} line={line}>
				<li>{mxitem.get('runningDate')}</li>
				<li
					className={ haveChild ?
					"table-item-with-triangle trianglePointer table-item-hover" :
					'table-item-with-triangle table-item-hover table-span-no-padding'}
					>
						<span
							className="account-flowNumber"
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
							style={{'textDecoration':'underline'}}
						>
							{flowNumber}
						</span>
						{
							haveChild ?
							<span className="table-item-triangle-account-wrap" onClick={() => dispatch(zhmxActions.accountDetailTriangleSwitch(showChild, mxitem.get('uuid')))}>
								<Icon className="table-item-triangle-account"
									type={showChild ? 'up' : 'down'}></Icon>
								</span> : ''
						}


				</li>
				<TableOver className="abstract-left">{mxitem.get('runningAbstract')+(mxitem.get('cardAbstract')?mxitem.get('cardAbstract'):'')}</TableOver>
				<TableOver className="abstract-center">{type[mxitem.get('runningType')]}</TableOver>
				<TableOver><Amount>{mxitem.get('incomeAmount')}</Amount></TableOver>
				<TableOver><Amount>{mxitem.get('expenseAmount')}</Amount></TableOver>
				<TableOver><Amount>{mxitem.get('balanceAmount')}</Amount></TableOver>

				</TableItem>
		);
	}
}
