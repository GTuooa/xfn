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
//             lineList,
//             dispatch
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
//                                 dispatch={dispatch}
//                             />)
//                         } else { //组合
//                             let itemArr = []
//                             itemArr.push(<ChargebackTableItem
//                                 key={i}
//                                 idx={i+1}
//                                 item={u}
//                                 dispatch={dispatch}
//                             />);
//
//                             u.get('packageList').map((v,j) => {
//                                 itemArr.push(<ChargebackTableItem
//                                     key={`${i}-${j}`}
//                                     idx={''}
//                                     item={v}
//                                     dispatch={dispatch}
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
