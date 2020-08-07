import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './form.less'
import Label from './FormLabel'
import Control from './FormControl'

@immutableRenderDecorator
export default
class FormItem extends Component {
	render() {
		const {
			label,
			children,
			className,
			showAsterisk,
			...other
		} = this.props

		return (
			// <div className={["form-item", className].join(' ')} {...other}>
			// 	<Label showAsterisk={showAsterisk}>{label}</Label>
			// 	<Control>
			// 		{children}
			// 	</Control>
			// </div>
			<div className="form-item-wrap">
				<div className={["form-item", className].join(' ')} {...other}>
					<Label showAsterisk={showAsterisk}>{label}</Label>
					<Control>
						{children}
					</Control>
				</div>
			</div>
		)
	}
}
