// import React from 'react'
// import { connect }	from 'react-redux'
// import { Button, Modal, Icon } from 'antd'
// import * as lrcgActions from 'app/actions/lrcg.action.js'
// import * as cxcgActions from 'app/actions/cxcg.action'
// import './style.less'
// import { fromJS, toJS } from 'immutable'
// import ChargebackTable from './ChargebackTable'
// import Table from './Table'
// import OrderFooter from './OrderFooter'
// import SheetFooter from './SheetFooter'
// import ChargebackFooter from './ChargebackFooter'
// import { billShouldModify } from 'app/utils'
//
//
// @connect(state => state)
// export default
// class PurchaseModal extends React.Component {
//
// 	render() {
//
//         const { dispatch, cxcgState, allState } = this.props
// 		const title = ['', '商品名称', '规格', '属性', '仓库', '单位', '数量', '单价（元）', '活动优惠', '采购金额（元）', '备注']
// 		const chargebackTitle = ['', '商品名称', '规格', '属性', '单位', '数量','单价（元）', '退款金额（元）', '备注']
//
//
//         const views = cxcgState.get('views')
//         const currentPage = views.get('currentPage')
//         const showBillModal = allState.get('cxcgBomb')
// 		const billIndexList = views.get('billIndexList')
//         const showItem = views.get('showItem')
// 		const billIdx = views.get('billIdx')
// 		const currentBillCategory = views.get('currentBillCategory')
// 		const lineList = showItem.get('lineList')
// 		const nextBillIdx = billIdx + 1
// 		const lastBillIdx = billIdx - 1
// 		const shouldModify = billShouldModify(currentBillCategory, showItem.get('relateBillCoding'))
//
// 		let showTitleName = ''
// 		let components = null
// 		let billFooter = null
// 		let toRelateBill = ''
//
// 		;({
//             'purchaseOrder': () => {
//                 showTitleName = '采购订单'
// 				toRelateBill = '生成采购单'
// 				components = <Table
// 					lineList={lineList}
// 					dispatch={dispatch}
// 				/>
// 				billFooter = <OrderFooter
// 					showItem={showItem}
// 				/>
//             },
//             'purchaseSheet': () => {
// 				showTitleName = '采购单'
// 				toRelateBill = '生成采购退单'
// 				components = <Table
// 					lineList={lineList}
// 					dispatch={dispatch}
// 				/>
// 				billFooter = <SheetFooter
// 					showItem={showItem}
// 				/>
//             },
//             'purchaseChargeback': () => {
// 				showTitleName = '采购退单'
// 				toRelateBill = '生成出库单'
// 				components = <ChargebackTable
// 					lineList={lineList}
// 					dispatch={dispatch}
// 				/>
// 				billFooter = <ChargebackFooter
// 					showItem={showItem}
// 				/>
//             }
//         }[currentBillCategory])()
//
//
// 		return (
//             <Modal
//                 visible={showBillModal}
//                 onCancel={() => dispatch(cxcgActions.hideCxcgBillModal())}
//                 width="790"
// 				className='purchaseModal'
//                 footer={[
// 					<Button key="first" type="ghost" size="large"
// 						disabled={billIndexList.size && billIdx == 0 ? true : false}
// 						onClick={() => dispatch(cxcgActions.getPurchaseBillFetch(0))}
// 						>
// 						<Icon type="step-backward" />
//                     </Button>,
// 					<Button key="pre" type="ghost" size="large"
// 						disabled={billIndexList.size && lastBillIdx != -1 ? false : true}
// 						onClick={() => dispatch(cxcgActions.getPurchaseBillFetch(lastBillIdx))}
// 						>
// 						<Icon type="caret-left" />
//                     </Button>,
// 					<Button key="modify" type="ghost" size="large"
// 						disabled = {!shouldModify}
// 						onClick={() => {
// 						dispatch(cxcgActions.hideCxcgBillModal())
// 						dispatch(cxcgActions.enterLrcg(currentBillCategory, showItem))
// 					}}>
// 						修改
//                     </Button>,
// 					<Button key="toRelateBill" type="ghost" size="large"
// 						onClick={() => {
// 						dispatch(lrcgActions.cxcgRelatePurchaseBill(currentBillCategory, showItem.get('id'), showItem.getIn(['serialNumberDTO', 'coding'])))
// 					}}>
// 						{toRelateBill}
//                     </Button>,
// 					<Button key="delete" type="ghost" size="large"
// 						disabled = {!shouldModify}
// 						onClick={() => dispatch(cxcgActions.deleteSinglePurchase(currentBillCategory, showItem.get('id'), billIdx))}>
// 						删除
//                     </Button>,
// 					<Button key="next" type="ghost" size="large"
// 						disabled={billIndexList.size && nextBillIdx == billIndexList.size ? true : false}
// 						onClick={() => dispatch(cxcgActions.getPurchaseBillFetch(nextBillIdx))}
// 						>
// 						<Icon type="caret-right" />
//                     </Button>,
// 					<Button key="last" type="ghost" size="large"
// 						disabled={billIndexList.size && nextBillIdx != billIndexList.size ? false : true}
// 						onClick={() => dispatch(cxcgActions.getPurchaseBillFetch(billIndexList.size-1))}
// 						>
// 						<Icon type="step-forward" />
//                     </Button>
// 				]}
//                 >
//                 <div>
//                     <div className="modalTitle">
// 						<p className="modalTitle-center">{showTitleName}</p>
// 						<div className="modalTitle-line">
// 							<div>
// 								<span>单据编号：</span>
// 								<span>{showItem.getIn(['serialNumberDTO', 'coding'])}</span>
// 								<span style={{display: showItem.get('relateBillCoding') ? '' : 'none'}}>&nbsp;&nbsp;关联单据：</span>
// 								<span className="modalTitle-line-coding" style={{display: showItem.get('relateBillCoding') ? '' : 'none'}}>
// 									{(showItem.get('relateBillCoding') || []).map((u,i) => <span>{u.get('relateCoding')}</span>)}
// 								</span>
//
// 							</div>
//                             <div>{showItem.get('billDate')}</div>
// 						</div>
//                         <div className="modalTitle-line">
// 							<div>
//                                 <span>供应商：</span>
// 								<span>{showItem.get('supplier')}</span>
// 							</div>
//                             <div></div>
// 						</div>
// 					</div>
//                     <div className={["modalBody", currentBillCategory == 'purchaseChargeback' ? 'modalBody-chargeback' : ''].join(' ')}>
//                         <i className="modalBody-shadow"></i>
// 						<ul className="modalBody-title">
//                             {
//                                 (currentBillCategory != 'purchaseChargeback' ? title : chargebackTitle).map((u,i) => <li>{u}</li>)
//                             }
// 						</ul>
// 						{/* 表格中心 */}
// 						{components}
//                     </div>
// 					{/* 单据底部 */}
// 					{billFooter}
//
//                 </div>
//             </Modal>
// 		)
// 	}
// }
