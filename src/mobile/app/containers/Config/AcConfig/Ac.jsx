import React, { PropTypes }	from 'react'
import { Map, List, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './ac-config.less'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import * as allActions from 'app/redux/Home/All/aclist.actions'
import { Checkbox, Icon } from 'app/components'

const colorLevel = {
	4: '#fff',
	6: '#D1C0A5',
	8: '#7E6B5A',
	10: '#59493f'
}

@immutableRenderDecorator
export default
class Ac extends React.Component {

	render() {
		const {
			style,
			hasSub,
			isExpanded,
			ac,
			currTabAcList,
			idx,
			selectable,
			allAcCheckBoxDisplay,
			allAcModifyButtonDisplay,
			dispatch,
			uppername,
			isEnd,
			history
		} = this.props

		const articlePaddingLeft = (ac.get('acid').length - 4) / 200 * 10 + 'rem'
		const flagColor = colorLevel[ac.get('acid').length]

		const flagstyle = {
			width: articlePaddingLeft,
			background: flagColor
		}

		return (
			<div className="ac-item-wrap" style={style}>
				<div
					className={!ac.get('asscategorylist').size ? "ac-item" : "ac-ass-item"}
					// style={style}
					style={{borderBottom: isEnd ? '0' : ''}}
					>
					<Checkbox
						className="checkbox"
						style={{display: allAcCheckBoxDisplay ? '' : 'none'}}
						checked={ac.get('selected')}
						disabled={selectable? false : true}
						checkedColor="#fb6"
						onClick={(e) => {
							// e.stopPropagation()
							if (selectable) {
								dispatch(allActions.selectAc(ac.get('idx')))
							}
						}}
						// onChange={() => dispatch(allActions.selectAcChilrens(ac.get('acid')))}
					/>
					<Icon
						style={{display: allAcModifyButtonDisplay ? '' : 'none'}}
						type="add-plus-fill"
						color={ac.get('acid').length === 10 ? '#ccc' : '#38ADFF'}
						size="18"
						onClick={(e) => {
							// e.stopPropagation()
							if (ac.get('acid').length === 10)
								return
							dispatch(acconfigActions.beforeInsertAc(ac, currTabAcList, '', history))
						}}
					/>
					<div className="ac-article">
						<span className="ac-article-acid-acname">
							{articlePaddingLeft == '0rem' ? '' : <span className={ac.get('asscategorylist').size ? "ac-flag ac-info-has-ass-flags" : 'ac-flag'} style={flagstyle}></span>}
							{/* <span > */}
								<span
									className={ac.get('asscategorylist').size ? "ac-info ac-info-has-ass ac-underline" : 'ac-info ac-underline'}
									onClick={(e) => {
										// e.stopPropagation()
										if (allAcCheckBoxDisplay && selectable) {
											dispatch(allActions.selectAc(ac.get('idx')))
										} else {
											dispatch(acconfigActions.beforeModifyAc(ac, idx, uppername, history))
										}
									}}
									>
									{ac.get('acid') + ac.get('acname')}
								</span>
								{/* <span className="ac-info-onclick" onClick={() => {hasSub && dispatch(acconfigActions.toggleLowerAc(ac.get('acid')))}}></span> */}
							{/* </span> */}
						</span>
						{ac.get('asscategorylist').size == 0 ? '' :
							<p className="ac-ass">
								辅助核算: {ac.get('asscategorylist').reduce((prev, v) => prev + '/' + v)}
							</p>
						}
					</div>
					<div
						className="ac-other"
						onClick={() => {hasSub && dispatch(acconfigActions.toggleLowerAc(ac.get('acid')))}}
						>
						<span className="ac-direction">{ac.get('direction') == 'debit' ? '借' : '贷'}方</span>
						<Icon type="arrow-down" style={{display : hasSub && isExpanded !== 'displaynone' ? '' : 'none', transform: isExpanded ? 'rotate(180deg)' : ''}}/>
					</div>
				</div>
			</div>
		)
	}
}
