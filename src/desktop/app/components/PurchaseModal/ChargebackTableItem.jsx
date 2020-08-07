// import React from 'react'
// import { Icon  } from 'antd'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'
//
//
// @immutableRenderDecorator
// export default
// class ChargebackTableItem extends React.Component {
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
//                 <li><span><span>{showPropertyName}</span></span></li>
//                 <li><span>{item.get('unit')}</span></li>
//                 <li><span>{item.get('number')}</span></li>
// 				<li><span>{item.get('unitPrice')}</span></li>
//                 <li><span>{item.get('amount')}</span></li>
//                 <li><span>{item.get('remark')}</span></li>
//             </ul>
// 		)
// 	}
// }
