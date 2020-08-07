// import React from 'react'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'
// import { Icon } from 'antd'
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
// 		let showPropertyName = '';
// 		(item.get('properties') || []).map((u,i) => {
// 			showPropertyName = `${showPropertyName}${showPropertyName ? '-' : ''}${u.get('name')}`
// 		})
//
// 		return (
//             <div className="salesModalBody-item">
//                 <li>{idx}</li>
//                 <li>
//                     <span>{item.get('productName')}</span>
//                     <span className="salesModalBody-item-triangle-icon" style={{display: item.get('bePackage') ? '' : 'none'}}>
// 						<Icon type='down'/>
// 					</span>
//                 </li>
//                 <li>{item.get('specifications')}</li>
// 				<li><span>{showPropertyName}</span></li>
// 				<li>{item.get('unit')}</li>
//                 <li>{item.get('number')}</li>
// 				<li>{item.get('unitPrice')}</li>
//                 <li>{item.get('amount')}</li>
//                 <li>{item.get('remark')}</li>
//             </div>
// 		)
// 	}
// }
