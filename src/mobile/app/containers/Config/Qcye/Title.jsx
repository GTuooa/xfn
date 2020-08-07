import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as qcyeActions from 'app/redux/Config/Qcye/qcye.action'

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			tabSelectedIndex,
			acTags,
			dispatch
		} = this.props

		const qcAcTags = acTags.slice(0, 4)

		return (
			<div className="tab-title">
				{qcAcTags.map((v, i) => {
					return (
						<span
							className={['tab-title-item', tabSelectedIndex === i ? 'selected' : ''].join(' ')}
							onClick={() => dispatch(qcyeActions.changeTabIndexQcconfig(i))}
							key={i}
							>
							{v.get('category')}
						</span>
					)
				})}
			</div>
		)
	}
}
