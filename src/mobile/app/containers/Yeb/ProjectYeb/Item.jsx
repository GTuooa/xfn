import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import moment from 'moment'
import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'

import * as projectYebActions from 'app/redux/Yeb/ProjectYeb/projectYeb.action.js'
import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			item,
			style,
			dispatch,
			className,
			leve,
			haveChild,
			showChild,
			history,
			issuedate,
			endissuedate,
			categoryTop,
			categoryUuid,
			ylDataList,
			direction,
			currentJrTypeItem,
			currentProjectItem,
			chooseValue
		} = this.props
		const articlePaddingLeft = (leve - 1) / 100 * 10 + 'rem'

		const flagColor = {
			1: '#fff',
			2: '#D1C0A5',
			3: '#7E6B5A',
			4: '#59493f'
		}[leve]

		const flagstyle = {
			background: flagColor,
			width: articlePaddingLeft
		}

		return (
			<div className={'ba' + ' ' + className} style={style}>
				<div>
				<span
					className='name'
					onClick={(e) => {
						sessionStorage.setItem("fromPage", "projectyeb")
						const projectCardItem = {
							uuid: item.get('cardUuid'),
							code: item.get('cardCode'),
							name: item.get('name')
						}
						if(!haveChild){
							const projectCardItem = {
								uuid: item.get('cardUuid'),
								code: item.get('cardCode'),
								name: item.get('name')
							}
							dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromProjectYeb(issuedate,endissuedate,fromJS(projectCardItem),currentJrTypeItem,currentProjectItem,history))
							dispatch(projectMxbActions.changeProjectMxbChooseValue(chooseValue))
						}else{
							let uuidList = []
							const loop = (data) => data.map(v => {
								if(v.get('childList') && v.get('childList').size){
									loop(v.get('childList'))
								}else{
									uuidList.push(v.get('cardUuid'))
								}
							})
							loop([item])
							const projectCardItem = {
								uuid: uuidList.length ? uuidList : '',
								code: '',
								name: '全部'
							}
							const curProjectItem = {
								uuid: item.get('cardCategory'),
								name: item.get('name'),
								value: `${item.get('cardCategory')}${Limit.TREE_JOIN_STR}${item.isTop ? item.isTop : false}`
							}
							dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromProjectYeb(issuedate,endissuedate,fromJS(projectCardItem),currentJrTypeItem,fromJS(curProjectItem),history))
							dispatch(projectMxbActions.changeProjectMxbChooseValue(chooseValue))
						}

					}}
					>
					{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
					<span className={`name-name name-click` }>{item.get('name')}</span>
				</span>
					<span className='btn'
						onClick={() => dispatch(projectYebActions.projectBalanceTriangleSwitch(showChild, item.get('cardCategory')))}
					>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='ba-info'>
					<Amount showZero={true}>{direction === 'debit' ? item.get('openDebit') === 0 ? -item.get('openCredit') : item.get('openDebit') : item.get('openCredit') === 0 ? -item.get('openDebit') : item.get('openCredit') }</Amount>
					<Amount showZero={true}>{item.get('currentDebit')}</Amount>
					<Amount showZero={true}>{item.get('currentCredit')}</Amount>
					<Amount showZero={true}>{direction === 'debit' ? item.get('closeDebit') === 0 ? -item.get('closeCredit'): item.get('closeDebit') : item.get('closeCredit') === 0 ? -item.get('closeDebit') : item.get('closeCredit')}</Amount>
				</div>
			</div>
		)
	}
}
