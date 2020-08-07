// import React from 'react'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'
// import ChargebackTableItem from './ChargebackTableItem'
//
// @immutableRenderDecorator
// export default
// class ChargebackTable extends React.Component {
//
// 	render() {
//         const {
//             lineList
//         } = this.props
//
//
// 		return (
//             <div className="modalBody-item-wrap">
//                 {
//                     (lineList || []).map((u,i) => {
//                         if (!u.get('bePackage')) { //单品
//                             return(<ChargebackTableItem
//                                 key={i}
//                                 idx={i+1}
//                                 item={u}
//                             />)
//                         } else { //组合
//                             let itemArr = []
//                             itemArr.push(<ChargebackTableItem
//                                 key={i}
//                                 idx={i+1}
//                                 item={u}
//                             />);
//
//                             u.get('packageList').map((v,j) => {
//                                 itemArr.push(<ChargebackTableItem
//                                     key={`${i}-${j}`}
//                                     idx={''}
//                                     item={v}
//                                 />)
//                             })
//                             return itemArr
//                         }
//                     })
//                 }
//             </div>
// 		)
// 	}
// }
