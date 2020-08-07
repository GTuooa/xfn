import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'

import { yllsActions } from 'app/redux/Ylls'

import * as projectYebActions from 'app/redux/Yeb/ProjectYeb/projectYeb.action.js'
import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'


@immutableRenderDecorator
export default
class DoubleItem extends React.Component {

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
			currentRunningItem,
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
			minWidth: articlePaddingLeft
		}

		return (
			<div className={'ba' + ' ' + className} style={style}>
				<div>
					<span className='name' >
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span
							className={`name-name name-click`}
							onClick={(e) => {
								sessionStorage.setItem("fromPage", "projectyeb")

								if(!haveChild){
									const projectCardItem = {
										uuid: item.get('cardUuid'),
										code: item.get('cardCode'),
										name: item.get('name')
									}
									dispatch(projectMxbActions.getProjectMxbBalanceListFromProjectYeb(issuedate,endissuedate,fromJS(projectCardItem),currentRunningItem,currentProjectItem,history))
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
										name: '全部',
									}
									const curProjectItem = {
										uuid: item.get('cardCategory'),
										name: item.get('name'),
										value: `${item.get('cardCategory')}${Limit.TREE_JOIN_STR}${item.isTop ? item.isTop : false}`
									}
									dispatch(projectMxbActions.getProjectMxbBalanceListFromProjectYeb(issuedate,endissuedate,fromJS(projectCardItem),currentRunningItem,fromJS(curProjectItem),history))
									dispatch(projectMxbActions.changeProjectMxbChooseValue(chooseValue))
								}
							}}
						>{item.get('name')}</span>
					</span>
					<span className='btn' onClick={() =>  dispatch(projectYebActions.projectBalanceTriangleSwitch(showChild, item.get('cardCategory')))}>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='double-ba-info'>
					<span className="double-item-list">
						<Amount showZero={false} style={{color:'#4166b8'}}>{item.get('openDebit')}</Amount>
						<Amount showZero={item.get('openDebit') === 0 && item.get('openCredit') === 0 ? true : false} style={{color:'#ff8348'}}>{item.get('openCredit')}</Amount>
					</span>
					<span className="double-item-list">
						<Amount showZero={true} style={{color:'#4166b8'}}>{item.get('currentDebit')}</Amount>
						<Amount showZero={true} style={{color:'#ff8348'}}>{item.get('currentCredit')}</Amount>
					</span>
					<span className="double-item-list">
						<Amount showZero={true} style={{color:'#4166b8'}}>{item.get('currentRealDebit')}</Amount>
						<Amount showZero={true} style={{color:'#ff8348'}}>{item.get('currentRealCredit')}</Amount>
					</span>
					<span className="double-item-list">
						<Amount showZero={false} style={{color:'#4166b8'}}>{item.get('closeDebit')}</Amount>
						<Amount showZero={item.get('closeDebit') === 0 && item.get('closeCredit') === 0 ? true : false} style={{color:'#ff8348'}}>{item.get('closeCredit')}</Amount>
					</span>
				</div>
			</div>
		)
	}
}
