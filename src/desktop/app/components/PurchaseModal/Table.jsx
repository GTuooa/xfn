// import React from 'react'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'
// import TableItem from './TableItem'
//
// @immutableRenderDecorator
// export default
// class Table extends React.Component {
//
// 	render() {
//         const {
//             lineList
//         } = this.props
//
// 		return (
//             <div className="modalBody-item-wrap">
//                 {
//                     (lineList || []).map((u,i) => {
//
//                         if (!u.get('bePackage')) { //单品
//                             return(<TableItem
//                                 key={i}
//                                 idx={i+1}
//                                 item={u}
//                             />)
//                         } else { //组合
//                             let itemArr = []
//                             itemArr.push(<TableItem
//                                 key={i}
//                                 idx={i+1}
//                                 item={u}
//                             />);
//
//                             u.get('packageList').map((v,j) => {
//                                 itemArr.push(<TableItem
//                                     key={`${i}-${j}`}
// 									idx={''}
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
