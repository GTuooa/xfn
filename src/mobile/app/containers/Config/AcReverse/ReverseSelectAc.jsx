import React, { PropTypes }	from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, Icon }	from 'app/components'
import '../AcConfig/ac-config.less'
import './ac-reverse.less'

import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import { Map, List, toJS } from 'immutable'

const colorLevel = {
	4: '#fff',
	6: '#D1C0A5',
	8: '#7E6B5A',
	10: '#59493f'
}

@immutableRenderDecorator
export default
class ReverseSelectAc extends React.Component {

	render() {
		const {
			style,
			hasSub,
			isExpanded,
			ac,
			idx,
			dispatch,
			selectAcId,
			type
		} = this.props

		const articlePaddingLeft = (ac.get('acid').length - 4) / 200 * 10 + 'rem'
		const flagColor = colorLevel[ac.get('acid').length]

		const flagstyle = {
			width: articlePaddingLeft,
			background: flagColor
		}

		return (
			<div
				className={!ac.get('asscategorylist').size ? "ac-item" : "ac-ass-item"}
				style={style}
				onClick={() => { hasSub && dispatch(acconfigActions.toggleLowerAc(ac.get('acid')))}}
				>
					<div classNam="ac-reverse-radio-wrap"
						style={{display: 'flex', flex: '1'}}
						onClick={(e) => {
							e.stopPropagation()
							dispatch(acconfigActions.selectAcReverse(ac.get('acid')))
						}}
						>
						{/* config/reverse/reversselect */}
						<div className="ac-reverse-radio">
							<span
								style={{display: (hasSub && isExpanded !== 'displaynone'&&type === 'class') || (ac.get('acid').length === 10&&type === 'class')  ? 'none' : '' }}
								// onClick={(e) => {
								// 	e.stopPropagation()
								// 	dispatch(acconfigActions.selectAcReverse(ac.get('acid')))
								// }}
								>
								<span className="ac-reverse-radio-select" style={{display: ac.get('acid') === selectAcId  ? '' : 'none'}}></span>
								<span className="ac-reverse-radio-btn"></span>
							</span>
						</div>
						<div className="ac-article">
							<span className="ac-article-acid-acname">
								{articlePaddingLeft == '0rem' ? '' : <span className="ac-flag" style={flagstyle}></span>}
								<span className="ac-info ac-underline">
									{ac.get('acid') + ac.get('acname')}
								</span>
							</span>
							{ac.get('asscategorylist').size == 0 ? '' : <p className="ac-ass">辅助核算: {ac.get('asscategorylist').reduce((prev, v) => prev + '/' + v)}</p>}
						</div>
					</div>
				{/* <div  className="ac-reverse-radio">
					<span
						style={{display: (hasSub && isExpanded !== 'displaynone'&&type === 'class') || (ac.get('acid').length === 10&&type === 'class')  ? 'none' : '' }}
						onClick={(e) => {
							e.stopPropagation()
							dispatch(acconfigActions.selectAcReverse(ac.get('acid')))
						}}
						>
						<span className="ac-reverse-radio-select" style={{display: ac.get('acid') === selectAcId  ? '' : 'none'}}></span>
						<span className="ac-reverse-radio-btn"></span>
					</span>
				</div>
				<div className="ac-article">
					{articlePaddingLeft == '0rem' ? '' : <span className="ac-flag" style={flagstyle}></span>}
					<span className="ac-info ac-underline">
						{ac.get('acid') + ac.get('acname')}
					</span>
					{ac.get('asscategorylist').size == 0 ? '' : <p className="ac-ass">辅助核算: {ac.get('asscategorylist').reduce((prev, v) => prev + '/' + v)}</p>}
				</div> */}
				<div className="ac-other">
					<span className="ac-direction">{ac.get('direction') == 'debit' ? '借' : '贷'}方</span>
					<Icon type="arrow-down" style={{display : hasSub && isExpanded !== 'displaynone' ? '' : 'none', transform: isExpanded ? 'rotate(180deg)' : ''}}/>
				</div>
			</div>
		)
	}
}
