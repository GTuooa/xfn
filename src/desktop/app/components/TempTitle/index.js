// import React from 'react'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
// import { Button  } from 'antd'
// import './tempTitle.less'
// import TableWrap from 'app/components/Table'
// import Table from 'app/components/Table'
// import TableAll from 'app/components/Table'
// import TableTitle from 'app/components/Table'
// import TableBody from 'app/components/Table'
//
//
// @immutableRenderDecorator
// export default
// class TempTitle extends React.Component {
//
// 	shouldComponentUpdate(nextprops) {
// 		return this.props.currentPage != nextprops.currentPage
// 	}
//
// 	render() {
// 		console.log('TempTitle')
// 		const { titleTags, currentPage, onClick } = this.props
//
// 		return (
// 			<div className="title title-config-topbar">
// 				<div className="title-left">
// 					{titleTags.map(v =>
// 						<span
// 							key={v.title}
// 							className={`title-temp ${currentPage == v.value ? 'title-temp-selectd' : ''}`}
// 							onClick={() => onClick(v.value)}
// 							>
// 							{v.title}
// 						</span>
// 					)}
// 				</div>
// 			</div>
// 		)
// 	}
// }
