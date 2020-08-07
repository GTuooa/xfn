// import React from 'react'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'
// import { Icon } from 'antd'
//
//
// @immutableRenderDecorator
// export default
// class TableItem extends React.Component {
//
// 	render() {
//         const {
//             idx,
//             item
//         } = this.props
//
// 		let showPropertyName = '';
// 		(item.get('properties') || []).map((u,i) => {
// 			showPropertyName = `${showPropertyName}${showPropertyName ? '-' : ''}${u.get('name')}`
// 		})
//
// 		return (
//             <ul className="modalBody-item">
//                 <li><span>{idx}</span></li>
//                 <li>
//                     <span>{item.get('productName')}</span>
//                     <span className="modalBody-item-triangle-icon" style={{display: item.get('bePackage') ? '' : 'none'}}>
// 						<Icon type='down'/>
// 					</span>
//                 </li>
//                 <li><span>{item.get('specifications')}</span></li>
//                 <li><span>{showPropertyName}</span></li>
//                 <li><span>{item.get('warehouse')}</span></li>
//                 <li><span>{item.get('unit')}</span></li>
//                 <li><span>{item.get('number')}</span></li>
// 				<li><span>{item.get('unitPrice')}</span></li>
//                 <li><span>{item.get('discountAmount')}</span></li>
//                 <li><span>{item.get('amount')}</span></li>
//                 <li><span>{item.get('remark')}</span></li>
//             </ul>
// 		)
// 	}
// }
