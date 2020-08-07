import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import { yllsActions } from 'app/redux/Ylls'
import * as relativeYebActions from 'app/redux/Yeb/RelativeYeb/relativeYeb.action.js'
import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'


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
			categoryUuid,
			categoryTop,
			chooseValue,
			runningCategoryObj,
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
					<span
						className='name'
						onClick={(e) => {
							sessionStorage.setItem("fromPage", "relativeyeb")
							if(!haveChild){
								dispatch(relativeMxbActions.getRelativeMxbListFromYeb(issuedate,endissuedate,categoryUuid,categoryTop,item,history,runningCategoryObj))
								dispatch(relativeMxbActions.changeRelativeMxbChooseValue(chooseValue))
							}else{
								dispatch(relativeMxbActions.getRelativeMxbListFromYeb(issuedate,endissuedate,item.get('categoryUuid'),false,item,history,runningCategoryObj,true))
								dispatch(relativeMxbActions.changeRelativeMxbChooseValue(chooseValue))
							}
						}}
						>
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className={`name-name name-click` }>{item.get('cardCode') ? `${item.get('cardCode')}_${item.get('name')}` : item.get('name')}</span>
					</span>
					<span className='btn' onClick={() =>  dispatch(relativeYebActions.relativeBalanceTriangleSwitch(showChild, item.get('categoryUuid')))}>
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
