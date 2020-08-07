// import React from 'react'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'
// import { DateLib }	from 'app/utils'
//
// @immutableRenderDecorator
// export default
// class SheetFooter extends React.Component {
//
// 	render() {
//         const {
//             showItem
//         } = this.props
//
// 		const gmtCreate = showItem.get('gmtCreate')
// 		const gmtModify = showItem.get('gmtModify')
// 		const createTime = gmtCreate == null ? '' : new DateLib(new Date(gmtCreate)).getFullDate()
// 		const modifyTime = gmtModify == null ? '' : new DateLib(new Date(gmtModify)).getFullDate()
//
// 		return (
//
//             <div className='modalFooter'>
//                 <div className="modalFooter-item modalFooter-top">
//                     <div>
//                         <span>合计：</span>
//                         <span>{showItem.get('totalAmount')}</span>
//                     </div>
//                     <div>
//                         <span>折扣额：</span>
//                         <span>{showItem.get('billDiscountAmount')}</span>
//                     </div>
//                     <div>
//                         <span>其他费用：</span>
//                         <span>{showItem.get('otherExpenses')}</span>
//                     </div>
//                     <div>
//                         <span>总计金额：</span>
//                         <span>{showItem.get('billAmount')}</span>
//                     </div>
//                     <div>
//                         <span>本次欠款：</span>
//                         <span>{showItem.get('billArrears')}</span>
//                     </div>
//                 </div>
//                 <div className="modalFooter-item">
//                     <div>
//                         <span>结算账户：</span>
//                         <span></span>
//                     </div>
//                     <div>
//                         <span>实付金额：</span>
//                         <span>{showItem.get('paidAmount')}</span>
//                     </div>
//                     <div>
//                         <span>预付定金抵扣：</span>
//                         <span>{showItem.get('depositOffsetAmount')}</span>
//                         <span className="modalFooter-item-color">（ 订单订金金额：）</span>
//                     </div>
//                 </div>
//                 <div className="modalFooter-item">
//                     <div>
//                         <span>备注：</span>
//                         <span>{showItem.get('billRemark')}</span>
//                     </div>
//                 </div>
//                 <div className='modalFooter-bottom'>
//                     <span>制单人： {showItem.get('createBy')}</span>
// 					<span>录入时间：{createTime}</span>
// 					<span>修改时间：{modifyTime}</span>
//                 </div>
//             </div>
// 		)
// 	}
// }
