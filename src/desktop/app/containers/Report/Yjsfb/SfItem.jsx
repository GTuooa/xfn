import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Amount, TableItem ,ItemTriangle ,TableOver} from 'app/components'
import * as sfbActions from 'app/redux/Report/Yjsfb/yjsfb.action.js'
@immutableRenderDecorator
export default
class SfItem extends React.Component {
	paddingLeft(level){
		switch(level){
			case 1:
				return 0;
			case 2 :
				return 18;
			case 3:
				return 54;
			case 4:
				return 66;
			default:
				return (level-1)*24
		}
	}
	render() {

		const { sjItem, className, idx ,showChildList,dispatch} = this.props
		const loop = (sjItem, level ,key)=>{
			if(sjItem.get('payTaxList')&&sjItem.get('payTaxList').size){
				const showChild = showChildList.indexOf(sjItem.get("lineIndex"))> -1
				const paddingLeft = this.paddingLeft(sjItem.get('level'))
				return(
					<div key={key}>
						<TableItem  className={className} line={idx+1}>
							<ItemTriangle
								textAlign="left"
								isLink={false}
								showTriangle={true}
								showchilditem={showChild}
								onClick={(e)=>{
									e.stopPropagation()
									dispatch(sfbActions.handleShowChildList(sjItem.get('lineIndex')))
								}}
							>
								<span
									style={{paddingLeft: `${paddingLeft}px`}}
								>
									{sjItem.get('lineName')}
								</span>
							</ItemTriangle>
							<li><Amount>{sjItem.get('yearAmount')}</Amount></li>
							<li><Amount>{sjItem.get('currentAmount')}</Amount></li>
						</TableItem>
						{
							showChild && sjItem.get('payTaxList').map((v, i) => loop(v, level+1, `${key}_${i}`))
						}
					</div>
				)
			}else{
				const paddingLeft = this.paddingLeft(sjItem.get('level'))
				return(
					<TableItem className={className} line={idx+1} key={key}>
						<TableOver
							textAlign="left"
							isLink={false}
						>
							<span
								style={{paddingLeft: `${paddingLeft}px`}}
							>
								{sjItem.get('lineName')}
							</span>
						</TableOver>
						<li><Amount>{sjItem.get('yearAmount')}</Amount></li>
						<li><Amount>{sjItem.get('currentAmount')}</Amount></li>
					</TableItem>
				)
			}
		}
		return loop(sjItem,0,idx)
	}
}
