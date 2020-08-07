import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'

import * as lsqcActions from 'app/redux/Config/Lsqc/lsqc.action.js'

@immutableRenderDecorator
export default
class Ba extends React.Component {

	render() {
		const {
			ba,
			style,
			hasSub,
			dispatch,
			className,
			issuedate,
			endissuedate,
			leve,
			haveChild,
			showChild,
			history,
			balistSeq,
			curModifyBtn
		} = this.props
		const articlePaddingLeft = (leve - 1) / 100 * 10 + 'rem'

		const flagstyle = {
			minWidth: articlePaddingLeft,
			backgroundColor:style
		}
		const getNumber = (numberName) => {
			let totalNumber = 0
			const loop = (data) => {
				data.map((item,i) => {
					if(item.childList && item.childList.length>0){
						loop(item.childList)
					}else{
						if(item.operate == "SUBTRACT"){
							totalNumber -= parseFloat(item[numberName])
						}else{
							totalNumber += parseFloat(item[numberName])
						}

					}
				})


			}
			ba.get('childList') && ba.get('childList').size > 0 ? loop(ba.get('childList').toJS()) : ''

			const number = ba.get('childList') && ba.get('childList').size > 0 ? totalNumber : ba.get(numberName)
			return number
		}

		return (
			<div className={'ba' + ' ' + className} style={style}>
				<div className='ba-info'>
					<span
						className='name-child'>
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className='name-name'>
							{
								curModifyBtn == 'Contacts' ? (ba.get('name').indexOf('UDFNCRD') > -1 ? `未明确单位` : `${ba.get('name')}`) :
								ba.get('name').indexOf('IDFNCRD') > -1 ? `未明确存货` : `${ba.get('name')}`

							}
						</span>
					</span>
					<Amount showZero={false}>{getNumber('debitBeginAmount')}</Amount>
					<Amount showZero={false}>{getNumber('creditBeginAmount')}</Amount>
					<span className='btn' onClick={() => dispatch(lsqcActions.QCTriangleSwitch(showChild, ba.get('uuid')))}>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
			</div>
		)
	}
}
