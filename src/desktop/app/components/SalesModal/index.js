// import React from 'react'
// import { connect }	from 'react-redux'
// import { Button, Modal, Icon } from 'antd'
// // import * as lrxsActions from 'app/actions/lrxs.action.js'
// // import * as cxxsActions from 'app/actions/cxxs.action'
// import './style.less'
// import Table from './Table'
// import ChargebackTable from './ChargebackTable'
// import OrderFooter from './OrderFooter'
// import SheetFooter from './SheetFooter'
// import ChargebackFooter from './ChargebackFooter'
// import { billShouldModify } from 'app/utils'
//
// @connect(state => state)
// export default
// class SalesModal extends React.Component {
//
// 	render() {
//
//         const { dispatch, cxxsState, allState } = this.props
// 		const title = ['', '商品名称', '规格', '属性', '仓库', '单位', '数量', '单价（元）', '活动优惠', '销售金额（元）', '备注']
// 		const chargebackTitle = ['', '商品名称', '规格', '属性', '单位', '数量','单价（元）', '退款金额（元）', '备注']
//
//
//         const views = cxxsState.get('views')
//         const currentPage = views.get('currentPage')
//         const showBillModal = allState.get('cxxsBomb')
// 		const billIndexList = views.get('billIndexList')
//         const showItem = views.get('showItem')
// 		const billIdx = views.get('billIdx')
// 		const currentBillCategory = views.get('currentBillCategory')
// 		const lineList = showItem.get('lineList')
// 		const nextBillIdx = billIdx + 1
// 		const lastBillIdx = billIdx - 1
// 		const shouldModify = billShouldModify(currentBillCategory, showItem.get('relateBillCoding'))
//
//
// 		let showTitleName = ''
// 		let components = null
// 		let billFooter = null
// 		let toRelateBill = ''
//
// 		;({
//             'salesOrder': () => {
//                 showTitleName = '销售订单'
// 				toRelateBill = '生成销售单'
// 				components = <Table
// 					lineList={lineList}
// 					dispatch={dispatch}
// 				/>
// 				billFooter = <OrderFooter
// 					showItem={showItem}
// 				/>
//             },
//             'salesSheet': () => {
// 				showTitleName = '销售单'
// 				toRelateBill = '生成销售退单'
// 				components = <Table
// 					lineList={lineList}
// 					dispatch={dispatch}
// 				/>
// 				billFooter = <SheetFooter
// 					showItem={showItem}
// 				/>
//             },
//             'salesChargeback': () => {
// 				showTitleName = '销售退单'
// 				toRelateBill = '生成入库单'
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
//                 onCancel={() => dispatch(cxxsActions.hideCxxsBillModal())}
//                 width="790"
// 				className='salesModal'
//                 footer={[
// 					<Button key="first" type="ghost" size="large"
// 						disabled={billIndexList.size && billIdx == 0 ? true : false}
// 						onClick={() => dispatch(cxxsActions.getSalesBillFetch(0))}
// 						>
// 						<Icon type="step-backward" />
//                     </Button>,
// 					<Button key="pre" type="ghost" size="large"
// 						disabled={billIndexList.size && lastBillIdx != -1 ? false : true}
// 						onClick={() => dispatch(cxxsActions.getSalesBillFetch(lastBillIdx))}
// 						>
// 						<Icon type="caret-left" />
//                     </Button>,
// 					<Button key="modify" type="ghost" size="large"
// 						disabled = {!shouldModify}
// 						onClick={() => {
// 						dispatch(cxxsActions.hideCxxsBillModal())
// 						dispatch(cxxsActions.enterLrxs(currentBillCategory, showItem))
// 					}}>
// 						修改
//                     </Button>,
// 					<Button key="toRelateBill" type="ghost" size="large"
// 						onClick={() => {
// 						dispatch(lrxsActions.cxxsRelateSalesBill(currentBillCategory, showItem.get('id'), showItem.getIn(['serialNumberDTO', 'coding'])))
// 					}}>
// 						{toRelateBill}
//                     </Button>,
// 					<Button key="delete" type="ghost" size="large"
// 						disabled = {!shouldModify}
// 						onClick={() => dispatch(cxxsActions.deleteSingleSales(currentBillCategory, showItem.get('id'), billIdx))}>
// 						删除
//                     </Button>,
// 					<Button key="next" type="ghost" size="large"
// 						disabled={billIndexList.size && nextBillIdx == billIndexList.size ? true : false}
// 						onClick={() => dispatch(cxxsActions.getSalesBillFetch(nextBillIdx))}
// 						>
// 						<Icon type="caret-right" />
//                     </Button>,
// 					<Button key="last" type="ghost" size="large"
// 						disabled={billIndexList.size && nextBillIdx != billIndexList.size ? false : true}
// 						onClick={() => dispatch(cxxsActions.getSalesBillFetch(billIndexList.size-1))}
// 						>
// 						<Icon type="step-forward" />
//                     </Button>
// 				]}
//                 >
//                 <div>
//                     <div className="salesModalTitle">
// 						<p className="salesModalTitle-center">{showTitleName}</p>
// 						<div className="salesModalTitle-line">
// 							<div>
// 								<span>单据编号：</span>
// 								<span>{showItem.getIn(['serialNumberDTO', 'coding'])}</span>
// 								<span style={{display: showItem.get('relateBillCoding') ? '' : 'none'}}>&nbsp;&nbsp;关联单据：</span>
// 								<span className="salesModalTitle-line-coding" style={{display: showItem.get('relateBillCoding') ? '' : 'none'}}>
// 									{(showItem.get('relateBillCoding') || []).map((u,i) => <span>{u.get('relateCoding')}</span>)}
// 								</span>
//
// 							</div>
//                             <div>{showItem.get('billDate')}</div>
// 						</div>
//                         <div className="salesModalTitle-line">
// 							<div>
//                                 <span>客户：</span>
// 								<span>{showItem.get('customer')}</span>
// 							</div>
//                             <div></div>
// 						</div>
// 					</div>
//                     <div className={["salesModalBody", currentBillCategory == 'purchaseChargeback' ? 'salesModalBody-chargeback' : ''].join(' ')}>
//                         <i className="salesModalBody-shadow"></i>
// 						<ul className="salesModalBody-title">
//                             {
//                                 (currentBillCategory != 'salesChargeback' ? title : chargebackTitle).map((u,i) => <li>{u}</li>)
//                             }
// 						</ul>
// 						{/* 表格中心 */}
// 						{components}
//
//                     </div>
// 					{billFooter}
//                 </div>
//             </Modal>
// 		)
// 	}
// }
