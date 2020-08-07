// import React, { PropTypes } from 'react'
// import { Map } from 'immutable'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
// import { Icon, Amount } from 'app/components'
// import moment from 'moment'
//
// import * as relativeYebActions from 'app/redux/Yeb/RelativeYeb/relativeYeb.action.js'
// import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'
//
// @immutableRenderDecorator
// export default
// class Item extends React.Component {
//
// 	render() {
// 		const {
// 			item,
// 			style,
// 			dispatch,
// 			className,
// 			leve,
// 			haveChild,
// 			showChild,
// 			history,
// 			issuedate,
// 			endissuedate,
// 			categoryTop,
// 			categoryUuid,
// 			ylDataList,
// 			chooseValue
// 		} = this.props
// 		const articlePaddingLeft = (leve - 1) / 100 * 10 + 'rem'
//
// 		const flagColor = {
// 			1: '#fff',
// 			2: '#D1C0A5',
// 			3: '#7E6B5A',
// 			4: '#59493f'
// 		}[leve]
//
// 		const flagstyle = {
// 			background: flagColor,
// 			width: articlePaddingLeft
// 		}
//
// 		const name = item.get('cardCode') ? `${item.get('cardCode')}_${item.get('name')}` : item.get('name')
// 		return (
// 			<div className={'ba' + ' ' + className} style={style}>
// 				<div>
// 					<span
// 						className={haveChild ? 'name': 'childName'}
// 						onClick={(e) => {
// 							if(!haveChild){
// 								dispatch(relativeMxbActions.getRelativeMxbListFromYeb(issuedate,endissuedate,categoryUuid,categoryTop,item,history))
// 								dispatch(relativeMxbActions.changeRelativeMxbChooseValue(chooseValue))
// 							}
// 						}}
// 						>
// 						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
// 						<span className='name-name'>{name}</span>
// 					</span>
// 					<span className='btn'
// 						onClick={() => dispatch(relativeYebActions.relativeBalanceTriangleSwitch(showChild, item.get('categoryUuid')))}
// 					>
// 						<Icon
// 							type='arrow-down'
// 							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
// 						/>
// 					</span>
// 				</div>
// 				<div className='ba-info'>
// 					<Amount showZero={true}>{item.get('openDebit') == 0 ? item.get('openCredit') == 0 ? '0.00' : `-${item.get('openCredit')}` : item.get('openDebit')}</Amount>
// 					<Amount showZero={true}>{item.get('currentDebit')}</Amount>
// 					<Amount showZero={true}>{item.get('currentCredit')}</Amount>
// 					<Amount showZero={true}>{item.get('closeDebit') == 0 ? item.get('closeCredit') == 0 ? '0.00' : `-${item.get('closeCredit')}` : item.get('closeDebit')}</Amount>
// 				</div>
// 			</div>
// 		)
// 	}
// }
