import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Map, List, fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import { Amount, Icon } from 'app/components'

@immutableRenderDecorator
export default
class Jv extends React.Component {

	render() {
		const {
            key,
            idx,
            dispatch,
            draftItem,
            draftKeyList,
			history
		} = this.props


		return (
            <div className="model"
                onClick={() => {
                    sessionStorage.setItem('lrpzHandleMode', 'insert')
                    history.push('/lrpz')
                    sessionStorage.removeItem('prevPage')
                    sessionStorage.setItem('router-from', 'draft')
					sessionStorage.setItem('enterDraft', 'draft')
                    dispatch(lrpzExportActions.setCkpzIsShow(true))
                    dispatch(lrpzActions.getDraftItemFetch(draftItem.get('vckey')))
                }}
                >
				<Icon style={{display: draftItem.get('locked') == '1' ? '' : 'none'}} className="draft-locked-icon" color="#ff943e" type="locked" size="50"/>
				<div className={['model-info', draftItem.get('locked') == '1' ? 'draft-locked' : ''].join(' ')}>
					<span>记 {draftItem.get('vcindex')} 号</span>
					<span className="model-info-date">{draftItem.get('vcdate').replace(/-/g,'/')}</span>
				</div>
				<div className="model-jv-list">
					{draftItem.get('jvlist').map((w,j) => {
						return (
							<div className="model-jv" key={j}>
								<div className="model-jv-info">
									<span className="model-jv-direction">{[w.get('jvdirection') === 'debit' ? '借' : '贷', '：', w.get('acname')].join('')}</span>
									<Amount className="model-jv-amount" showZero={true}>{w.get('jvamount')}</Amount>
								</div>
								{
									w.get('asslist').size ?
									<div className="model-jv-ass">
										{
											w.get('asslist').map((v, i) =>
												<div key={i} className={`model-jv-ass-showtext ${i === 0 ? 'model-jv-ass-showtext-tip' : ''}`}>
													{`${v.get('asscategory')+ '_' + v.get('assid') + ' ' + v.get('assname')}`}
												</div>
											)
										}
									</div>
									: ''
								}
								<div className="model-jv-abstract">
									<span>摘要：</span>
									<span>{w.get('jvabstract')}</span>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}
