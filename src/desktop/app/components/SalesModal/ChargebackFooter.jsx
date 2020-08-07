// import React from 'react'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'
// import { DateLib }	from 'app/utils'
//
// @immutableRenderDecorator
// export default
// class ChargebackFooter extends React.Component {
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
//             <div className='salesModalFooter'>
//                 <div className="salesModalFooter-item salesModalFooter-top">
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
//                         <span>供应商欠款</span>
//                         <span>{showItem.get('arrearsOffset')}</span>
//                     </div>
//
//                 </div>
//                 <div className="salesModalFooter-item">
//                     <div>
//                         <span>结算账户：</span>
//                         <span></span>
//                     </div>
//                     <div>
//                         <span>退换客户金额：</span>
//                         <span>{showItem.get('refundAmount')}</span>
//                     </div>
//                 </div>
//                 <div className="salesModalFooter-item">
//                     <div>
//                         <span>备注：</span>
//                         <span>{showItem.get('billRemark')}</span>
//                     </div>
//                 </div>
//                 <div className='salesModalFooter-bottom'>
//                     <span>制单人： {showItem.get('createBy')}</span>
// 					<span>录入时间：{createTime}</span>
// 					<span>修改时间：{modifyTime}</span>
//                 </div>
//             </div>
// 		)
// 	}
// }
