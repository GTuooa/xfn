// import React from 'react'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
// import { Button } from 'antd'
//
//
// @immutableRenderDecorator
// export default
// class LrkcTitle extends React.Component {
//
// 	render() {
//
// 		const {
// 			titleTags,
// 			stocktakingProfit,
// 			stocktakingLoss,
// 			currentPage,
// 			onClick,
// 			saveClick,
// 			saveAndNewClick,
// 			generateEntry,
// 			generateOut,
// 			insertOrModify,
// 			notModify
// 		} = this.props
//
// 		// console.log(' sd',stocktakingProfit, stocktakingLoss);
//
// 		return (
// 			<div className="title title-config-topbar">
// 				<div className="title-left">
// 					{titleTags.map(v =>
// 						<span
// 							key={v.title}
// 							className={`title-conleft lrck-title-conleft ${currentPage == v.value ? 'title-selectd' : ''}`}
// 							onClick={() => onClick(v.value)}
// 							>
// 							{v.title}
// 						</span>
// 					)}
// 				</div>
//                 <Button
// 					disabled={notModify && currentPage === 'Stock'}
// 					className="title-right"
// 					type="ghost"
// 					onClick={saveClick}
// 					>
// 					保存
// 				</Button>
// 				{
// 					currentPage === 'Stock' && stocktakingProfit ?
// 					<Button
// 						className="title-right"
// 						type="ghost"
// 						onClick={generateEntry}
// 						>
// 						生成入库单
// 					</Button>
// 					: ''
// 				}
// 				{
// 					currentPage === 'Stock' && stocktakingLoss ?
// 					<Button
// 						className="title-right"
// 						type="ghost"
// 						onClick={generateOut}
// 						>
// 						生成出库单
// 					</Button> : ''
// 				}
// 				<Button
// 						className="title-right"
// 						type="ghost"
// 						onClick={saveAndNewClick}
// 					>
// 					保存并新增
// 				</Button>
// 			</div>
// 		)
// 	}
// }
