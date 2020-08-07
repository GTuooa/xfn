// import React from 'react'
// import { Container, Row, ScrollView, Icon } from 'app/components'
// import * as thirdParty from 'app/thirdParty'
// import { fromJS,toJS }	from 'immutable'
// import './index.less'
//
// import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
//
// export default
// class Category extends React.Component {
//
// 	static displayName = 'RepentPatternCategory'
//
// 	constructor(props) {
// 		super(props)
// 		this.state = {
// 			currentindex: 0,
// 			childList: []
//         }
//     }
//
// 	componentDidMount() {
// 		thirdParty.setTitle({title: '选择流水类别'})
// 		thirdParty.setIcon({showIcon: false})
// 	}
//
// 	render() {
// 		const { onClick, runningViews, dispatch, categoryTypeObj, callback } = this.props
// 		const { currentindex } = this.state
// 		const regretCategoryList = runningViews.get('regretCategoryList')
// 		const notShowRegretList = runningViews.get('notShowRegretList')
// 		const loop = (data,level) => {
// 			return data.map(item => {
// 				const childList = item.get('childList')
// 				const notShowChild = notShowRegretList.indexOf(item.get('uuid')) > -1
// 				return(
// 					<div>
// 						<Row
// 							className='menu-right-item overElli'
// 							key={item.get('uuid')}
// 							style={{color:childList.size?'#ccc':'color: rgba(0, 0, 0, 0.65)'}}
// 							onClick={() =>{
// 								if(!childList.size) {
// 									dispatch(runningConfActions.changeRegretTemp('categoryName',item.get('name')))
// 									dispatch(runningConfActions.changeRegretTemp('categoryUuid',item.get('uuid')))
// 									dispatch(runningConfActions.changeRegretTemp('hasBalance',item.get('hasBalance')))
// 									dispatch(runningConfActions.changeRegretTemp('hasBusiness',item.get('hasBusiness')))
// 									callback()
// 								}
// 							}}
// 						>
// 							<span>{item.get('name')}</span>
// 							{
// 								childList.size?
// 									<Icon type='arrow-down'
// 										className='ac-icon-po'
// 										style={!notShowChild?{transform: 'rotate(180deg)'}:{}}
// 										onClick={() => {
// 											dispatch(runningConfActions.changeRegretChildList(item.get('uuid')))
// 										}}
// 									/> :null
// 							}
// 						</Row>
// 						{
// 							childList.size && !notShowChild ?loop(childList,level+1):''
// 						}
// 					</div>
// 				)
// 			})
// 		}
// 		return(
// 			<Container className="lrls">
// 				<ScrollView flex="1" className='lrls-menu-scroll'>
// 					<div className='lrls-menu'>
// 						<div className='menu-left'>
// 							{
// 								regretCategoryList.map((v, i) => {
// 									return (
// 										<Row
// 											key={i}
// 											className={currentindex === i ? 'menu-left-item menu-left-item-selected' : 'menu-left-item'}
// 											onClick={() => this.setState({currentindex:i})}
// 										>
// 											{v.get('name')}
// 										</Row>
// 									)
// 								})
// 							}
// 						</div>
// 						<div className='menu-right'>
// 							{
// 								loop(regretCategoryList.getIn([currentindex,'childList']),0)
// 							}
// 						</div>
// 					</div>
// 				</ScrollView>
// 			</Container>
// 		)
// 	}
// }
