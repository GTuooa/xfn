// import React from 'react'
// import { connect }	from 'react-redux'
// import { Button, Modal, Icon } from 'antd'
// import * as Limit from 'app/constants/Limit.js'
// import { DateLib }	from 'app/utils'
// import * as lrkcActions from 'app/actions/lrck.action.js'
// import * as cxkcActions from 'app/actions/cxkc.action.js'
// import './style.less'
// import { fromJS, toJS } from 'immutable'
// import TableAllo from './TableAllo'
// import TableCost from './TableCost'
// import TableEntry from './TableEntry'
//
//
// @connect(state => state)
// export default
// class CxkcBomb extends React.Component {
//
// 	render() {
// 		const { dispatch, cxckState, allState } = this.props
//
// 		const bomb = cxckState.get('bomb')
// 		const cxkcBomb = allState.get('cxkcBomb')
// 		const currentPage = bomb.get('currentBombPage')
// 		const billIndexList = bomb.get('billIndexList')
// 		const showItem = bomb.get('showItem')
// 		const billIdx = bomb.get('billIdx')
// 		const lineList = showItem.get('lineList')
// 		const nextBillIdx = billIdx + 1
// 		const lastBillIdx = billIdx - 1
// 		const gmtCreate = showItem.get('gmtCreate')
// 		const gmtModify = showItem.get('gmtModify')
// 		const createTime = gmtCreate == null ? '' : new DateLib(new Date(gmtCreate)).getFullDate()
// 		const modifyTime = gmtModify == null ? '' : new DateLib(new Date(gmtModify)).getFullDate()
//
// 		let showTitleName = ''
// 		let title = []
// 		let titleClassName = ''
// 		let components = null
//
// 		;({
// 			'Allocation': () => {
// 				showTitleName = '调拨单'
// 				title = ['', '存货编码', '规格型号', '属性', '单位', '调出仓库', '调入仓库', '调拨数量', '备注']
// 				titleClassName = 'allocation-tabel-width cxkcModalBody-title'
// 				components = <TableAllo
// 				lineList={lineList}
// 				dispatch={dispatch}
// 				/>
// 			},
// 			'costAdjust': () => {
// 				showTitleName = '成本调整单'
// 				title = ['', '存货编码', '规格型号', '属性', '基本单位', '系统余额', '实际余额', '调整金额', '备注']
// 				titleClassName = 'lrkc-cost-tabel-width cxkcModalBody-title'
// 				components = <TableCost
// 					lineList={lineList}
// 					dispatch={dispatch}
// 				/>
// 			},
// 			'Entry': () => {
// 				showTitleName = '其他入库单'
// 				title = ['', '存货编码', '规格型号', '属性', '单位', '仓库', '数量', '入库单价', '入库金额' ,'备注']
// 				titleClassName = 'entry-tabel-width cxkcModalBody-title'
// 				components = <TableEntry
// 					lineList={lineList}
// 					dispatch={dispatch}
// 				/>
// 			},
// 			'Out': () => {
// 				showTitleName = '其他出库单'
// 				title = ['', '存货编码', '规格型号', '属性', '单位', '仓库', '数量', '出库单价', '出库金额' ,'备注']
// 				titleClassName = 'entry-tabel-width cxkcModalBody-title'
// 				components = <TableEntry
// 					lineList={lineList}
// 					dispatch={dispatch}
// 				/>
// 			}
// 		}[currentPage])()
//
//
// 		return (
// 			<Modal
// 				visible={cxkcBomb}
// 				onCancel={() => dispatch(cxkcActions.showCxkcBomb(false))}
// 				width="790"
// 				className='cxkcModal'
// 				footer={[
// 					<Button key="first" type="ghost" size="large"
// 						disabled={billIndexList.size && billIdx == 0 ? true : false}
// 						onClick={() => dispatch(cxkcActions.getCxkcBillFetch(0))}
// 						>
// 						<Icon type="step-backward" />
// 					</Button>,
// 					<Button key="pre" type="ghost" size="large"
// 						disabled={billIndexList.size && lastBillIdx != -1 ? false : true}
// 						onClick={() => dispatch(cxkcActions.getCxkcBillFetch(lastBillIdx))}
// 						>
// 						<Icon type="caret-left" />
// 					</Button>,
// 					<Button key="modify" type="ghost" size="large" onClick={() => {
// 						dispatch(cxkcActions.showCxkcBomb(false))
// 						dispatch(lrkcActions[`fromOtherTo${currentPage}`]('Lrck', showItem))
// 					}}>
// 						修改
// 					</Button>,
// 					<Button key="delete" type="ghost" size="large" onClick={() => dispatch(cxkcActions.deleteCxkcBillFetch(currentPage, showItem.get('id'), billIdx))}>
// 						删除
// 					</Button>,
// 					<Button key="next" type="ghost" size="large"
// 						disabled={billIndexList.size && nextBillIdx == billIndexList.size ? true : false}
// 						onClick={() => dispatch(cxkcActions.getCxkcBillFetch(nextBillIdx))}
// 						>
// 						<Icon type="caret-right" />
// 					</Button>,
// 					<Button key="last" type="ghost" size="large"
// 						disabled={billIndexList.size && nextBillIdx != billIndexList.size ? false : true}
// 						onClick={() => dispatch(cxkcActions.getCxkcBillFetch(billIndexList.size-1))}
// 						>
// 						<Icon type="step-forward" />
// 					</Button>
// 				]}>
// 					<div>
// 						<div className="cxkcModalTitle">
// 						<p className="cxkcModalTitle-center">{showTitleName}</p>
// 						<div className="cxkcModalTitle-line">
// 							<div>
// 								<span>单据编号：</span>
// 								<span>{showItem.getIn(['serialNumberDTO', 'coding'])}</span>
// 								{
// 									(currentPage==='Allocation' || currentPage==='costAdjust') ?
// 									"" :
// 									<span>
// 										<span>&nbsp;&nbsp;关联单据：</span>
// 										<span>
// 											{(showItem.get('relateBillCoding') || []).map((u,i) => <span>{u.get('relateCoding')}</span>)}
// 										</span>
// 									</span>
// 								}
// 							</div>
//                             <div>{showItem.get('billDate')}</div>
// 						</div>
// 						{
// 							(currentPage==='Allocation' || currentPage==='costAdjust') ?
// 							'' :
// 							<div className="cxkcModalTitle-line">
// 								<div>
// 									<span>{currentPage==='Entry' ? '供应商：' : '客户：'}</span>
// 									<span>{showItem.get('supplier')}</span>
// 								</div>
// 								<div>
// 									<span>业务类型：</span>
// 									<span>{showItem.get('businessType')}</span>
// 								</div>
// 							</div>
// 						}
// 					</div>
// 					<div className={["cxkcModalBody", currentPage == 'purchaseChargeback' ? 'cxkcModalBody-chargeback' : ''].join(' ')}
// 						style={{marginTop: (currentPage==='Allocation' || currentPage==='costAdjust') ? '55px':''}}>
// 						<i className="cxkcModalBody-shadow"></i>
// 						<ul className={titleClassName}>
// 							{ title.map((u,i) => <li key={i}>{u}</li>) }
// 						</ul>
// 						{/* 表格中心 */}
// 						{components}
// 					</div>
// 					<div className='cxkcModalFooter'>
// 						<span>制单人： {showItem.get('createBy')}</span>
// 						<span>录入时间： {createTime}</span>
// 						<span>修改时间： {modifyTime}</span>
// 					</div>
// 				</div>
// 			</Modal>
// 		)
// 	}
// }
