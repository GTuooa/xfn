import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './currency.less'
import * as thirdParty from 'app/thirdParty'

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			tabSelectedIndex,
			acTags,
			dispatch,
			callback
		} = this.props

		return (
			<div className="tab-title">
				{acTags.map((v, i) => {
					return (
						<span
							className={['tab-title-item', tabSelectedIndex === i ? 'selected' : ''].join(' ')}
							onClick={() => callback(i)}
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
